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
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";
import { useRedirectContext } from "../contexts/RedirectContext";

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

const SigninForm = () => {
  const navigate = useNavigate();
  const { redirectTo, setRedirectTo } = useRedirectContext();

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
    mutationFn: (data: ISigninDTO) => {
      return signin(data);
    },
    onSuccess(data) {
      toast.success(data?.message);
      if (redirectTo) {
        navigate(redirectTo.pathname + redirectTo.search, { replace: true });
        setRedirectTo(null);
      } else {
        if (data?.data.user.role === "admin") {
          navigate(`/admin`, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
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
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link to={`/forgot-password`} className="text-sm underline">
                  Forgot your password?
                </Link>
              </div>
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
        <div className="text-center text-sm">
          Already have account?{" "}
          <Link to={`/signup`} className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SigninForm;
