import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import type { IChangePasswordDTO } from "../types/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";
import { memo, type ComponentProps, type FC } from "react";

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirm_password: z.string().min(8, {
      message: "Confirm password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"], // Hiển thị lỗi ở trường confirm_password
  });

const initValues: IChangePasswordDTO = {
  password: "",
  confirm_password: "",
};

const ChangePasswordForm: FC<ComponentProps<"div">> = ({ ...props }) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResult.mutate(values);
  }

  const { changePassword } = useAuthStore();
  const submitResult = useMutation({
    mutationFn: async (data: IChangePasswordDTO) => {
      return await changePassword(data);
    },
    onSuccess(data) {
      toast.success(data?.message);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <div {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={submitResult.isPending}
            type="submit"
            className="w-full"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default memo(ChangePasswordForm);
