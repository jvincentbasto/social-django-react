import { useEffect } from "react";
import type { ApiUser } from "~/api/types";
import { useUserHook } from "~/contexts/useUser";

import CardPost from "~/components/cards/CardPost";
import { SectionUserLeftTabsSample } from "./SectionUserLeftTabs";
import { FormCardPost } from "~/components/forms/FormPost";
import { usePost, usePostHook } from "~/contexts/usePost";

interface SectionUserContentProps {
  // children?: React.ReactNode,
  username?: ApiUser.Fields["PartialFields"]["username"];
  // [key: string]: unknown
}

const SectionUserContent = ({ username }: SectionUserContentProps) => {
  const { posts, getUserPosts } = useUserHook();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return;
      await getUserPosts(username);
    };

    fetchPosts();
  }, [username]);

  const UserPost = () => {
    return (
      <div className="w-full min-w-[300px] md:min-w-[500px] max-w-[1000px] flex flex-col gap-[20px]">
        <FormCardPost navigateTo={`/${username}`} />
        {posts.map((post, i) => {
          return <CardPost key={i} post={post} />;
        })}
      </div>
    );
  };

  return (
    <div className="w-full rounded-[5px] mb-[50px]">
      <div className="w-full flex gap-[20px]">
        <SectionUserLeftTabsSample />
        <UserPost />
      </div>
    </div>
  );
};

export default SectionUserContent;
