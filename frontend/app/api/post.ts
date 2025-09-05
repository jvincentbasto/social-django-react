import type { AxiosRequestConfig } from "axios";
import { baseApi } from "./base";
import type { ApiPost } from "./types";

const api = baseApi.api

// 
type Api = {
  getPosts: (...[page]: [number]) => Promise<any>
  createPost: (...[payload]: [ApiPost.InvertedFields["partial"]]) => Promise<any>
  getPostById: (...[id]: [ApiPost.InvertedFields["partial"]['id']]) => Promise<any>
  updatePost: (...[payload]: [ApiPost.InvertedFields["partial"]]) => Promise<any>
  deletePost: (...[id]: [ApiPost.InvertedFields['main']['id']]) => Promise<any>
  toggleLike: (...[id]: [ApiPost.InvertedFields['main']['id']]) => Promise<any>
}

// main
const getPosts: Api['getPosts'] = async (page) => {
  const query = `page=${page}`
  const response = await api.get(`/posts/?${query}`)
  return response.data
}
const createPost: Api['createPost'] = async (payload) => {
  const options: AxiosRequestConfig<any> | undefined = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await api.post('/post/create/', payload, options)
  return response.data
}
const getPostById: Api['getPostById'] = async (id) => {
  const response = await api.get(`/post/${id}/`)
  return response.data
}
const updatePost: Api['updatePost'] = async (payload) => {
  const { id } = payload
  const options: AxiosRequestConfig<any> | undefined = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  const response = await api.patch(`/post/${id}/update/`, payload, options)
  return response.data
}
const deletePost: Api['deletePost'] = async (id) => {
  const response = await api.delete(`/post/${id}/delete/`)
  return response.data
}

// 
const toggleLike: Api['toggleLike'] = async (id) => {
  const payload = { id: id }
  const response = await api.post('/post/like/', payload)
  return response.data
}

export const apiPost = {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
}