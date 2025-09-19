import { Menu, Trello } from "lucide-react";
import { Link } from "react-router-dom";
import { header_links } from "../constants/links";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import KanbanSidebarLeft from "./KanbanSidebarLeft";
import { useState } from "react";

const KanbanHeader = () => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  return (
    <header className="p-2 h-12 border-b">
      <div className="flex gap-4 items-center justify-between">
        <Link to={`/kanban/dashboard`} className="flex items-center gap-1">
          <Trello className="text-blue-500" size={28} />
          <span className="font-bold text-base">Kanban</span>
        </Link>

        <ul className="flex items-center gap-4">
          {header_links.map((item) => (
            <li key={item.title}>
              <div>{item.icon}</div>
            </li>
          ))}
          <li>
            <div className="w-6 aspect-square overflow-hidden rounded-full">
              <img
                src={user?.avatar || IMAGE_NOTFOUND.avatar_notfound}
                alt="avatar"
                className="img"
              />
            </div>
          </li>
          <li>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button>
                  <Menu size={"20"} />
                </button>
              </SheetTrigger>
              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      to={`/kanban/dashboard`}
                      className="flex items-center gap-1"
                    >
                      <Trello className="text-blue-500" size={28} />
                      <span className="font-bold text-base">Kanban</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <KanbanSidebarLeft setOpen={setOpen} />
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default KanbanHeader;
