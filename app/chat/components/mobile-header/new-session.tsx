import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store/chat-store";
import { PlusIcon } from "lucide-react";

export const NewSession = () => {
  const setActiveConversationId = useChatStore(
    (state) => state.setActiveConversationId,
  );
  return (
    <Button
      variant="default"
      size="icon"
      onClick={() => setActiveConversationId(null)}
    >
      <PlusIcon className="size-4" />
    </Button>
  );
};
