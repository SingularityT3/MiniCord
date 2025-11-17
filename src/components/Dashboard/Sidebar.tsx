import { useState } from "react";
import CreateChatModal from "./CreateChatModal";
import CreateChatButton from "./CreateChatButton";
import UserPanel from "./UserPanel";

const Sidebar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {openModal && <CreateChatModal onClose={() => setOpenModal(false)} />}

      <aside
        className="h-full w-20 flex flex-col justify-between items-center
        bg-white/20 dark:bg-[#0e021d]/40 backdrop-blur-xl border-r 
        border-purple-300/10 dark:border-purple-800/20 shadow-md"
      >
        <div className="mt-6">
          <CreateChatButton onClick={() => setOpenModal(true)} />
        </div>

        <div className="mb-6">
          <UserPanel />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
