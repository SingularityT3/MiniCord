import minicord from "@/api";

/* Fetch all friends + pending requests */
const getFriendsAPI = async () => {
  return await minicord.get("/friends");
};

/* Send a new friend request */
const sendFriendRequestAPI = async (recipientId: string) => {
  const payload = { recipientId };
  return await minicord.post("/friends", payload);
};

/* Accept a request */
const acceptFriendRequestAPI = async (requestId: string) => {
  return await minicord.post(`/friends/${requestId}/accept`);
};

/* Reject friend request OR unfriend */
const deleteFriendOrRequestAPI = async (requestId: string) => {
  return await minicord.delete(`/friends/${requestId}`);
};

/* ----------------- EXTRA FRONTEND HELPERS ----------------- */

/* Extract only pending requests */
const getFriendRequestsOnlyAPI = async () => {
  const res = await getFriendsAPI();
  return res.data?.pending || [];
};

/* Extract only accepted friends */
const getFriendsOnlyAPI = async () => {
  const res = await getFriendsAPI();
  return res.data?.friends || [];
};

/* Alias for rejecting a request (readable name) */
const rejectFriendRequestAPI = async (requestId: string) => {
  return deleteFriendOrRequestAPI(requestId);
};

/* Alias for removing a friend */
const removeFriendAPI = async (friendshipId: string) => {
  return deleteFriendOrRequestAPI(friendshipId);
};

/* Determine if someone is already a friend */
const isFriendAPI = async (userId: string) => {
  const res = await getFriendsAPI();
  return res.data.friends.some((f: any) => f.sender.id === userId);
};

/* Local friend request cache */
const friendCache = {
  friends: [] as any[],
  pending: [] as any[],
  set(data: any) {
    this.friends = data.friends || [];
    this.pending = data.pending || [];
  },
};

/* Polling helper for real-time friend request updates */
const pollFriendRequestsAPI = (
  callback: (pending: any[]) => void,
  interval = 1500
) => {
  const poll = async () => {
    try {
      const res = await getFriendRequestsOnlyAPI();
      callback(res);
    } catch (err) {
      console.error("Friend request polling error:", err);
    }
  };

  const id = setInterval(poll, interval);
  return () => clearInterval(id);
};

export {
  getFriendsAPI,
  sendFriendRequestAPI,
  acceptFriendRequestAPI,
  deleteFriendOrRequestAPI,

  // extras
  getFriendRequestsOnlyAPI,
  getFriendsOnlyAPI,
  rejectFriendRequestAPI,
  removeFriendAPI,
  isFriendAPI,
  pollFriendRequestsAPI,
  friendCache,
};
