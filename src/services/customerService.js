import axiosInstance from "./axiosInstance";

export const getCustomerList = async () => {
  console.log("Fetching customer list...");
  const response = await axiosInstance.get("/customers/list");
  console.log("Customer list fetched:", response.data);
  return response.data;
};

export const toggleCustomerStatus = async (customer_id) => {
  const response = await axiosInstance.post(`/customers/toggle_status`, {
    customer_id,
  });
  return response.data;
};

export const filterCustomers = async (filters) => {
  console.log("Filtering customers...", filters);
  const response = await axiosInstance.post("/customers/filter", filters);
  console.log("Filtered customers fetched:", response.data);
  return response.data;
};
