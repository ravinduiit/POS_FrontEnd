import axiosInstance from "./axiosInstance";

export const getProductList = async () => {
  const response = await axiosInstance.get("/products/list");
  return response.data;
};

export const getLowStockProductList = async () => {
  const response = await axiosInstance.post("/products/low_stock", {});
  return response.data;
};

export const toggleProductStatus = async (product_id) => {
  const response = await axiosInstance.patch("/products/toggle_status", {
    product_id,
  });

  return response.data;
};

export const addProduct = async (productData) => {
  const response = await axiosInstance.post("/products/add", productData);
  return response.data;
};

export const getSingleProduct = async (product_id) => {
  const response = await axiosInstance.post("/products/product_by_id", {
    product_id: Number(product_id),
  });

  return response.data;
};

export const updateProduct = async (productData) => {
  const response = await axiosInstance.patch("/products/update", productData);
  return response.data;
};

export const filterProducts = async (filterData) => {
  const response = await axiosInstance.post("/products/filter", filterData);
  return response.data;
};

export const updateProductStock = async (payload) => {
  const response = await axiosInstance.patch("/products/update-stock", payload);
  return response.data;
};
