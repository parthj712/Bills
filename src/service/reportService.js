import API from "./api";

export const gstSummary = async (fromDate, toDate) => {
  console.log(fromDate);
  return await API.get("/bills/gst/gst-summary", {
    params: { fromDate, toDate },
  });
};

export const getRatingsSummary = async () => {
  return await API.get("/feedback/feedback-summary");
};
