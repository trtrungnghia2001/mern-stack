import { Star } from "lucide-react";
import { useBoardStore } from "../stores/board.store";
import type { IBoard } from "../types/board.type";
import clsx from "clsx";
import { memo, useState } from "react";

interface ButtonBoardFavoriteProps {
  board: IBoard;
}

const ButtonBoardFavorite = ({ board }: ButtonBoardFavoriteProps) => {
  const { updateById } = useBoardStore();
  const [favorite, setFavorite] = useState(board.favorite);
  return (
    <button
      onClick={() => {
        updateById(board._id, { favorite: !board.favorite });
        setFavorite(!favorite);
      }}
    >
      <Star
        size={16}
        className={clsx([
          favorite
            ? `text-yellow-500 fill-yellow-500 stroke-none`
            : `text-white`,
        ])}
      />
    </button>
  );
};

export default memo(ButtonBoardFavorite);
