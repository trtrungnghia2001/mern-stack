import { memo, useMemo, useState } from "react";
import { z } from "zod";
import type { IRoomDTO } from "../types/chat.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import UploadComponent from "@/shared/components/form/upload-component";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRoomStore } from "../stores/room.store";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  avatar: z.string().optional(),
  description: z.string().optional(),
});

const initValues: IRoomDTO = {
  name: "",
  avatar: "",
  description: "",
};

const RoomForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResult.mutate(values);
  }

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const keys = useMemo(() => {
    return Object.keys(formSchema.shape) as Array<
      keyof typeof formSchema.shape
    >;
  }, []);

  const { create } = useRoomStore();
  const submitResult = useMutation({
    mutationFn: async (data: IRoomDTO) => {
      const formData = new FormData();
      if (avatarFile) formData.append("avatarFile", avatarFile);
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      return await create(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      setAvatarFile(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UploadComponent
          previewType="avatar"
          data={[form.getValues("avatar")]
            .filter(Boolean)
            .map((file) => ({ type: "image", url: file as string }))}
          onChangeFile={(e) => {
            setAvatarFile(e[0]);
          }}
          accept="image/*"
        />

        {keys
          .filter((key) => key !== "avatar")
          .map((key) => (
            <FormField
              key={key}
              name={key}
              control={form.control}
              render={({ field }) => {
                const label = key.replace(/_/gi, " ");

                return (
                  <FormItem>
                    <FormLabel className="capitalize">{label}</FormLabel>
                    {["description"].includes(key) ? (
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    )}

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
        <Button
          disabled={submitResult.isPending}
          type="submit"
          className="w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default memo(RoomForm);
