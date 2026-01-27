import API from "./api";

export const getSubscriptionExpiry = () => {
  return API.get("/auth/subscription/expiry");
};
