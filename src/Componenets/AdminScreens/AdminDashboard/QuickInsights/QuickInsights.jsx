"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import TrendingUp from "@mui/icons-material/TrendingUp";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import TableBar from "@mui/icons-material/TableBar";
import AccessTime from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Cancel from "@mui/icons-material/Cancel";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";

/* Charts */
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import InsightDialog from "./InsightDialog";
import { getBills } from "@/service/billsService";

export const QuickInsights = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [open, setOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [bills, setBills] = useState([]);

  const getData = async () => {
    try {
      const res = await getBills();

      setBills(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const insights = [
    {
      label: "Total Orders",
      icon: ShoppingCart,
      chartType: "bar",
      bg: "bg-blue-100/70",
      color: "text-blue-600",
    },
    {
      label: "Active Tables",
      icon: TableBar,
      chartType: "none",
      bg: "bg-green-100/70",
      color: "text-green-600",
    },
    {
      label: "Peak Hours",
      icon: AccessTime,
      chartType: "line",
      bg: "bg-purple-100/70",
      color: "text-purple-600",
    },
    // {
    //   label: "Top Selling Item",
    //   icon: RestaurantMenu,
    //   chartType: "none",
    //   bg: "bg-orange-100/70",
    //   color: "text-orange-600",
    // },
    // {
    //   label: "Cancelled Orders",
    //   icon: Cancel,
    //   chartType: "none",
    //   bg: "bg-red-100/70",
    //   color: "text-red-600",
    // },
    {
      label: "Revenue Trend",
      icon: TrendingUp,
      chartType: "donut",
      bg: "bg-emerald-100/70",
      color: "text-emerald-600",
    },
    {
      label: "Income vs Expense",
      icon: AccountBalanceWalletIcon,
      chartType: "incomeExpense",
      bg: "bg-rose-100/70",
      color: "text-rose-600",
    },
    {
      label: "Customer Ratings",
      icon: RestaurantMenu,
      chartType: "ratings",
      bg: "bg-yellow-100/70",
      color: "text-yellow-600",
    },
  ];

  /* Handle Click */
  const handleOpen = (item) => {
    setSelectedInsight(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInsight(null);
  };

  return (
    <>
      {/* MAIN CARD */}
      <Card
        sx={{
          my: 2,
          borderRadius: "10px",
          border: "1px solid rgba(0,0,0,0.06)",
          background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        }}
        className="p-6 lg:col-span-2"
      >
        {/* Header */}
        <Box mb={3}>
          <Typography fontSize={20} fontWeight={700}>
            Quick Insights
          </Typography>
        </Box>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {insights.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={index}
                onClick={() => handleOpen(item)}
                sx={{
                  borderRadius: "6px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  },
                }}
                className="px-3 py-3.5 text-center cursor-pointer"
              >
                {/* Icon */}
                <Box
                  className={`mx-auto mb-3 h-11 w-11 rounded-xl flex items-center justify-center ${item.bg}`}
                >
                  <Icon className={`${item.color} text-[20px]`} />
                </Box>

                {/* Label */}
                <Typography fontSize={isMobile ? 14 : 15} fontWeight={600}>
                  {item.label}
                </Typography>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* ===================== DIALOG ===================== */}
      {/* DIALOG COMPONENT */}
      <InsightDialog
        open={open}
        onClose={handleClose}
        insight={selectedInsight}
        bills={bills}
      />
    </>
  );
};
