import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import minicord from "@/api.ts";
import styles from "./home.module.css";
import type { Conversation, User } from "@/types";
import { FriendsManager } from "./friends.tsx";
import { ConversationList, DMContent } from "./conversation.tsx";

export interface ContentState {
  selected: string; // friends | dm | group
  conversation?: Conversation;
}

export const UserContext = createContext<User | null>(null);

function logout(navigate: NavigateFunction) {
  localStorage.removeItem("token");
  navigate("/login");
}

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [contentState, setContentState] = useState<ContentState>({
    selected: "friends",
  });

  useEffect(() => {
    minicord
      .get("/users/self")
      .then((res) => setUser(res.data))
      .catch(() => logout(navigate));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, []);

  return (
    <div className={`${styles.home_bg} bg`}>
      <UserContext value={user!}>
        <SidePanel setContentState={setContentState} />
        <ContentView
          contentState={contentState}
          setContentState={setContentState}
        />
      </UserContext>
    </div>
  );
}

function SidePanel({
  setContentState,
}: {
  setContentState: Dispatch<SetStateAction<ContentState>>;
}) {
  return (
    <div className={styles.side_panel}>
      <div>
        <div
          className={styles.side_panel_container}
          onClick={() => setContentState({ selected: "friends" })}
        >
          <label>Friends</label>
        </div>
        <hr />
        <ConversationList setContentState={setContentState} />
      </div>

      <UserControls />
    </div>
  );
}

function ContentView({
  contentState,
  setContentState,
}: {
  contentState: ContentState;
  setContentState: Dispatch<SetStateAction<ContentState>>;
}) {
  return (
    <>
      {contentState.selected === "friends" && (
        <FriendsManager setContentState={setContentState} />
      )}
      {contentState.selected === "dm" && (
        <DMContent conversation={contentState.conversation!} />
      )}
    </>
  );
}

function UserControls() {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  return (
    <div className={styles.side_panel_container}>
      <div className={styles.user_controls}>
        <label>{user?.username}</label>
        <button onClick={() => logout(navigate)} className="secondary">
          Logout
        </button>
      </div>
    </div>
  );
}
