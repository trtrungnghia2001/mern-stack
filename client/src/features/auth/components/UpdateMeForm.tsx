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
import type { IUpdateMeDTO } from "../types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";
import { Textarea } from "@/shared/components/ui/textarea";
import { memo, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { gender_options } from "../constants/options";
import type { IOption } from "../types/options";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  gender: z.string().optional(),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  work: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
  link_website: z.string().optional(),
});

const initValues: IUpdateMeDTO = {
  name: "",
  gender: "",
  avatar: "",
  phoneNumber: "",
  address: "",
  birthday: "",
  work: "",
  education: "",
  bio: "",
  link_website: "",
};

const UpdateMeForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    submitResult.mutate(values);
  }

  const { updateMe, getMe } = useAuthStore();
  const getMeResult = useQuery({
    queryKey: ["auth/get-me"],
    queryFn: async () => {
      return await getMe();
    },
  });
  useEffect(() => {
    if (getMeResult.data && getMeResult.isSuccess) {
      form.reset(getMeResult.data.data);
    }
  }, [getMeResult.data, getMeResult.isSuccess]);

  const submitResult = useMutation({
    mutationFn: (data: IUpdateMeDTO) => {
      return updateMe(data);
    },
    onSuccess(data) {
      toast.success(data?.message);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {Object.keys(initValues)
          .filter((key) => key !== "avatar")
          .map((key) => (
            <FormField
              key={key}
              name={key as keyof typeof formSchema.shape}
              control={form.control}
              render={({ field }) => {
                const label = key.replace(/_/gi, " ");
                let options: IOption[] = [];
                if (key === "gender") options = gender_options;

                return (
                  <FormItem>
                    <FormLabel className="capitalize">{label}</FormLabel>
                    {["bio"].includes(key) ? (
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    ) : ["gender"].includes(key) ? (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select a ${key}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options?.map((item, idx) => (
                            <SelectItem key={idx} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input
                          {...field}
                          type={
                            key === "phoneNumber"
                              ? "tel"
                              : key === "birthday"
                              ? "date"
                              : "text"
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (key === "phoneNumber") {
                              field.onChange(value.replace(/\D/g, ""));
                            } else {
                              field.onChange(value);
                            }
                          }}
                        />
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

export default memo(UpdateMeForm);
