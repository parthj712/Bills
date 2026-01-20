import API from "./api";

export const registerStaff = async (payload) => {
  const data = await API.post("/staff", payload);
  return data;
};

export const getStaff = async () => {
  const data = await API.get("/staff");
  return data;
};

export const updateStaff = (id, payload) => API.put(`/staff/${id}`, payload);

export const deleteStaff = (id) => API.delete(`/staff/${id}`);

export const toggleStaffStatus = (id) =>
  API.patch(`/staff/${id}/active-status`);
