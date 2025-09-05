import { createContext, useContext, useState } from "react";
import { ApiUser } from "~/api/types";
import { apiUser } from "~/api/user";
import { convertKeys } from "~/utils/utils";

interface UserProviderProps {
  children: React.ReactNode;
}
type DispatchType<T> = React.Dispatch<React.SetStateAction<T>>;
export type UserContextType = {
  data: ApiUser.Fields["PartialFields"];
  form: ApiUser.Fields["PartialFields"] | null;
  search: ApiUser.Fields["PartialFields"][];
  posts: ApiUser.Fields["PartialFields"][];
  //
  loading: boolean;
  modal: boolean;
  errors: Record<string, any>[];
  status: "initial" | "pending" | "success" | "failed";

  // dispatch
  setData: DispatchType<UserContextType["data"]>;
  setForm: DispatchType<UserContextType["form"]>;
  setSearch: DispatchType<UserContextType["search"]>;
  setPosts: DispatchType<UserContextType["posts"]>;
  //
  setLoading: DispatchType<UserContextType["loading"]>;
  setModal: DispatchType<UserContextType["modal"]>;
  setErrors: DispatchType<UserContextType["errors"]>;
  setStatus: DispatchType<UserContextType["status"]>;

  // api
  getUser: (
    ...[username]: [ApiUser.Fields["PartialFields"]["username"]]
  ) => Promise<ApiUser.Fields["PartialFields"] | null>;
  createUser: (
    ...[payload]: [ApiUser.Fields["PartialFields"]]
  ) => Promise<ApiUser.Fields["PartialFields"] | null>;
  updateUser: (
    ...[payload]: [ApiUser.Fields["PartialFields"]]
  ) => Promise<ApiUser.Fields["PartialFields"] | null>;
  deleteUser: (
    ...[id]: [string]
  ) => Promise<ApiUser.Fields["PartialFields"]["id"] | null>;
  searchUsers: (
    ...[query]: [string]
  ) => Promise<ApiUser.Fields["PartialFields"][] | null>;
  //
  getUserPosts: (
    ...[username]: [ApiUser.Fields["PartialFields"]["username"]]
  ) => Promise<ApiUser.Fields["PartialFields"][] | null>;
  toggleUserFollow: (
    ...[username]: [ApiUser.Fields["PartialFields"]["username"]]
  ) => Promise<ApiUser.Fields["PartialFields"] | null>;

  // storage
  getStoreItem: (...[key]: [string?]) => any;
  setStoreItem: (...[payload, key]: [string, string?]) => void;
  removeStoreItem: (...[key]: [string?]) => void;
};

const constants = {
  storageKeys: {
    user: "userData",
  },
};
const initialValues = {
  id: "",
  email: "",
  username: "",
  profileImage: "",
  firstName: "",
  lastName: "",
  bio: "",
  //
  following: false,
  followerCount: 0,
  followingCount: 0,
  userFollowers: [],
  userFollowing: [],
  isOurProfile: false,
  createdAt: "",
  formattedCreatedAt: "",
  //
  image: "",
  liked: false,
  likes: [],
  likeCount: 0,
  likeUsers: [],
  user: {},
};

// hooks
export const useUserHook = () => {
  const [data, setData] = useState<UserContextType["data"]>({});
  const [form, setForm] = useState<UserContextType["form"]>(initialValues);
  const [search, setSearch] = useState<UserContextType["search"]>([]);
  const [posts, setPosts] = useState<UserContextType["posts"]>([]);

  //
  const [loading, setLoading] = useState<UserContextType["loading"]>(false);
  const [modal, setModal] = useState<UserContextType["modal"]>(false);
  const [errors, setErrors] = useState<UserContextType["errors"]>([]);
  const [status, setStatus] = useState<UserContextType["status"]>("initial");

  //
  const keys = ApiUser.constants.inverted.all;
  type Params = ApiUser.ConvertKeyParams["toDefault"];
  const convertFields = (m: Params["1"]) => {
    let result = convertKeys<Params["1"], Params["2"], Params["3"]>(m, keys);
    return result;
  };
  const convertUserFields = (payload: ApiUser.InvertedFields["partial"]) => {
    let results = convertFields(payload);

    //
    if (typeof results?.user === "object") {
      const user = convertFields(results?.user);
      results["user"] = user;
    }
    if (results?.userFollowers && Array.isArray(results?.userFollowers)) {
      const userFollowers = results.userFollowers.map(
        (followers: ApiUser.InvertedFields["partial"]) => {
          const values = convertFields(followers);
          return values;
        }
      );

      results["userFollowers"] = userFollowers;
    }
    if (results?.userFollowing && Array.isArray(results?.userFollowing)) {
      const userFollowing = (results.userFollowing ?? []).map(
        (followers: ApiUser.InvertedFields["partial"]) => {
          const values = convertFields(followers);
          return values;
        }
      );
      results["userFollowing"] = userFollowing;
    }
    if (results?.likeUsers && Array.isArray(results?.likeUsers)) {
      const likeUsers = (results.likeUsers ?? []).map(
        (followers: ApiUser.InvertedFields["partial"]) => {
          const values = convertFields(followers);
          return values;
        }
      );
      results["likeUsers"] = likeUsers;
    }

    return results;
  };

  //
  const payloadLeys = ApiUser.constants.all;
  type PayloadParams = ApiUser.ConvertKeyParams["toInverse"];
  const convertPayloadFields = (m: PayloadParams["1"]) => {
    let result = convertKeys<
      PayloadParams["1"],
      PayloadParams["2"],
      PayloadParams["3"]
    >(m, payloadLeys);
    return result;
  };
  const convertPayloadUserFields = (
    payload: ApiUser.Fields["PartialFields"]
  ) => {
    let results = convertPayloadFields(payload);

    //
    if (typeof results?.user === "object") {
      const user = convertFields(results?.user);
      results["user"] = user;
    }
    if (results?.user_followers && Array.isArray(results?.user_followers)) {
      const user_followers = results.user_followers.map(
        (followers: ApiUser.Fields["PartialFields"]) => {
          const values = convertFields(followers);
          return values;
        }
      );

      results["user_followers"] = user_followers;
    }
    if (results?.user_following && Array.isArray(results?.user_following)) {
      const userFollowing = (results.user_following ?? []).map(
        (followers: ApiUser.Fields["PartialFields"]) => {
          const values = convertFields(followers);
          return values;
        }
      );
      results["user_following"] = userFollowing;
    }
    if (results?.like_users && Array.isArray(results?.like_users)) {
      const like_users = (results.like_users ?? []).map(
        (followers: ApiUser.Fields["PartialFields"]) => {
          const values = convertFields(followers);
          return values;
        }
      );
      results["like_users"] = like_users;
    }

    return results;
  };

  // api
  const getUser: UserContextType["getUser"] = async (username) => {
    try {
      setLoading(true);
      setErrors([]);

      // const payloadFormat = convertPayloadUserFields({ username });
      const response = await apiUser.getUser(username);
      const user = convertUserFields(response);

      setData(user);
      return user;
    } catch {
      const error = { message: "Failed to get user" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
    }
  };
  const createUser: UserContextType["createUser"] = async (payload) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      // const payloadFormat = convertPayloadUserFields(payload);

      return null;
    } catch {
      const error = { message: "Failed to create user" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const updateUser: UserContextType["updateUser"] = async (payload) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const { profileImage, ...rest } = payload;
      const validateImage =
        (profileImage as any) instanceof File ? profileImage : null;
      let payloadValidated = rest;
      if (validateImage) {
        payloadValidated = {
          ...payloadValidated,
          ...(validateImage ? { profileImage: validateImage } : {}),
        };
      }

      const payloadFormat = convertPayloadUserFields(payloadValidated);
      const response = await apiUser.updateUser(payloadFormat);
      const user = convertUserFields(response);

      const json = JSON.stringify(user);
      setStoreItem(json);

      setData((state) => {
        const newState = {
          ...state,
          ...user,
        };
        return newState;
      });

      return user;
    } catch {
      const error = { message: "Failed to update user" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const deleteUser: UserContextType["deleteUser"] = async (id) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      await apiUser.deleteUser(id);
      setData(initialValues);

      return id;
    } catch {
      const error = { message: "Failed to delete user" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const searchUsers: UserContextType["searchUsers"] = async (query) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const response = await apiUser.searchUsers(query);
      const users = response.map((m: ApiUser.InvertedFields["partial"]) => {
        let results = convertUserFields(m);
        return results;
      });

      setSearch(users);
      return users;
    } catch {
      const error = { message: "Failed to search users" };
      setErrors((state) => [...state, error]);
      return [];
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  //
  const getUserPosts: UserContextType["getUserPosts"] = async (query) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const response = await apiUser.getUserPosts(query);
      const posts = response.map((m: ApiUser.InvertedFields["partial"]) => {
        let results = convertUserFields(m);
        return results;
      });

      setPosts(posts);
      return posts;
    } catch {
      const error = { message: "Failed to delete post" };
      setErrors((state) => [...state, error]);
      return [];
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const toggleUserFollow: UserContextType["toggleUserFollow"] = async (
    username
  ) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const response = await apiUser.toggleUserFollow(username);
      const isFollowing = response?.following ?? false;

      let newState = {};
      if (isFollowing) {
        setData((state) => {
          newState = {
            ...(state ?? {}),
            followerCount: (state?.followerCount ?? 0) + 1,
            following: true,
          };

          return newState;
        });
      } else {
        setData((state) => {
          newState = {
            ...(state ?? {}),
            followerCount: (state?.followerCount ?? 0) - 1,
            following: false,
          };

          return newState;
        });
      }

      return { following: isFollowing };
    } catch {
      const error = { message: "Failed to toggle user follow" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  // storage
  const userKey = constants.storageKeys.user;
  const getStoreItem: UserContextType["getStoreItem"] = (key = userKey) => {
    const json = localStorage.getItem(key);
    const parsed = json ? JSON.parse(json) : null;

    return parsed;
  };
  const setStoreItem: UserContextType["setStoreItem"] = (
    payload,
    key = userKey
  ) => {
    localStorage.setItem(key, payload);
  };
  const removeStoreItem: UserContextType["removeStoreItem"] = (
    key = userKey
  ) => {
    localStorage.removeItem(key);
  };

  // hooks
  const api = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    //
    getUserPosts,
    toggleUserFollow,
  };
  const storage = {
    getStoreItem,
    setStoreItem,
    removeStoreItem,
  };

  const values = {
    data,
    form,
    search,
    posts,
    //
    loading,
    modal,
    errors,
    status,
  };
  const handlers = {
    setData,
    setForm,
    setSearch,
    setPosts,
    //
    setLoading,
    setModal,
    setErrors,
    setStatus,
    //
    ...api,
    ...storage,
  };
  const hooks = {
    ...values,
    ...handlers,
  };

  return hooks;
};

// contexts
const UserContext = createContext<UserContextType | undefined>(undefined);
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Missing user context");
  }

  return context;
};
export const UserProvider = ({ children }: UserProviderProps) => {
  const hook = useUserHook();

  const value = {
    ...hook,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserProvider;
