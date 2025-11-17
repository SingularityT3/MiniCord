import minicord from "@/api";

const getMessagesAPI = async (
  conversationId: string,
  limit = 10,
  before?: string,
  after?: string
) => {
  return await minicord.get(`/conversations/${conversationId}/messages`, {
    params: { limit, before, after },
  });
};

const getMessageByIdAPI = async (conversationId: string, messageId: string) => {
  return await minicord.get(
    `/conversations/${conversationId}/messages/${messageId}`
  );
};

const sendMessageAPI = async (conversationId: string, content: string) => {
  const payload = { content };
  return await minicord.post(
    `/conversations/${conversationId}/messages`,
    payload
  );
};

export { getMessagesAPI, getMessageByIdAPI, sendMessageAPI };
