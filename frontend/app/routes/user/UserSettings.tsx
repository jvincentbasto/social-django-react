import type { Route } from "./+types/UserSettings";
import { FormCardSettings } from "~/components/forms/FormSettings";
import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import PrivateRoute from "~/components/layouts/PrivateRoute";

const Settings = ({}: Route.ActionArgs) => {
  return (
    <PrivateRoute>
      <LayoutWrapper>
        <div className="w-full h-dvh flex justify-center">
          <div className="w-full min-w-[375px] max-w-[500px] pt-[100px]">
            <FormCardSettings />
          </div>
        </div>
      </LayoutWrapper>
    </PrivateRoute>
  );
};

export default Settings;
