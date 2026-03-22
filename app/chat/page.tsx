import { Suspense } from "react";
import { Chat } from "./components/chat/chat";
import { ChatSidebar } from "./components/chat-sidebar";
import { MobileHeader } from "./components/mobile-header";
import { ViewsManager } from "./components/views-manager";

const ChatPage = () => {
  return (
    <div className="flex h-dvh flex-col gap-3 bg-muted p-3 lg:flex-row">
      <ChatSidebar />
      <MobileHeader />
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <Suspense>
          <Chat />
        </Suspense>
        <ViewsManager />
      </main>
    </div>
  );
};

export default ChatPage;
