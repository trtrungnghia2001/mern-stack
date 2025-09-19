import { Outlet, useLocation } from "react-router-dom";
import KanbanHeader from "./components/KanbanHeader";
import KanbanSidebarLeft from "./components/KanbanSidebarLeft";
import clsx from "clsx";

const KanbanLayout = () => {
  const location = useLocation();

  const checkBoard = /kanban\/board\/.*/.test(location.pathname);
  return (
    <div>
      <KanbanHeader />
      <main className="flex items-start">
        <KanbanSidebarLeft className="hidden lg:block px-4 w-[288px] " />
        <section
          className={clsx([
            `flex-1 overflow-auto h-[calc(100vh-48px)] overflow-y-auto border-l`,
            !checkBoard && `p-4 md:p-8 pt-10`,
          ])}
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default KanbanLayout;
