import type { User } from "@/types/User";
import api from "./axiosInstance";


export const registerUser = async (email: string, password: string) => {
  const response = await api.post('/users/register', { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get<{ user: User }>('/users/verify');
  return response.data;
};

export const logoutUser = async () => {
  await api.post('/users/logout');
};
