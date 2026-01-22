import API from "./api";

export const getBills = async () => {
  return await API("/bills");
};
