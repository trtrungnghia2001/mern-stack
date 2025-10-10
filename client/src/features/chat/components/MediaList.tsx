import { memo } from "react";
import { useRoomStore } from "../stores/room.store";
import { useQuery } from "@tanstack/react-query";

const MediaList = ({ roomId }: { roomId: string }) => {
  const { getMediasByRoomId } = useRoomStore();
  const { data } = useQuery({
    queryKey: ["chat", "room", roomId, "media"],
    queryFn: async () => (await getMediasByRoomId(roomId)).data,
    enabled: !!roomId,
  });
  return (
    <ul className="grid grid-cols-3 gap-2">
      {data?.map((item) =>
        item.attachments?.map((file) => (
          <li key={file.asset_id}>
            <div className="aspect-square rounded overflow-hidden">
              <img src={file.url} alt="file" className="img" />
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default memo(MediaList);
