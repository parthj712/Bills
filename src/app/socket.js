import { io } from "socket.io-client";

export const socket = io("https://billing-web-app-sdr9.onrender.com", {
  autoConnect: false,
});

export const connectSocket = (shopId) => {
  console.log("socket", shopId);
  if (!socket.connected) {
    socket.connect();
    socket.emit("joinShop", shopId);
  }
};
