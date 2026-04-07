import API from "./api";

export const addMenuItem = async (payload) => {
  const { data } = await API.post("/menu", payload);
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
    categoryName: data.categoryName, // ✅ FIXED
    subCategory: data.subCategory,
    foodType: data.foodType,
    itemCode: data.itemCode,
    description: data.description,
    priceType: data.priceType,
  };

  if (data.priceType === "HALF_FULL") {
    payload.priceHalf = Number(data.priceHalf) || 0;
    payload.priceFull = Number(data.priceFull) || 0;
  }

  if (data.priceType === "SINGLE") {
    payload.priceFull = Number(data.priceFull) || 0;
  }

  if (data.priceType === "VARIANT") {
    payload.variants = data.variants;
  }

  const res = await API.put(`/menu/${id}`, payload);
  return res.data;
};

export const updateMenuAvailability = async (id, data) => {
  const res = await API.patch(`/menu/${id}/availability`, data);
  return res.data;
};

export const getCatgories = async () => {
  return await API.get("/menu/categories");
};

export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await API.post("/menu/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteAllMenu = async () => {
  return await API.delete("/menu/all/delete-all");
};
