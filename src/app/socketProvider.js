"use client";
import { useEffect } from "react";
import { getShopName } from "@/service/shopService";
import { socket } from "./lib/socket";
export default function SocketProvider({ children }) {
  useEffect(() => {
    const join = async () => {
      try {
        const res = await getShopName();
        const shopId = res.data?.data?.shopId;
        if (!shopId) return;
        socket.connect();
        socket.on("connect", () => {
          console.log("connected:", socket.id);
          socket.emit("joinShop", shopId);
        });
      } catch (err) {
        console.log(err);
      }
    };
    join();
    return () => {
      socket.disconnect();
    };
  }, []);
  return children;
}
