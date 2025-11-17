import { useState } from "react";
import { Send } from "lucide-react";

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    console.log("Send:", message);

    // TODO: websocket send
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t border-purple-300/20 dark:border-purple-800/30
                 bg-white/40 dark:bg-[#120427]/40 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        {/* Input */}
        <input
          placeholder="Type a message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-3 rounded-lg bg-white/80 dark:bg-[#16062e]/70
                     text-gray-900 dark:text-gray-100 focus:outline-none
                     focus:ring-2 focus:ring-purple-500 transition"
        />

        {/* Send Button */}
        <button
          type="submit"
          className="p-3 rounded-lg bg-purple-600 hover:bg-purple-700
                     active:scale-95 transition text-white shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
