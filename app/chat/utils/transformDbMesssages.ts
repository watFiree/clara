import type { DbMessage } from "@/lib/types/api";
import type { UIMessage } from "ai";

export const transformDbMessages = (messages: DbMessage[]): UIMessage[] => {
  return messages.map((m) => ({
    id: m.id,
    role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
    parts: m.parts as UIMessage["parts"],
    createdAt: new Date(m.createdAt),
    metadata: m.metadata,
  }));
};
