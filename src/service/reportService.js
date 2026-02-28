import API from "./api";

export const gstSummary = async (fromDate, toDate) => {
  console.log(fromDate);
  return await API.get("/bills/gst/gst-summary", {
    params: { fromDate, toDate },
  });
};
