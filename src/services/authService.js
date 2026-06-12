import { jwtDecode } from "jwt-decode";
import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_BASE_URL = "http://localhost:3000/api";

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken,
  });

  return response.data;
};

export const saveLoginData = (data) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("isLoggedIn", "true");

  saveUserFromToken(data.accessToken);
};

export const saveNewAccessToken = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("isLoggedIn", "true");

  saveUserFromToken(accessToken);
};

export const saveUserFromToken = (accessToken) => {
  const decodedUser = jwtDecode(accessToken);

  localStorage.setItem("userName", decodedUser.name);
  localStorage.setItem("userEmail", decodedUser.email);
  localStorage.setItem("userRole", decodedUser.role);
  localStorage.setItem("userId", decodedUser.userId);
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isLoggedIn");

  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
};

export const isUserLoggedIn = () => {
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!token && !refreshToken) {
    return false;
  }

  if (refreshToken) {
    return true;
  }

  return false;
};

export const isAccessTokenValid = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getLoggedUserName = () => {
  return localStorage.getItem("userName");
};

export const getLoggedUserEmail = () => {
  return localStorage.getItem("userEmail");
};

export const getLoggedUserRole = () => {
  return localStorage.getItem("userRole");
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};