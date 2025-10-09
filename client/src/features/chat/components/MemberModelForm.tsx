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
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRoomStore } from "../stores/room.store";
import { memo, useEffect, useMemo, useState } from "react";
import instance from "@/configs/axios.config";
import type { ResponseSuccessListType } from "@/shared/types/response";
import type { IUser } from "@/features/auth/types/auth";
import { IMAGE_NOTFOUND } from "@/shared/constants/image.constant";

interface MemberModelFormProps extends Readonly<DialogProps> {
  roomId: string;
}

const formSchema = z.object({
  members: z.array(
    z.object({
      user: z.string(),
    })
  ),
});

const initValue = {
  members: [],
};

const MemberModelForm = ({ roomId, ...props }: MemberModelFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValue,
  });

  const { addMember } = useRoomStore();
  const { isPending, mutate } = useMutation({
    mutationFn: async (memberIds: string[]) =>
      await addMember(roomId, memberIds),
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset(initValue);
      props.onOpenChange?.(false);
    },
    onError: (error) => toast.error(error.message),
  });

  function onSubmit() {
    mutate(selectedMembers.map((m) => m.user));
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
    queryKey: ["chat", "available-members", queryMember],
    queryFn: async () =>
      (
        await instance.get<ResponseSuccessListType<IUser>>(
          `/api/v1/chat/rooms/${roomId}/available-members`,
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

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Select a user from the list below to add them to your team. You can
            only add members who are not already part of this group.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
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
              Add Member
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(MemberModelForm);
