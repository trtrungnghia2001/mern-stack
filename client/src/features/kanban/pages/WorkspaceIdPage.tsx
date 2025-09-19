import { useWorkspaceStore } from "../stores/workspace.store";
import { Trello } from "lucide-react";
import BoardCard from "../components/BoardCard";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MemberCard from "../components/MemberCard";
import { useState } from "react";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import { useBoardStore } from "../stores/board.store";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import BoardModelForm from "../components/BoardModelForm";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const WorkspaceIdPage = () => {
  const { id } = useParams();
  const { members, getById, addMember } = useWorkspaceStore();
  const { boards, getBoardsByWorkspaceId } = useBoardStore();

  const { isLoading, error, data } = useQuery({
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

  const [openForm, setOpenForm] = useState(false);
  const { user } = useAuthStore();
  console.log();

  const isShowFormInputEmail =
    data?.[0].data.owner._id === user?._id ||
    members.find((item) => item.user._id === user?._id)?.role === "admin";

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <>
      <div className="space-y-10">
        <div className="mb-4 space-y-2">
          <h2 className="text-xl font-bold">{data?.[0].data.name}</h2>
          <p className="text-base">{data?.[0].data.description}</p>
          <p className="text-gray-500 text-sm">
            Owner: {data?.[0].data?.owner?.name || "You"}
          </p>
        </div>
        {/* boards */}
        <div>
          <div className="flex items-center gap-2 mb-4 font-bold text-base">
            <Trello size={16} />
            <span>Boards</span>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boards.map((item) => (
              <li key={item._id}>
                <BoardCard board={item} />
              </li>
            ))}
            <li>
              <button
                onClick={() => setOpenForm(true)}
                className="w-full h-full font-medium aspect-video bg-gray-100 hover:bg-gray-200 cursor-pointer shadow rounded-lg"
              >
                Create new board
              </button>
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
          {isShowFormInputEmail && (
            <div className="mb-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addMemberResult.mutate();
                }}
                className="flex items-stretch gap-3 max-w-[500px]"
              >
                <Input
                  type="email"
                  name="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email..."
                  required
                />
                <Button
                  size={"sm"}
                  type="submit"
                  disabled={addMemberResult.isPending}
                >
                  Add Member
                </Button>
              </form>
            </div>
          )}
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {members.map((item) => (
              <li key={item._id}>
                <MemberCard member={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BoardModelForm
        open={openForm}
        onOpenChange={setOpenForm}
        title="Create board"
        description="Fill in the details to create your new Kanban board. You can also add an optional description to provide more context"
        workspaceId={id as string}
      />
    </>
  );
};

export default WorkspaceIdPage;
