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
      <main className="flex items-start h-[calc(100vh-48px)]">
        <KanbanSidebarLeft />
        <section
          className={clsx([
            `flex-1 overflow-y-auto h-full`,
            checkBoard ? `` : `p-8 pt-10`,
          ])}
        >
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default KanbanLayout;
