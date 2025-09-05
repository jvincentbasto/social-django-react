import type { Route } from "./+types/Search";
import { useUser, useUserHook } from "~/contexts/useUser";

import PrivateRoute from "~/components/layouts/PrivateRoute";
import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import { FormCardSearch } from "~/components/forms/FormSearch";
import CardUser from "~/components/cards/CardUser";
import { SectionSearchLeftTabsSample } from "~/components/sections/search/SectionSearchLeftTabs";
import { useEffect } from "react";

const Search = ({}: Route.ActionArgs) => {
  const userHooks = useUserHook();
  // const {} = useUser();
  const { search, searchUsers } = userHooks;

  useEffect(() => {
    searchUsers(" ");
  }, []);

  const NoResults = () => {
    return (
      <div className="w-full h-[500px] rounded-[5px] bg-white shadow-md">
        <div className="w-full h-full flex justify-center items-center">
          <p className="font-black text-[32px] text-gray-300 mt-[-20px]">
            No Search Results
          </p>
        </div>
      </div>
    );
  };
  const Header = () => {
    return (
      <div className="w-full mt-[50px]">
        <div className="w-full">
          <FormCardSearch userHooks={userHooks} />
        </div>
      </div>
    );
  };
  const Content = () => {
    return (
      <div className="w-full flex gap-[20px] mt-[50px]">
        <div className="w-full min-w-[300px] lg:max-w-[400px] max-lg:hidden">
          <SectionSearchLeftTabsSample />
        </div>
        <div className="w-full min-w-[300px]">
          <div className="w-full flex flex-col gap-[20px]">
            <FormCardSearch userHooks={userHooks} />
            {search.length > 0 ? (
              search.map((user) => {
                return <CardUser key={user.username} user={user} />;
              })
            ) : (
              <NoResults />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PrivateRoute>
      <LayoutWrapper>
        <div className="w-full flex flex-col gap-[20px] mb-[50px]">
          {/* <Header /> */}
          <Content />
        </div>
      </LayoutWrapper>
    </PrivateRoute>
  );
};

export default Search;
