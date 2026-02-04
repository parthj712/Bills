const { default: API } = require("./api");

export const finalizeBillAndOrder = async (payload) => {
  return await API.post("/bills/finalize", payload);
};

export const getOrders = async () => {
  return await API.get("/orders");
};

export const saveOrdersToDraft = async (payload) => {
  return await API.post("/orders/draft", payload);
};

export const fetchActiveOrder = async (tableId) => {
  return await API.get(`/orders/active?tableId=${tableId}`);
};
