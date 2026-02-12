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

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Assessment, ExpandMore } from "@mui/icons-material";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { useEffect, useState } from "react";
import { getShopName } from "@/service/shopService";
import { Box, Typography } from "@mui/material";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import LockIcon from "@mui/icons-material/Lock";


const mainItems = [
  { label: "Dashboard", href: "/admin", icon: <Dashboard fontSize="small" /> },
  {
    label: "Table Management",
    href: "/admin/tables",
    icon: <TableBar fontSize="small" />,
  },
  {
    label: "Menu Management",
    href: "/admin/menu",
    icon: <RestaurantMenu fontSize="small" />,
  },
  // {
  //   label: "Order Management",
  //   href: "/admin/orders",
  //   icon: <MenuBook fontSize="small" />,
  // },
  {
    label: "Billing & Payments",
    href: "/admin/bills",
    icon: <Receipt fontSize="small" />,
  },
  // {
  //   label: "Analytics & Graphs",
  //   href: "/admin/analytics",
  //   icon: <BarChart fontSize="small" />,
  // },
  {
    label: "Staff Management",
    href: "/admin/staff",
    icon: <People fontSize="small" />,
  },
];

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
  // {
  //   label: "GST Report",
  //   href: "/admin/reports/gst",
  //   icon: <Receipt fontSize="small" />,
  // },
  // {
  //   label: "Staff Report",
  //   href: "/admin/reports/staff",
  //   icon: <Group fontSize="small" />,
  // },
  // {
  //   label: "Daily Summary",
  //   href: "/admin/reports/daily",
  //   icon: <Today fontSize="small" />,
  // },
];

const settingsItem = {
  label: "Settings",
  href: "/admin/settings",
  icon: <Settings fontSize="small" />,
};

export default function Sidebar() {

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const allowedPlans = ["PREMIUM", "TRIAL", "STANDARD"];

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


  const [shopName, setShopName] = useState("");
  const pathname = usePathname();
  const fetchShopName = async () => {
    try {
      const res = await getShopName();
      console.log("shopname", res.data);
      setShopName(res.data?.data?.shopName);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchShopName();
    fetchSubscriptionExpiry();
  }, []);
  const [openReports, setOpenReports] = useState(
    pathname.startsWith("/admin/reports"),
  );

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
        "
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <img src="/Logo.png" className="h-8" alt="Logo" />
      </div>
      <div className="border-t mb-4"></div>
      <Box className="mb-8 px-3">
        <motion.div
          className="relative overflow-hidden bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center shadow-sm"
        >
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
            {shopName || "Loading..."}
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
              text-[17px] cursor-pointer
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
                   text-[17px] font-medium text-black hover:bg-gray-50"
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
                    className={`relative flex items-center gap-3 px-3 py-2 ml-4 rounded-lg
                            text-[15px] cursor-pointer
                            ${isActive
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
      <div className="mt-auto">
        <Link href={settingsItem.href}>
          <motion.div
            whileHover={{ x: 6 }}
            className={`bg-gray-100 ${pathname === settingsItem.href ? "bg-orange-100" : ""} flex items-center gap-3 px-3 py-2 rounded-lg
          text-[17px] cursor-pointer
          ${pathname === settingsItem.href
                ? "font-semibold text-orange-600"
                : "text-black"
              }
        `}
          >
            {settingsItem.icon}
            {settingsItem.label}
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}
