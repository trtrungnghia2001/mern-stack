import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import { Ellipsis, Phone, Video } from "lucide-react";
import MessageInput from "../components/MessageInput";

const MessageIdPage = () => {
  const contactInfo = {
    name: "John Doe",
    avatar: "",
  };

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="border-b border-b-gray-200 p-4 flex items-center justify-between gap-8">
        {/* left */}
        <div className="flex items-center gap-2">
          <div className="w-8 aspect-square rounded-full overflow-hidden">
            <img
              src={contactInfo?.avatar || IMAGE_NOTFOUND.avatar_notfound}
              alt="avatar"
              loading="lazy"
              className="img"
            />
          </div>
          <div>
            <div className="font-medium text-13">{contactInfo.name}</div>
            <div className="text-gray-500 text-xs">5 minutes ago</div>
          </div>
        </div>
        {/* right */}
        <div className="flex items-center gap-2">
          <button title="Call" className="hover:bg-gray-200 p-2 rounded-lg">
            <Phone size={16} />
          </button>
          <button title="Call" className="hover:bg-gray-200 p-2 rounded-lg">
            <Video size={16} />
          </button>
          <button title="Call" className="hover:bg-gray-200 p-2 rounded-lg">
            <Ellipsis size={16} />
          </button>
        </div>
      </div>
      {/* messages */}
      <ul className="flex-1 overflow-y-auto"></ul>
      {/* input */}
      <MessageInput />
    </div>
  );
};

export default MessageIdPage;
