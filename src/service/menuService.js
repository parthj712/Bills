import API from "./api";

export const addMenuItem = async (form) => {
  const payload = {
    name: form.name,
    categoryName: form.category, // ✅ FIXED
    subCategory: form.subCategory,
    foodType: form.foodType,
    itemCode: form.itemCode,
    description: form.description,
    priceHalf: Number(form.priceHalf),
    priceFull: Number(form.priceFull),
  };
  const data = await API.post("/menu", payload);
  return data;
};

export const getMenuItems = async () => {
  return await API.get("/menu");
};

export const deleteMenuItem = async (id) => {
  const res = await API.delete(`/menu/${id}`);
  return res.data;
};

export const updateMenuItem = async (id, data) => {
  const payload = {
    name: data.name,
    categoryName: data.category,
    subCategory: data.subCategory,
    foodType: data.foodType,
    itemCode: data.itemCode,
    description: data.description,
    priceHalf: Number(data.priceHalf),
    priceFull: Number(data.priceFull),
  };

  const res = await API.put(`/menu/${id}`, payload);
  return res.data;
};

export const updateMenuAvailability = async (id, data) => {
  const res = await API.patch(`/menu/${id}/availability`, data);
  return res.data;
};
