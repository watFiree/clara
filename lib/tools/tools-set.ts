import { ToolSet } from "ai";
import { askQuestionsTool } from "./ask-questions/tool";
import { createSaveMemoryTool } from "./save-memory/tool";
import { createGetMemoriesTool } from "./get-memories/tool";
import { createUpdateMemoryTool } from "./update-memory/tool";
import { createReadJournalTool } from "./read-journal/tool";
import { createUpdateJournalTool } from "./update-journal/tool";
import { checkMemoryAccess } from "../features/memories/checkAccess";
import { checkJournalAccess } from "../features/journal/checkAccess";

interface ToolsSetParams {
  userId: string;
  conversationId: string;
  memoryEnabled: boolean;
  journalEnabled: boolean;
}

export const createToolsSet = async ({
  userId,
  conversationId,
  memoryEnabled,
  journalEnabled,
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

  if (journalEnabled === true) {
    const journalAccess = await checkJournalAccess(userId);
    if (journalAccess.allowed) {
      if (journalAccess.readToolEnabled) {
        tools.readJournal = createReadJournalTool(userId);
      }
      if (journalAccess.updateToolEnabled) {
        tools.updateJournal = createUpdateJournalTool();
      }
    }
  }

  return tools;
};
