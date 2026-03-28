import { Language } from "@/app/generated/prisma/browser";
import type { ErrorCode } from "./codes";

export const ErrorTranslations: Record<ErrorCode, Record<Language, string>> = {
  CONVERSATIONS_LIMIT_REACHED: {
    en: "You've reached the limit of conversations. No worries — your current chats will be merged. Sign up for free and enjoy unlimited conversations with Clara!",
    es: "Has alcanzado el límite de conversaciones. No te preocupes, tus chats actuales se fusionarán. ¡Regístrate gratis y disfruta de conversaciones ilimitadas con Clara!",
    fr: "Vous avez atteint la limite de conversations. Pas d'inquiétude — vos conversations actuelles seront fusionnées. Inscrivez-vous gratuitement et profitez de conversations illimitées avec Clara !",
    de: "Du hast das Limit an Konversationen erreicht. Keine Sorge — deine aktuellen Chats werden zusammengeführt. Melde dich kostenlos an und genieße unbegrenzte Konversationen mit Clara!",
    pl: "Osiągnięto limit konwersacji. Bez obaw — Twoje dotychczasowe rozmowy zostaną połączone. Zarejestruj się za darmo i korzystaj z nieograniczonych rozmów z Clarą!",
    pt: "Você atingiu o limite de conversas. Não se preocupe — suas conversas atuais serão mescladas. Cadastre-se gratuitamente e aproveite conversas ilimitadas com a Clara!",
  },
};
