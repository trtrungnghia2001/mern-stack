import { memo } from "react";

const MessageCardSkeleton = () => {
  return (
    <div className="space-y-2 animate-pulse max-w-[40%] p-4">
      {/* avatar */}
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-2 w-full bg-gray-300 rounded-lg" />
          <div className="h-2 w-full bg-gray-300 rounded-lg" />
        </div>
      </div>

      {/* text bubble */}
      <div className="h-8 w-full bg-gray-300 rounded-lg" />
    </div>
  );
};

export default memo(MessageCardSkeleton);
