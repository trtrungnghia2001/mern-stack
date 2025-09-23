import { MessageSquare, Users, Bell, Star, Settings } from "lucide-react";

export const sidebarNav = [
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    path: "/messages",
  },
  {
    id: "friends",
    label: "Friends",
    icon: Users,
    path: "/friends",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    id: "favorites",
    label: "Favorites",
    icon: Star,
    path: "/favorites",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
