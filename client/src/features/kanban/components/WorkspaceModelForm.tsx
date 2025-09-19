import { memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useWorkspaceStore } from "../stores/workspace.store";
import type { IWorkspaceCreateDTO } from "../types/workspace.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";

interface WorkspaceModelFormProps extends Readonly<DialogProps> {
  title?: string;
  description?: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string(),
});

const initValue: IWorkspaceCreateDTO = { name: "", description: "" };

const WorkspaceModelForm = ({
  title,
  description,
  ...props
}: WorkspaceModelFormProps) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValue,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  const { create, updateById, isEdit, setEdit } = useWorkspaceStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: IWorkspaceCreateDTO) => {
      if (isEdit) {
        return await updateById(isEdit.idEdit, data);
      }
      return await create(data);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset(initValue);
      setEdit(null);
      props.onOpenChange?.(false);
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (isEdit?.dataInitEdit) {
      form.reset(isEdit.dataInitEdit);
    }
  }, [isEdit?.dataInitEdit]);

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Workspace name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              {isPending && <Loader />}
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(WorkspaceModelForm);
