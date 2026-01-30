const { default: API } = require("./api");

export const finalizeBillAndOrder = async (payload) => {
  return await API.post("/bills/finalize", payload);
};

export const getOrders = async () => {
  return await API.get("/orders");
};
