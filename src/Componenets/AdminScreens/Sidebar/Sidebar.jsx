"use client";

import {
  Dashboard,
  TableBar,
  RestaurantMenu,
  Receipt,
  BarChart,
  People,
  Settings,
  MenuBook,
} from "@mui/icons-material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Assessment, ExpandMore } from "@mui/icons-material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import { useEffect, useState } from "react";
import { getShopName } from "@/service/shopService";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import LockIcon from "@mui/icons-material/Lock";
import UpdateIcon from "@mui/icons-material/Update";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CloseIcon from "@mui/icons-material/Close";
import { Badge } from "@mui/material";
import { getShopInfo } from "@/service/shopService";
import LiquorIcon from "@mui/icons-material/Liquor";

const reportItems = [
  {
    label: "Sales Report",
    href: "/admin/reports/salesreport",
    icon: <Assessment fontSize="small" />,
  },
  {
    label: "Item Report",
    href: "/admin/reports/itemsreport",
    icon: <Inventory2Icon fontSize="small" />,
  },
  {
    label: "Expense Report",
    href: "/admin/reports/expensereport",
    icon: <AccountBalanceWalletIcon fontSize="small" />,
  },
  {
    label: "Gst Report",
    href: "/admin/reports/gstreport",
    icon: <AccountBalanceWalletIcon fontSize="small" />,
  },
];

const settingsItem = {
  label: "Settings",
  href: "/admin/settings",
  icon: <Settings fontSize="small" />,
};

const helpItem = {
  label: "Help & Support",
  href: "/admin/help",
  icon: <MenuBook fontSize="small" />,
};

const incomingChangesItem = {
  label: "Incoming Features",
  href: "/admin/incoming-changes",
  icon: <NewReleasesIcon fontSize="small" />,
};

export default function Sidebar() {
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [openIncoming, setOpenIncoming] = useState(false);
  const [shopData, setShopData] = useState([]);
  const isDineIn = shopData?.businessCategory === "DINE_IN";
  const isBar = shopData?.businessCategory === "RESTO_BAR";
  const showTables =
    shopData?.businessCategory === "DINE_IN" ||
    shopData?.businessCategory === "RESTO_BAR";

  const allowedPlans = ["PREMIUM", "TRIAL"];

  const mainItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <Dashboard fontSize="small" />,
    },

    // show only for restaurants
    ...(showTables
      ? [
          {
            label: "Table Management",
            href: "/admin/tables",
            icon: <TableBar fontSize="small" />,
          },
        ]
      : []),

    // change label dynamically
    {
      label: showTables ? "Menu Management" : "Item Management",
      href: "/admin/menu",
      icon: <RestaurantMenu fontSize="small" />,
    },

    {
      label: "Billing & Payments",
      href: "/admin/bills",
      icon: <Receipt fontSize="small" />,
    },

    {
      label: "Staff Management",
      href: "/admin/staff",
      icon: <People fontSize="small" />,
    },
    {
      label: " Expense Tracker",
      href: "/admin/expense",
      icon: <AccountBalanceWalletIcon fontSize="small" />,
    },

    ...(isBar
      ? [
          {
            label: "Bar Inventory",
            href: "/admin/bar-inventory",
            icon: <LiquorIcon fontSize="small" />,
          },
        ]
      : []),

    {
      label: "Customers Info",
      href: "/admin/crm",
      icon: <Receipt fontSize="small" />,
    },
    {
      label: "Customer Feedbacks",
      href: "/admin/feedbacks",
      icon: <FeedbackIcon fontSize="small" />,
    },
  ];

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription.planType);

  const fetchSubscriptionExpiry = async () => {
    try {
      const res = await getSubscriptionExpiry();
      setSubscription(res.data);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoadingSub(false); // ✅ stop loading
    }
  };

  const pathname = usePathname();

  const [openReports, setOpenReports] = useState(
    pathname.startsWith("/admin/reports"),
  );

  const fetchShopInfo = async () => {
    try {
      const res = await getShopInfo();
      setShopData(res.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchShopInfo();
    fetchSubscriptionExpiry();
  }, []);
  console.log("shopinfo", shopData);

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
          fixed left-0 top-0
          w-64 h-screen
          bg-white border-r
          px-4 py-6
          hidden lg:flex flex-col
          overflow-hidden
        "
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <img src="/Logo.png" className="h-8" alt="Logo" />
      </div>
      <div className="border-t mb-4"></div>
      <Box className="mb-4 px-2">
        <motion.div className="relative overflow-hidden bg-orange-50 border-2 border-orange-200 rounded-xl p-2 text-center shadow-sm">
          {/* ✨ SHIMMER / MIRROR REFLECTION */}
          <motion.span
            initial={{ x: "-100%" }}
            animate={{ x: "120%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
            className="
              pointer-events-none
              absolute top-0 left-0
              h-full w-1/3
              bg-gradient-to-r
              from-transparent
              via-white/60
              to-transparent
              rotate-6
            "
          />

          {/* CONTENT */}
          <Typography fontSize={14} color="black">
            Logged in Shop
          </Typography>

          <Typography
            fontWeight={600}
            className="text-lg font-semibold text-orange-600 mt-1 truncate"
          >
            {shopData?.shopName || "Loading..."}
          </Typography>
        </motion.div>
      </Box>

      {/* MAIN NAV */}
      <nav className="space-y-4">
        {mainItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.label} href={item.href}>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-lg
              text-[15px] cursor-pointer
              ${isActive ? "font-semibold text-orange-600" : "text-black"}
            `}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded bg-orange-500"
                  />
                )}

                <motion.span whileHover={{ scale: 1.15 }}>
                  {item.icon}
                </motion.span>

                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div>
        <motion.div
          onClick={() => {
            if (!hasAccess) return;
            setOpenReports(!openReports);
          }}
          className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                   text-[15px] font-medium text-black hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Assessment fontSize="small" />
            <span>Reports</span>
          </div>

          <motion.span
            animate={hasAccess ? { rotate: openReports ? 180 : 0 } : {}}
            transition={{ duration: 0.25 }}
          >
            {hasAccess ? (
              <ExpandMore fontSize="small" />
            ) : (
              <LockIcon fontSize="small" className="text-gray-400" />
            )}
          </motion.span>
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            height: openReports ? "auto" : 0,
            opacity: openReports ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-2 space-y-1">
            {reportItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link key={item.label} href={item.href}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    className={`relative flex items-center gap-3 px-3 py-1.5 ml-4 rounded-lg
                            text-[14px] cursor-pointer
                            ${
                              isActive
                                ? "font-semibold text-orange-600"
                                : "text-gray-700"
                            }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded bg-orange-500"
                      />
                    )}

                    <motion.span whileHover={{ scale: 1.15 }}>
                      {item.icon}
                    </motion.span>

                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* SETTINGS AT BOTTOM */}
      <div className="mt-auto flex flex-col gap-4">
        <Box onClick={() => setOpenIncoming(true)}>
          <motion.div
            onClick={() => setOpenIncoming(true)}
            whileHover={{ x: 4, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl
  cursor-pointer transition-all duration-300 group
  bg-white hover:bg-orange-50 text-gray-700 overflow-hidden"
          >
            {/* ✨ MIRROR SHIMMER EFFECT */}
            <motion.span
              initial={{ x: "-120%" }}
              animate={{ x: "130%" }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "linear",
              }}
              className="
      pointer-events-none
      absolute top-0 left-0
      h-full w-1/3
      bg-gradient-to-r
      from-transparent
      via-white/60
      to-transparent
      skew-x-[-20deg]
      opacity-70
    "
            />

            {/* Animated Left Indicator */}
            <span
              className={`
      absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-300
      bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]
    `}
            />

            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-orange-500 relative z-10"
            >
              <UpdateIcon fontSize="small" />
            </motion.div>

            {/* Label */}
            <Box
              display="flex"
              flexDirection="column"
              textAlign="left"
              justifyContent="flex-start"
              className="relative z-10"
            >
              <span className="text-[15px] font-semibold tracking-wide">
                {incomingChangesItem.label}
              </span>
            </Box>
          </motion.div>
        </Box>

        <Box display={"flex"} flexDirection={"row-reverse"} gap={2}>
          <Link href={helpItem.href}>
            <motion.div
              whileHover={{ y: 4 }}
              className={`bg-gray-100 flex items-center gap-3 px-3 py-2 rounded-lg
      text-[14px] cursor-pointer
      ${
        pathname === helpItem.href
          ? "font-semibold text-orange-600"
          : "text-black"
      }`}
            >
              {helpItem.icon}
              {helpItem.label}
            </motion.div>
          </Link>

          <Link href={settingsItem.href}>
            <motion.div
              whileHover={{ y: 4 }}
              className={`bg-gray-100 ${pathname === settingsItem.href ? "bg-orange-100" : ""} flex items-center gap-3 px-3 py-2 rounded-lg
          text-[15px] cursor-pointer
          ${
            pathname === settingsItem.href
              ? "font-semibold text-orange-600"
              : "text-black"
          }
        `}
            >
              {settingsItem.icon}
              {/* {settingsItem.label} */}
            </motion.div>
          </Link>
        </Box>
      </div>

      <Dialog
        open={openIncoming}
        onClose={() => setOpenIncoming(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: 600,
            color: "#ea580c",
            background: "#fff7ed",
            borderBottom: "1px solid #fde3c8",
          }}
        >
          <Typography fontSize={16} fontWeight={600}>
            Exciting new features arriving soon to enhance your business
            operations.
          </Typography>

          <IconButton onClick={() => setOpenIncoming(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} my={3}>
            {[
              "Swiggy/Zomato Integration",
              "Advanced Inventory Alerts",
              "Auto Daily Profit Summary on WhatsApp",
              "Staff Performance Tracking",
              "CRM",
              "QR Table Ordering",
            ].map((feature, index) => (
              <Box
                key={feature}
                sx={{
                  p: 2.2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #fff7ed, #ffffff)",
                  border: "1px solid #fde3c8",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // 👈 Default soft shadow
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-3px) scale(1.02)", // 👈 Lift up instead of side move
                    boxShadow: "0 8px 20px rgba(249,115,22,0.2)", // 👈 Orange glow shadow
                    borderColor: "#fb923c",
                    background: "linear-gradient(135deg, #ffedd5, #ffffff)",
                  },
                }}
              >
                <Typography
                  fontWeight={600}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "color 0.3s ease",
                  }}
                >
                  🚀 {feature}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </motion.aside>
  );
}
