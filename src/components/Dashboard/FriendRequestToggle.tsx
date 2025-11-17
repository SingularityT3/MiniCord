import React from "react";
import { Users } from "lucide-react";

interface Props {
  onOpen: () => void;
  badgeCount?: number;
}

const FriendRequestToggle: React.FC<Props> = ({ onOpen, badgeCount = 0 }) => {
  return (
    <button
      onClick={onOpen}
      className="relative w-12 h-12 rounded-2xl bg-white/10 dark:bg-[#0f021d]/30
                 flex items-center justify-center border border-purple-300/10 hover:bg-purple-100/10 transition"
      aria-label="Open friend requests"
    >
      <Users className="w-5 h-5 text-purple-700 dark:text-purple-300" />
      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {badgeCount}
        </span>
      )}
    </button>
  );
};

export default FriendRequestToggle;
