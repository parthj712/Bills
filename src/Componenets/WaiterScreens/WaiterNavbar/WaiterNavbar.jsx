"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NOTIFICATIONS } from "@/Componenets/ToastConstant/notifications";
import { showToast } from "@/Componenets/ToastConstant/toast";

const WaiterNavbar = () => {

  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [kbAnchorEl, setKbAnchorEl] = useState(null);
  const [kbOpen, setKbOpen] = useState(false);
  const router = useRouter();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // clear auth
    localStorage.removeItem("token"); // or cookies

    showToast(NOTIFICATIONS.AUTH.LOGOUT_SUCCESS);

    router.push("/login");
  };

  const handleKbOpen = () => {
    showToast({
      type: "info",
      message: "Keyboard shortcuts opened",
    });
    setKbOpen(true);
  };

  const handleKbClose = () => setKbOpen(false);

  const handleOrderTypeClick = (orderType) => {
    showToast({
      type: "info",
      message: `${orderType} order selected`,
    });

    router.push(`/waiter/order?orderType=${orderType}`);
  };

  const ShortcutRow = ({ label, keys }) => (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <kbd className="bg-gray-100 px-2 py-1 rounded font-semibold">{keys}</kbd>
    </div>
  );

  return (
    <div>
      <Card className="mb-6 px-6 py-3 rounded-2xl flex items-center justify-between shadow-sm">
        {/* Left: Logo */}
        <Box
          display={"flex"}
          flexDirection={"row"}
          gap={2}
          alignItems={"center"}
        >
          <div className="relative w-8 h-10">
            <Image
              src="/LogoIcon.png" // put logo inside /public folder
              alt="Billing Logo"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>

          <Typography fontSize={24} fontWeight={600}>
            Billing | Waiter Panel
          </Typography>
        </Box>

        {isDesktop && (
          <>
            {/* Right: Menu + Sign Out */}
            <div className="flex items-center gap-3">
              <IconButton onClick={handleKbOpen}>
                <KeyboardIcon />
              </IconButton>

              <AppButton
                label="Swiggy"
                className="
              !bg-[#FC8019]
              !text-white
              !px-5
              hover:!bg-[#e56f15]
            "
                onClick={() => handleOrderTypeClick("SWIGGY")}
              />

              <AppButton
                label="Zomato"
                className="
              !bg-[#E23744]
              !text-white
              !px-5
              hover:!bg-[#c92f3a]
            "
                onClick={() => handleOrderTypeClick("ZOMATO")}
              />

              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    bgcolor: "#2563EB", // Indigo / Blue
                    fontWeight: 600,
                  }}
                >
                  A
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" className="mr-2" />
                  Sign Out
                </MenuItem>
              </Menu>
            </div>

            <Dialog open={kbOpen} onClose={handleKbClose} maxWidth="xs" fullWidth>
              <DialogTitle className="flex items-center justify-between">
                <Typography fontWeight={600}>Keyboard Shortcuts</Typography>

                <IconButton onClick={handleKbClose}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent>
                <div className="flex flex-col gap-3 text-sm">
                  <ShortcutRow label="Select Table" keys="1 – 99" />
                  <ShortcutRow label="Takeaway" keys="T" />
                  <ShortcutRow label="Swiggy Orders" keys="S" />
                  <ShortcutRow label="Zomato Orders" keys="Z" />
                  <ShortcutRow label="Close Dialog" keys="ESC" />
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </Card>
    </div>
  );
};

export default WaiterNavbar;
