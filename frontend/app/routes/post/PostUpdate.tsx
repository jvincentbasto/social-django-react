import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import { FormCardPost } from "~/components/forms/FormPost";
import { SectionPostLeftTabsSample } from "~/components/sections/post/SectionPostLeftTabs";
import type { Route } from "./+types/PostUpdate";

const PostUpdate = ({}: Route.ActionArgs) => {
  const Header = () => {
    return (
      <div className="w-full mt-[50px]">
        <div className="w-full">
          <FormCardPost title="Update Post" />
        </div>
      </div>
    );
  };
  const Content = () => {
    return (
      <div className="w-full flex gap-[20px] mt-[50px]">
        <div className="w-full min-w-[300px]">
          <div className="w-full flex flex-col gap-[20px]">
            <FormCardPost title="Update Post" />
            <SectionPostLeftTabsSample />
          </div>
        </div>
        <div className="w-full min-w-[300px] lg:max-w-[400px] max-lg:hidden">
          <SectionPostLeftTabsSample />
        </div>
      </div>
    );
  };

  return (
    <LayoutWrapper>
      <div className="w-full flex justify-center mb-[50px]">
        <div className="w-full flex flex-col gap-[20px]">
          {/* <Header /> */}
          <Content />
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default PostUpdate;
