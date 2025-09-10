import React, { useState } from "react";

const CommentInput = () => {
  const [comment, setComment] = useState("");
  return (
    <div className="space-y-1">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write comment"
        className="p-3 w-full rounded-lg outline-none border focus:border-blue-500"
      />
      <button
        onClick={() => {}}
        className="px-3 py-1.5 bg-blue-500 text-white rounded disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed"
        disabled={!comment}
      >
        Save
      </button>
    </div>
  );
};

export default CommentInput;
