// interface ContactCardProps {
//   user: IUser;
// }

import { memo } from "react";

const data = {
  user: {
    name: "John Doe",
    avatar:
      "https://lh3.googleusercontent.com/a/ACg8ocJebHI28w4K5vCJCsvMbAQwttSubVTshcMuM_VN_5bvXP2d0v6v=s96-c",
    lasstMessage: "Hello, how are you?",
    updatedAt: "2023-10-01T10:00:00Z",
  },
};

const ContactCard = () => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 cursor-pointer">
      <div className="w-7 aspect-square rounded-full overflow-hidden">
        <img
          src={data.user.avatar}
          alt="avatar"
          loading="lazy"
          className="img"
        />
      </div>
      <div className="flex-1">
        <div className="font-medium text-13 line-clamp-1">{data.user.name}</div>
        <div className="text-xs text-gray-500 line-clamp-1">
          {data.user.lasstMessage}
        </div>
      </div>
    </div>
  );
};

export default memo(ContactCard);
