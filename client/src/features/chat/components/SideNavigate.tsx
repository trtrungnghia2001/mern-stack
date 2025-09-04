import clsx from "clsx";
import { Bot, LogOut, MessageSquare, Sun, UserPen, Users } from "lucide-react";
import { memo } from "react";
import { Link, NavLink } from "react-router-dom";

const size = 18;

const nav = [
  {
    icon: <UserPen size={size} />,
    label: "Profile",
    path: "/profile",
  },
  {
    icon: <MessageSquare size={size} />,
    label: "User",
    path: "/user",
  },
  {
    icon: <Users size={size} />,
    label: "Group",
    path: "/group",
  },
];

const SideNavigate = () => {
  return (
    <div className="p-4 flex flex-col items-center h-full">
      {/* logo */}
      <Link to={`/`} className="mb-8 text-blue-500 font-medium inline-block">
        <Bot size={28} />
      </Link>

      {/* nav */}
      <ul className="space-y-4 h-full">
        {nav.map((item) => (
          <li key={item.label}>
            <NavLink
              to={"/chat" + item.path}
              title={item.label}
              className={({ isActive }) =>
                clsx([
                  `hover:text-blue-500 inline-block`,
                  isActive && "text-blue-500",
                ])
              }
            >
              {item.icon}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* theme and logout */}
      <ul className="space-y-4">
        <li>
          <button>
            <Sun size={size} />
          </button>
        </li>
        <li>
          <button>
            <LogOut size={size} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default memo(SideNavigate);
