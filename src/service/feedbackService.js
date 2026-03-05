import API from "./api";

export const getFeedbacks = async () => {
  return await API.get("/feedback");
};
export const updateResovleStatus = async (id) => {
  return await API.patch(`/feedback/resolve/${id}`);
};
