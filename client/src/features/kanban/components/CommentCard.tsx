import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import type { IComment } from "../types/comment.type";
import { useCommentStore } from "../stores/comment.store";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAuthStore } from "@/features/auth/stores/auth.store";

interface CommentCardProps {
  data: IComment;
}

const CommentCard = ({ data }: CommentCardProps) => {
  const { deleteById, updateById } = useCommentStore();
  const deleteByIdResult = useMutation({
    mutationFn: async () => await deleteById(data._id),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.success(error.message),
  });

  const updateByIdResult = useMutation({
    mutationFn: async () =>
      await updateById(data._id, { comment: text.trim() }),
    onSuccess: (data) => {
      toast.success(data.message);
      setIsEdit(false);
      setText("");
    },
    onError: (error) => toast.success(error.message),
  });

  const [isEdit, setIsEdit] = useState(false);
  const [text, setText] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const { user } = useAuthStore();
  const checkMe = user?._id === data.user._id;

  return (
    <div className="flex items-start gap-3 ">
      <div className="aspect-square overflow-hidden rounded-full w-6">
        <img
          src={data.user.avatar || IMAGE_NOTFOUND.avatar_notfound}
          alt="avatar"
          className="img"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="space-x-3">
          <span className="font-medium">{data.user?.name}</span>
          <span className="text-xs text-blue-500">
            {new Date(data.createdAt).toLocaleString()}
          </span>
        </div>
        {!isEdit && (
          <>
            <div
              className="px-3 py-2 bg-white rounded-lg border shadow whitespace-break-spaces"
              dangerouslySetInnerHTML={{ __html: data.comment }}
            ></div>
            {checkMe && (
              <div className="text-xs space-x-3">
                <button
                  onClick={() => {
                    setIsEdit(!isEdit);
                    setText(data.comment);
                  }}
                  className="underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteByIdResult.mutate()}
                  className="underline"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
        {isEdit && checkMe && (
          <>
            <TextareaAutosize
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="px-3 py-2 bg-white rounded-lg border shadow whitespace-break-spaces w-full"
              placeholder="Write..."
              ref={inputRef}
            />
            <div className="flex space-x-2">
              <button
                onClick={() => updateByIdResult.mutate()}
                disabled={!text || text === data.comment}
                className="rounded px-3 py-1.5 bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setText("");
                }}
                disabled={!text}
                className="rounded px-3 py-1.5 bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
