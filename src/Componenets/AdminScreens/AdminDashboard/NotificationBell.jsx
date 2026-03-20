"use client";

import React, { useEffect, useState } from "react";
import { IconButton, Badge, Tooltip } from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { motion } from "framer-motion";

import { getUnreadCount } from "@/service/notificationService";

const NotificationBell = ({ onClick }) => {
  const [unread, setUnread] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await getUnreadCount();
      setUnread(res.unreadCount || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUnread();

    // 🔁 auto refresh every 10 sec
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip title="Notifications">
      <IconButton
        onClick={onClick}
        sx={{
          position: "relative",
          width: 48,
          height: 48,
          borderRadius: "14px",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          transition: "all 0.25s ease",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Badge
          badgeContent={unread}
          color="error"
          overlap="circular"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <motion.div
            animate={
              unread > 0 ? { rotate: [0, -10, 10, -6, 6, 0] } : { rotate: 0 }
            }
            transition={{ duration: 0.6 }}
          >
            <NotificationsRoundedIcon
              sx={{
                fontSize: 26,
                color: "#edc01c",
              }}
            />
          </motion.div>
        </Badge>

        {/* 🔴 Pulse Dot */}
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 0 4px rgba(239,68,68,0.3)",
              animation: "pulse 1.5s infinite",
            }}
          />
        )}

        {/* 🔥 Pulse animation */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.4); opacity: 0.6; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationBell;
