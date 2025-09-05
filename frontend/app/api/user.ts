import type { AxiosRequestConfig } from "axios";
import { baseApi } from "./base";
import type { ApiUser } from "./types";

const api = baseApi.api

// 
type Api = {
  getUser: (...[username]: [ApiUser.InvertedFields["partial"]['username']]) => Promise<any>
  createUser: (...[payload]: [ApiUser.InvertedFields["partial"]]) => Promise<any>
  updateUser: (...[payload]: [ApiUser.InvertedFields["partial"]]) => Promise<any>
  deleteUser: (...[id]: [ApiUser.InvertedFields['main']['id']]) => Promise<any>
  searchUsers: (...[query]: [string]) => Promise<any>
  // 
  getUserPosts: (...[username]: [ApiUser.InvertedFields["partial"]['username']]) => Promise<any>
  toggleUserFollow: (...[username]: [ApiUser.InvertedFields["partial"]['username']]) => Promise<any>
}


// main
const getUser: Api['getUser'] = async (username) => {
  const response = await api.get(`/user/${username}/`);
  return response.data
}
const createUser: Api['createUser'] = async (payload) => {
  const options: AxiosRequestConfig<any> | undefined = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await api.post('/user/create', payload, options)
  return response.data
}
const updateUser: Api['updateUser'] = async (payload) => {
  const options: AxiosRequestConfig<any> | undefined = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await api.patch('/user/update', payload, options)
  return response.data
}
const deleteUser: Api['deleteUser'] = async (id) => {
  const response = await api.delete(`/user/${id}/`);
  return response.data
}
const searchUsers: Api['searchUsers'] = async (query) => {
  const response = await api.get(`/user/search?query=${query}`)
  return response.data
}

// 
const getUserPosts: Api['getUserPosts'] = async (username) => {
  const response = await api.get(`/user/posts/${username}/`);
  return response.data
}
const toggleUserFollow: Api['toggleUserFollow'] = async (username) => {
  const response = await api.post('/user/follow', { username });
  return response.data
}


export const apiUser = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  // 
  getUserPosts,
  toggleUserFollow
}