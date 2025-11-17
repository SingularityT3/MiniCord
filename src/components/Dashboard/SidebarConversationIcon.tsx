import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/User";
import { getUsernameByIdAPI } from "@/Api/Users";

interface Props {
  conversation: any;
  members?: any[];
}

const SidebarConversationIcon: React.FC<Props> = ({
  conversation,
  members,
}) => {
  const { user } = useAuth();
  const isGroup = conversation.type === "GROUP";

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch DM username dynamically
  useEffect(() => {
    const load = async () => {
      if (isGroup) {
        // group avatar (use group title)
        if (conversation.title) {
          const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            conversation.title
          )}&background=8b5cf6&color=ffffff`;
          setAvatarUrl(url);
        }
        return;
      }

      // DIRECT MESSAGE
      const other = (members || []).find((m: any) => m.userId !== user?.id);

      if (!other?.userId) {
        setAvatarUrl(null);
        return;
      }

      try {
        const res = await getUsernameByIdAPI(other.userId);
        const username = res.data?.username;

        if (username) {
          const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            username
          )}&background=8b5cf6&color=ffffff`;
          setAvatarUrl(url);
        } else {
          setAvatarUrl(null);
        }
      } catch (err) {
        console.error("Failed to load username:", err);
        setAvatarUrl(null);
      }
    };

    load();
  }, [conversation, members, isGroup, user]);

  return (
    <div
      className="w-12 h-12 rounded-2xl overflow-hidden 
                 bg-purple-600/40 border border-purple-300/20 dark:border-purple-800/30
                 shadow-sm hover:scale-105 transition"
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-purple-500/30" />
      )}
    </div>
  );
};

export default SidebarConversationIcon;
