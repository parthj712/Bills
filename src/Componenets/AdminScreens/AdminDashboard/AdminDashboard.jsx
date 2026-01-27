"use client";

import { Box, Card, Typography, Divider } from "@mui/material";
import {
  ShoppingCart,
  CurrencyRupee,
  EmojiEmotions,
  HomeWork,
  TrendingUp,
} from "@mui/icons-material";
import { StatCard } from "./StatCard";
import { useEffect, useState } from "react";
import { getBills } from "@/service/billsService";
import { getSubscriptionExpiry } from "@/service/subscriptionService";

const topProducts = [
  { name: "Chicken Chilly", percent: 40 },
  { name: "Misal Pav", percent: 35 },
  { name: "Cheese Chilly Toast", percent: 30 },
  { name: "Cheese Sandwich", percent: 25 },
  { name: "Vegetable Salad", percent: 20 },
];

export default function AdminDashboard() {
  const [bills, setBills] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const today = new Date();
  const todayDate = today.toDateString();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    fetchBills();
    fetchSubscriptionExpiry();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await getBills();
      setBills(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (error) {
      console.log(error?.message || error);
    }
  };
  const fetchSubscriptionExpiry = async () => {
    try {
      const res = await getSubscriptionExpiry();
      console.log("res", res);

      setSubscription(res.data);
    } catch (error) {
      console.log(error?.message || error);
    }
  };

  const monthlyTotalSales = bills.reduce((sum, bill) => {
    const billDate = new Date(bill.createdAt);
    if (
      billDate.getMonth() === currentMonth &&
      billDate.getFullYear() === currentYear
    ) {
      return sum + bill.grandTotal;
    }
    return sum;
  }, 0);

  const todaysOrders = bills.filter(
    (b) => new Date(b.createdAt).toDateString() === todayDate,
  ).length;

  const todaysTotalSales = bills.reduce((sum, bill) => {
    const billDate = new Date(bill.createdAt).toDateString();
    return billDate === todayDate ? sum + bill.grandTotal : sum;
  }, 0);

  const satisfactionPercent =
    bills.length === 0 ? 0 : Math.round((todaysOrders / bills.length) * 100);

  const stats = [
    {
      title: "Monthly Sales",
      value: `₹${monthlyTotalSales}`,
      icon: <HomeWork fontSize="large" />,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Today's Orders",
      value: todaysOrders,
      icon: <ShoppingCart fontSize="large" />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Today's Sales",
      value: `₹${todaysTotalSales}`,
      icon: <CurrencyRupee fontSize="large" />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Customer Satisfaction",
      value: `${satisfactionPercent}%`,
      icon: <EmojiEmotions fontSize="large" />,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <Box className="min-h-screen bg-[#f8fafc] p-4">
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
      <Card
        className="mb-6 p-6 rounded-2xl"
        sx={{
          background: "linear-gradient(90deg,#7c2d12,#f97316)",
          color: "white",
        }}
      >
        <Typography fontSize={26} fontWeight={800}>
          Dashboard Overview
        </Typography>
        <Typography fontSize={13} sx={{ opacity: 0.85 }}>
          Real-time restaurant performance summary
        </Typography>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP PRODUCTS */}
        <Card className="p-6 rounded-2xl shadow-sm">
          <Typography fontWeight={700} mb={1}>
            Top Selling Products
          </Typography>
          <Typography fontSize={12} color="text.secondary" mb={3}>
            Based on current month sales
          </Typography>

          <div className="space-y-4">
            {topProducts.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{item.name}</span>
                  <span className="text-gray-500">{item.percent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SPEED DIAL */}
        <Card className="p-6 rounded-2xl shadow-sm lg:col-span-2">
          <Typography fontWeight={700} mb={1}>
            Quick Insights
          </Typography>
          <Typography fontSize={12} color="text.secondary" mb={2}>
            Fast access to key metrics
          </Typography>

          <Divider className="mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {[
              "Total Orders",
              "Active Tables",
              "Peak Hours",
              "Top Item",
              "Cancelled Orders",
              "Revenue Growth",
            ].map((item, index) => (
              <Card
                key={index}
                className="p-4 rounded-xl text-center cursor-pointer hover:shadow-md transition"
              >
                <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="text-orange-600" />
                </div>
                <Typography fontSize={13} fontWeight={600}>
                  {item}
                </Typography>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </Box>
  );
}
