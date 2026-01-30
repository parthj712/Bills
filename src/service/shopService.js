import API from "./api";

export const getShopName = async () => {
  return await API.get("/shops/shop-name");
};
