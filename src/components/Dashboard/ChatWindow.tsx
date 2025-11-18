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

const ChatWindow: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const convId = id ?? null;

  const [conversation, setConversation] = useState<any | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ----------------------------
  // Load Conversation Entry
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const loadConv = async () => {
      if (!convId) {
        setConversation(null);
        setMembers([]);
        return;
      }

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

  // ----------------------------
  // Poll Messages (every 1s)
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    if (!convId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const res = await getMessagesAPI(convId, 20);
        if (!mounted) return;

        let msgs = res.data?.messages || res.data || [];

        // SORT TIMESTAMP → Ensure new messages are last
        msgs = msgs.sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        // enrich
        const enriched = await Promise.all(
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

        setMessages(enriched);

        // scroll to bottom after render
        setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } catch (err) {
        console.error("load messages", err);
      }
    };

    loadMessages();
    const iv = setInterval(loadMessages, 1000);

    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [convId, members]);

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
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
