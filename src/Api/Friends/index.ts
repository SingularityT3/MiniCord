import minicord from "@/api";

const getFriendsAPI = async () => {
  return await minicord.get("/friends");
};

const sendFriendRequestAPI = async (recipientId: string) => {
  const payload = { recipientId };
  return await minicord.post("/friends", payload);
};

const acceptFriendRequestAPI = async (requestId: string) => {
  return await minicord.post(`/friends/${requestId}/accept`);
};

const deleteFriendOrRequestAPI = async (requestId: string) => {
  return await minicord.delete(`/friends/${requestId}`);
};

export {
  getFriendsAPI,
  sendFriendRequestAPI,
  acceptFriendRequestAPI,
  deleteFriendOrRequestAPI,
};
