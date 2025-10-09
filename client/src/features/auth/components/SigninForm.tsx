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
import type { ISigninDTO } from "../types/auth";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";
import { useRedirectContext } from "../contexts/RedirectContext";
import { memo, type ComponentProps, type FC } from "react";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const initValues: ISigninDTO = {
  email: "",
  password: "",
};

const SigninForm: FC<ComponentProps<"div">> = ({ ...props }) => {
  const { handleRedirectWhenSignInSuccess } = useRedirectContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResult.mutate(values);
  }

  const { signin } = useAuthStore();
  const submitResult = useMutation({
    mutationFn: async (data: ISigninDTO) => {
      return await signin(data);
    },
    onSuccess(data) {
      toast.success(data?.message);
      handleRedirectWhenSignInSuccess(data.data.user);
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <Button
            disabled={submitResult.isPending}
            type="submit"
            className="w-full"
          >
            Submit
          </Button>
          <div>
            <Link
              to={`/auth/forgot-password`}
              className="text-sm underline text-center block"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="text-center text-sm">
            Already have account?{" "}
            <Link to={`/auth/signup`} className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default memo(SigninForm);
