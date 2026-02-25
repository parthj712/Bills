import API from "./api";

export const getExpense = async () => {
  return await API.get("/expense");
};
export const addExpense = async (data) => {
  const res = await API.post("/expense", data);
  return res;
};

export const deleteExpense = async (id) => {
  return await API.delete(`/expense/${id}`);
};

export const getExpenseCategories = async () => {
  return await API.get("/expenseCategory");
};

export const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await API.post("/expense/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
