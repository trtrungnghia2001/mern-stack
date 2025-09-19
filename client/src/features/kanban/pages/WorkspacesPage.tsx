import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "../stores/workspace.store";
import Loading from "../components/Loading";
import ErrorPage from "./ErrorPage";
import WorkspaceCard from "../components/WorkspaceCard";
import { Plus, SwatchBook } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import WorkspaceModelForm from "../components/WorkspaceModelForm";

const WorkspacesPage = () => {
  const { workspaces, getAll, setOpenForm, openForm, isEdit } =
    useWorkspaceStore();
  const { isLoading, error } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => await getAll(),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <>
      <div className="space-y-10">
        {/* Workspaces */}
        <div>
          <div className="flex items-center justify-between  mb-4">
            <div className="flex items-center gap-2 font-bold text-base">
              <SwatchBook size={20} />
              <span>Workspaces</span>
            </div>
            <Button onClick={() => setOpenForm(true)} size={"sm"}>
              <Plus />
              Add
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {workspaces.map((item) => (
              <li key={item._id}>
                <WorkspaceCard data={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <WorkspaceModelForm
        open={openForm}
        onOpenChange={setOpenForm}
        title={isEdit ? "Update workspace" : "Create workspace"}
        description="Fill in workspace details"
      />
    </>
  );
};

export default WorkspacesPage;
