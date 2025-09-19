import { useMutation } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import { useWorkspaceStore } from "../stores/workspace.store";
import type { IWorkspaceCreateDTO } from "../types/workspace.type";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

interface WorkspaceFormProps {
  setOpen: (open: boolean) => void;
  isEdit?: boolean;
  idEdit?: string;
  dataEdit?: IWorkspaceCreateDTO;
}

const init = { name: "", description: "" };

const WorkspaceForm = ({
  setOpen,
  dataEdit,
  idEdit,
  isEdit,
}: WorkspaceFormProps) => {
  const [form, setForm] = useState<IWorkspaceCreateDTO>(init);
  const { create, updateById } = useWorkspaceStore();

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: IWorkspaceCreateDTO) => {
      if (isEdit && idEdit) {
        return await updateById(idEdit, form);
      }
      return await create(data);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setForm(init);
      setOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (dataEdit) {
      setForm(dataEdit);
    }
  }, [dataEdit]);

  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Update Workspace` : `Create Workspace`}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate(form);
          }}
          className="bg-white shadow-lg rounded-2xl p-4 w-full"
        >
          <h2 className="text-base font-semibold mb-4">Create Workspace</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Workspace name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Optional description..."
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isEdit ? `Edit Workspace` : `Create Workspace`}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(WorkspaceForm);
