import { Star, User } from "lucide-react";

import BoardCard from "../components/BoardCard";
import { useBoardStore } from "../stores/board.store";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import { RenderList } from "../components/RenderList";

const YouBoardPage = () => {
  const { boards, boardFavorites, getMe, getFavorite } = useBoardStore();
  const { isLoading, error } = useQuery({
    queryKey: ["me", "favorite"],
    queryFn: async () => Promise.all([await getMe(), await getFavorite()]),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div className="space-y-10">
      <RenderList
        title="Star Board"
        items={boardFavorites}
        icon={<Star size={20} />}
        renderItem={(item) => <BoardCard board={item} />}
      />
      <RenderList
        title="Your tables"
        items={boards}
        icon={<User size={20} />}
        renderItem={(item) => <BoardCard board={item} />}
      />
    </div>
  );
};

export default YouBoardPage;
