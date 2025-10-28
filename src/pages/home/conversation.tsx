import minicord from "@/api";
import type { Conversation } from "@/types";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import type { ContentState } from "./home";

export function ConversationList({
  setContentState,
}: {
  setContentState: (s: ContentState) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    minicord
      .get("/conversations")
      .then((res) => setConversations(res.data))
      .catch((err) => alert(err.toString()));
  }, []);

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
      <label>{c.id}</label>
    </div>
  ));

  return <div>{memberDivs}</div>;
}

function MessageDisplay() {
  return (
    <>
      <p>Messages go here...</p>
    </>
  );
}

export function DMContent({ conversation }: { conversation: Conversation }) {
  return (
    <>
      <h1>Conversation ID: {conversation.id}</h1>
      <MessageDisplay />
    </>
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
