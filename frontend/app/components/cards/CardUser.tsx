import type { ApiUser } from "~/api/types";
import envs from "~/constants/envs";
import { useAuth } from "~/contexts/useAuth";

const { apiUrl } = envs;

interface CardUserProps {
  // children?: React.ReactNode;
  user: ApiUser.Fields["PartialFields"];
  // [key: string]: unknown;
}

const sample = {
  image: "https://m.media-amazon.com/images/I/5132RLcVxhL.jpg",
  description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe
    officia dicta consequuntur in quis, laborum sunt expedita neque
    vitae omnis cupiditate ipsum nihil optio assumenda voluptate quia
    repudiandae laudantium dolorum. Lorem ipsum dolor sit, amet
    consectetur adipisicing elit. Saepe officia dicta consequuntur in
    quis, laborum sunt expedita neque vitae omnis cupiditate ipsum nihil
    optio assumenda voluptate quia repudiandae laudantium dolorum. Lorem
    ipsum dolor sit, amet consectetur adipisicing elit. Saepe officia
    dicta consequuntur in quis, SOMETHINGS laborum sunt expedita neque vitae omnis
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

const CardUser = ({ user }: CardUserProps) => {
  const { username } = user;
  const profileImage = user?.profileImage
    ? `${apiUrl}${user.profileImage}`
    : sample.image;

  const followers = user.userFollowers ?? [];
  const maxVisibleFollowers = followers.slice(0, 5);
  const followerCount = user.followerCount ?? null;

  const Header = () => {
    const User = () => {
      return (
        <div className="w-full flex items-center gap-[10px]">
          <div className="size-[50px] rounded-full border-[1px] border-gray-100 shadow-md overflow-hidden">
            <div className="size-full rounded-full border-[2px] border-white shadow-md overflow-hidden">
              <a className="cursor-pointer" href={`/${user.username}`}>
                <img
                  src={profileImage}
                  alt="Post Image"
                  className="size-full object-cover"
                />
              </a>
            </div>
          </div>
          <div className="flex flex-col">
            <a
              href={`/${username}`}
              className="font-bold text-[14px] text-gray-800"
            >
              @{username}
            </a>
            <p className="text-[12px] text-gray-400">
              {user.formattedCreatedAt}
            </p>
          </div>
        </div>
      );
    };
    const Followers = () => {
      const Avatars = ({
        userFollower,
        index = 0,
        list = [],
      }: Record<string, any>) => {
        const image = userFollower?.profileImage
          ? `${apiUrl}${userFollower.profileImage}`
          : sample.image;
        const zIndex = list.length - index;
        const height = 50 - index > 45 ? 50 - index : 45;

        return (
          <div
            className={`size-[50px] rounded-full border-[1px] border-gray-100 shadow-md ml-[-25px]`}
            style={{ zIndex: zIndex, height: `${height}px` }}
          >
            <div
              className={`size-full rounded-full border-[4px] border-white overflow-hidden  `}
            >
              <a className="cursor-pointer" href={`/${userFollower.username}`}>
                <img
                  src={image}
                  alt="Post Image"
                  className="size-full object-cover"
                />
              </a>
            </div>
          </div>
        );
      };

      return (
        <div className="w-full flex items-center gap-[10px]">
          <div className="w-full flex justify-end ">
            {maxVisibleFollowers.map((m, i, list) => {
              return <Avatars key={i} userFollower={m} index={i} list={list} />;
            })}
          </div>
          {followerCount ? (
            <div className="flex">
              <p className="font-black text-[14px] text-gray-400">
                +{followerCount}
              </p>
            </div>
          ) : null}
        </div>
      );
    };

    return (
      <div className="w-full p-[20px]">
        <div className="w-full flex justify-between ">
          <User />
          <Followers />
        </div>
        {/* <hr className="border-gray-200 my-[20px] mb-0" /> */}
      </div>
    );
  };

  return (
    <div className="w-full rounded-[5px] shadow-md bg-white overflow-hidden">
      <Header />
    </div>
  );
};

export default CardUser;
