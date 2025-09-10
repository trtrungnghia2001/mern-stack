import { memo, useState } from "react";
import BoardModel from "./BoardModel";

const ButtonBoardNew = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <BoardModel open={open} setOpen={setOpen} />
      <button
        onClick={() => setOpen(true)}
        className="w-full h-full font-medium aspect-video bg-gray-100 hover:bg-gray-200 cursor-pointer shadow rounded-lg"
      >
        Create new table
      </button>
    </div>
  );
};

export default memo(ButtonBoardNew);
