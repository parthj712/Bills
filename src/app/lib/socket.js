import { io } from "socket.io-client";

let currentShopId = null;

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

export const connectSocket = (shopId) => {
  currentShopId = shopId;

  if (!socket.connected) {
    socket.connect();
  }
};

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);

  if (currentShopId) {
    socket.emit("joinShop", currentShopId);
  }
});

socket.on("reconnect", () => {
  console.log("Socket reconnected");

  if (currentShopId) {
    socket.emit("joinShop", currentShopId);
  }
});
