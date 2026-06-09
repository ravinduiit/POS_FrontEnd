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

export const id_name_list = async () => {
  const response = await axiosInstance.get("/customers/id_name_list");
  return response.data;
};

export const addCustomer = async (customerData) => {
  console.log("Adding customer with data:", customerData);
  const response = await axiosInstance.post("/customers/create", customerData);
  return response.data;
};

export const customerDetails = async (customer_id) => {
  const response = await axiosInstance.post("/customers/customer_details", {customer_id});
  return response.data;
}

export const getSingleCustomer = async (customer_id) => {
  const response = await axiosInstance.post("/customers/customer_details", {customer_id});
  return response.data;
}

export const getSaleById = async (sale_id) => {
  const res = await axiosInstance.post("/sales/getSaleDetailsById", {selling_id:sale_id});
  return res.data;
};
