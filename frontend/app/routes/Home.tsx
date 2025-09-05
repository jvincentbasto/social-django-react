import { useEffect, useState } from "react";
import type { Route } from "./+types/Home";

import { usePost, usePostHook } from "~/contexts/usePost";
import { ApiPost } from "~/api/types";

import CardPost from "~/components/cards/CardPost";
import PrivateRoute from "~/components/layouts/PrivateRoute";
import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import FeedLayout from "~/components/layouts/FeedLayout";
import Loading from "~/components/loading/Loading";

import { FeedRightHomeSample } from "~/components/sections/feed/FeedRightHome";
import { FeedLeftHomeSample } from "~/components/sections/feed/FeedLeftHome";
import { FormCardPost } from "~/components/forms/FormPost";

type Posts = ApiPost.Fields["PartialFields"];

const Home = ({}: Route.ActionArgs) => {
  const {
    data: posts,
    loading,
    getPosts,
    setLoading,
    setErrors,
  } = usePostHook();
  // const { } = usePost();

  const [nextPage, setNextPage] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrors([]);

      const data = await getPosts(nextPage);
      if (!data || typeof data !== "object") return;

      setNextPage(data.next ? nextPage + 1 : 0);
    } catch {
      const error = { message: "Failed to get posts" };
      setErrors((state) => [...state, error]);
      return { results: [], next: 0 };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const loadMorePosts = () => {
    if (nextPage) {
      fetchData();
    }
  };

  const NoResults = () => {
    return (
      <div className="w-full h-[600px] rounded-[5px] bg-white shadow-md">
        <div className="w-full h-full flex justify-center items-center">
          <p className="font-black text-[32px] text-gray-300 mt-[-20px]">
            No Posts
          </p>
        </div>
      </div>
    );
  };
  const Feed = () => {
    const LoadMore = () => {
      if (!nextPage) return null;

      return (
        <button
          onClick={loadMorePosts}
          disabled={loading}
          className="btn w-full mt-[40px]"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      );
    };
    const Contents = () => {
      return (
        <div className="w-full flex flex-col gap-[20px]">
          <FormCardPost />
          {posts.length > 0 ? (
            posts.map((post: Posts, i) => {
              return <CardPost key={i} post={post} />;
            })
          ) : (
            <NoResults />
          )}
        </div>
      );
    };

    if (loading) {
      return (
        <div className="w-full h-full">
          <div className="w-full h-full flex justify-center mt-[30px]">
            <Loading />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <Contents />
        {posts.length > 0 ? <LoadMore /> : null}
      </div>
    );
  };

  return (
    <PrivateRoute>
      <LayoutWrapper>
        <div className="w-full min-h-dvh py-[50px] overflow-x-auto">
          <FeedLayout
            contentLeft={<FeedLeftHomeSample />}
            contentRight={<FeedRightHomeSample />}
          >
            <Feed />
          </FeedLayout>
        </div>
      </LayoutWrapper>
    </PrivateRoute>
  );
};

export default Home;
