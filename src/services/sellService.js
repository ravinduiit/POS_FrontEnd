import axiosInstance from "./axiosInstance";

export const searchProductsForSale = async (keyword) => {
  const response = await axiosInstance.post("/products/search", {
    keyword: keyword
  });

  return response.data;
};

export const createSale = async (saleData) => {
  const response = await axiosInstance.post("/sales/createSale", saleData);
  return response.data;
};