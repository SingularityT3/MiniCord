import React, { useState } from "react";
import { Send } from "lucide-react";
import { createConversationAPI } from "@/Api/Conversation";
import { sendMessageAPI } from "@/Api/Messages";

const MessageInput: React.FC<{
  conversationId: string | null;
  onCreated?: (conv: any) => void;
}> = ({ conversationId, onCreated }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      if (!conversationId) {
        const res = await createConversationAPI("DIRECT_MESSAGE", []);
        onCreated?.(res.data);
        await sendMessageAPI(res.data.id, message);
      } else {
        await sendMessageAPI(conversationId, message);
      }
      setMessage("");
    } catch (err) {
      console.error("send failed", err);
      alert("Send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="p-4 border-t border-purple-300/20 dark:border-purple-800/30 bg-white/40 dark:bg-[#120427]/40"
    >
      <div className="flex items-center gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          className="flex-1 px-4 py-3 rounded-lg bg-white/80 dark:bg-[#16062e]/70 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
