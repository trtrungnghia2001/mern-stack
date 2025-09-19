import {
  Bell,
  Info,
  LayoutDashboard,
  LockKeyhole,
  SwatchBook,
  Trello,
  UserPen,
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

export const nav_links = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={size} />,
    path: "/dashboard",
  },
  {
    title: "Boards",
    icon: <Trello size={size} />,
    path: "/boards",
  },
  {
    title: "Workspaces",
    icon: <SwatchBook size={size} />,
    path: "/workspaces",
  },
];

export const wordspace_links = [
  {
    title: "You board",
    icon: <Trello size={size} />,
    path: "/you-board",
  },
  {
    title: "Member",
    icon: <Users size={size} />,
    path: "/menber",
  },
  {
    title: "Update Propfile",
    icon: <UserPen size={size} />,
    path: "/update-profile",
  },
  {
    title: "Change password",
    icon: <LockKeyhole size={size} />,
    path: "/change-password",
  },
];
