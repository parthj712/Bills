const { default: API } = require("./api");

export const finalizeBillAndOrder = async (payload) => {
  return await API.post("/bills/finalize", payload);
};
