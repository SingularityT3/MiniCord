import React from "react";
import { Plus } from "lucide-react";

const CreateChatButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md transition"
    >
      <Plus className="w-5 h-5" />
    </button>
  );
};

export default CreateChatButton;
