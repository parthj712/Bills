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
  }, []);
  const [openReports, setOpenReports] = useState(
    pathname.startsWith("/admin/reports"),
  );

  return (
    <motion.aside
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-64 bg-white border-r px-4 py-6 hidden md:flex flex-col h-screen overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <img src="/Logo.png" className="h-8" alt="Logo" />
      </div>
      <div className="border-t mb-4"></div>
      <div className="mb-8 px-3">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Logged in Shop
          </p>

          <h2 className="text-lg font-semibold text-orange-600 mt-1 truncate">
            {shopName || "Loading..."}
          </h2>
        </div>
      </div>

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
          onClick={() => setOpenReports(!openReports)}
          className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                   text-[17px] font-medium text-black hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Assessment fontSize="small" />
            <span>Reports</span>
          </div>

          <motion.span
            animate={{ rotate: openReports ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ExpandMore fontSize="small" />
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
      <div className="mt-auto pt-6 border-t">
        <Link href={settingsItem.href}>
          <motion.div
            whileHover={{ x: 6 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg
          text-[17px] cursor-pointer
          ${
            pathname === settingsItem.href
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
