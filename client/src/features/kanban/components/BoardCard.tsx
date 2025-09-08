import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { IBoard } from "../types/board.type";
import clsx from "clsx";

interface BoardCardProps {
  board: IBoard;
}

const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <Link
      to={`/kanban/board/` + board._id}
      className="block aspect-video rounded-lg border shadow overflow-hidden bg-gradient-to-br from-purple-400 to-rose-400 relative"
    >
      <button className="absolute top-2 right-2 ">
        <Star
          size={16}
          className={clsx([
            board.favorite
              ? `text-yellow-500 fill-yellow-500 stroke-none`
              : `text-white`,
          ])}
        />
      </button>
      <div className="p-2 bg-white absolute left-0 bottom-0 right-0 font-medium">
        {board.name}
      </div>
    </Link>
  );
};

export default BoardCard;
