import { Star } from "lucide-react";
import { useBoardStore } from "../stores/board.store";
import type { IBoard } from "../types/board.type";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface ButtonBoardFavoriteProps {
  board: IBoard;
}

const ButtonBoardFavorite = ({ board }: ButtonBoardFavoriteProps) => {
  const { addBoardFavorite, removeBoardFavorite } = useBoardStore();
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    setFavorite(board.favorite);
  }, [board.favorite]);

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      if (favorite) {
        return await removeBoardFavorite(board._id);
      }
      return await addBoardFavorite(board._id);
    },
    onSuccess: () => setFavorite(!favorite),
  });

  return (
    <button disabled={isPending} onClick={() => mutate()}>
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
