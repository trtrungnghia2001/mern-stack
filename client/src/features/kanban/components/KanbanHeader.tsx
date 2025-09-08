import { Trello } from "lucide-react";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";
import { Button } from "@/shared/components/ui/button";
import { header_links } from "../constants/links";

const KanbanHeader = () => {
  return (
    <header className="p-2 h-12 border-b">
      <div className="flex gap-4 items-center justify-between">
        <Link to={`/kanban`} className="flex items-center gap-1">
          <Trello className="text-blue-500" size={28} />
          <span className="font-bold text-base">Kanban</span>
        </Link>
        <div className="flex-1 overflow-hidden flex items-stretch gap-2 max-w-[900px]">
          <SearchInput />
          <Button
            size={"sm"}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Create new
          </Button>
        </div>
        <ul className="flex items-center gap-4">
          {header_links.map((item) => (
            <li key={item.title}>
              <div>{item.icon}</div>
            </li>
          ))}
          <li>
            <div className="w-6 aspect-square overflow-hidden rounded-full">
              <img
                src="https://lh3.googleusercontent.com/a/ACg8ocJebHI28w4K5vCJCsvMbAQwttSubVTshcMuM_VN_5bvXP2d0v6v=s96-c"
                alt="avatar"
                className="img"
              />
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default KanbanHeader;
