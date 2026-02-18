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
} from "@mui/icons-material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CloseIcon from "@mui/icons-material/Close";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getShopInfo } from "@/service/shopService";

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
];

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();
  const [openReports, setOpenReports] = useState(false);
  const [shopCategory, setShopCategory] = useState(null);
  const isDineIn = shopCategory === "DINE_IN";

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
            <div className="">
              <div
                onClick={() => setOpenReports(!openReports)}
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-black"
              >
                <div className="flex items-center gap-3 text-black">
                  <Assessment fontSize="small" />
                  <span className="text-[16px]">Reports</span>
                </div>
                <motion.span animate={{ rotate: openReports ? 180 : 0 }}>
                  <ExpandMore fontSize="small" />
                </motion.span>
              </div>

              <AnimatePresence>
                {openReports && (
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
                            ${isActive ? "text-orange-600 font-semibold" : "text-black"}
                            `}
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
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
