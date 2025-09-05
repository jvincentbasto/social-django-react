import { useEffect, useState } from "react";

import type { ApiPost } from "~/api/types";
import envs from "~/constants/envs";
import { usePost, usePostHook } from "~/contexts/usePost";

import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { SlOptions } from "react-icons/sl";

const { apiUrl } = envs;

interface CardPostProps {
  // children?: React.ReactNode;
  post: ApiPost.Fields["PartialFields"];
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

const CardPost = ({ post }: CardPostProps) => {
  const navigate = useNavigate();
  const {
    form,
    loading,
    toggleLike,
    setForm,
    setLoading,
    setErrors,
    deletePost,
  } = usePostHook();
  const { setForm: setFormCtx, setIsUpdate, setLikeToggle } = usePost();

  const [expand, setExpand] = useState(false);

  const user = post?.user && typeof post?.user === "object" ? post?.user : null;
  const profileImage = user?.profileImage
    ? `${apiUrl}${user.profileImage}`
    : sample.image;
  const image = post?.image ? `${apiUrl}${post.image}` : sample.image;

  const userLikes = post.likeUsers ?? [];
  const maxVisibleUserLikes = userLikes.slice(0, 5);
  const likeCount = post.likeCount ?? null;

  const handleToggleLike = async () => {
    if (!form?.id) return;

    try {
      setLoading(true);
      setErrors([]);

      const response = await toggleLike(form?.id);
      const liked = response?.liked ?? false;
      setLikeToggle(liked);

      setForm((state) => {
        const likeCount = state?.likeCount ?? 0;
        const newValues = {
          ...post,
          ...state,
          liked,
          likeCount: liked ? likeCount + 1 : likeCount > 0 ? likeCount - 1 : 0,
        };

        return newValues;
      });
    } catch {
      const error = { message: "Failed to toggle like" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(post);
  }, [post]);

  const Options = () => {
    const paths = {
      update: post.id ? `/post/update/${post.id}` : "",
      // delete: post.id ? `/post/update/${post.id}` : ""
    };
    const handleOnEdit = () => {
      setFormCtx(post);
      setIsUpdate(true);
      navigate(paths.update);
    };
    const handleOnDelete = () => {
      if (post?.id) {
        deletePost(post.id);
      }
      // navigate("/");
      window.location.href = "/";
    };

    const menuItems = [
      { name: "Edit", href: paths.update, onClick: handleOnEdit },
      {
        name: "Delete",
        href: "",
        onClick: handleOnDelete,
      },
      { name: "Report", href: "", onClick: () => null },
    ];

    const MenuItem = ({ item }: { item: (typeof menuItems)[number] }) => {
      const btn = item.onClick ? (
        <button onClick={item.onClick} className="">
          {item.name}
        </button>
      ) : (
        <Link to={item.href} className="">
          {item.name}
        </Link>
      );

      return <li>{btn}</li>;
    };

    return (
      <div className="flex items-center">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div
              className="size-[36px] rounded-full"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SlOptions />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 min-w-[150px] mt-[10px] p-[10px] shadow-md"
          >
            {menuItems.map((item, i) => {
              return <MenuItem key={i} item={item} />;
            })}
          </ul>
        </div>
      </div>
    );
  };
  const Header = () => {
    return (
      <div className="w-full p-[20px]">
        <div className="w-full flex justify-between ">
          <div className="w-full flex items-center gap-[10px]">
            <div className="size-[50px] rounded-full border-[2px] border-gray-400 shadow-md overflow-hidden">
              <img
                src={profileImage}
                alt="Post Image"
                className="size-full object-cover"
              ></img>
            </div>
            <div className="flex flex-col">
              <a
                href={`/${form?.username}`}
                className="font-bold text-[14px] text-gray-800"
              >
                @{form?.username}
              </a>
              <p className="text-[12px] text-gray-400">
                {form?.formattedCreatedAt}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Options />
          </div>
        </div>
        <hr className="border-gray-200 my-[20px] mb-0" />
      </div>
    );
  };
  const Media = () => {
    return (
      <div className="w-full h-[300px]">
        <div className="min-w-0 w-full h-full bg-gray-50/50">
          <img
            src={image}
            alt="Post Image"
            className="w-full h-full object-contain max-sm:object-cover lg:object-contain"
          ></img>
        </div>
      </div>
    );
  };
  const Content = () => {
    const expandContent = expand
      ? "max-h-[2000px] overflow-auto"
      : "max-h-[150px] overflow-hidden";

    // const desc = form?.description ?? sample.description;
    const desc = form?.description ?? "";
    const expandDesc = desc.length > 800;

    const ExpandButton = () => {
      return (
        <div className="min-w-0 w-full">
          <span
            onClick={() => setExpand((s) => !s)}
            className="cursor-pointer font-bold text-gray-500 hover:text-gray-700 mt-[10px]"
          >
            {expand ? "Show less" : "Show more ..."}
          </span>
        </div>
      );
    };

    return (
      <div className="w-full p-[20px] pt-0 text-[14px] flex flex-col gap-[10px] overflow-hidden">
        <div className={`min-w-0 w-full h-auto mt-[10px] ${expandContent}`}>
          <p className="">{desc}</p>
        </div>
        {expandDesc ? <ExpandButton /> : null}
      </div>
    );
  };
  const UserLikes = () => {
    const Avatars = ({
      userLikes,
      index = 0,
      list = [],
    }: Record<string, any>) => {
      const image = userLikes?.profileImage
        ? `${apiUrl}${userLikes.profileImage}`
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
            <a className="cursor-pointer" href={`/${userLikes.username}`}>
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
          {maxVisibleUserLikes.map((m, i, list) => {
            return <Avatars key={i} userLikes={m} index={i} list={list} />;
          })}
        </div>
        {likeCount ? (
          <div className="flex">
            <p className="font-black text-[14px] text-gray-400">+{likeCount}</p>
          </div>
        ) : null}
      </div>
    );
  };
  const Footer = () => {
    return (
      <div className="min-w-0 w-full p-[20px] pt-0 text-[14px]">
        {/* <hr className="border-gray-200" /> */}
        <div className="w-full h-full min-h-[50px] flex justify-between items-center mt-[20px]">
          <div className="w-full h-full flex items-center gap-[10px]">
            <button
              onClick={handleToggleLike}
              disabled={loading}
              className="btn btn-circle cursor-pointer"
            >
              {form?.liked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <p>{form?.likeCount}</p>
          </div>
          <div className="w-full h-full flex justify-end items-end">
            {/* <UserLikes /> */}
            <p>{form?.formattedCreatedAt}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full rounded-[5px] shadow-md bg-white overflow-hidden">
      <Header />
      <Content />
      <Media />
      <Footer />
    </div>
  );
};

export default CardPost;
