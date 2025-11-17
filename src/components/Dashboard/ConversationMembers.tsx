import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversationMembersAPI } from "@/Api/Conversation";
import { getUserAPI } from "@/Api/Users";
import { type Member as MemberType } from "@/types";

interface DetailedMember {
  id: string;
  username: string;
  avatarUrl: string;
}

const ConversationMembers: React.FC = () => {
  const { id: conversationId } = useParams<{ id: string }>();
  const [members, setMembers] = useState<DetailedMember[]>([]);

  useEffect(() => {
    if (conversationId) {
      getConversationMembersAPI(conversationId)
        .then(async (res) => {
          const memberData: MemberType[] = res.data || [];
          const detailedMembers = await Promise.all(
            memberData.map(async (member) => {
              const userRes = await getUserAPI(member.userId);
              const userData = userRes.data;
              return {
                id: userData.id,
                username: userData.username,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userData.username
                )}&background=random`,
              };
            })
          );
          setMembers(detailedMembers);
        })
        .catch((err) => {
          console.error("Failed to fetch conversation members:", err);
          setMembers([]);
        });
    } else {
      setMembers([]);
    }
  }, [conversationId]);

  if (!conversationId) {
    return null; // Don't render anything if no conversation is selected
  }

  return (
    <aside
      className="
      h-full w-64 flex flex-col 
      bg-white/20 dark:bg-[#0e021d]/40 backdrop-blur-xl 
      border-l border-purple-300/10 dark:border-purple-800/20
      p-4"
    >
      <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
        Members
      </h2>
      <div className="flex-1 overflow-y-auto">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 mb-3">
            <img
              src={member.avatarUrl}
              alt={member.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="text-gray-800 dark:text-gray-200">
              {member.username}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ConversationMembers;
