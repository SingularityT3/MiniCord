import React from "react";
import { useAuth } from "@/context/User";

const SidebarConversationIcon: React.FC<{
  conversation: any;
  members?: any[];
}> = ({ conversation, members }) => {
  const { user } = useAuth();
  const isGroup = conversation.type === "GROUP";

  let label = "";

  if (isGroup) {
    // Show group title or fallback
    label = (conversation.title || "Group").slice(0, 3);
  } else {
    // DIRECT MESSAGE → show the other user's username
    const other = (members || []).find((m: any) => m.userId !== user?.id);
    label = (other?.username || "DM").slice(0, 3);
  }

  return (
    <div
      className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center 
                 text-white text-sm font-semibold 
                 border border-purple-300/20 dark:border-purple-800/30 
                 shadow-sm hover:scale-105 transition select-none"
    >
      {label}
    </div>
  );
};

export default SidebarConversationIcon;
