import minicord from "@/api";

/* Fetch all conversations */
const getConversationsAPI = async () => {
  return await minicord.get("/conversations");
};

/* Get a specific conversation */
const getConversationByIdAPI = async (conversationId: string) => {
  return await minicord.get(`/conversations/${conversationId}`);
};

/* Create DM or Group */
const createConversationAPI = async (
  type: "DIRECT_MESSAGE" | "GROUP",
  members: string[],
  title?: string
) => {
  const payload = { type, members, title };
  return await minicord.post("/conversations", payload);
};

/* Update group title */
const updateConversationTitleAPI = async (
  conversationId: string,
  title: string
) => {
  const payload = { title };
  return await minicord.patch(`/conversations/${conversationId}`, payload);
};

/* Get members of a convo */
const getConversationMembersAPI = async (conversationId: string) => {
  return await minicord.get(`/conversations/${conversationId}/members`);
};

/* Add new member to group */
const addConversationMemberAPI = async (conversationId: string, id: string) => {
  const payload = { id };
  return await minicord.post(
    `/conversations/${conversationId}/members`,
    payload
  );
};

/* Remove member */
const removeConversationMemberAPI = async (
  conversationId: string,
  memberId: string
) => {
  return await minicord.delete(
    `/conversations/${conversationId}/members/${memberId}`
  );
};

/* ---------------- EXTRA FRONTEND HELPERS ---------------- */

/* Get the latest message for preview in sidebar */
const getConversationLastMessageAPI = async (conversationId: string) => {
  return await minicord.get(
    `/conversations/${conversationId}/messages?limit=1`
  );
};

/* Conversation Cache */
const conversationCache = {
  members: {} as Record<string, any[]>,
  details: {} as Record<string, any>,

  setMembers(convoId: string, members: any[]) {
    this.members[convoId] = members;
  },
  getMembers(convoId: string) {
    return this.members[convoId] || null;
  },

  setDetails(convoId: string, details: any) {
    this.details[convoId] = details;
  },
  getDetails(convoId: string) {
    return this.details[convoId] || null;
  },
};

/* Polling conversations (until WebSocket is added) */
const pollConversationsAPI = (
  callback: (conversations: any[]) => void,
  interval = 2000
) => {
  const poll = async () => {
    try {
      const res = await getConversationsAPI();
      callback(res.data || []);
    } catch (err) {
      console.error("Conversation polling failed:", err);
    }
  };

  const id = setInterval(poll, interval);
  return () => clearInterval(id);
};

/* Resolve avatar + title to show in sidebar */
const resolveConversationDisplayData = async (
  convo: any,
  currentUserId: string
) => {
  if (convo.type === "GROUP") {
    return {
      title: convo.title || "Untitled Group",
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        convo.title || "Group"
      )}&background=8b5cf6&color=ffffff`,
    };
  }

  // DIRECT MESSAGE
  const membersRes = await getConversationMembersAPI(convo.id);
  const members = membersRes.data;

  const other = members.find((m: any) => m.userId !== currentUserId);
  if (!other) {
    return {
      title: "Unknown User",
      avatarUrl:
        "https://ui-avatars.com/api/?name=?&background=8b5cf6&color=ffffff",
    };
  }

  // Fetch username
  const userRes = await minicord.get(`/users/${other.userId}`);
  const username = userRes.data.username;

  return {
    title: username,
    avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=8b5cf6&color=ffffff`,
  };
};

export {
  getConversationsAPI,
  getConversationByIdAPI,
  createConversationAPI,
  updateConversationTitleAPI,
  getConversationMembersAPI,
  addConversationMemberAPI,
  removeConversationMemberAPI,
  getConversationLastMessageAPI,
  pollConversationsAPI,
  conversationCache,
  resolveConversationDisplayData,
};
