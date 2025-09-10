import { MessageSquareText } from "lucide-react";
import { memo } from "react";
import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

const TaskModelCommentList = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <MessageSquareText size={16} />
        <div className="font-bold text-base">Comments and Activities</div>
      </div>
      <div className="space-y-5">
        <CommentInput />
        <CommentCard />
        <CommentCard />
        <CommentCard />
        <CommentCard />
        <CommentCard />
      </div>
    </div>
  );
};

export default memo(TaskModelCommentList);
