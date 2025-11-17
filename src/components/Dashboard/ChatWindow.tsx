import MessageInput from "./MessageInput";

const ChatWindow: React.FC = () => {
  return (
    <section className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div
        className="p-4 border-b border-purple-300/20 dark:border-purple-800/30
                      bg-white/30 dark:bg-[#0f021f]/40"
      >
        <h1 className="text-lg font-semibold">Chat Name</h1>
      </div>

      {/* Messages placeholder */}
      <div className="flex-1 p-6 overflow-y-auto">
        <p className="text-gray-500 dark:text-gray-400">
          Messages will appear here…
        </p>
      </div>

      {/* Input */}
      <MessageInput />
    </section>
  );
};

export default ChatWindow;
