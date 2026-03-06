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

export const updateTableStatus = async (tableId, status) => {
  return await API.patch(`/tables/${tableId}/status`, { status });
};

export const createSection = async (payload) => {
  return await API.post("/section", payload);
};
export const getTableSection = async () => {
  return await API.get("/section");
};
