import minicord from "@/api";

/* Fetch paginated messages (latest 10 by default)
   Supports infinite scroll using before/after cursors */
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

/* Fetch a specific message */
const getMessageByIdAPI = async (conversationId: string, messageId: string) => {
  return await minicord.get(
    `/conversations/${conversationId}/messages/${messageId}`
  );
};

/* Send a new message */
const sendMessageAPI = async (conversationId: string, content: string) => {
  const payload = { content };
  return await minicord.post(
    `/conversations/${conversationId}/messages`,
    payload
  );
};

/* A polling helper to simulate real-time messages (until WebSocket arrives) */
const pollMessagesAPI = (
  conversationId: string,
  onNewMessages: (msgs: any[]) => void,
  interval = 1000
) => {
  let lastMessageId: string | null = null;

  const poll = async () => {
    try {
      const res = await getMessagesAPI(
        conversationId,
        10,
        undefined,
        lastMessageId || undefined
      );

      if (res.data?.messages?.length) {
        const newMessages = res.data.messages;
        lastMessageId = newMessages[newMessages.length - 1].id;

        onNewMessages(newMessages);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  const id = setInterval(poll, interval);

  return () => clearInterval(id); // stop polling
};

/* Local in-memory message cache (helps reduce fetch calls) */
const createMessageCache = () => {
  const cache: Record<string, any[]> = {};

  return {
    get(conversationId: string) {
      return cache[conversationId] || [];
    },
    add(conversationId: string, messages: any[]) {
      cache[conversationId] = [...(cache[conversationId] || []), ...messages];
    },
    set(conversationId: string, messages: any[]) {
      cache[conversationId] = messages;
    },
    clear(conversationId: string) {
      delete cache[conversationId];
    },
  };
};

export const MessageCache = createMessageCache();

export { getMessagesAPI, getMessageByIdAPI, sendMessageAPI, pollMessagesAPI };
