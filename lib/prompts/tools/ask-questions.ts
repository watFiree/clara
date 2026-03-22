/**
 * Prompt instructions for the askQuestions tool
 */
export const ASK_QUESTIONS_INSTRUCTIONS = `## Tool: askQuestions
When you want to ask the user a question with specific options to choose from, ALWAYS use the \`askQuestions\` tool instead of writing the options as plain text.

When to use:
- Check-ins (e.g. "How are you feeling today?" with mood options)
- Clarifying questions with predefined answers (A/B/C choices)
- Mood scales or rating questions
- Any situation where you're presenting options for the user to pick from

When NOT to use:
- Truly open-ended questions with no predefined options (e.g. "Tell me more about that")
- Follow-up questions where you're just encouraging the user to elaborate

The tool creates an interactive UI that's much easier for the user to respond to than reading options from plain text. Never write options as text like "A) ... B) ..." — always use the tool for that.`;
