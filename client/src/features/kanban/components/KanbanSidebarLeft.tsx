import { NavLink } from "react-router-dom";
import { nav_links, wordspace_links } from "../constants/links";
import clsx from "clsx";
import type { FC } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { LogOut } from "lucide-react";

interface KanbanSidebarLeftProps {
  setOpen?: (open: boolean) => void;
  className?: string;
}

const KanbanSidebarLeft: FC<KanbanSidebarLeftProps> = ({
  className,
  setOpen,
}) => {
  const { signout } = useAuthStore();
  return (
    <aside
      className={clsx([`pt-10 min-h-[calc(100vh-48px)] h-full `, className])}
    >
      <ul className="space-y-1 pb-1">
        {nav_links.map((item) => (
          <li key={item.title}>
            <NavLink
              onClick={() => setOpen?.(false)}
              to={"/kanban" + item.path}
              className={({ isActive }) =>
                clsx([
                  `flex items-center gap-4 px-2 py-1.5 rounded-lg font-medium`,
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
                onClick={() => setOpen?.(false)}
                to={"/kanban/workspace" + item.path}
                className={({ isActive }) =>
                  clsx([
                    `flex items-center gap-4 px-2 py-1.5 rounded-lg font-medium`,
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
          <li>
            <button
              className={clsx([
                `flex items-center gap-4 px-2 py-1.5 rounded-lg font-medium hover:bg-gray-200 w-full`,
              ])}
              onClick={signout}
            >
              <LogOut size={16} />
              Signout
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default KanbanSidebarLeft;
