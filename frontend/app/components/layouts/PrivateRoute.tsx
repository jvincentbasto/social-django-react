import { useAuth } from "../../contexts/useAuth";
import { Navigate } from "react-router";
import Loading from "../loading/Loading";
import { useEffect, useState } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
  // [key: string]: unknown;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { loggedIn, loading } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

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
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
