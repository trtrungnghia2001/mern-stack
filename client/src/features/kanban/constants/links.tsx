import {
  Bell,
  CreditCard,
  Info,
  LayoutDashboard,
  Megaphone,
  Settings,
  SwatchBook,
  Trello,
  Users,
} from "lucide-react";

const size = 14;
const size1 = 16;

export const header_links = [
  {
    title: "Share",
    icon: <Megaphone size={size1} />,
  },
  {
    title: "Notification",
    icon: <Bell size={size1} />,
  },
  {
    title: "Infomation",
    icon: <Info size={size1} />,
  },
];

export const nav_links = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={size} />,
    path: "/dashboard",
  },
  {
    title: "Board",
    icon: <Trello size={size} />,
    path: "/boards",
  },
  {
    title: "Template",
    icon: <SwatchBook size={size} />,
    path: "/templates",
  },
];

export const wordspace_links = [
  {
    title: "Board",
    icon: <Trello size={size} />,
    path: "/home",
  },
  {
    title: "Member",
    icon: <Users size={size} />,
    path: "/menber",
  },
  {
    title: "Setting",
    icon: <Settings size={size} />,
    path: "/setting",
  },
  {
    title: "Pay",
    icon: <CreditCard size={size} />,
    path: "/pay",
  },
];
