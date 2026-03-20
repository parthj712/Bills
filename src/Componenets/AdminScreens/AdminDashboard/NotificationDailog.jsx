"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

const NotificationDialog = ({
  open,
  onClose,
  notifications = [],
  onMarkRead,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 5,
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.9))",
          boxShadow:
            "0 30px 80px rgba(2,6,23,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2.2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "#fff",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <NotificationsRoundedIcon />
          <Typography fontWeight={700} fontSize={18}>
            Notifications
          </Typography>
        </Box>

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* CONTENT */}
      <DialogContent sx={{ p: 2 }}>
        {notifications.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No notifications yet 🚀
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {notifications.map((n) => (
              <Box
                key={n._id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: n.isRead ? "#f1f5f9" : "#e0f2fe",
                  border: "1px solid rgba(15,23,42,0.08)",
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  },
                }}
                onClick={() => !n.isRead && onMarkRead(n._id)}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontWeight={600}>{n.title}</Typography>

                  {!n.isRead && (
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>

                <Typography fontSize={14} color="text.secondary" mt={0.5}>
                  {n.message}
                </Typography>

                <Typography fontSize={11} color="gray" mt={1}>
                  {new Date(n.createdAt).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
