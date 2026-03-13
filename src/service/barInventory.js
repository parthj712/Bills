import API from "./api";

export const getBarInventory = async () => {
  return await API.get("/bar-inventory");
};

export const createBarInventory = async (data) => {
  return await API.post("/bar-inventory/create", data);
};

export const addBarStock = async (data) => {
  return await API.post("/bar-inventory/add-stock", data);
};

export const getLiquorMenuItems = async () => {
  return await API.get("/menu/liquor-items");
};

export const deleteBarInventory = async (id) => {
  return await API.delete(`/bar-inventory/${id}`);
};
