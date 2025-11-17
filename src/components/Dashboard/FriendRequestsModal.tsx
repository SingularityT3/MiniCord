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
  const [requests, setRequests] = useState<any[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  // fetch initial pending requests
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getFriendsAPI();
        if (!mounted) return;
        setRequests(res.data?.pending || []);
      } catch (err) {
        console.error("Failed to fetch friend requests", err);
      }
    })();

    // start polling while modal is open
    const stop = pollFriendRequestsAPI((pending: any[]) => {
      setRequests(pending || []);
    }, 1200);

    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);

    return () => {
      mounted = false;
      stop();
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const accept = async (id: string) => {
    setLoadingMap((s) => ({ ...s, [id]: true }));
    try {
      await acceptFriendRequestAPI(id);
      setRequests((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      console.error("accept failed", err);
      alert("Accept failed");
    } finally {
      setLoadingMap((s) => ({ ...s, [id]: false }));
    }
  };

  const reject = async (id: string) => {
    setLoadingMap((s) => ({ ...s, [id]: true }));
    try {
      await deleteFriendOrRequestAPI(id);
      setRequests((r) => r.filter((x) => x.id !== id));
    } catch (err) {
      console.error("reject failed", err);
      alert("Reject failed");
    } finally {
      setLoadingMap((s) => ({ ...s, [id]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={panelRef}
        className="w-full max-w-2xl bg-white/30 dark:bg-[#0f021f]/60 rounded-2xl p-4 backdrop-blur-xl border border-purple-300/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
            Friend Requests
          </h2>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 dark:text-gray-300 px-3 py-1"
          >
            Close
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="py-8 text-center text-gray-600 dark:text-gray-400">
            No pending friend requests
          </div>
        ) : (
          <div className="grid gap-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-white/40 dark:bg-[#120427]/50 p-3 rounded-lg border border-purple-300/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    {(req.sender?.username || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {req.sender?.username}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      wants to be your friend
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => accept(req.id)}
                    disabled={!!loadingMap[req.id]}
                    className="px-3 py-1 rounded bg-purple-600 text-white text-sm"
                  >
                    {loadingMap[req.id] ? "..." : "Accept"}
                  </button>

                  <button
                    onClick={() => reject(req.id)}
                    disabled={!!loadingMap[req.id]}
                    className="px-3 py-1 rounded border text-sm text-red-600 bg-red-50"
                  >
                    {loadingMap[req.id] ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsModal;
