import { Link, NavLink } from "react-router-dom";
import { sidebarNav } from "../constants";
import { Bot, Moon } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { memo } from "react";

const Nav = () => {
  const { user, signout } = useAuthStore();

  return (
    <div className="p-4 flex flex-col items-center gap-6 border-r border-r-gray-200">
      <Link to={`/chat`} className="inline-block text-blue-600">
        <Bot size={32} />
      </Link>
      {/* links */}
      <ul className="flex flex-col items-center gap-2 flex-1">
        {sidebarNav.map((item) => (
          <li key={item.id}>
            <NavLink
              title={item.label}
              to={`/chat` + item.path}
              className={({ isActive }) =>
                clsx([
                  isActive && `text-blue-500 bg-gray-100`,
                  `flex items-center gap-3 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-lg`,
                ])
              }
            >
              <item.icon size={16} />
            </NavLink>
          </li>
        ))}
      </ul>
      {/* actions */}
      <ul className="flex flex-col items-center gap-2">
        <li>
          <button
            title="Darkmode"
            className="flex items-center gap-3 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-lg"
          >
            <Moon size={16} />
          </button>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                title={user?.name}
                className="w-6 aspect-square rounded-full overflow-hidden"
              >
                <img
                  src={user?.avatar || IMAGE_NOTFOUND.avatar_notfound}
                  alt="avatar"
                  loading="lazy"
                  className="img"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <NavLink to={`/chat/edit-profile`} className={"block w-full"}>
                  Edit Profile
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NavLink
                  to={`/chat/change-password`}
                  className={"block w-full"}
                >
                  Change Password
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signout}>
                <button className={"block w-full text-left"}>Log out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </div>
  );
};

export default memo(Nav);
