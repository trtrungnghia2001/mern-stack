import { Clock3, Star, Trello } from "lucide-react";
import BoardCard from "../components/BoardCard";
import ButtonBoardNew from "../components/ButtonBoardNew";
import { useBoardStore } from "../stores/board.store";

const size = 20;

const BoardsPage = () => {
  const { boards } = useBoardStore();
  return (
    <div>
      {/* Star Board */}
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Star size={size} />
          <span>Star Board</span>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {boards
            .filter((item) => item.favorite)
            .map((item) => (
              <li key={item._id}>
                <BoardCard board={item} />
              </li>
            ))}
        </ul>
      </div>
      {/* Recently Viewed */}
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Clock3 size={size} />
          <span>Recently Viewed</span>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {boards.map((item) => (
            <li key={item._id}>
              <BoardCard board={item} />
            </li>
          ))}
        </ul>
      </div>
      {/* Trello Workspace */}
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Trello size={size} />
          <span>Trello Workspace</span>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {boards.map((item) => (
            <li key={item._id}>
              <BoardCard board={item} />
            </li>
          ))}
          <li>
            <ButtonBoardNew />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BoardsPage;
