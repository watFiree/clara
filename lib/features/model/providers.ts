import { openai } from "@ai-sdk/openai";
import { ProvidersList } from "./consts";

export const providers = {
  openai,
} satisfies Record<ProvidersList, unknown>;
