import minicord from "@/api";
import type { Friend, User } from "@/types";
import styles from "./home.module.css";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "./home";

export function FriendsManager() {
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
          <h2>Pending Requests</h2>
          {pendingFriends.map((u) => (
            <PendingFriendRequest
              key={u.id}
              user={u}
              actionCallback={updateFriends}
            />
          ))}
          <hr />
          {friends.length > 0 && <h2>Friends</h2>}
        </>
      )}
      {friends.map((u) => (
        <FriendCard key={u.id} user={u} actionCallback={updateFriends} />
      ))}
    </div>
  );
}

function PendingFriendRequest({
  user,
  actionCallback,
}: {
  user: User;
  actionCallback: CallableFunction;
}) {
  return (
    <div className={styles.friend_card}>
      <label>{user.username}</label>
      <div>
        <button
          onClick={() => acceptFriendRequest(user, actionCallback)}
          className="secondary"
        >
          Accept
        </button>
        <button
          onClick={() => rejectFriendRequest(user, actionCallback)}
          className="secondary"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

function FriendCard({
  user,
  actionCallback,
}: {
  user: User;
  actionCallback: CallableFunction;
}) {
  return (
    <div className={styles.friend_card}>
      <label>{user.username}</label>
      <button
        onClick={() => rejectFriendRequest(user, actionCallback)}
        className="secondary"
      >
        Remove
      </button>
    </div>
  );
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

function acceptFriendRequest(user: User, actionCallback: CallableFunction) {
  minicord
    .post("/friends/acceptRequest", { username: user.username })
    .then(() => actionCallback())
    .catch((err) => alert(err.toString()));
}

function rejectFriendRequest(user: User, actionCallback: CallableFunction) {
  minicord
    .post("/friends/rejectRequest", { username: user.username })
    .then(() => actionCallback())
    .catch((err) => alert(err.toString()));
}
