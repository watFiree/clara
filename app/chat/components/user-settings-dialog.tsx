"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Language } from "@/app/generated/prisma/browser";
import {
  type UserSettings,
  TONE_OPTIONS,
  GENDER_OPTIONS,
  AGE_RANGE_OPTIONS,
  FOCUS_AREA_OPTIONS,
  LANGUAGE_OPTIONS,
  isUserSettingsResponse,
} from "@/lib/types/settings";

const QUERY_KEY = ["user-settings"];

const DEFAULTS: Omit<
  UserSettings,
  "id" | "userId" | "createdAt" | "updatedAt"
> = {
  name: null,
  gender: null,
  ageRange: null,
  language: "en",
  tonePreference: "warm",
  memoryEnabled: true,
  focusAreas: [],
};

interface UserSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserSettingsDialog = ({
  open,
  onOpenChange,
}: UserSettingsDialogProps) => {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data: unknown = await res.json();
      if (!isUserSettingsResponse(data))
        throw new Error("Invalid settings response");
      return data.settings;
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: async (partial: Partial<UserSettings>) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      const data: unknown = await res.json();
      if (!isUserSettingsResponse(data)) throw new Error("Invalid response");
      return data.settings;
    },
    onMutate: async (partial) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<UserSettings>(QUERY_KEY);
      queryClient.setQueryData<UserSettings | undefined>(QUERY_KEY, (old) =>
        old ? { ...old, ...partial } : old,
      );
      return { previous };
    },
    onError: (_err, _partial, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const s = { ...DEFAULTS, ...settings };

  const [nameDraft, setNameDraft] = useState(s.name ?? "");

  // Sync server value into draft when it changes (initial load / rollback)
  useEffect(() => {
    setNameDraft(s.name ?? "");
  }, [s.name]);

  // Debounce name updates
  useEffect(() => {
    const trimmed = nameDraft || null;
    if (trimmed === (s.name ?? null)) return;
    const id = setTimeout(() => update({ name: trimmed }), 500);
    return () => clearTimeout(id);
  }, [nameDraft]);

  const toggleFocusArea = (area: string) => {
    const next = s.focusAreas.includes(area)
      ? s.focusAreas.filter((a) => a !== area)
      : [...s.focusAreas, area];
    update({ focusAreas: next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your preferences</DialogTitle>
          <DialogDescription>
            Help Clara get to know you better
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="clara">Clara</TabsTrigger>
          </TabsList>

          <ScrollArea className="max-h-[50dvh]">
            <TabsContent value="profile" className="space-y-4 pt-4">
              <Field label="What should Clara call you?">
                <Input
                  placeholder="Your name"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                />
              </Field>

              <Field label="Gender">
                <Select
                  value={s.gender ?? ""}
                  onValueChange={(v) => update({ gender: v || null })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Prefer not to say" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDER_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Age range">
                <Select
                  value={s.ageRange ?? ""}
                  onValueChange={(v) => update({ ageRange: v || null })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_RANGE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Language">
                <Select
                  value={s.language}
                  onValueChange={(v) => update({ language: v as Language })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </TabsContent>

            <TabsContent value="clara" className="space-y-4 pt-4">
              <Field label="How should Clara talk to you?">
                <Select
                  value={s.tonePreference}
                  onValueChange={(v) => update({ tonePreference: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="What would you like to focus on?">
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREA_OPTIONS.map((o) => (
                    <Badge
                      key={o.value}
                      variant={
                        s.focusAreas.includes(o.value) ? "default" : "outline"
                      }
                      className="cursor-pointer select-none"
                      onClick={() => toggleFocusArea(o.value)}
                    >
                      {o.label}
                    </Badge>
                  ))}
                </div>
              </Field>

              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Memory</p>
                  <p className="text-xs text-muted-foreground">
                    Let Clara remember context across sessions
                  </p>
                </div>
                <Switch
                  checked={s.memoryEnabled}
                  onCheckedChange={(v) => update({ memoryEnabled: v })}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium">{label}</label>
    {children}
  </div>
);
