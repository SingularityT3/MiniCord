import { useState } from "react";

const CreateChatModal = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState<"DM" | "GROUP">("DM");
  const [value, setValue] = useState("");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/30 dark:bg-[#10021f]/40 p-6 rounded-xl w-80 
        backdrop-blur-xl border border-purple-300/20 dark:border-purple-700/20"
      >
        <h1 className="text-lg font-semibold text-center mb-4">New Chat</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("DM")}
            className={`flex-1 py-2 rounded-md ${
              mode === "DM"
                ? "bg-purple-600 text-white"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            DM
          </button>

          <button
            onClick={() => setMode("GROUP")}
            className={`flex-1 py-2 rounded-md ${
              mode === "GROUP"
                ? "bg-purple-600 text-white"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            Group
          </button>
        </div>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={mode === "DM" ? "Enter username" : "Group name"}
          className="w-full p-2 rounded-lg bg-white/70 dark:bg-[#16062e]/70
                     text-gray-800 dark:text-gray-100"
        />

        <button
          className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700
                     text-white rounded-lg transition"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateChatModal;
