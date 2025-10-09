import { debounce } from "lodash";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRoomStore } from "../stores/room.store";
import type { IRoomCreateDTO } from "../types/room.type";
import { memo, useEffect, useMemo, useState } from "react";
import instance from "@/configs/axios.config";
import type { ResponseSuccessListType } from "@/shared/types/response";
import type { IUser } from "@/features/auth/types/auth";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";

interface GroupModelFormProps extends Readonly<DialogProps> {
  title?: string;
  description?: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  description: z.string(),
  members: z.array(
    z.object({
      user: z.string(),
    })
  ),
});

const initValue = {
  name: "",
  description: "",
  members: [],
};

const GroupModelForm = ({
  title,
  description,
  ...props
}: GroupModelFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValue,
  });

  const { create } = useRoomStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async (data: IRoomCreateDTO) => await create(data),
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset(initValue);
      props.onOpenChange?.(false);
    },
    onError: (error) => toast.error(error.message),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ ...values });
  }

  // Debounce tìm kiếm user
  const [queryMember, setQueryMember] = useState("");
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setQueryMember(value), 300),
    []
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const { data: members, isLoading } = useQuery({
    queryKey: ["chat", "members", queryMember],
    queryFn: async () =>
      (
        await instance.get<ResponseSuccessListType<IUser>>(
          `/api/v1/chat/members`,
          { params: { _q: queryMember } }
        )
      ).data.data,
    enabled: !!props.open,
  });

  const selectedMembers = form.watch("members");

  const toggleMember = (userId: string) => {
    const current = form.getValues("members") || [];

    const exists = current.some((m) => m.user === userId);

    if (exists) {
      // Nếu user đã có trong danh sách → bỏ ra
      form.setValue(
        "members",
        current.filter((m) => m.user !== userId)
      );
    } else {
      // Nếu chưa có → thêm vào với role mặc định là "member"
      form.setValue("members", [...current, { user: userId }]);
    }
  };

  // const [avatarFile, setAvatarFile] = useState<File | null>(null);
  // const [previewFile, setPreviewFile] = useState<string>("");
  // useEffect(() => {
  //   if (avatarFile) {
  //     const url = URL.createObjectURL(avatarFile);
  //     setPreviewFile(url);
  //     return () => URL.revokeObjectURL(url);
  //   }
  // }, [avatarFile]);

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label
                      id="file"
                      className="w-24 block mx-auto cursor-pointer aspect-square overflow-hidden rounded-full border"
                    >
                      <img
                        src={previewFile || IMAGE_NOTFOUND.group_notfound}
                        alt="avatar"
                        className="img"
                      />
                      <input
                        name="file"
                        type="file"
                        onChange={(e) =>
                          setAvatarFile(e.target.files?.[0] as File)
                        }
                        accept="image/*"
                        hidden
                      />
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group name" {...field} />
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

            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Add Members{" "}
                    {selectedMembers.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        ({selectedMembers.length} selected)
                      </span>
                    )}
                  </FormLabel>

                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        placeholder="Search user..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                      />

                      {isLoading ? (
                        <div className="text-center text-sm text-gray-500 py-2">
                          Loading...
                        </div>
                      ) : members && members.length > 0 ? (
                        <ul className="max-h-40 overflow-y-auto border rounded-md">
                          {members.map((u) => {
                            const selected = selectedMembers.some(
                              (m) => m.user === u._id
                            );
                            return (
                              <li
                                key={u._id}
                                onClick={() => toggleMember(u._id)}
                                className={`flex items-center gap-2 p-2 cursor-pointer ${
                                  selected
                                    ? "bg-primary/10"
                                    : "hover:bg-muted transition"
                                }`}
                              >
                                <img
                                  src={
                                    u.avatar || IMAGE_NOTFOUND.avatar_notfound
                                  }
                                  className="w-6 h-6 rounded-full"
                                />
                                <span className="flex-1 text-sm">{u.name}</span>
                                {selected && (
                                  <Check className="w-4 h-4 text-primary" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="text-center text-sm text-gray-500 py-2">
                          No users found
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit" className="w-full">
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Create Group
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(GroupModelForm);
