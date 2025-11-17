import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CreateChatButton from "./CreateChatButton";
import SidebarConversationIcon from "./SidebarConversationIcon";
import UserPanel from "./UserPanel";
import FriendRequestToggle from "./FriendRequestToggle";
import { getConversationMembersAPI, getConversationsAPI } from "@/Api/Conversation";
import FriendRequestsModal from "./FriendRequestsModal";

const Sidebar: React.FC = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<string, any[]>>({});
  const [requestsOpen, setRequestsOpen] = useState(false);
  const navigate = useNavigate();

  // load conversations once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getConversationsAPI();
        if (!mounted) return;
        setConversations(res.data || []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    conversations.forEach((convo) => {
      if (!members[convo.id]) {
        getConversationMembersAPI(convo.id)
          .then((r) =>
            setMembers((prev) => ({ ...prev, [convo.id]: r.data || [] }))
          )
          .catch(() => {
            /* ignore per-convo member errors */
          });
      }
    });
  }, [conversations]);

  const openConversation = (conv: any) => {
    navigate(`/convo/${conv.id}`);
  };

  return (
    <>
      {requestsOpen && (
        <FriendRequestsModal onClose={() => setRequestsOpen(false)} />
      )}

      <aside
        className="h-full w-20 flex flex-col justify-between items-center
                       bg-white/20 dark:bg-[#0e021d]/40 backdrop-blur-xl border-r
                       border-purple-300/10 dark:border-purple-800/20"
      >
        <div className="mt-4 flex flex-col items-center gap-4">
          <CreateChatButton
            onClick={() => {
              /* open create modal if you have one */
            }}
          />
          <FriendRequestToggle onOpen={() => setRequestsOpen(true)} />
        </div>

        <div className="flex-1 w-full overflow-y-auto py-4 flex flex-col items-center gap-4">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className="focus:outline-none"
              aria-label={`Open conversation ${conv.title ?? conv.id}`}
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
