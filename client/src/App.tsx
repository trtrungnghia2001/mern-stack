import { useNavigate } from "react-router-dom";
import { Toaster } from "./shared/components/ui/sonner";
import { useAuthStore } from "./features/auth/stores/auth.store";
import { useEffect } from "react";
import MainRouter from "./app/routes";
import { useRedirect } from "./features/auth/contexts/RedirectContext";

const App = () => {
  const { user, signinWithSocialMediaSuccess } = useAuthStore();
  const { redirectTo, setRedirectTo } = useRedirect();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      (async () => {
        await signinWithSocialMediaSuccess().then((data) => {
          if (redirectTo) {
            navigate(redirectTo.pathname + redirectTo.search, {
              replace: true,
            });
            setRedirectTo(null);
          } else {
            if (data?.data.user.role === "admin") {
              navigate(`/admin`, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        });
      })();
    }
  }, []);

  return (
    <div>
      <Toaster />
      <MainRouter />
    </div>
  );
};

export default App;
