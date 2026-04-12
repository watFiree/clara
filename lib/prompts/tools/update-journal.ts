export const UPDATE_JOURNAL_INSTRUCTIONS = `## Tool: updateJournal
Use this tool to write or update the user's journal entry for a specific date.

When to use:
- When the user asks you to write, create, or update a journal entry
- When the user wants to reflect on their day and asks for help writing it down

Tips:
- Write reflective, personal content in markdown format
- Include sections like highlights, reflections, and gratitude when appropriate
- The user will see the entry and must approve before it is saved
- Default to today's date unless the user specifies otherwise
- If an entry already exists for that date, your content will replace it — mention this to the user`;
