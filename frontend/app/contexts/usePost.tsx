import { createContext, useContext, useState } from "react";
import { apiPost } from "~/api/post";
import { ApiPost, ApiUser } from "~/api/types";
import { convertKeys } from "~/utils/utils";

interface PostProviderProps {
  children: React.ReactNode;
}
type DispatchType<T> = React.Dispatch<React.SetStateAction<T>>;
export type PostContextType = {
  data: ApiPost.Fields["PartialFields"][];
  form: ApiPost.Fields["PartialFields"] | null;
  search:
    | ApiPost.Fields["PartialFields"][]
    | Record<string, ApiPost.Fields["PartialFields"][]>
    | null;
  //
  loading: boolean;
  modal: boolean;
  errors: Record<string, any>[];
  status: "initial" | "pending" | "success" | "failed";
  isUpdate: boolean;
  likeToggle: boolean;

  // dispatch
  setData: DispatchType<PostContextType["data"]>;
  setForm: DispatchType<PostContextType["form"]>;
  setSearch: DispatchType<PostContextType["search"]>;
  //
  setLoading: DispatchType<PostContextType["loading"]>;
  setModal: DispatchType<PostContextType["modal"]>;
  setErrors: DispatchType<PostContextType["errors"]>;
  setStatus: DispatchType<PostContextType["status"]>;
  //
  setIsUpdate: DispatchType<PostContextType["isUpdate"]>;
  setLikeToggle: DispatchType<PostContextType["likeToggle"]>;

  // api
  getPosts: (...[page]: [number]) => Promise<
    | ({
        results: ApiPost.Fields["PartialFields"][];
        next: number;
      } & Record<string, any>)
    | null
  >;
  createPost: (
    ...[payload]: [ApiPost.Fields["PartialFields"]]
  ) => Promise<ApiPost.Fields["PartialFields"] | null>;
  getPostById: (
    ...[id]: [ApiPost.Fields["PartialFields"]["id"]]
  ) => Promise<ApiPost.Fields["PartialFields"] | null>;
  updatePost: (
    ...[payload]: [ApiPost.Fields["PartialFields"]]
  ) => Promise<ApiPost.Fields["PartialFields"] | null>;
  deletePost: (
    ...[id]: [string | number]
  ) => Promise<ApiPost.Fields["PartialFields"]["id"] | null>;
  toggleLike: (
    ...[id]: [string | number]
  ) => Promise<ApiPost.Fields["PartialFields"] | null>;
};

const initialValues = {
  id: "",
  email: "",
  user: "",
  username: "",
  bio: "",
  description: "",
  image: "",
  liked: false,
  //
  following: false,
  followerCount: "",
  followingCount: "",
  userFollowers: [],
  userFolling: [],
  formattedCreatedAt: "",
};

// hooks
export const usePostHook = () => {
  const [data, setData] = useState<PostContextType["data"]>([]);
  const [form, setForm] = useState<PostContextType["form"]>(initialValues);
  const [search, setSearch] = useState<PostContextType["search"]>([]);

  //
  const [loading, setLoading] = useState<PostContextType["loading"]>(false);
  const [modal, setModal] = useState<PostContextType["modal"]>(false);
  const [errors, setErrors] = useState<PostContextType["errors"]>([]);
  const [status, setStatus] = useState<PostContextType["status"]>("initial");
  //
  const [isUpdate, setIsUpdate] = useState<PostContextType["isUpdate"]>(false);
  const [likeToggle, setLikeToggle] =
    useState<PostContextType["likeToggle"]>(false);

  //
  const keys = ApiPost.constants.inverted.all;
  type Params = ApiPost.ConvertKeyParams["toDefault"];
  const userKeys = ApiUser.constants.inverted.all;
  type UserParams = ApiUser.ConvertKeyParams["toDefault"];
  const convertFields = (m: Params["1"]) => {
    let result = convertKeys<Params["1"], Params["2"], Params["3"]>(m, keys);

    if (typeof result.user === "object") {
      const user = convertKeys<
        UserParams["1"],
        UserParams["2"],
        UserParams["3"]
      >(result.user, userKeys);

      result = {
        ...result,
        user,
      };
    }

    if (Array.isArray(result?.likeUsers)) {
      const likeUsers = result.likeUsers.map((m: UserParams["1"]) => {
        const value = convertKeys<
          UserParams["1"],
          UserParams["2"],
          UserParams["3"]
        >(m, userKeys);

        return value;
      });

      result = {
        ...result,
        likeUsers,
      };
    }

    return result;
  };

  const payloadKeys = ApiPost.constants.all;
  type PayloadParams = ApiPost.ConvertKeyParams["toInverse"];
  const payloadUserKeys = ApiUser.constants.all;
  type PayloadUserParams = ApiUser.ConvertKeyParams["toInverse"];
  const convertPayloadFields = (m: PayloadParams["1"]) => {
    let result = convertKeys<
      PayloadParams["1"],
      PayloadParams["2"],
      PayloadParams["3"]
    >(m, payloadKeys);

    if (typeof result.user === "object") {
      const user = convertKeys<
        PayloadUserParams["1"],
        PayloadUserParams["2"],
        PayloadUserParams["3"]
      >(result.user, payloadUserKeys);

      result = {
        ...result,
        user,
      };
    }

    if (Array.isArray(result?.like_users)) {
      const likeUsers = result.like_users.map((m: PayloadUserParams["1"]) => {
        const value = convertKeys<
          PayloadUserParams["1"],
          PayloadUserParams["2"],
          PayloadUserParams["3"]
        >(m, payloadUserKeys);

        return value;
      });

      result = {
        ...result,
        likeUsers,
      };
    }

    return result;
  };

  // api
  const getPosts: PostContextType["getPosts"] = async (...[page]) => {
    try {
      setLoading(true);
      setErrors([]);

      const response = await apiPost.getPosts(page);
      const posts = response.results.map((m: Params["1"]) => {
        let result = convertFields(m);
        return result;
      });

      setData((state) => {
        return [...state, ...posts];
      });
      return { results: posts, next: response?.next ?? 0 };
    } catch {
      const error = { message: "Failed to get posts" };
      setErrors((state) => [...state, error]);
      return { results: [], next: 0 };
    } finally {
      setLoading(false);
    }
  };
  const createPost: PostContextType["createPost"] = async (...[payload]) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const payloadFormat = convertPayloadFields(payload);
      const response = await apiPost.createPost(payloadFormat);
      let post = convertFields(response.results);

      setData((state) => [...state, post]);
      return post;
    } catch {
      const error = { message: "Failed to create post" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const getPostById: PostContextType["getPostById"] = async (...[id]) => {
    try {
      setLoading(true);
      setErrors([]);

      const response = await apiPost.getPostById(id);
      const post = convertFields(response.result);

      return post;
    } catch {
      const error = { message: "Failed to get posts" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updatePost: PostContextType["updatePost"] = async (...[payload]) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const { image, ...rest } = payload;
      const validateImage = (image as any) instanceof File ? image : null;
      let payloadValidated = rest;
      if (validateImage) {
        payloadValidated = {
          ...payloadValidated,
          ...(validateImage ? { image: validateImage } : {}),
        };
      }
      const payloadFormat = convertPayloadFields(payloadValidated);
      const response = await apiPost.updatePost(payloadFormat);
      const post = convertFields(response.results);

      setData((state) =>
        state.map((m) => {
          const value = m.id === post.id ? post : m;
          return value;
        })
      );

      return post;
    } catch {
      const error = { message: "Failed to update post" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const deletePost: PostContextType["deletePost"] = async (...[id]) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      await apiPost.deletePost(id);
      setData((state) => state.filter((f) => f.id !== id));

      return id;
    } catch {
      const error = { message: "Failed to delete post" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  //
  const toggleLike: PostContextType["toggleLike"] = async (...[id]) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const response = await apiPost.toggleLike(id);
      const post = convertFields(response);
      const liked = post?.liked;

      setData((state) =>
        state.map((m) => {
          const likeCount = m?.likeCount ?? 0;
          const newValues = {
            liked,
            likeCount: liked
              ? likeCount + 1
              : likeCount > 0
                ? likeCount - 1
                : 0,
          };

          const value = m.id === id ? { ...m, ...newValues } : m;
          return value;
        })
      );
      setLikeToggle(liked);

      return response;
    } catch {
      const error = { message: "Failed to toggle like" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  const postKeys = {
    initialValues,
  };
  // hooks
  const api = {
    getPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    toggleLike,
  };
  const values = {
    ...postKeys,
    data,
    form,
    search,
    //
    loading,
    modal,
    errors,
    status,
    //
    isUpdate,
    likeToggle,
  };
  const handlers = {
    setData,
    setForm,
    setSearch,
    //
    setLoading,
    setModal,
    setErrors,
    setStatus,
    setIsUpdate,
    setLikeToggle,
    //
    ...api,
  };
  const hooks = {
    ...values,
    ...handlers,
  };

  return hooks;
};

// contexts
const PostContext = createContext<PostContextType | undefined>(undefined);
export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("Missing post context");
  }

  return context;
};
export const PostProvider = ({ children }: PostProviderProps) => {
  const hook = usePostHook();

  const value = {
    ...hook,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
export default PostProvider;
