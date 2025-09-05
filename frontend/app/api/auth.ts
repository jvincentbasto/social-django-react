import type { AxiosRequestConfig } from "axios";
import { baseApi } from "./base";
import type { ApiUser } from "./types";

const api = baseApi.api

// 
type Api = {
  register: (...[payload]: [ApiUser.InvertedFields["partial"]]) => Promise<any>
  login: (...[payload]: [ApiUser.InvertedFields["partial"]]) => Promise<any>
  logout: (...[]: []) => Promise<any>
  verifyAuth: (...[]: []) => Promise<any>
}

// main
const register: Api['register'] = async (payload) => {
  const options: AxiosRequestConfig<any> | undefined = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await api.post('/register/', payload, options);

  return response.data
}
const login: Api['login'] = async (payload) => {
  const response = await api.post("/token/", payload);
  return response.data;
};
const logout: Api['logout'] = async () => {
  const response = await api.post('/logout/')
  return response.data
}

// 
const verifyAuth: Api['verifyAuth'] = async () => {
  const response = await api.get(`/verify_auth/`);
  return response.data
}
const refreshToken = baseApi.refreshToken

export const apiAuth = {
  login,
  register,
  logout,
  verifyAuth,
  refreshToken
}