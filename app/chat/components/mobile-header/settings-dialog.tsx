"use client";

import { useState } from "react";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSettingsDialog } from "../user-settings-dialog";

export const SettingsButton = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSettingsOpen(true)}
      >
        <SettingsIcon className="size-4" />
      </Button>
      <UserSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
