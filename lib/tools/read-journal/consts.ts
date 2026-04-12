import { z } from "zod";
import type { Tool, UIToolInvocation } from "ai";
import { readJournalParameters } from "./schema";

export type ReadJournalInput = z.infer<typeof readJournalParameters>;

export type ReadJournalToolPart = {
  type: "tool-readJournal";
  toolCallId: string;
  state: UIToolInvocation<Tool>["state"];
  input: ReadJournalInput;
};
