import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/Home.tsx"),
  route("login", "routes/auth/Login.tsx"),
  route("register", "routes/auth/Register.tsx"),
  route("post", "routes/post/PostLayout.tsx", [
    route("create", "routes/post/PostCreate.tsx"),
    route("update/:id", "routes/post/PostUpdate.tsx"),
    // route("delete/:id", "routes/post/PostDelete.tsx"),
  ]),
  route(":user", "routes/user/UserLayout.tsx", [
    route("", "routes/user/UserProfile.tsx"),
  ]),
  route("settings", "routes/user/UserSettings.tsx"),
  route("search", "routes/Search.tsx"),
  route("*", "routes/NotFound.tsx")
] satisfies RouteConfig;
