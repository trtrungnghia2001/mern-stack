import { Star, User } from "lucide-react";

import BoardCard from "../components/BoardCard";
import { useBoardStore } from "../stores/board.store";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const size = 20;

const WorkspaceBoardPage = () => {
  const { boards, getAll } = useBoardStore();
  const getAllResult = useQuery({
    queryKey: ["boards"],
    queryFn: async () => await getAll(),
  });

  if (getAllResult.isLoading) return <Loading />;

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
          <User size={size} />
          <span>Your tables</span>
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

export default WorkspaceBoardPage;
