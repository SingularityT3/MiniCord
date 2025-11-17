import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/User";

const UserPanel = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const avatar =
    user?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.username || "User"
    )}&background=8b5cf6&color=ffffff`;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1 rounded-xl hover:bg-purple-200/20 dark:hover:bg-purple-900/30 transition"
      >
        <img
          src={avatar}
          className="w-12 h-12 rounded-full border border-purple-300/30 dark:border-purple-800/40"
        />
      </button>

      {open && (
        <div
          className="absolute bottom-14 right-0 bg-white dark:bg-[#1a0535] 
                        rounded-lg shadow-lg border border-purple-300/20 
                        dark:border-purple-800/30 p-1 w-fit"
        >
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 w-full text-left
                       text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30
                       rounded-md"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
