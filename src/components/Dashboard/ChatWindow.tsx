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

  // load conversation entry (from /conversations)
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
          // map each member to include username by fetching user
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

  // poll messages
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
        const msgs = res.data?.messages || res.data || [];
        // enrich messages with sender username via members cache or fetch
        // assume messages include authorId; map authorId -> username if possible
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
              return { ...m, sender: { id: m.authorId, username: "Unknown" } };
            }
          })
        );
        setMessages(enriched);
        setTimeout(
          () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
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

  const headerTitle = (() => {
    if (!conversation) return "Select a conversation";
    if (conversation.type === "GROUP") return conversation.title || "Group";
    const other = members.find((m) => m.userId !== user?.id);
    return other?.username || "Direct Message";
  })();

  return (
    <section className="flex flex-col flex-1 overflow-hidden">
      <div className="px-6 py-4 border-b border-purple-300/20 dark:border-purple-800/30 bg-white/30 dark:bg-[#0f021f]/30 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {headerTitle}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {conversation?.updatedAt
            ? new Date(conversation.updatedAt).toLocaleString()
            : ""}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.authorId === user?.id ? "self-end" : ""
            }`}
          >
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
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {m.sender?.username}
              </p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {m.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        conversationId={convId}
        onCreated={(c: any) => navigate(`/convo/${c.id}`)}
      />
    </section>
  );
};

export default ChatWindow;
