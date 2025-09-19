import { memo } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import type { IBoardCreateDTO } from "../types/board.type";
import { boardBgColor } from "../constants/color";
import { useBoardStore } from "../stores/board.store";

interface BoardModelFormProps extends Readonly<DialogProps> {
  title?: string;
  description?: string;
  workspaceId: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  bgColor: z.number(),
});

const initValue: IBoardCreateDTO = {
  name: "",
  description: "",
  bgColor: 0,
  workspace: "",
};
const BoardModelForm = ({
  title,
  description,
  workspaceId,
  ...props
}: BoardModelFormProps) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValue,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ ...values, workspace: workspaceId });
  }

  const { create } = useBoardStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: IBoardCreateDTO) => {
      return await create(data);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset(initValue);
      props.onOpenChange?.(false);
    },
    onError: (error) => toast.error(error.message),
  });

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
              name="bgColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <ul className="grid gap-2 grid-cols-4">
                      {boardBgColor.map((item, idx) => (
                        <li
                          key={idx}
                          className={`aspect-video rounded overflow-hidden relative cursor-pointer`}
                          onClick={() => field.onChange(idx)}
                        >
                          {idx === field.value && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Check
                                className="absolute text-white"
                                size={16}
                              />
                            </div>
                          )}
                          <img src={item} alt="bg" className="img" />
                        </li>
                      ))}
                    </ul>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default memo(BoardModelForm);
