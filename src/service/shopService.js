import API from "./api";

export const getShopName = async () => {
  return await API.get("/shops/shop-name");
};

export const adminInfo = async () => {
  return await API.get("/staff/admin");
};

export const getShofInfo = async () => {
  return await API.get("/shops/shop-info");
};

export const addWebsite = async (payload) => {
  return await API.put("/shops/update-website", payload);
};

export const uploadShopLogo = async (file) => {
  const formData = new FormData();
  formData.append("logo", file);

  return await API.post("/shops/upload-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadShopQR = async (file) => {
  const formData = new FormData();
  formData.append("qr", file);

  return await API.post("/shops/upload-qr", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const removeShopLogo = async () => {
  return await API.delete("/shops/logo");
};

export const removeShopQR = async () => {
  return await API.delete("/shops/qr");
};
