import { memo } from "react";
import type { IMemberDetail } from "../types/member.type";
import { Card } from "@/shared/components/ui/card";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";

interface MemberDetailCardProps {
  data: IMemberDetail;
}
const MemberDetailCard = ({ data }: MemberDetailCardProps) => {
  return (
    <Card className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 aspect-square rounded-full overflow-hidden">
          <img
            src={data.avatar || IMAGE_NOTFOUND.avatar_notfound}
            alt="avatar"
            className="img"
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-500 line-clamp-1">{data.email}</p>
        </div>
      </div>
      <div>
        {/* <p className="text-gray-500">{data.bio ?? "No bio"}</p> */}
        <p className="text-gray-500 text-13">
          Member since: {new Date(data.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
};

export default memo(MemberDetailCard);
