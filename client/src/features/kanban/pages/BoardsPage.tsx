import { Clock3, Trello } from "lucide-react";
import BoardCard from "../components/BoardCard";
import { useBoardStore } from "../stores/board.store";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const size = 20;

const BoardsPage = () => {
  const { boards, boardViews, getAll, getView } = useBoardStore();
  const getAllResult = useQuery({
    queryKey: ["boards"],
    queryFn: async () => await getAll(),
  });
  const getViewResult = useQuery({
    queryKey: ["boards-view"],
    queryFn: async () => await getView(),
  });

  if (getAllResult.isLoading || getViewResult.isLoading) return <Loading />;

  return (
    <div className="space-y-10">
      {/* Recently Viewed */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Clock3 size={size} />
          <span>Recently Viewed</span>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {boardViews.map((item) => (
            <li key={item._id}>
              <BoardCard board={item} />
            </li>
          ))}
        </ul>
      </div>
      {/* Trello Workspace */}
      <div>
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
        </ul>
      </div>
    </div>
  );
};

export default BoardsPage;
