import { NavLink } from "react-router-dom";
import { sidebarLeft_links } from "../constants/links";
import clsx from "clsx";
import type { FC } from "react";
import { useAuthStore } from "@/features/auth/stores/auth.store";

interface KanbanSidebarLeftProps {
  setOpen?: (open: boolean) => void;
  className?: string;
}

const KanbanSidebarLeft: FC<KanbanSidebarLeftProps> = ({
  className,
  setOpen,
}) => {
  return (
    <aside
      className={clsx([
        `pt-10 min-h-[calc(100vh-48px)] h-full space-y-6`,
        className,
      ])}
    >
      <ul className="space-y-6">
        {sidebarLeft_links.map((item, idx) => (
          // gorup
          <li key={idx}>
            <p className="text-gray-400 font-bold text-xs mb-2">{item.title}</p>
            <ul className="space-y-1">
              {item.links.map((link) => (
                // link
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={(e) => {
                      if (link.path === "signout") {
                        e.preventDefault();
                        useAuthStore.getState().signout();
                      }
                      setOpen?.(false);
                    }}
                    className={({ isActive }) =>
                      clsx([
                        `flex items-center gap-4 px-2 py-1.5 rounded-lg font-medium hover:bg-gray-200`,
                        isActive ? `bg-gray-200` : ``,
                      ])
                    }
                  >
                    <span>{link.icon}</span>
                    <span>{link.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default KanbanSidebarLeft;
