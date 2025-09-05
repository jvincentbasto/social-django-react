import type { Route } from "./+types/Login";

import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import { FormCardLogin } from "~/components/forms/FormLogin";
import { useAuth } from "~/contexts/useAuth";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Loading from "~/components/loading/Loading";

const Login = ({}: Route.ActionArgs) => {
  const navigate = useNavigate();
  const { loggedIn, loading } = useAuth();

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated && !loading && loggedIn) {
      navigate("/");
    }
  }, [hydrated, loading, loggedIn, navigate]);

  const LoadingBlock = () => {
    return (
      <div className="w-full min-h-dvh flex justify-center items-center">
        <Loading />
      </div>
    );
  };

  if (!hydrated || loading) {
    return <LoadingBlock />;
  }

  return (
    <div className="w-full min-h-[650px]">
      <LayoutWrapper>
        <div className="w-full h-full flex justify-center items-center">
          <FormCardLogin />
        </div>
      </LayoutWrapper>
    </div>
  );
};

export default Login;
