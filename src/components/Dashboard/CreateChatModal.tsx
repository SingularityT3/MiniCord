import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { createConversationAPI } from "@/Api/Conversation";
import { getUserByUsernameAPI } from "@/Api/Users";

const CreateChatModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"INIT" | "DM" | "GROUP">("INIT");

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

  // refs
  const dmUsernameRef = useRef<HTMLInputElement>(null);
  const groupTitleRef = useRef<HTMLInputElement>(null);
  const groupUsernamesRef = useRef<HTMLInputElement>(null);

  // error states
  const [dmError, setDmError] = useState("");
  const [groupError, setGroupError] = useState("");

  // ---------------------------
  // DIRECT MESSAGE HANDLER
  // ---------------------------
  const handleStartDM = async () => {
    const username = dmUsernameRef.current?.value?.trim();

    if (!username) {
      setDmError("Please enter a username.");
      return;
    }

    setDmError("");

    try {
      const res = await getUserByUsernameAPI(username);
      const user = res.data;

      if (!user || !user.id) {
        setDmError("User not found.");
        return;
      }

      await createConversationAPI("DIRECT_MESSAGE", [user.id]);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setDmError("Failed to create DM.");
    }
  };

  // ---------------------------
  // GROUP HANDLER
  // ---------------------------
  const handleCreateGroup = async () => {
    const title = groupTitleRef.current?.value?.trim();
    const usernames = groupUsernamesRef.current?.value
      ?.split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    if (!title) {
      setGroupError("Group title is required.");
      return;
    }

    if (!usernames || usernames.length === 0) {
      setGroupError("Please add at least one member.");
      return;
    }

    setGroupError("");

    try {
      const memberIds = [];

      for (const username of usernames) {
        const res = await getUserByUsernameAPI(username);
        const user = res.data;

        if (!user || !user.id) {
          setGroupError(`User not found: ${username}`);
          return;
        }

        memberIds.push(user.id);
      }

      await createConversationAPI("GROUP", memberIds, title);
      onClose();
    } catch (error: unknown) {
      console.error(error);
      const msg =
        error instanceof Error ? error.message : "Failed to create group.";
      setGroupError(msg);
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
        {(mode === "DM" || mode === "GROUP") && (
          <button
            onClick={() => {
              setDmError("");
              setGroupError("");
              setMode("INIT");
            }}
            className="absolute left-4 top-4 flex items-center gap-1 
                       text-purple-700 dark:text-purple-300 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-600 dark:text-gray-300 text-sm"
        >
          Close
        </button>

        {/* INIT */}
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
              ref={dmUsernameRef}
              onChange={() => setDmError("")}
              className={`w-full px-4 py-2 rounded bg-white/70 dark:bg-[#16062e]/70 ${
                dmError ? "border border-red-500" : ""
              }`}
            />

            {dmError && <p className="text-red-500 text-sm mt-1">{dmError}</p>}

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
              ref={groupTitleRef}
              onChange={() => setGroupError("")}
              className={`w-full px-4 py-2 rounded bg-white/70 dark:bg-[#16062e]/70 mb-3 ${
                groupError ? "border border-red-500" : ""
              }`}
            />

            <input
              type="text"
              placeholder="Add member usernames (comma separated)"
              ref={groupUsernamesRef}
              onChange={() => setGroupError("")}
              className={`w-full px-4 py-2 rounded bg-white/70 dark:bg-[#16062e]/70 ${
                groupError ? "border border-red-500" : ""
              }`}
            />

            {groupError && (
              <p className="text-red-500 text-sm mt-1">{groupError}</p>
            )}

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
