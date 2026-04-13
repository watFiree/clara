import { z } from "zod";
import type { Tool, UIToolInvocation } from "ai";
import { updateJournalParameters } from "./schema";

export type UpdateJournalInput = z.infer<typeof updateJournalParameters>;

export type UpdateJournalOutput = {
  approved: boolean;
  saved: boolean;
};

export type UpdateJournalToolPart = {
  type: "tool-updateJournal";
  toolCallId: string;
  state: UIToolInvocation<Tool>["state"];
  input: UpdateJournalInput;
  output?: UpdateJournalOutput;
};
