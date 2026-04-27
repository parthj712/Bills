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
import CloseIcon from "@mui/icons-material/Close";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getShopInfo } from "@/service/shopService";
import { getSubscriptionExpiry } from "@/service/subscriptionService";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import LiquorIcon from "@mui/icons-material/Liquor";

const reportItems = [
  {
    label: "Sales Report",
    href: "/admin/reports/salesreport",
    icon: <ReceiptLongIcon fontSize="small" />, // sales invoices/report
  },
  {
    label: "Item Report",
    href: "/admin/reports/itemsreport",
    icon: <Inventory2Icon fontSize="small" />, // inventory/items
  },
  {
    label: "Expense Report",
    href: "/admin/reports/expensereport",
    icon: <AccountBalanceWalletIcon fontSize="small" />, // expenses
  },
  {
    label: "Gst Report",
    href: "/admin/reports/gstreport",
    icon: <LocalAtmIcon fontSize="small" />, // tax/money
  },
  {
    label: "Daily Sales Report",
    href: "/admin/reports/dailyreport",
    icon: <Assessment fontSize="small" />, // daily summary
  },
  {
    label: "Profit Report",
    href: "/admin/reports/profitreport",
    icon: <TrendingUpIcon fontSize="small" />, // profit growth
  },
  {
    label: "Orders Report",
    href: "/admin/reports/ordersreport",
    icon: <ShoppingCartIcon fontSize="small" />, // orders
  },
  {
    label: "Discount Report",
    href: "/admin/reports/discountreport",
    icon: <LocalOfferIcon fontSize="small" />, // orders
  },
];

export default function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();
  const [openReports, setOpenReports] = useState(false);
  const [shopCategory, setShopCategory] = useState(null);

  const [openReportsDialog, setOpenReportsDialog] = useState(false);

  const isDineIn = shopCategory === "DINE_IN";
  const isBar = shopCategory === "RESTO_BAR";
  const showTables = shopCategory === "DINE_IN" || shopCategory === "RESTO_BAR";

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
    ...(showTables
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
        setShopData(res.data?.data);
        console.log("shopdata", res.data?.data);

        setShopCategory(res.data?.data?.businessCategory);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchShopInfo();
  }, []);
  console.log("shopCategory", shopCategory);
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

            {/* Main Nav */}
            <nav className="space-y-2">
              {mainItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.label} href={item.href}>
                    <div
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[14px]
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
                  setOpenReportsDialog(true);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-black"
              >
                <div className="flex items-center gap-3">
                  <Assessment fontSize="small" />
                  <span className="test-[14px]">Reports</span>
                </div>

                {/* <motion.span
                  initial={{ rotate: 0 }}
                  whileHover={hasAccess ? { rotate: -90 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {hasAccess ? (
                    <ExpandMore fontSize="small" />
                  ) : (
                    <LockIcon fontSize="small" className="text-gray-400" />
                  )}
                </motion.span> */}
              </div>

              {/* <AnimatePresence>
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
              </AnimatePresence> */}
            </div>

            {/* Settings */}
            <div className="mt-auto pt-4 border-t">
              <Link href="/admin/settings">
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg test-[14px]
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg test-[14px]
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg test-[14px]
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

      <Dialog
        open={openReportsDialog}
        onClose={() => setOpenReportsDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={600} fontSize={16}>
            Reports
          </Typography>

          <IconButton onClick={() => setOpenReportsDialog(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          {reportItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Box
                onClick={() => {
                  setOpenReportsDialog(false);
                  onClose(); // 👈 close sidebar also
                }}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                    borderColor: "#6366f1",
                  },
                }}
              >
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            </Link>
          ))}
        </Box>
      </Dialog>
    </AnimatePresence>
  );
}
