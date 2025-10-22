import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import minicord from "@/api.ts";
import styles from "./home.module.css";
import type { User } from "@/types";
import { FriendsManager } from "./friends.tsx";

export const UserContext = createContext<User | null>(null);

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    minicord.get("/user/self").then((res) => setUser(res.data));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  return (
    <div className={`${styles.home_bg} bg`}>
      <UserContext value={user!}>
        <SidePanel />
        <ContentView />
      </UserContext>
    </div>
  );
}

function SidePanel() {
  return (
    <div className={styles.side_panel}>
      <div>
        <div className={styles.side_panel_container}>
          <label>Friends</label>
        </div>
        <hr />
        <div>
          <div className={styles.side_panel_container}>
            <label>Conversation 1</label>
          </div>
          <div className={styles.side_panel_container}>
            <label>Conversation 2</label>
          </div>
        </div>
      </div>

      <UserControls />
    </div>
  );
}

function ContentView() {
  return (
    <>
      <FriendsManager />
    </>
  );
}

function UserControls() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.side_panel_container}>
      <div className={styles.user_controls}>
        <label>{user?.username}</label>
        <button onClick={logout} className="secondary">
          Logout
        </button>
      </div>
    </div>
  );
}
