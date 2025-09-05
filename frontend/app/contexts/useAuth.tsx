import { createContext, useContext, useState, useEffect } from "react";
import { apiAuth } from "~/api/auth";
import { useNavigate, useLocation } from "react-router";
import { ApiRegister, ApiLogin, ApiUser } from "~/api/types";
import { convertKeys } from "~/utils/utils";

interface AuthProviderProps {
  children: React.ReactNode;
}
type DispatchType<T> = React.Dispatch<React.SetStateAction<T>>;
export type AuthContextType = {
  dataUser: ApiUser.Fields["PartialFields"] | null;
  formRegister: ApiRegister.Fields["PartialFields"] | null;
  formLogin: ApiLogin.Fields["PartialFields"] | null;

  //
  loggedIn: boolean;
  loading: boolean;
  modal: boolean;
  errors: Record<string, any>[];
  status: "initial" | "pending" | "success" | "failed";

  // dispatch
  setDataUser: DispatchType<AuthContextType["dataUser"]>;
  setFormRegister: DispatchType<AuthContextType["formRegister"]>;
  setFormLogin: DispatchType<AuthContextType["formLogin"]>;
  //
  setLoggedIn: DispatchType<AuthContextType["loggedIn"]>;
  setLoading: DispatchType<AuthContextType["loading"]>;
  setModal: DispatchType<AuthContextType["modal"]>;
  setErrors: DispatchType<AuthContextType["errors"]>;
  setStatus: DispatchType<AuthContextType["status"]>;

  // api
  register: (
    ...[payload]: [ApiRegister.Fields["PartialFields"]]
  ) => Promise<ApiRegister.Fields["PartialFields"] | null>;
  login: (
    ...[payload]: [ApiLogin.Fields["PartialFields"]]
  ) => Promise<ApiLogin.Fields["PartialFields"] | null>;
  logout: (...[]: []) => Promise<boolean | null>;
  verifyAuth: (...[]: []) => Promise<null>;

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
  user: {
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
  },
  register: {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  },
  login: {
    username: "",
    password: "",
  },
};

// hooks
export const useAuthHook = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataUser, setDataUser] = useState<AuthContextType["dataUser"]>(
    initialValues.user
  );
  const [formRegister, setFormRegister] = useState<
    AuthContextType["formRegister"]
  >(initialValues.register);
  const [formLogin, setFormLogin] = useState<AuthContextType["formLogin"]>(
    initialValues.login
  );

  //
  const [loggedIn, setLoggedIn] = useState<AuthContextType["loggedIn"]>(false);
  const [loading, setLoading] = useState<AuthContextType["loading"]>(false);
  const [modal, setModal] = useState<AuthContextType["modal"]>(false);
  const [errors, setErrors] = useState<AuthContextType["errors"]>([]);
  const [status, setStatus] = useState<AuthContextType["status"]>("initial");

  //
  const registerKeys = ApiRegister.constants.inverted.all;
  type RegisterParams = ApiRegister.ConvertKeyParams["toDefault"];
  const loginKeys = ApiLogin.constants.inverted.all;
  type LoginParams = ApiLogin.ConvertKeyParams["toDefault"];
  const userKeys = ApiUser.constants.inverted.all;
  type UserParams = ApiUser.ConvertKeyParams["toDefault"];

  //
  const convertFieldRegister = (m: RegisterParams["1"]) => {
    let result = convertKeys<
      RegisterParams["1"],
      RegisterParams["2"],
      RegisterParams["3"]
    >(m, registerKeys);
    return result;
  };
  const convertFieldLogin = (m: LoginParams["1"]) => {
    let result = convertKeys<
      LoginParams["1"],
      LoginParams["2"],
      LoginParams["3"]
    >(m, loginKeys);
    return result;
  };
  const convertFieldUser = (m: UserParams["1"]) => {
    let result = convertKeys<UserParams["1"], UserParams["2"], UserParams["3"]>(
      m,
      userKeys
    );
    return result;
  };

  //
  const payloadRegisterKeys = ApiRegister.constants.all;
  type PayloadRegisterParams = ApiRegister.ConvertKeyParams["toInverse"];
  const payloadLoginKeys = ApiLogin.constants.all;
  type PayloadLoginParams = ApiLogin.ConvertKeyParams["toInverse"];

  //
  const convertPayloadFieldRegister = (m: PayloadRegisterParams["1"]) => {
    let result = convertKeys<
      PayloadRegisterParams["1"],
      PayloadRegisterParams["2"],
      PayloadRegisterParams["3"]
    >(m, payloadRegisterKeys);
    return result;
  };
  const convertPayloadFieldLogin = (m: PayloadLoginParams["1"]) => {
    let result = convertKeys<
      PayloadLoginParams["1"],
      PayloadLoginParams["2"],
      PayloadLoginParams["3"]
    >(m, payloadLoginKeys);
    return result;
  };

  // api
  const register: AuthContextType["register"] = async (payload) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const payloadFormat = convertPayloadFieldRegister(payload);
      const response = await apiAuth.register(payloadFormat);
      let user = convertFieldRegister(response.results);
      user = convertFieldUser(user);

      setDataUser((state) => {
        return { ...state, ...user };
      });

      return null;
    } catch {
      const error = { message: "Failed to register" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const login: AuthContextType["login"] = async (payload) => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      const payloadFormat = convertPayloadFieldLogin(payload);
      const response = await apiAuth.login(payloadFormat);
      const user = convertFieldUser(response.user);

      const storeUser = { ...user, loggedIn: true };
      const json = JSON.stringify(storeUser);
      setStoreItem(json);

      setDataUser((state) => {
        return { ...state, ...storeUser };
      });

      return user;
    } catch {
      const error = { message: "Failed to login" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const logout: AuthContextType["logout"] = async () => {
    try {
      setLoading(true);
      setModal(true);
      setErrors([]);

      await apiAuth.logout();
      setLoggedIn(false);
      setDataUser(initialValues.user);
      removeStoreItem();

      return null;
    } catch {
      const error = { message: "Failed to logout" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
      setModal(false);
    }
  };
  const verifyAuth: AuthContextType["verifyAuth"] = async () => {
    try {
      setLoading(true);

      await apiAuth.verifyAuth();
      setLoggedIn(true);

      return null;
    } catch {
      const error = { message: "Failed to verify user" };
      setErrors((state) => [...state, error]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // storage
  const userKey = constants.storageKeys.user;
  const getStoreItem: AuthContextType["getStoreItem"] = (key = userKey) => {
    const json = localStorage.getItem(key);
    const parsed = json ? JSON.parse(json) : null;

    return parsed;
  };
  const setStoreItem: AuthContextType["setStoreItem"] = (
    payload,
    key = userKey
  ) => {
    localStorage.setItem(key, payload);
  };
  const removeStoreItem: AuthContextType["removeStoreItem"] = (
    key = userKey
  ) => {
    localStorage.removeItem(key);
  };

  // on mount
  useEffect(() => {
    verifyAuth();

    const user = getStoreItem();
    if (user) {
      setDataUser(user);
    }
  }, [location.pathname]);

  //
  const keys = {
    constants,
    initialValues,
  };
  // hooks
  const api = {
    register,
    login,
    logout,
    verifyAuth,
  };
  const storage = {
    getStoreItem,
    setStoreItem,
    removeStoreItem,
  };

  //
  const values = {
    ...keys,
    dataUser,
    formRegister,
    formLogin,
    //
    loggedIn,
    loading,
    modal,
    errors,
    status,
  };
  const handlers = {
    setDataUser,
    setFormRegister,
    setFormLogin,
    //
    setLoggedIn,
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
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Missing auth context");
  }

  return context;
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const hooks = useAuthHook();

  const value = {
    ...hooks,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
