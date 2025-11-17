import React, { useEffect, useRef, useState } from "react";
import {
  getFriendsAPI,
  acceptFriendRequestAPI,
  deleteFriendOrRequestAPI,
  pollFriendRequestsAPI,
} from "@/Api/Friends";

interface Props {
  onClose: () => void;
}

const FriendRequestsModal: React.FC<Props> = ({ onClose }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [pending, setPending] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  // initial fetch + polling
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getFriendsAPI();
        if (!mounted) return;
        setPending(res.data?.pending || []);
        setFriends(res.data?.friends || []);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
    })();

    const stopPolling = pollFriendRequestsAPI((pendingList: any[]) => {
      setPending(pendingList);
    }, 1500);

    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      mounted = false;
      stopPolling();
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // actions
  const acceptRequest = async (id: string) => {
    setLoadingMap((m) => ({ ...m, [id]: true }));
    try {
      await acceptFriendRequestAPI(id);
      setPending((p) => p.filter((r) => r.id !== id));

      // refresh friends list
      const res = await getFriendsAPI();
      setFriends(res.data?.friends || []);
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }));
    }
  };

  const rejectOrUnfriend = async (id: string) => {
    setLoadingMap((m) => ({ ...m, [id]: true }));
    try {
      await deleteFriendOrRequestAPI(id);
      setPending((p) => p.filter((r) => r.id !== id));
      setFriends((f) => f.filter((r) => r.id !== id));
    } finally {
      setLoadingMap((m) => ({ ...m, [id]: false }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={wrapperRef}
        className="w-full max-w-2xl bg-white/30 dark:bg-[#0f021f]/60 
                   rounded-2xl p-6 backdrop-blur-xl border border-purple-300/20 
                   max-h-[90vh] overflow-y-auto"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-purple-700 dark:text-purple-300">
            Friends & Requests
          </h1>

          <button
            onClick={onClose}
            className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1"
          >
            Close
          </button>
        </div>

        {/* PENDING REQUESTS */}
        <h2 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-3">
          Friend Requests
        </h2>

        {pending.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400 mb-6">
            No pending friend requests
          </div>
        ) : (
          <div className="grid gap-3 mb-8">
            {pending.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-3 rounded-xl
                           bg-white/40 dark:bg-[#120427]/50 border border-purple-300/10"
              >
                {/* USER */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                    {(req.sender?.username || "U")[0].toUpperCase()}
                  </div>

                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {req.sender?.username}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      wants to be your friend
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm"
                    disabled={loadingMap[req.id]}
                  >
                    {loadingMap[req.id] ? "..." : "Accept"}
                  </button>

                  <button
                    onClick={() => rejectOrUnfriend(req.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded border text-sm"
                    disabled={loadingMap[req.id]}
                  >
                    {loadingMap[req.id] ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FRIENDS LIST */}
        <h2 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-3">
          Your Friends
        </h2>

        {friends.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400">
            You have no friends yet
          </div>
        ) : (
          <div className="grid gap-3">
            {friends.map((fr) => (
              <div
                key={fr.id}
                className="flex items-center justify-between p-3 rounded-xl
                           bg-white/40 dark:bg-[#120427]/50 border border-purple-300/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                    {(fr.sender?.username || "U")[0].toUpperCase()}
                  </div>

                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {fr.sender?.username}
                  </p>
                </div>

                <button
                  onClick={() => rejectOrUnfriend(fr.id)}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded border text-sm"
                  disabled={loadingMap[fr.id]}
                >
                  {loadingMap[fr.id] ? "..." : "Unfriend"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsModal;
