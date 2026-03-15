"use client";

import {
  Dashboard,
  TableBar,
  RestaurantMenu,
  Receipt,
  People,
  Settings,
  ExpandMore,
  Assessment,
  MenuBook,
} from "@mui/icons-material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getShopInfo } from "@/service/shopService";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import LockIcon from "@mui/icons-material/Lock";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box, Typography } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

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

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();
  const [openReports, setOpenReports] = useState(false);
  const [shopCategory, setShopCategory] = useState(null);
  const isDineIn = shopCategory === "DINE_IN";
  const isBar = shopCategory === "RESTO_BAR";

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const [shopData, setShopData] = useState([]);

  const allowedPlans = ["PREMIUM", "TRIAL"];

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription?.planType);

  const mainItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <Dashboard fontSize="small" />,
    },

    // Only restaurants should see tables
    ...(isDineIn
      ? [
          {
            label: "Table Management",
            href: "/admin/tables",
            icon: <TableBar fontSize="small" />,
          },
        ]
      : []),

    // Dynamic naming
    {
      label: isDineIn ? "Menu Management" : "Item Management",
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
      icon: <ReceiptLongIcon fontSize="small" />,
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

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [pathname]);

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const res = await getShopInfo();
        setShopCategory(res.data?.data?.businessCategory);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchShopInfo();
  }, []);

  useEffect(() => {
    const fetchSubscriptionExpiry = async () => {
      try {
        const res = await getSubscriptionExpiry();
        setSubscription(res.data);
      } catch (error) {
        console.log(error?.message || error);
      } finally {
        setLoadingSub(false);
      }
    };

    fetchSubscriptionExpiry();
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed top-0 left-0 z-50 w-64 h-screen bg-white px-4 py-5 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 mx-3 ">
              <img src="/LogoIcon.png" className="h-5" alt="Logo" />
              <CloseIcon
                onClick={onClose}
                className="cursor-pointer text-gray-600"
              />
            </div>

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

            {/* Main Nav */}
            <nav className="space-y-2">
              {mainItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
                      ${isActive ? "text-orange-600 font-semibold" : "text-gray-800"}
                      `}
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Reports */}
            <div>
              <div
                onClick={() => {
                  if (!hasAccess) return;
                  setOpenReports(!openReports);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-black"
              >
                <div className="flex items-center gap-3">
                  <Assessment fontSize="small" />
                  <span className="text-[16px]">Reports</span>
                </div>

                <motion.span
                  animate={hasAccess ? { rotate: openReports ? 180 : 0 } : {}}
                >
                  {hasAccess ? (
                    <ExpandMore fontSize="small" />
                  ) : (
                    <LockIcon fontSize="small" className="text-gray-400" />
                  )}
                </motion.span>
              </div>

              <AnimatePresence>
                {openReports && hasAccess && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-2 space-y-1 overflow-hidden"
                  >
                    {reportItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link key={item.label} href={item.href}>
                          <div
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px]
                ${isActive ? "text-orange-600 font-semibold" : "text-black"}`}
                          >
                            {item.icon}
                            {item.label}
                          </div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings */}
            <div className="mt-auto pt-4 border-t">
              <Link href="/admin/settings">
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
      ${
        pathname === "/admin/settings"
          ? "text-orange-600 font-semibold"
          : "text-gray-800"
      }
      `}
                >
                  <Settings fontSize="small" />
                  Settings
                </div>
              </Link>

              <Link href="/admin/help">
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
      ${
        pathname === "/admin/help"
          ? "text-orange-600 font-semibold"
          : "text-gray-800"
      }
      `}
                >
                  <MenuBook fontSize="small" />
                  Help & Support
                </div>
              </Link>

              <Link href="/admin/incoming-changes">
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[16px]
      ${
        pathname === "/admin/help"
          ? "text-orange-600 font-semibold"
          : "text-gray-800"
      }
      `}
                >
                  <NewReleasesIcon fontSize="small" />
                  Incoming Features
                </div>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
