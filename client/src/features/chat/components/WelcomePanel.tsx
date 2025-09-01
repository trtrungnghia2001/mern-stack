import { Bot } from "lucide-react";
import { memo } from "react";

const WelcomePanel = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="space-y-4">
        <Bot size={40} className="mx-auto animate-bounce" />
        <p>Welcome! Please select a conversation or start a new chat.</p>
      </div>
    </div>
  );
};

export default memo(WelcomePanel);
