import minicord from "@/api";
import type { Conversation, Member, Message, User } from "@/types";
import { useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import styles from "./home.module.css";
import { UserContext, type ContentState } from "./home";

export function ConversationList({
  setContentState,
}: {
  setContentState: Dispatch<SetStateAction<ContentState>>;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const user = useContext(UserContext);
  useEffect(() => {
    if (!user) return;
    minicord
      .get("/conversations")
      .then((res) => {
        Promise.all(
          res.data.map(async (c: Conversation) =>
            c.type === "DIRECT_MESSAGE" ? { ...c, title: (await getDMUser(c, user!.id)).username } : c
          )
        ).then((c) => setConversations(c));
      })
      .catch((err) => alert(err.toString()));
  }, [user]);

  const memberDivs = conversations.map((c) => (
    <div
      key={c.id}
      className={styles.side_panel_container}
      onClick={() =>
        setContentState({
          selected: c.type === "DIRECT_MESSAGE" ? "dm" : "group",
          conversation: c,
        })
      }
    >
      <label>{c.title}</label>
    </div>
  ));

  return <div>{memberDivs}</div>;
}

function MessageComponent({ message }: { message: Message }) {
  return (
    <div>
      <label><b>{message.author?.username}</b></label>
      <br />
      <p>{message.content}</p>
    </div>
  );
}

function MessageDisplay({ conversation }: { conversation: Conversation }) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    minicord
      .get(`/conversations/${conversation.id}/messages`)
      .then((res) =>
        Promise.all(
          res.data.messages.map(async (msg: Message) => {
            const userRes = await minicord.get(`/users/${msg.authorId}`);
            return { ...msg, author: userRes.data };
          })
        )
      )
      .then((res) => setMessages(res));
  }, [conversation]);

  return (
    <div>
      {messages.map((msg) => (
        <MessageComponent key={msg.id} message={msg} />
      ))}
    </div>
  );
}

function MessageComposer({ conversation }: { conversation: Conversation }) {
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const sendMsg = () => {
    if (!msgRef.current) return;
    minicord.post(`/conversations/${conversation.id}/messages`, {
      content: msgRef.current.value,
    });
  };

  return (
    <div>
      <textarea ref={msgRef}></textarea>
      <button onClick={sendMsg}>Send</button>
    </div>
  );
}

export function DMContent({ conversation }: { conversation: Conversation }) {
  const [friendUser, setFriendUser] = useState<User>();
  const user = useContext(UserContext);

  useEffect(() => {
    minicord
      .get(`/conversations/${conversation.id}/members`)
      .then((res) => {
        const friend: Member = res.data.find(
          (member: Member) => member.userId !== user!.id
        );
        return minicord.get(`/users/${friend.userId}`);
      })
      .then((res) => setFriendUser(res.data));
  }, [conversation]);

  return (
    <div>
      <h1>{friendUser?.username}</h1>
      <MessageDisplay conversation={conversation} />
      <MessageComposer conversation={conversation} />
    </div>
  );
}

export async function getDM(friendUserId: string): Promise<Conversation> {
  const conversations: Conversation[] = (await minicord.get("/conversations"))
    .data;
  for (const conversation of conversations) {
    if (conversation.type !== "DIRECT_MESSAGE") continue;
    conversation.members = (
      await minicord.get(`/conversations/${conversation.id}/members`)
    ).data;
    if (
      conversation.members!.find((member) => member.userId === friendUserId)
    ) {
      return conversation;
    }
  }

  const conversation = await minicord.post("/conversations", {
    type: "DIRECT_MESSAGE",
    members: [friendUserId],
  });
  return conversation.data;
}

async function getDMUser(conversation: Conversation, currentUserId: string): Promise<User> {
  const members: Member[] = (
    await minicord.get(`/conversations/${conversation.id}/members`)
  ).data;
  const friend = members.find(
    (member: Member) => member.userId !== currentUserId
  );
  return (await minicord.get(`/users/${friend!.userId}`)).data;
}
