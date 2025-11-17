import React from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import ConversationMembers from "./ConversationMembers";

const DashboardLayout: React.FC = () => {
  return (
    <main
      className="flex h-screen w-full
      bg-linear-to-br from-purple-100 via-white to-purple-50
      dark:from-[#0f021f] dark:via-[#120427] dark:to-[#1a0535]
      transition-colors duration-500 overflow-hidden"
    >
      <Sidebar />
      <ChatWindow />
      <ConversationMembers />
    </main>
  );
};

export default DashboardLayout;
