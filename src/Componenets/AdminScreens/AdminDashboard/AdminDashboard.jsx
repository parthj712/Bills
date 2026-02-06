"use client";

import {
  Box,
  Card,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
} from "@mui/material";
import {
  ShoppingCart,
  CurrencyRupee,
  EmojiEmotions,
  HomeWork,
  TrendingUp,
} from "@mui/icons-material";
import { StatCard } from "./StatCard";
import { useEffect, useState } from "react";
import { getBills, getDashboardSummary } from "@/service/billsService";
import { getSubscriptionExpiry } from "@/service/subscriptionService";
import { TopProductsCard } from "./TopProductsCard/TopProductsCard";
import { QuickInsights } from "./QuickInsights/QuickInsights";
import { Skeleton, CircularProgress } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const topProducts = [
  { name: "Paneer Butter Masala", percent: 72 },
  { name: "Veg Biryani", percent: 65 },
  { name: "Butter Naan", percent: 54 },
  { name: "Cold Coffee", percent: 41 },
];

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [summary, setSummary] = useState([]);

  const [openTodayOrders, setOpenTodayOrders] = useState(false);

  const today = new Date();

  const yesterday = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  yesterday.setDate(today.getDate() - 1);
  const allowedPlans = ["PREMIUM", "TRIAL", "STANDARD"];

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription.planType);

  useEffect(() => {
    fetchSummary();
    fetchSubscriptionExpiry();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await getDashboardSummary();
      console.log(res.data);
      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const avgOrderValue = summary.totalOrders
    ? Math.round(summary.totalRevenue / summary.totalOrders)
    : 0;

  const todayAOV = summary.todayOrders
    ? Math.round(summary.todayRevenue / summary.todayOrders)
    : 0;

  const aovChange =
    avgOrderValue === 0
      ? 0
      : Math.round(((todayAOV - avgOrderValue) / avgOrderValue) * 100);

  const stats = [
    {
      title: "Monthly Sales",
      value: `₹${summary.monthlyRevenue}`,
      icon: <HomeWork fontSize="large" />,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Today's Orders",
      value: summary.todayOrders,
      icon: <ShoppingCart fontSize="large" />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      onClick: () => setOpenTodayOrders(true),
    },

    {
      title: "Today's Sales",
      value: `₹${summary.todayRevenue}`,
      icon: <CurrencyRupee fontSize="large" />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Order Value Trend",
      value: `${aovChange > 0 ? "+" : ""}${aovChange}%`,
      icon: <TrendingUpIcon fontSize="large" />,
      bg: aovChange >= 0 ? "bg-green-100" : "bg-red-100",
      iconColor: aovChange >= 0 ? "text-green-600" : "text-red-600",
    },
  ];
  return (
    <Box className="min-h-screen bg-[#f8fafc] overflow-hidden">
      {subscription && subscription.daysLeft <= 2 && (
        <Card
          className="mb-6 p-4 rounded-xl"
          sx={{
            background:
              subscription.daysLeft <= 0
                ? "linear-gradient(90deg,#991b1b,#ef4444)"
                : subscription.daysLeft === 1
                  ? "linear-gradient(90deg,#92400e,#f59e0b)"
                  : "linear-gradient(90deg,#1e3a8a,#3b82f6)",
            color: "white",
          }}
        >
          <Typography fontWeight={700}>
            {subscription.daysLeft > 1 && "⚠️ Subscription Expiring Soon"}
            {subscription.daysLeft === 1 && "⏰ Subscription Expires Tomorrow"}
            {subscription.daysLeft <= 0 && "❌ Subscription Expired"}
          </Typography>

          <Typography fontSize={13} sx={{ opacity: 0.9 }}>
            {subscription.daysLeft > 1 &&
              `Your ${subscription.plan} plan will expire in ${subscription.daysLeft} days.
To continue uninterrupted service, please contact our support team for renewal assistance at +91 9XXXXXXXXX.`}

            {subscription.daysLeft === 1 &&
              `Your subscription expires tomorrow.
Please contact our support team at +91 9XXXXXXXXX to renew and avoid service interruption.`}

            {subscription.daysLeft <= 0 &&
              `Your subscription has expired.
To reactivate your account, please contact our support team at +91 9XXXXXXXXX for renewal assistance.`}
          </Typography>
        </Card>
      )}
      {/* HEADER */}

      <Box className="min-h-screen bg-[#f8fafc] p-4">
        {/* HEADER */}
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          className="text-[#0b3c5d]"
          mb={3}
        >
          Dashboard Overview
        </Typography>

        {/* ================= LOADING STATE ================= */}
        {loadingSub ? (
          <Box>
            {/* Skeleton Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="rounded"
                  height={120}
                  sx={{ borderRadius: "18px" }}
                />
              ))}
            </div>

            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton
                variant="rounded"
                height={260}
                sx={{ borderRadius: "18px" }}
              />
              <Skeleton
                variant="rounded"
                height={260}
                sx={{ borderRadius: "18px" }}
              />
              <Skeleton
                variant="rounded"
                height={260}
                sx={{ borderRadius: "18px" }}
              />
            </div>
          </Box>
        ) : (
          /* ================= DASHBOARD CONTENT ================= */
          <Box sx={{ position: "relative" }}>
            {/* MAIN DASHBOARD UI */}
            <Box
              sx={{
                filter: hasAccess ? "none" : "blur(6px)",
                pointerEvents: hasAccess ? "auto" : "none",
                transition: "0.3s ease",
              }}
            >
              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} onClick={stat.onClick} />
                ))}
              </div>

              {/* CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TopProductsCard topProducts={topProducts} />
                <QuickInsights />
              </div>
            </Box>

            {/* ================= LOCK OVERLAY ================= */}
            {!hasAccess && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.65)",
                  borderRadius: "20px",
                  textAlign: "center",
                  backdropFilter: "blur(3px)",
                }}
              >
                <Typography fontSize={28} fontWeight={800}>
                  🔒 Locked Features
                </Typography>

                <Typography fontSize={14} sx={{ mt: 1, opacity: 0.8 }}>
                  Upgrade your subscription to view analytics, reports &
                  insights.
                </Typography>

                <Card
                  sx={{
                    mt: 3,
                    px: 4,
                    py: 1.5,
                    borderRadius: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                    color: "white",
                  }}
                >
                  Upgrade to Premium 🚀
                </Card>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Dialog
        open={openTodayOrders}
        onClose={() => setOpenTodayOrders(false)}
        fullWidth
        maxWidth="xs"
      >
        <Box p={3}>
          <Typography fontSize={20} fontWeight={700} mb={2}>
            Today's Orders Breakdown
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {summary.orderTypeStats?.map((item, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              mb={1}
            >
              <Typography>{item.orderType} Orders</Typography>
              <Typography fontWeight={700}>{item.todayOrders}</Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box textAlign="right">
            <Card
              onClick={() => setOpenTodayOrders(false)}
              sx={{
                display: "inline-block",
                px: 3,
                py: 1,
                cursor: "pointer",
                borderRadius: "10px",
                background: "linear-gradient(90deg,#2563eb,#3b82f6)",
                color: "white",
                fontWeight: 600,
              }}
            >
              Close
            </Card>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
