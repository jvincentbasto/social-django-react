import SectionUserHeader from "~/components/sections/user/SectionUserHeader";
import SectionUserContent from "~/components/sections/user/SectionUserContent";
import { useParams } from "react-router";

const UserProfile = () => {
  const params = useParams();
  const username = params.user;

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-[20px]">
        <div className="w-full mt-[40px]">
          <SectionUserHeader username={username} />
        </div>
        <div className="w-full">
          <SectionUserContent username={username} />
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
