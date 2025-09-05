import { Outlet } from "react-router";
import type { Route } from "./+types/UserLayout";
import LayoutWrapper from "~/components/layouts/LayoutWrapper";

const UserLayout = ({}: Route.ActionArgs) => {
  return (
    // <LayoutWrapper>
    <div className="w-full max-w-[1200px] mx-auto">
      <Outlet />
    </div>
    // </LayoutWrapper>
  );
};

export default UserLayout;
