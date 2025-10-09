import { useQuery } from "@tanstack/react-query";
import ContactCard from "./ContactCard";
import InputSearch from "./InputSearch";
import { useRoomStore } from "../stores/room.store";
import { Button } from "@/shared/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useState } from "react";
import GroupModelForm from "./GroupModelForm";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";

const SidebarLeft = () => {
  const { getRooms, getPersons, rooms, persons } = useRoomStore();

  const { searchParams, handleSearchParams } = useSearchParamsValue({
    _q: "",
  });
  const _q = searchParams.get("_q");

  const [searchValue, setSearchValue] = useState(() => _q || "");

  const { isLoading } = useQuery({
    queryKey: ["chat", "contact", _q],
    queryFn: async () =>
      await Promise.all([
        await getRooms(`_q=${_q}&_type=group`),
        await getPersons(`_q=${_q}&_type=direct`),
      ]),
  });

  const [openGroup, setOpenGroup] = useState(false);

  return (
    <aside className="p-4 border-r border-r-gray-200 w-80 h-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="Chat font-bold text-xl">Chat</span>
        <div className="space-x-2">
          <Button
            onClick={() => setOpenGroup(!openGroup)}
            size={"sm"}
            variant={"outline"}
          >
            <Users />
          </Button>
          <Button size={"sm"} variant={"outline"}>
            <UserPlus />
          </Button>
        </div>
      </div>

      <InputSearch
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchParams("_q", searchValue);
          }
        }}
      />

      {isLoading && <p className="text-xs text-gray-500">Loading...</p>}
      {!isLoading && (
        <>
          <div className="space-y-2">
            <div className="font-medium text-gray-500">Contact person</div>

            <ul className="overflow-y-auto">
              {persons?.map((item, idx) => {
                return (
                  <li key={idx}>
                    <ContactCard data={item} />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-500">Group</div>
            <ul className="overflow-y-auto">
              {rooms?.map((item, idx) => {
                return (
                  <li key={idx}>
                    <ContactCard data={item} />
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}

      <GroupModelForm
        open={openGroup}
        onOpenChange={setOpenGroup}
        title="Add Group"
      />
    </aside>
  );
};

export default SidebarLeft;
