import { useEffect } from "react";
import type { ApiUser } from "~/api/types";
import envs from "~/constants/envs";
import { useUser, useUserHook } from "~/contexts/useUser";

const { apiUrl } = envs;

const sample = {
  image: "https://m.media-amazon.com/images/I/5132RLcVxhL.jpg",
  bio: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe
    officia dicta consequuntur in quis, laborum sunt expedita neque
    vitae omnis cupiditate ipsum nihil optio assumenda voluptate quia
    repudiandae laudantium dolorum. Lorem ipsum dolor sit, amet
    consectetur adipisicing elit. Saepe officia dicta consequuntur in
    quis, laborum sunt expedita neque vitae omnis cupiditate ipsum nihil
    optio assumenda voluptate quia repudiandae laudantium dolorum. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. Saepe officia
    dicta consequuntur in quis, laborum sunt expedita neque vitae omnis
    cupiditate ipsum nihil optio assumenda voluptate quia repudiandae
    laudantium dolorum. Lorem ipsum dolor sit, amet consectetur
    adipisicing elit. Saepe officia dicta consequuntur in quis, laborum
    sunt expedita neque vitae omnis cupiditate ipsum nihil optio
    assumenda voluptate quia repudiandae laudantium dolorum. Lorem ipsum
    dolor sit, amet consectetur adipisicing elit. Saepe officia dicta
    consequuntur in quis, laborum sunt expedita neque vitae omnis
    cupiditate ipsum nihil optio assumenda voluptate quia repudiandae
    laudantium dolorum.`,
};

interface SectionUserHeaderInterface {
  // children?: React.ReactNode,
  username?: string;
  // [key: string]: unknown
}
type UserData = ApiUser.Fields["PartialFields"];

const ProfileBlock = ({ data }: { data?: UserData }) => {
  const profileImage = data?.profileImage
    ? `${apiUrl}${data.profileImage}`
    : sample.image;

  return (
    <div className="w-full rounded-[10px] bg-white shadow-md">
      <div className="w-fuil flex flex-col">
        <div className="w-full h-[300px] rounded-[5px] rounded-b-none bg-gray-100 overflow-hidden relative">
          <img src={profileImage} className="w-full h-full object-cover" />
          <div className="w-full h-full bg-linear-to-b from-transparent to-black/50 absolute top-0 left-0 z-[10]"></div>
        </div>
        <div className="w-full relative z-[20]">
          <div className="size-[200px] rounded-full border-[10px] border-white overflow-hidden absolute bottom-0 left-0 translate-y-[55%] translate-x-[20px] max-sm:left-[50%] max-sm:translate-x-[-50%] bg-white">
            <img src={profileImage} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};
const Info = ({
  username,
  loading,
  data,
  handleToggleFollow,
}: {
  username?: string;
  loading: boolean;
  data?: UserData;
  handleToggleFollow: () => Promise<void>;
}) => {
  const Header = () => {
    const name = `${data?.firstName ?? ""} ${data?.lastName ?? ""}`.trim();

    return (
      <div className="w-full max-md:mt-[120px] max-md:ml-0 ml-[220px]">
        <div className="font-black flex ">
          <span className="text-[24px] mr-[8px]">{name}</span>
        </div>
        <div className="w-full flex items-center gap-[10px]">
          <p className="text-[16px] text-gray-600 font-bold">@{username}</p>
        </div>
        <div className="w-full flex items-center gap-[10px]">
          <p className="">{data?.followerCount} followers</p>
          <p className="size-[5px] bg-black rounded-full"></p>
          <p className="">{data?.followingCount} following</p>
        </div>
      </div>
    );
  };
  const Actions = () => {
    return (
      <div className="w-full flex max-md:justify-start max-md:mt-[20px] justify-end mt-[5px] gap-[10px]">
        <div className="flex gap-[10px]">
          {/* {!data?.isOurProfile ? (
            <button
              // onClick={}
              disabled={loading}
              className="btn btn-primary cursor-pointer"
            >
              {false ? "Friends" : "Add Friend"}
            </button>
          ) : null} */}
          {data?.isOurProfile ? (
            <a
              // onClick={}
              href={`/settings`}
              className="btn cursor-pointer"
            >
              Edit
            </a>
          ) : (
            <button
              onClick={handleToggleFollow}
              disabled={loading}
              className="btn btn-primary cursor-pointer"
            >
              {data?.following ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>
      </div>
    );
  };
  const Bio = () => {
    return (
      <div className="w-full flex gap-[10px] max-h-[148px] mt-[0px] overflow-hidden">
        <p className="text-gray-700 text-[16px]">{data?.bio}</p>
      </div>
    );
  };

  return (
    <div className="w-full rounded-[5px] bg-white p-[20px] shadow-md mt-[-20px]">
      <div className="w-full flex flex-col gap-[5px]">
        <div className="w-full min-h-[90px] flex justify-between max-md:flex-col">
          <Header />
          <Actions />
        </div>
        {data?.bio ? (
          <>
            <hr className="border-gray-200 my-[20px] mt-[20px]" />
            <Bio />
          </>
        ) : null}
      </div>
    </div>
  );
};

const SectionUserHeader = ({ username }: SectionUserHeaderInterface) => {
  const { data, loading, getUser, setForm, toggleUserFollow } = useUserHook();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      await getUser(username);
    };

    fetchData();
  }, [username]);

  // handlers
  const handleToggleFollow = async () => {
    if (!username) return;

    const data = await toggleUserFollow(username);
    setForm(data);
  };

  return (
    <div className="w-full ">
      <div className="w-full flex flex-col gap-[10px]">
        <ProfileBlock data={data} />
        <Info
          username={username}
          loading={loading}
          data={data}
          handleToggleFollow={handleToggleFollow}
        />
      </div>
    </div>
  );
};

export default SectionUserHeader;
