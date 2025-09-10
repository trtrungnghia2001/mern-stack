import { Link } from "react-router-dom";
import type { IBoard } from "../types/board.type";
import clsx from "clsx";
import { boardBgColor } from "../constants/color";
import ButtonBoardFavorite from "./ButtonBoardFavorite";

interface BoardCardProps {
  board: IBoard;
}

const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <ButtonBoardFavorite board={board} />
      </div>

      <Link
        to={`/kanban/board/` + board._id}
        className={clsx([
          `block aspect-video rounded-lg border shadow overflow-hidden`,
        ])}
        style={{
          background: `url('${
            boardBgColor[board.bgColor]
          }') no-repeat center/cover `,
        }}
      >
        <div className="p-2 bg-white/70 absolute left-0 bottom-0 right-0 font-medium line-clamp-1">
          {board.name}
        </div>
      </Link>
    </div>
  );
};

export default BoardCard;
