import API from "./api";

export const createNewTable = async (payload) => {
  const { data } = await API.post("/tables", payload);
  return data;
};

export const getTables = async () => {
  const { data } = await API.get("/tables");
  return data;
};

export const updateTable = async (id, data) => {
  return await API.put(`/tables/${id}`, data);
};

export const deleteTable = async (id) => {
  return await API.delete(`/tables/${id}`);
};

export const updateTableStatus = (tableId, status) => {
  return API.patch(`/tables/${tableId}/status`, { status });
};
