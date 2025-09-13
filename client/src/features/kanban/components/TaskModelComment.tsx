import { MessageSquareText } from "lucide-react";
import { memo } from "react";
import CommentInput from "./CommentInput";
import CommentCard from "./CommentCard";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { useCommentStore } from "../stores/comment.store";
import { useQuery } from "@tanstack/react-query";

const TaskModelComment = () => {
  const { taskId } = useParams();

  const { comments, getAllByTaskId } = useCommentStore();
  const getAllByTaskIdResult = useQuery({
    queryKey: [`task`, `comment`, taskId],
    queryFn: async () => await getAllByTaskId(taskId as string),
    enabled: !!taskId,
  });

  if (getAllByTaskIdResult.isLoading || getAllByTaskIdResult.isError) return;

  return (
    <div className={clsx([`space-y-6`])}>
      <div className="flex items-center gap-3 mb-3">
        <MessageSquareText size={14} />
        <div className="font-bold">Comment</div>
      </div>
      <CommentInput />
      {comments.map((item) => (
        <CommentCard key={item._id} data={item} />
      ))}
    </div>
  );
};

export default memo(TaskModelComment);
