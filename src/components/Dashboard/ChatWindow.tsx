import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getConversationsAPI,
  getConversationMembersAPI,
} from "@/Api/Conversation";
import { getUserAPI } from "@/Api/Users";
import MessageInput from "./MessageInput";
import { useAuth } from "@/context/User";
import { getMessagesAPI } from "@/Api/Messages";
import { useVisibility } from "@/hooks/useVisibility";
import { formatDistanceToNowStrict, isToday, format } from "date-fns";

const ChatWindow: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const convId = id ?? null;

  const [conversation, setConversation] = useState<any | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [loadedOldestMessage, setLoadedOldestMessage] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const enrichMessages = async (msgs: any[]) => {
    return await Promise.all(
      msgs.map(async (m: any) => {
        const cached = members.find((mm) => mm.userId === m.authorId);
        if (cached)
          return {
            ...m,
            sender: {
              id: m.authorId,
              username: cached.username,
              profilePicture: cached.profilePicture,
            },
          };

        try {
          const u = await getUserAPI(m.authorId);
          return {
            ...m,
            sender: {
              id: m.authorId,
              username: u.data.username,
              profilePicture: u.data.profilePicture,
            },
          };
        } catch {
          return { ...m, sender: { username: "Unknown" } };
        }
      })
    );
  };

  // ----------------------------
  // Load Conversation Entry
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const loadConv = async () => {
      if (!convId) {
        setConversation(null);
        setMembers([]);
        setMessages([]);
        setLastMessageId(null);
        setLoadedOldestMessage(false);
        return;
      }

      // Reset messages when conversation changes
      setMessages([]);
      setLastMessageId(null);
      setLoadedOldestMessage(false);

      try {
        const list = await getConversationsAPI();
        if (!mounted) return;

        const conv =
          (list.data || []).find((c: any) => c.id === convId) || null;
        setConversation(conv);

        if (conv) {
          const mres = await getConversationMembersAPI(conv.id);
          if (!mounted) return;
          const raw = mres.data || [];

          const detailed = await Promise.all(
            raw.map(async (r: any) => {
              try {
                const u = await getUserAPI(r.userId);
                return {
                  userId: r.userId,
                  username: u.data.username,
                  profilePicture: u.data.profilePicture,
                };
              } catch {
                return { userId: r.userId, username: "Unknown" };
              }
            })
          );

          if (!mounted) return;
          setMembers(detailed);
        }
      } catch (err) {
        console.error("load conv", err);
      }
    };

    loadConv();
    return () => {
      mounted = false;
    };
  }, [convId]);

  // -------------------------------------
  // Poll for new messages
  // -------------------------------------
  useEffect(() => {
    if (!convId) return;

    const updateMessages = async () => {
      const container = containerRef.current;
      const isAtBottom =
        container &&
        container.scrollHeight - container.scrollTop - container.clientHeight <
          100; // 100px threshold

      try {
        const res = await getMessagesAPI(
          convId,
          20,
          undefined,
          lastMessageId || undefined
        );
        let newMessages = res.data?.messages || res.data || [];
        if (newMessages.length < 1) return;

        newMessages = newMessages.sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const enriched = await enrichMessages(newMessages);

        setMessages((messages) => {
          const allMsgs = messages.concat(enriched);
          if (isAtBottom) {
            setTimeout(() => {
              bottomRef.current?.scrollIntoView({ behavior: "auto" });
            }, 50);
          }
          return allMsgs;
        });
        setLastMessageId(enriched[enriched.length - 1].id);
      } catch (err) {
        console.error("load messages", err);
      }
    };

    // Initial fetch
    if (!lastMessageId) {
        updateMessages();
    }

    const interval = setInterval(updateMessages, 1500);
    return () => {
      clearInterval(interval);
    };
  }, [convId, lastMessageId, members]);


  // -------------------------------------
  // Fetch older messages on scroll up
  // -------------------------------------
  const fetchOlderMessages = async () => {
    if (messages.length < 1 || loadedOldestMessage || !convId) return;

    const container = containerRef.current;
    if (!container) return;

    const previousScrollHeight = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    try {
      const res = await getMessagesAPI(convId, 20, messages[0].id);
      let olderMessages = res.data?.messages || res.data || [];
      if (olderMessages.length < 1) {
        setLoadedOldestMessage(true);
        return;
      }
      
      olderMessages = olderMessages.sort(
        (a: any, b: any) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const enriched = await enrichMessages(olderMessages);
      setMessages((current) => enriched.concat(current));

      requestAnimationFrame(() => {
        if (!container) return;
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          newScrollHeight - previousScrollHeight + previousScrollTop;
      });
    } catch (err) {
      console.error("fetch older messages", err);
    }
  };

  const topRef = useVisibility<HTMLDivElement>(fetchOlderMessages);

  // ----------------------------
  // Humanize Timestamp
  // ----------------------------
  const getHumanizedTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } else {
      return format(date, "MMM dd, yyyy HH:mm");
    }
  };

  // ----------------------------
  // Render Header Title
  // ----------------------------
  const headerTitle = (() => {
    if (!conversation) return "Select a conversation";
    if (conversation.type === "GROUP") return conversation.title || "Group";

    const other = members.find((m) => m.userId !== user?.id);
    return other?.username || "Direct Message";
  })();

  return (
    <section className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-purple-300/20 dark:border-purple-800/30 bg-white/30 dark:bg-[#0f021f]/30 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {headerTitle}
        </h2>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div ref={topRef} />
        {!loadedOldestMessage && messages.length > 0 && (
            <div className="text-center text-gray-500">Loading more...</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${
              m.authorId === user?.id ? "flex-row-reverse text-right" : ""
            }`}
          >
            {/* Avatar */}
            <img
              src={
                m.sender?.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  m.sender?.username || "User"
                )}&background=8b5cf6&color=ffffff`
              }
              alt={m.sender?.username}
              className="w-10 h-10 rounded-full"
            />

            {/* Message content */}
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {m.sender?.username}
              </p>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {m.content}
              </p>

              {/* timestamp */}
              <p className="text-xs text-gray-500 mt-1">
                {getHumanizedTimestamp(m.timestamp)}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        conversationId={convId}
        onCreated={(c: any) => navigate(`/convo/${c.id}`)}
      />
    </section>
  );
};

export default ChatWindow;
