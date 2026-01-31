import API from "./api";

export const getShopName = async () => {
  return await API.get("/shops/shop-name");
};

export const adminInfo = async () => {
  return await API.get("/staff/admin");
};

export const addWebsite = async (payload) => {
  return await API.put("/shops/update-website", payload);
};
