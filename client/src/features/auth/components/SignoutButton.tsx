import { useMutation } from "@tanstack/react-query";
import { memo } from "react";
import { useAuthStore } from "../stores/auth.store";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";

const SignoutButton = () => {
  const { signout } = useAuthStore();
  const signoutResult = useMutation({
    mutationFn: async () => {
      return await signout();
    },
    onSuccess(data) {
      toast.success(data?.message);
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  return (
    <Button
      disabled={signoutResult.isPending}
      onClick={() => {
        signoutResult.mutate();
      }}
    >
      Signout
    </Button>
  );
};

export default memo(SignoutButton);
