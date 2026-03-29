"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { queryFactory } from "@/lib/queryFactory";
import { isUserSettingsResponse } from "@/lib/types/settings";
import { ErrorTranslations } from "@/lib/errors/translations";
import { Language } from "@/app/generated/prisma/browser";

interface LimitReachedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LimitReachedDialog = ({
  open,
  onOpenChange,
}: LimitReachedDialogProps) => {
  const { data: settings } = useQuery({
    queryKey: ["user-settings"],
    enabled: open,
    queryFn: () =>
      queryFactory("/api/settings", {}, isUserSettingsResponse).then(
        (d) => d.settings,
      ),
  });

  const lang: Language = settings?.language ?? "en";
  const message = ErrorTranslations.CONVERSATIONS_LIMIT_REACHED[lang];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {lang === "en"
              ? "Conversation Limit Reached"
              : ErrorTranslations.CONVERSATIONS_LIMIT_REACHED[lang].split(
                  ".",
                )[0]}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild>
            <Link href="/auth/login">
              <LogInIcon className="size-4" />
              {lang === "en" ? "Sign Up Free" : getSignUpLabel(lang)}
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const signUpLabels: Record<Language, string> = {
  en: "Sign Up Free",
  es: "Regístrate gratis",
  fr: "S'inscrire gratuitement",
  de: "Kostenlos registrieren",
  pl: "Zarejestruj się za darmo",
  pt: "Cadastre-se gratis",
};

const getSignUpLabel = (lang: Language): string => signUpLabels[lang];
