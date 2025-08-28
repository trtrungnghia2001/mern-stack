import { Mic, Paperclip, Send, SmilePlus } from "lucide-react";
import { memo } from "react";

const size = 16;

const MessageInput = () => {
  return (
    <div className="flex items-center gap-4 border rounded-lg p-4">
      <input
        className="outline-none border-none resize-none w-full"
        placeholder="Enter message..."
      ></input>
      <button>
        <SmilePlus size={size} />
      </button>
      <button>
        <Paperclip size={size} />
      </button>
      <button>
        <Mic size={size} />
      </button>
      <button>
        <Send size={size} />
      </button>
    </div>
  );
};

export default memo(MessageInput);
