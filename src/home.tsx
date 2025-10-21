import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { minicord } from "./main.tsx";
import styles from "./home.module.css";

interface User {
  id: string;
  username: string;
}
const UserContext = createContext<User | null>(null);

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

function PendingFriendRequest({ user, actionCallback }: {user: User, actionCallback: CallableFunction}) {
  const accept = () => {
    minicord
      .post("/friends/acceptRequest", { username: user.username })
      .then(() => actionCallback(user))
      .catch((err) => alert(err.toString()));
  };

  const reject = () => {
    minicord
      .post("/friends/rejectRequest", { username: user.username })
      .then(() => actionCallback(user))
      .catch((err) => alert(err.toString()));
  };

  return (
    <div>
      <label>{user.username}</label>
      <button onClick={accept}>Accept</button>
      <button onClick={reject}>Reject</button>
    </div>
  );
}

function ContentView() {
  const [pendingFriends, setPendingFriends] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  const user = useContext(UserContext);
  const updateFriends = () => {
    if (!user) return;
    fetchFriends(user.id).then((res) => {
      const [pending, friends] = res;
      setPendingFriends(pending);
      setFriends(friends);
    });
  };
  useEffect(updateFriends, [user]);

  const addFriendUsername = useRef<HTMLInputElement>(null);
  const addFriend = () => {
    const username = addFriendUsername.current!.value;
    minicord
      .post("/friends/sendRequest", { username: username })
      .then(() => alert("Friend request sent"))
      .catch((err) => alert(err.toString()));
  };

  return (
    <div className={styles.content}>
      <h1>Friends</h1>
      <label>Add friend</label>
      <br />
      <input type="text" placeholder="Username" ref={addFriendUsername}></input>
      <button onClick={addFriend}>+</button>
      <br />
      {pendingFriends.length > 0 && (
        <>
          <h2>Pending</h2>
          {pendingFriends.map((u) => <PendingFriendRequest key={u.id} user={u} actionCallback={updateFriends} />)}
          <hr />
        </>
      )}
      {friends.map((u) => (
        <div key={u.id!}>
          <label>{u.username}</label>
        </div>
      ))}
    </div>
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

interface Friend {
  senderId: string;
  recipientId: string;
  acceptTime?: Date;
}

interface User {
  id: string;
  username: string;
}

async function fetchFriends(userId: string): Promise<User[][]> {
  const friendObjs: Friend[] = (await minicord.get("/friends")).data;

  const pending = [];
  const friends = [];

  for (let f of friendObjs) {
    const friendId = f.senderId === userId ? f.recipientId : f.senderId;
    if (f.acceptTime) {
      friends.push(friendId);
    } else {
      pending.push(friendId);
    }
  }

  const fetchUser = async (id: string) => {
    const user = await minicord.get(`/user?id=${id}`);
    return { id: id, ...user.data };
  };
  const pendingUsersPromises = pending.map(fetchUser);
  const friendUsersPromises = friends.map(fetchUser);

  const [pendingUsers, friendUsers] = await Promise.all([
    Promise.all(pendingUsersPromises),
    Promise.all(friendUsersPromises),
  ]);

  return [pendingUsers, friendUsers];
}
