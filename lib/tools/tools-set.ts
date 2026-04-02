import { ToolSet } from "ai";
import { askQuestionsTool } from "./ask-questions/tool";
import { createSaveMemoryTool } from "./save-memory/tool";
import { createGetMemoriesTool } from "./get-memories/tool";
import { createUpdateMemoryTool } from "./update-memory/tool";
import { checkMemoryAccess } from "../features/memories/checkAccess";

interface ToolsSetParams {
  userId: string;
  conversationId: string;
  memoryEnabled: boolean;
}

export const createToolsSet = async ({
  userId,
  conversationId,
  memoryEnabled,
}: ToolsSetParams) => {
  const tools: ToolSet = {
    askQuestions: askQuestionsTool,
  };

  if (memoryEnabled === true) {
    const memoryAccess = await checkMemoryAccess(userId);
    if (memoryAccess.allowed) {
      tools.saveMemory = createSaveMemoryTool(userId, conversationId, memoryAccess.memoryLimit);
      tools.getMemories = createGetMemoriesTool(userId);
      tools.updateMemory = createUpdateMemoryTool(userId);
    }
  }

  return tools;
};
