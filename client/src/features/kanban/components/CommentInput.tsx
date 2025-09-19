import { memo, useState } from "react";
import { useCommentStore } from "../stores/comment.store";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";

const CommentInput = () => {
  const [text, setText] = useState("");

  const { taskId } = useParams();

  const { create } = useCommentStore();

  const createResult = useMutation({
    mutationFn: async () =>
      await create({ comment: text.trim(), task: taskId as string }),
    onSuccess: (data) => {
      toast.success(data.message);
      setText("");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-1">
      <Textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="resize-none w-full border rounded px-3 py-1.5"
        placeholder="Write..."
      />
      <button
        onClick={() => createResult.mutate()}
        disabled={!text}
        className="rounded px-3 py-1.5 bg-blue-500 text-white disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

export default memo(CommentInput);
