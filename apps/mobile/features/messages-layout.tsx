import { Message as UIMessage } from "@ai-sdk/react";
import { ChatMessage } from "./chat-message";
import { Tool } from "./tool";

export const MessagesLayout = ({ messages }: { messages: UIMessage[] }) => {
  return (
    <>
      {messages.map((m, idx) => {
        const tools = m.parts?.filter((p) => p.type === "tool-invocation");

        return (
          <ChatMessage
            key={m.id}
            role={m.role === "assistant" ? "Assistant" : "User"}
            messageId={m.id}
            parts={m.parts}
            createdAt={m.createdAt}
          >
            {tools?.map((t, idx) => (
              <Tool key={"tool" + idx} invocation={t.toolInvocation} />
            ))}
          </ChatMessage>
        );
      })}
    </>
  );
};
