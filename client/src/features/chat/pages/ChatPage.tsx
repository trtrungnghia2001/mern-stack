import { Bot } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="items-center space-y-4">
        <Bot className="mx-auto text-blue-600 animate-bounce" size={32} />
        <div className="text-gray-500">Select a conversation to start</div>
      </div>
    </div>
  );
};

export default ChatPage;
