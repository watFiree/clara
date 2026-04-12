# Journal Feature — Assumptions

## Data Model

- One entry per user per day, enforced by `@@unique([userId, date])` on `JournalEntry`
- Dates are stored as start-of-day UTC (e.g. `2026-04-11T00:00:00Z`)
- Journal content is stored encrypted using the user's per-user key (`encryptData`/`decryptData`), same pattern as messages and memories
- Saving an entry for a day that already has one **replaces** it (upsert semantics)
- `JournalGeneration` records track each call to the generate endpoint for monthly limit enforcement — generating the same day's entry multiple times each count against the limit

## Feature Gating (per plan)

| | Free | Premium Lite | Premium |
|---|---|---|---|
| Generations/month | 4 | 30 | Unlimited (`-1`) |
| Manual write/edit | No | Yes | Yes |
| `readJournal` AI tool | No | Yes | Yes |
| `updateJournal` AI tool | No | No | Yes |

- In local mode (`isCloudMode = false`), all access checks are bypassed and all features are available
- Monthly generation count resets at the start of each UTC month

## AI Tools

- `readJournal` has an `execute` function — runs automatically, no user approval required (read-only operation)
- `updateJournal` has **no `execute`** — the AI SDK sends the invocation to the client, which renders an approval widget; the user reviews/edits the proposed content before it is saved; the actual save is a client-side `POST /api/journal` call
- Both tools are registered in `tools-set.ts` conditionally based on the plan's `readToolEnabled` / `updateToolEnabled` config flags

## Generation (from conversation)

- The generate endpoint (`POST /api/journal/generate`) fetches the full conversation, sends it to the LLM with a journal-writing system prompt, and returns markdown
- Generation is counted **before** the user saves — the `JournalGeneration` record is created on successful LLM response, regardless of whether the user saves the result
- Free users see a read-only preview of the generated entry (no edit before save)
- Premium Lite+ users can edit the generated content before saving

## Calendar UI

- No date library used — calendar is built with native `Date` APIs
- Future days are **disabled** (dimmed, not clickable)
- Days with existing entries show a dot indicator
- Today is highlighted with the primary color even when not selected

## Entry Editing

- Free users cannot manually write or edit entries — the edit button is hidden and the empty state shows no "Write manually" option
- The editor uses a plain `<textarea>` with a write/preview toggle; preview renders markdown via the existing `MessageResponse` component (streamdown)
