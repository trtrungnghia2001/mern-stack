import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "../stores/workspace.store";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import WorkspaceCard from "../components/WorkspaceCard";
import { SwatchBook } from "lucide-react";
import WorkspaceForm from "../components/WorkspaceForm";
import ButtonDropdownMenu from "../components/ButtonDropdownMenu";

const WorkspacesPage = () => {
  const { workspaces, getAll } = useWorkspaceStore();
  const { isLoading, error } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await getAll(),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <div className="space-y-10">
      {/* Workspaces */}
      <div>
        <div className="flex items-center justify-between  mb-4">
          <div className="flex items-center gap-2 font-bold text-base">
            <SwatchBook size={20} />
            <span>Workspaces</span>
          </div>
          <ButtonDropdownMenu
            button={
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              >
                Add Workspace
              </button>
            }
          >
            {(setOpen) => <WorkspaceForm setOpen={setOpen} />}
          </ButtonDropdownMenu>
        </div>
        <ul className="grid gap-4 grid-cols-4">
          {workspaces.map((item) => (
            <li key={item._id}>
              <WorkspaceCard data={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkspacesPage;
