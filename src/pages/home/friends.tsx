import minicord from "@/api";
import type { Friend, User } from "@/types";
import styles from "./home.module.css";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext, type ContentState } from "./home";
import { getDM } from "./conversation";

export function FriendsManager({
  setContentState,
}: {
  setContentState: (s: ContentState) => void;
}) {
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
  const addFriend = async () => {
    const username = addFriendUsername.current!.value;
    minicord
      .get("/users/by-username/" + username)
      .then((res) => minicord.post("/friends", { recipientId: res.data.id }))
      .then(() => alert("Friend request sent"))
      .catch((err) => alert(err.toString()));
  };

  const openDM = (friendId: string) => {
    getDM(friendId).then((conversation) =>
      setContentState({
        selected: "dm",
        conversation: conversation,
      })
    );
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
        <FriendCard
          key={u.id}
          user={u}
          chatCallback={async () => await openDM(u.id)}
          removeCallback={updateFriends}
        />
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
          onClick={() =>
            acceptFriendRequest(user.friendRelationId!, actionCallback)
          }
          className="secondary"
        >
          Accept
        </button>
        <button
          onClick={() => deleteFriend(user.friendRelationId!, actionCallback)}
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
  chatCallback,
  removeCallback,
}: {
  user: User;
  chatCallback: CallableFunction;
  removeCallback: CallableFunction;
}) {
  return (
    <div className={styles.friend_card}>
      <label>{user.username}</label>
      <button
        onClick={() => chatCallback(user.friendRelationId!)}
        className="secondary"
      >
        Chat
      </button>
      <button
        onClick={() => deleteFriend(user.friendRelationId!, removeCallback)}
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
    const friendUserId = f.senderId === userId ? f.recipientId : f.senderId;
    const friend = { id: f.id, friendUserId };
    if (f.acceptTime) {
      friends.push(friend);
    } else {
      pending.push(friend);
    }
  }

  const fetchUser = async (friend: { id: string; friendUserId: string }) => {
    const user = await minicord.get(`/users/${friend.friendUserId}`);
    return {
      ...user.data,
      id: friend.friendUserId,
      friendRelationId: friend.id,
    };
  };
  const pendingUsersPromises = pending.map(fetchUser);
  const friendUsersPromises = friends.map(fetchUser);

  const [pendingUsers, friendUsers] = await Promise.all([
    Promise.all(pendingUsersPromises),
    Promise.all(friendUsersPromises),
  ]);

  return [pendingUsers, friendUsers];
}

function acceptFriendRequest(id: string, actionCallback: CallableFunction) {
  minicord
    .post(`/friends/${id}/accept`)
    .then(() => actionCallback())
    .catch((err) => alert(err.toString()));
}

function deleteFriend(id: string, actionCallback: CallableFunction) {
  minicord
    .delete(`/friends/${id}`)
    .then(() => actionCallback())
    .catch((err) => alert(err.toString()));
}
