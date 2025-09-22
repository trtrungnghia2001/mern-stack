import { Clock3, Trello } from "lucide-react";
import BoardCard from "../components/BoardCard";
import { useBoardStore } from "../stores/board.store";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { RenderList } from "../components/RenderList";

const size = 20;

const BoardsPage = () => {
  const { boards, boardViews, getAll, getView } = useBoardStore();
  const { isLoading } = useQuery({
    queryKey: ["boards", "views"],
    queryFn: async () => Promise.all([await getView(), await getAll()]),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-10">
      <RenderList
        icon={<Clock3 size={size} />}
        title="Recently Viewed"
        items={boardViews}
        renderItem={(item) => <BoardCard board={item} />}
      />
      <RenderList
        icon={<Trello size={size} />}
        title="Trello Workspace"
        items={boards}
        renderItem={(item) => <BoardCard board={item} />}
      />
    </div>
  );
};

export default BoardsPage;
