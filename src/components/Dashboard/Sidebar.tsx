import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CreateChatButton from "./CreateChatButton";
import CreateChatModal from "./CreateChatModal";
import SidebarConversationIcon from "./SidebarConversationIcon";
import UserPanel from "./UserPanel";
import FriendRequestToggle from "./FriendRequestToggle";
import FriendRequestsModal from "./FriendRequestsModal";
import {
  getConversationsAPI,
  getConversationMembersAPI,
} from "@/Api/Conversation";

const Sidebar: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<string, any[]>>({});
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const navigate = useNavigate();

  const fetchConversations = () => {
    getConversationsAPI().then((r) => setConversations(r.data || []));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    conversations.forEach((convo) => {
      if (!members[convo.id]) {
        getConversationMembersAPI(convo.id).then((m) =>
          setMembers((p) => ({ ...p, [convo.id]: m.data || [] }))
        );
      }
    });
  }, [conversations]);

  const handleCloseCreateModal = () => {
    setCreateOpen(false);
    fetchConversations();
  };

  return (
    <>
      {requestsOpen && (
        <FriendRequestsModal onClose={() => setRequestsOpen(false)} />
      )}
      {createOpen && <CreateChatModal onClose={handleCloseCreateModal} />}

      <aside
        className="
        h-full w-20 flex flex-col justify-between items-center 
        bg-white/20 dark:bg-[#0e021d]/40 backdrop-blur-xl 
        border-r border-purple-300/10 dark:border-purple-800/20
      "
      >
        <div className="mt-4 flex flex-col items-center gap-4">
          <CreateChatButton onClick={() => setCreateOpen(true)} />
          <FriendRequestToggle onOpen={() => setRequestsOpen(true)} />
        </div>

        <div className="flex-1 w-full overflow-y-auto py-4 flex flex-col items-center gap-4">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => navigate(`/convo/${conv.id}`)}
              className="focus:outline-none"
            >
              <SidebarConversationIcon
                conversation={conv}
                members={members[conv.id]}
              />
            </button>
          ))}
        </div>

        <div className="mb-4">
          <UserPanel />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
