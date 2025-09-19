import SignoutButton from "@/features/auth/components/SignoutButton";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import ThemeButton from "@/features/theme/components/ThemeButton";
import { Button } from "@/shared/components/ui/button";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";
import { memo } from "react";
import { Link } from "react-router-dom";

const links = [
  {
    path: "auth/profile",
    title: "Hồ sơ của tôi",
  },
  {
    path: "auth/update-me",
    title: "Cập nhật thông tin",
  },
  {
    path: "auth/change-password",
    title: "Đổi mật khẩu",
  },
  //
  {
    path: "upload",
    title: "Upload",
  },
  {
    path: "chat",
    title: "Chat",
  },
  {
    path: "kanban/dashboard",
    title: "Kanban",
  },
];

const AccountOverviewBox = () => {
  const { user } = useAuthStore();
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 ">
        Chào mừng đến với ứng dụng của bạn!
      </h1>
      <p className="text-lg text-gray-600">
        Đây là trang chủ. Khám phá các tính năng khác hoặc đăng nhập để tiếp
        tục.
      </p>
      {user && (
        <div className="flex flex-col items-center gap-3">
          <div className="aspect-square w-40 rounded-full overflow-hidden block border-4">
            <img
              src={user.avatar || IMAGE_NOTFOUND.avatar_notfound}
              alt="avatar"
              loading="lazy"
              className="img"
            />
          </div>
          <h3>
            Hi, my name is{" "}
            <span className="italic font-medium">{user.name}</span>
          </h3>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {user ? (
          <SignoutButton />
        ) : (
          <Link to="/auth/signin">
            <Button>Đăng nhập</Button>
          </Link>
        )}
        {links.map((item) => (
          <Link to={item.path} key={item.path}>
            <Button>{item.title}</Button>
          </Link>
        ))}

        <ThemeButton />
      </div>
    </div>
  );
};

export default memo(AccountOverviewBox);
