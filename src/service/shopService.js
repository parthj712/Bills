import API from "./api";

export const getShopName = async () => {
  return await API.get("/shops/shop-name");
};

export const adminInfo = async () => {
  return await API.get("/staff/admin");
};

export const getShopInfo = async () => {
  return await API.get("/shops/shop-info");
};

export const addWebsite = async (payload) => {
  return await API.put("/shops/update-website", payload);
};

export const addTagline = async (payload) => {
  return await API.put("/shops/tagline", payload);
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

export const addOrUpdateGST = async (payload) => {
  return await API.post("/shops/gst-number", payload);
};

export const addOrUpdateFssai = async (payload) => {
  return await API.post("/shops/fssai-number", payload);
};
export const addOrUpdateVAT = async (payload) => {
  return await API.post("/shops/vat-number", payload);
};

export const generateFeedbackLink = async () => {
  return API.post("/shops/generate-feedback-slug");
};

export const getFeedbackLink = async () => {
  return API.get("/shops/feedback-link");
};
export const removeTagline = async () => {
  return await API.delete("/shops/tagline");
};

export const removeGST = async () => {
  return await API.delete("/shops/gst-number");
};
export const removeFSSAI = async () => {
  return await API.delete("/shops/fssai-number");
};
export const removeVAT = async () => {
  return await API.delete("/shops/vat-number");
};
export const removeWebsite = async () => {
  return await API.delete("/shops/website");
};
export const removeFeedbackSlug = async () => {
  return API.delete("/shops/feedback-slug");
};
