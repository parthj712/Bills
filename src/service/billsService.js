import API from "./api";

export const getBills = async () => {
  return await API("/bills");
};

export const getDashboardSummary = async () => {
  return await API("/dashboard/summary");
};
