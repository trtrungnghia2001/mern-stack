import {
  Bell,
  FolderKanban,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  SwatchBook,
  Trello,
  UserCog,
  Users,
} from "lucide-react";

const size = 16;

export const header_links = [
  {
    title: "Notification",
    icon: <Bell size={size} />,
  },
  {
    title: "Infomation",
    icon: <Info size={size} />,
  },
];

export const sidebarLeft_links = [
  {
    title: "GENERAL",
    links: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard size={size} />,
        path: "/kanban/dashboard",
      },
    ],
  },
  {
    title: "PROJECTS",
    links: [
      {
        title: "Boards",
        icon: <Trello size={size} />,
        path: "/kanban/boards",
      },
      {
        title: "Workspaces",
        icon: <SwatchBook size={size} />,
        path: "/kanban/workspaces",
      },
      {
        title: "Your Board",
        icon: <FolderKanban size={size} />,
        path: "/kanban/your-board",
      },
      {
        title: "Members",
        icon: <Users size={size} />,
        path: "/kanban/members",
      },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      {
        title: "Update Profile",
        icon: <UserCog size={size} />,
        path: "/kanban/update-profile",
      },
      {
        title: "Change Password",
        icon: <Lock size={size} />,
        path: "/kanban/change-password",
      },
      {
        title: "Sign Out",
        icon: <LogOut size={size} />,
        path: "signout",
      },
    ],
  },
];
