import { Star, User } from "lucide-react";

import BoardCard from "../components/BoardCard";
import { useBoardStore } from "../stores/board.store";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";

const YouBoardPage = () => {
  const { boards, boardFavorites, getMe, getFavorite } = useBoardStore();
  const { isLoading, error } = useQuery({
    queryKey: ["me", "favorite"],
    queryFn: async () => Promise.all([await getMe(), await getFavorite()]),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div>
      {/* Star Board */}
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Star size={20} />
          <span>Star Board</span>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {boardFavorites.map((item) => (
            <li key={item._id}>
              <BoardCard board={item} />
            </li>
          ))}
        </ul>
      </div>
      {/* Recently Viewed */}
      <div className="pb-10">
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <User size={20} />
          <span>Your tables</span>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

export default YouBoardPage;
