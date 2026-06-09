import axiosInstance from "./axiosInstance";

export const brandlst = async () => {
  const response = await axiosInstance.get("/brand/list");
  return response.data;
};

export const addBrand = async (brandData) => {
  const response = await axiosInstance.post("/brand/add", brandData);
  return response.data;
};

export const categorylist = async () => {
  const response = await axiosInstance.get("/category/list");
  return response.data;
};

export const addCategory = async (categoryData) => {
  const response = await axiosInstance.post("/category/add", categoryData);
  return response.data;
};