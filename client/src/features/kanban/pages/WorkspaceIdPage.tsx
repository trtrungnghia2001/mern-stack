import { useWorkspaceStore } from "../stores/workspace.store";
import { Trello } from "lucide-react";
import BoardCard from "../components/BoardCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MemberCard from "../components/MemberCard";
import { useState } from "react";
import toast from "react-hot-toast";
import ButtonDropdownMenu from "../components/ButtonDropdownMenu";
import BoardModel from "../components/BoardModel";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import { useBoardStore } from "../stores/board.store";

const WorkspaceIdPage = () => {
  const { id } = useParams();
  const { members, getById, addMember } = useWorkspaceStore();
  const { boards, getBoardsByWorkspaceId } = useBoardStore();

  const { isLoading, error } = useQuery({
    queryKey: ["workspace", id],
    queryFn: async () =>
      await Promise.all([
        await getById(id as string),
        await getBoardsByWorkspaceId(id as string),
      ]),
    enabled: !!id,
  });

  const [email, setEmail] = useState("");
  const addMemberResult = useMutation({
    mutationFn: async () => await addMember(id as string, email),
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail("");
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div className="space-y-10">
      {/* boards */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Trello size={16} />
          <span>Boards</span>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {boards.map((item) => (
            <li key={item._id}>
              <BoardCard board={item} />
            </li>
          ))}
          <li>
            <ButtonDropdownMenu
              button={
                <button className="w-full h-full font-medium aspect-video bg-gray-100 hover:bg-gray-200 cursor-pointer shadow rounded-lg">
                  Create new board
                </button>
              }
            >
              {(setOpen) => (
                <BoardModel setOpen={setOpen} workspaceId={id as string} />
              )}
            </ButtonDropdownMenu>
          </li>
        </ul>
      </div>
      {/* members */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-bold text-base">
          <Trello size={16} />
          <span>Member</span>
        </div>
        {/* action */}
        <div className="mb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMemberResult.mutate();
            }}
            className="flex items-center gap-3 max-w-[500px]"
          >
            <input
              type="email"
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Email..."
              required
            />
            <button
              type="submit"
              disabled={addMemberResult.isPending}
              className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Add Member
            </button>
          </form>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {members.map((item) => (
            <li key={item._id}>
              <MemberCard member={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkspaceIdPage;
