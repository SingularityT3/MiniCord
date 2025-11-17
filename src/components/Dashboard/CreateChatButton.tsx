import { Plus } from "lucide-react";

const CreateChatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 
      text-white flex items-center justify-center shadow-md transition"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default CreateChatButton;
