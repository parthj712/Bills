"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import {
  Avatar,
  Box,
  Card,
  Divider,
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
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NOTIFICATIONS } from "@/Componenets/ToastConstant/notifications";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import AddMenuItems from "@/Componenets/AdminScreens/AdminMenuManagement/AddMenuItems";

const WaiterNavbar = () => {


  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "#2563EB", // blue
      "#16A34A", // green
      "#DC2626", // red
      "#9333EA", // purple
      "#F59E0B", // amber
      "#0EA5E9", // sky
      "#EC4899", // pink
      "#14B8A6", // teal
    ];

    return colors[Math.abs(hash) % colors.length];
  };



  const { showSnackbar } = useAppSnackbar();

  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [kbAnchorEl, setKbAnchorEl] = useState(null);
  const [kbOpen, setKbOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAddMenu, setOpenAddMenu] = useState(false);

  //avatr mail

  const [userInitial, setUserInitial] = useState("A");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?.email) {
        setUserInitial(user.email);
      }
    }
  }, []);

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

    showSnackbar("Logout Sucessfull", "success");

    router.push("/login");
  };

  const handleKbOpen = () => {


    showSnackbar("Keyboard shortcuts opened", "info");
    setKbOpen(true);
  };

  const handleKbClose = () => setKbOpen(false);

  const handleOrderTypeClick = (orderType) => {


    showSnackbar(`${orderType} order selected`, "info");

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
          <div className="relative w-10 h-10">
            <Image
              src="/LogoIcon.png" // put logo inside /public folder
              alt="Billing Logo"
              fill
              className="object-contain rounded-full"
              priority
            />
          </div>

          <Typography fontSize={24} fontWeight={600}>
            Service Console
          </Typography>
        </Box>


        {(isMobile || isTablet) && (
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}

        {isDesktop && (
          <>
            {/* Right: Menu + Sign Out */}
            <div className="flex items-center gap-3">
              {isDesktop && (
                <>
                  <IconButton onClick={handleKbOpen}>
                    <KeyboardIcon />
                  </IconButton>

                  {/* Add Menu Item */}
                  <AppButton
                    startIcon={<RestaurantMenuRoundedIcon />}
                    label="Add Item"
                    onClick={() => setOpenAddMenu(true)}
                    sx={{
                      backgroundColor: "#0b3c5d",
                      color: "#fff",
                      fontWeight: 700,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#082c44",
                      },
                    }}
                  />

                  {/* Swiggy */}
                  <Box position="relative" display="inline-block">
                    <AppButton
                      label="Swiggy"
                      className="
                            !bg-[#FC8019]/80
                            !text-white
                            !px-5
                            opacity-80
                            cursor-not-allowed
                          "
                      disabled
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        backgroundColor: "#f97316",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                        px: 1,
                        py: "2px",
                        borderRadius: 1.5,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    >
                      Incoming
                    </Box>
                  </Box>

                  {/* Zomato */}
                  <Box position="relative" display="inline-block">
                    <AppButton
                      label="Zomato"
                      className="
                    !bg-[#E23744]/80
                    !text-white
                    !px-5
                    opacity-80
                    cursor-not-allowed
                  "
                      disabled
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        backgroundColor: "#dc2626",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                        px: 1,
                        py: "2px",
                        borderRadius: 1.5,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    >
                      Incoming
                    </Box>
                  </Box>
                </>
              )}

              <IconButton
                onClick={handleMenuOpen}
                sx={{ position: "relative" }}
              >
                <Box position="relative">
                  <Avatar
                    sx={{
                      bgcolor: stringToColor(userInitial || "A"),
                      fontWeight: 600,
                    }}
                  >

                    {userInitial.charAt(0).toUpperCase()}
                  </Avatar>

                  {/* 🟢 Online Status Dot */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#22c55e",
                      border: "2px solid white",
                    }}
                  />
                </Box>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    minWidth: 180,
                    p: 1,
                  },
                }}
              >
                {/* User Info */}
                <Box px={2} py={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    {userInitial}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Logged In
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Sign Out */}
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                  sx={{ borderRadius: 1 }}
                >
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </div>

            <Dialog
              open={kbOpen}
              onClose={handleKbClose}
              maxWidth="xs"
              fullWidth
            >
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



        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        >
          <Box width={250} p={2} display="flex" flexDirection="column" gap={2}>

            {/* User Info */}
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: stringToColor(userInitial || "A"),
                  fontWeight: 600,
                }}
              >
                {userInitial.charAt(0).toUpperCase()}
              </Avatar>

              <Box>
                <Typography fontWeight={600}>{userInitial}</Typography>
                <Typography fontSize={12} color="text.secondary">
                  Logged In
                </Typography>
              </Box>
            </Box>

            <Divider />

            <MenuItem
              onClick={() => {
                setMobileOpen(false);
                setOpenAddMenu(true);
              }}
              sx={{ borderRadius: 1 }}
            >
              <RestaurantMenuRoundedIcon fontSize="small" sx={{ mr: 1 }} />
              Add Menu Item
            </MenuItem>

            {/* Logout Button */}
            <MenuItem
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              sx={{ borderRadius: 1 }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Sign Out
            </MenuItem>

          </Box>
        </Drawer>


        <AddMenuItems
          open={openAddMenu}
          onClose={() => setOpenAddMenu(false)}
          onSuccess={() => {
            showSnackbar("Menu item added", "success");
          }}
        />


      </Card>
    </div>
  );
};

export default WaiterNavbar;
