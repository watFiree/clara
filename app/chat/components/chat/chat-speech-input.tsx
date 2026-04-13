"use client";

import { useQuery } from "@tanstack/react-query";
import { queryFactory } from "@/lib/queryFactory";
import {
  isUserSettingsResponse,
  LANGUAGE_LOCALE,
} from "@/lib/types/settings";
import {
  SpeechInput,
  type SpeechInputProps,
} from "@/components/ai-elements/speech-input";

export const ChatSpeechInput = (props: Omit<SpeechInputProps, "lang">) => {
  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: () =>
      queryFactory("/api/settings", {}, isUserSettingsResponse).then(
        (d) => d.settings,
      ),
  });

  const lang = settings ? LANGUAGE_LOCALE[settings.language] : undefined;

  return <SpeechInput lang={lang} {...props} />;
};
