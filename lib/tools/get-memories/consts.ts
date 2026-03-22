import { z } from "zod";
import { getMemoriesParameters } from "./schema";
import { Tool, UIToolInvocation } from "ai";

export type GetMemoriesInput = z.infer<typeof getMemoriesParameters>;

export type GetMemoriesToolPart = {
  type: "tool-getMemories";
  toolCallId: string;
  state: UIToolInvocation<Tool>["state"];
  input: GetMemoriesInput;
};
