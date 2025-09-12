import { NavLink } from "react-router-dom";
import { nav_links, wordspace_links } from "../constants/links";
import clsx from "clsx";

const KanbanSidebarLeft = () => {
  return (
    <aside className="px-4 pt-10 w-[288px] min-h-[calc(100vh-48px)] h-full">
      <ul className="space-y-1 pb-1">
        {nav_links.map((item) => (
          <li key={item.title}>
            <NavLink
              to={"/kanban" + item.path}
              className={({ isActive }) =>
                clsx([
                  `flex items-center gap-4 px-2 py-1.5 rounded-lg `,
                  isActive
                    ? `bg-blue-200 hover:g-blue-200`
                    : `hover:bg-gray-200`,
                ])
              }
            >
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="py-4 border-t">
        <div className="text-xs font-semibold py-2">The Workspaces</div>
        <ul className="space-y-1">
          {wordspace_links.map((item) => (
            <li key={item.title}>
              <NavLink
                to={"/kanban/workspace" + item.path}
                className={({ isActive }) =>
                  clsx([
                    `flex items-center gap-4 px-2 py-1.5 rounded-lg `,
                    isActive
                      ? `bg-blue-200 hover:g-blue-200`
                      : `hover:bg-gray-200`,
                  ])
                }
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default KanbanSidebarLeft;
