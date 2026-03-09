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
  // Build payload according to priceType
  const payload = {
    name: data.name,
    categoryName: data.category,
    subCategory: data.subCategory,
    foodType: data.foodType,
    itemCode: data.itemCode,
    description: data.description,
    price:
      data.priceType === "HALF_FULL"
        ? {
            half: Number(data.priceHalf) || 0,
            full: Number(data.priceFull) || 0,
          }
        : undefined,
    variants: data.priceType === "VARIANT" ? data.variants : undefined,
    priceType: data.priceType,
  };

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
