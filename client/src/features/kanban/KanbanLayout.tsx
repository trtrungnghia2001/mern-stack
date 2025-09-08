import { Outlet } from "react-router-dom";
import KanbanHeader from "./components/KanbanHeader";
import KanbanSidebarLeft from "./components/KanbanSidebarLeft";

const KanbanLayout = () => {
  return (
    <div>
      <KanbanHeader />
      <main className="">
        <KanbanSidebarLeft />
        <section className="ml-[288px] h-[calc(100vh-48px)] p-8 pt-10 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default KanbanLayout;
