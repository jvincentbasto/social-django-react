import { createContext, useContext } from "react";
import AuthProvider, {
  useAuth,
  useAuthHook,
  type AuthContextType,
} from "./useAuth";
import PostProvider, {
  usePost,
  usePostHook,
  type PostContextType,
} from "./usePost";
import UserProvider, {
  useUser,
  useUserHook,
  type UserContextType,
} from "./useUser";

interface AppProviderProps {
  children: React.ReactNode;
}
export type AppContextType = {
  auth: AuthContextType;
  user: UserContextType;
  post: PostContextType;
} | null;

const AppContext = createContext<AppContextType>(null);

//
export const useAppHook = () => {
  const auth = useAuthHook();
  const user = useUserHook();
  const post = usePostHook();

  const value = {
    auth,
    user,
    post,
  };

  return value;
};
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};
export const AppProvider = ({ children }: AppProviderProps) => {
  const hooks = useAppHook();

  const value = {
    ...hooks,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppProvider;

//
const MultiAppContextComposer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useAuth();
  const user = useUser();
  const post = usePost();

  const value = {
    auth,
    user,
    post,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const MultiAppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <MultiAppContextComposer>{children}</MultiAppContextComposer>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
};
