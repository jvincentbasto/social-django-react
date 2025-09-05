import { Outlet } from "react-router";
import type { Route } from "./+types/PostLayout";
import PrivateRoute from "~/components/layouts/PrivateRoute";

const PostLayout = ({}: Route.ActionArgs) => {
  return (
    <PrivateRoute>
      <div className="w-full h-full">
        <Outlet />
      </div>
    </PrivateRoute>
  );
};

export default PostLayout;
