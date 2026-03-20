import API from "./api";

// 🔔 Get all notifications
export const getNotifications = async () => {
  const res = await API.get("/notification");
  return res.data;
};

// 🔴 Get unread count
export const getUnreadCount = async () => {
  const res = await API.get("/notification/unread-count");
  return res.data;
};

// ✅ Mark notification as read
export const markNotificationAsRead = async (id) => {
  const res = await API.patch(`/notification/${id}/read`);
  return res.data;
};
