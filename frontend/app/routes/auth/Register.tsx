import type { Route } from "./+types/Register";

import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import { FormCardRegister } from "~/components/forms/FormRegister";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/useAuth";
import { useEffect, useState } from "react";
import Loading from "~/components/loading/Loading";

const Register = ({}: Route.ActionArgs) => {
  const navigate = useNavigate();
  const { loggedIn, loading } = useAuth();

  const LoadingBlock = () => {
    return (
      <div className="w-full min-h-dvh flex justify-center items-center">
        <Loading />
      </div>
    );
  };

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated && !loading && loggedIn) {
      navigate("/");
    }
  }, [hydrated, loading, loggedIn, navigate]);

  if (!hydrated || loading) {
    return <LoadingBlock />;
  }

  return (
    <div className="w-full min-h-[650px] my-[50px]">
      <LayoutWrapper>
        <div className="w-full flex justify-center">
          <FormCardRegister />
        </div>
      </LayoutWrapper>
    </div>
  );
};

export default Register;
