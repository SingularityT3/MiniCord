import React, { useEffect, useRef, useState } from "react";
import { getUserByUsernameAPI } from "@/Api/Users";
import { createConversationAPI } from "@/Api/Conversation";

const CreateChatModal: React.FC<{
  onClose: () => void;
  onCreated?: (conv: any) => void;
}> = ({ onClose, onCreated }) => {
  const [mode, setMode] = useState<"DM" | "GROUP">("DM");
  const [value, setValue] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  const create = async () => {
    setLoading(true);
    try {
      if (mode === "DM") {
        const r = await getUserByUsernameAPI(value);
        const id = r.data?.id;
        if (!id) throw new Error("User not found");
        const convRes = await createConversationAPI("DIRECT_MESSAGE", [id]);
        onCreated?.(convRes.data);
      } else {
        const names = membersInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (names.length < 1) throw new Error("Add at least one member");
        // resolve to ids sequentially
        const ids: string[] = [];
        for (const n of names) {
          const r = await getUserByUsernameAPI(n);
          ids.push(r.data.id);
        }
        const convRes = await createConversationAPI("GROUP", ids, value);
        onCreated?.(convRes.data);
      }
    } catch (err: any) {
      console.error("create chat failed", err);
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <div
        ref={ref}
        className="w-full max-w-md p-6 rounded-2xl bg-white/30 dark:bg-[#0f021f]/60 backdrop-blur-xl border border-purple-300/20 dark:border-purple-800/30"
      >
        <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">
          Create Chat
        </h3>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode("DM")}
            className={`flex-1 py-2 rounded ${
              mode === "DM"
                ? "bg-purple-600 text-white"
                : "bg-white/50 dark:bg-[#120427]/50"
            }`}
          >
            DM
          </button>
          <button
            onClick={() => setMode("GROUP")}
            className={`flex-1 py-2 rounded ${
              mode === "GROUP"
                ? "bg-purple-600 text-white"
                : "bg-white/50 dark:bg-[#120427]/50"
            }`}
          >
            Group
          </button>
        </div>

        {mode === "DM" ? (
          <>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="username"
              className="w-full p-2 rounded mb-3 bg-white/70 dark:bg-[#16062e]/60"
            />
          </>
        ) : (
          <>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Group title"
              className="w-full p-2 rounded mb-2 bg-white/70 dark:bg-[#16062e]/60"
            />
            <input
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="members (comma separated usernames)"
              className="w-full p-2 rounded mb-3 bg-white/70 dark:bg-[#16062e]/60"
            />
          </>
        )}

        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={create}
            className="flex-1 py-2 rounded bg-purple-600 text-white"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
