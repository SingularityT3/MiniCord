import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { createConversationAPI } from "@/Api/Conversation";
import { getUserByUsernameAPI } from "@/Api/Users";

const CreateChatModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"INIT" | "DM" | "GROUP">("INIT");

  // Close modal when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const dmUsernameRef = useRef<HTMLInputElement>(null);
  const groupTitleRef = useRef<HTMLInputElement>(null);
  const groupUsernamesRef = useRef<HTMLInputElement>(null);

  const handleStartDM = async () => {
    if (!dmUsernameRef.current?.value) return;
    try {
      const res = await getUserByUsernameAPI(dmUsernameRef.current.value);
      const user = res.data;
      if (user && user.id) {
        await createConversationAPI("DIRECT_MESSAGE", [user.id]);
        onClose();
      } else {
        alert("User not found");
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Failed to create DM");
    }
  };

  const handleCreateGroup = async () => {
    const title = groupTitleRef.current?.value;
    const usernames = groupUsernamesRef.current?.value
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    if (!title || usernames!.length === 0) {
      alert("Please provide a group title and at least one member.");
      return;
    }

    try {
      const memberIds = await Promise.all(
        usernames!.map(async (username) => {
          const res = await getUserByUsernameAPI(username);
          const user = res.data;
          if (user && user.id) {
            return user.id;
          } else {
            throw new Error(`User not found: ${username}`);
          }
        })
      );

      await createConversationAPI("GROUP", memberIds, title);
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`Failed to create group: ${message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={wrapperRef}
        className="w-full max-w-lg bg-white/30 dark:bg-[#0f021f]/60 
                   rounded-2xl p-6 backdrop-blur-xl border 
                   border-purple-300/20 relative"
      >
        {/* BACK BUTTON (only in DM or GROUP modes) */}
        {(mode === "DM" || mode === "GROUP") && (
          <button
            onClick={() => setMode("INIT")}
            className="absolute left-4 top-4 flex items-center gap-1 
                       text-purple-700 dark:text-purple-300 text-sm
                       hover:opacity-80 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 dark:text-gray-300 
                     hover:text-gray-800 dark:hover:text-gray-100 text-sm"
        >
          Close
        </button>

        {/* INIT MODE */}
        {mode === "INIT" && (
          <div className="flex flex-col items-center gap-6 mt-10">
            <button
              onClick={() => setMode("DM")}
              className="w-full py-3 bg-purple-600 text-white rounded-xl text-lg"
            >
              Direct Message
            </button>

            <button
              onClick={() => setMode("GROUP")}
              className="w-full py-3 bg-purple-500 text-white rounded-xl text-lg"
            >
              Create Group
            </button>
          </div>
        )}

        {/* DM MODE */}
        {mode === "DM" && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-200 mb-4">
              Create Direct Message
            </h2>

            <input
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded bg-white/70 dark:bg-[#16062e]/70"
              ref={dmUsernameRef}
            />

            <button
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded"
              onClick={handleStartDM}
            >
              Start DM
            </button>
          </div>
        )}

        {/* GROUP MODE */}
        {mode === "GROUP" && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-purple-700 dark:text-purple-200 mb-4">
              Create Group
            </h2>

            <input
              type="text"
              placeholder="Group Title"
              className="w-full px-4 py-2 rounded bg-white/70 dark:bg-[#16062e]/70 mb-3"
              ref={groupTitleRef}
            />

            <input
              type="text"
              placeholder="Add member usernames (comma separated)"
              className="w-full px-4 py-2 rounded bg-white/70 dark:bg-[#16062e]/70"
              ref={groupUsernamesRef}
            />

            <button
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded"
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateChatModal;
