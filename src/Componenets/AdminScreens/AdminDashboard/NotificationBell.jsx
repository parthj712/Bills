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
          width: 40,
          height: 40,
          borderRadius: "12px",

          // CLEAN BACKGROUND
          backgroundColor: "#ffffff",

          // SOFT BORDER (instead of heavy shadow)
          border: "1px solid #e2e8f0",

          // VERY LIGHT SHADOW
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",

          transition: "all 0.2s ease",

          "&:hover": {
            backgroundColor: "#f8fafc",
            transform: "translateY(1px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },
        }}
      >
        <Badge
          badgeContent={unread}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: 10,
              height: 18,
              minWidth: 18,
              borderRadius: "50%",
            },
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
                fontSize: 20,
                color: "#0f172a",
                ":hover": { color: "#edc01c", transition: "color 0.2s ease" },
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
              // animation: "pulse 1.5s infinite",
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
