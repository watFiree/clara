import { z } from "zod";
import { saveMemoryParameters } from "./schema";
import { Tool, UIToolInvocation } from "ai";

export type SaveMemoryInput = z.infer<typeof saveMemoryParameters>;

export type SaveMemoryToolPart = {
  type: "tool-saveMemory";
  toolCallId: string;
  state: UIToolInvocation<Tool>["state"];
  input: SaveMemoryInput;
};
