import { z } from "zod";
import { updateMemoryParameters } from "./schema";
import { Tool, UIToolInvocation } from "ai";

export type UpdateMemoryInput = z.infer<typeof updateMemoryParameters>;

export type UpdateMemoryToolPart = {
  type: "tool-updateMemory";
  toolCallId: string;
  state: UIToolInvocation<Tool>["state"];
  input: UpdateMemoryInput;
};
