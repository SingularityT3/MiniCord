import React, { useState } from "react";
import { acceptFriendRequestAPI, rejectFriendRequestAPI } from "@/Api/Friends";

const FriendRequestItem: React.FC<{ request: any }> = ({ request }) => {
  const [loading, setLoading] = useState(false);

  const accept = async () => {
    setLoading(true);
    try {
      await acceptFriendRequestAPI(request.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    setLoading(true);
    try {
      await rejectFriendRequestAPI(request.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-44 px-2 py-1 rounded bg-white/20 dark:bg-[#120427]/40 border border-purple-300/10">
      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-white text-sm">
        {(request.sender?.username || "U")[0]}
      </div>
      <div className="flex-1 text-xs text-gray-800 dark:text-gray-200">
        {request.sender?.username}
      </div>
      <button
        onClick={accept}
        disabled={loading}
        className="px-2 py-1 rounded bg-purple-600 text-white text-xs"
      >
        ✓
      </button>
      <button
        onClick={reject}
        disabled={loading}
        className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs"
      >
        ✕
      </button>
    </div>
  );
};

export default FriendRequestItem;
