import minicord from "@/api";

const getConversationsAPI = async () => {
  return await minicord.get("/conversations");
};

const createConversationAPI = async (
  type: "DIRECT_MESSAGE" | "GROUP",
  members: string[],
  title?: string
) => {
  const payload = { type, members, title };
  return await minicord.post("/conversations", payload);
};

const updateConversationTitleAPI = async (
  conversationId: string,
  title: string
) => {
  const payload = { title };
  return await minicord.patch(`/conversations/${conversationId}`, payload);
};

const getConversationMembersAPI = async (conversationId: string) => {
  return await minicord.get(`/conversations/${conversationId}/members`);
};

const addConversationMemberAPI = async (conversationId: string, id: string) => {
  const payload = { id };
  return await minicord.post(
    `/conversations/${conversationId}/members`,
    payload
  );
};

const removeConversationMemberAPI = async (
  conversationId: string,
  memberId: string
) => {
  return await minicord.delete(
    `/conversations/${conversationId}/members/${memberId}`
  );
};

export {
  getConversationsAPI,
  createConversationAPI,
  updateConversationTitleAPI,
  getConversationMembersAPI,
  addConversationMemberAPI,
  removeConversationMemberAPI,
};
