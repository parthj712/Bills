"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, useMediaQuery, useTheme } from "@mui/material";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Divider,
  Avatar,
  Button,
} from "@mui/material";

import {
  CurrencyRupee,
  ShoppingCart,
  Payments,
  Restaurant,
  TakeoutDining,
  Percent,
  PictureAsPdf,
} from "@mui/icons-material";
import { motion } from "framer-motion";

import { getBills } from "@/service/billsService";
import dayjs from "dayjs";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const cardStyle = {
  p: 3,
  borderRadius: "20px",
  background: "linear-gradient(145deg,#ffffff,#f8fafc)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  border: "1px solid #e2e8f0",
};

export default function DailyReport() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [billsData, setBillsData] = useState([]);
  const [loading, setLoading] = useState(true);

  //----------------------------------------
  // Fetch Bills
  //----------------------------------------
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await getBills();

        const bills = Array.isArray(res.data) ? res.data : res.data?.data || [];

        setBillsData(bills);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  //----------------------------------------
  // Today's Bills
  //----------------------------------------
  const todayBills = useMemo(() => {
    return billsData.filter((bill) =>
      dayjs(bill.createdAt).isSame(dayjs(), "day"),
    );
  }, [billsData]);

  //----------------------------------------
  // Summary Calculation
  //----------------------------------------
  const summary = useMemo(() => {
    return todayBills.reduce(
      (acc, bill) => {
        acc.totalSales += Number(bill.grandTotal || 0);
        acc.totalOrders += 1;

        acc.cash += bill.paymentMethod === "CASH" ? Number(bill.grandTotal) : 0;
        acc.card += bill.paymentMethod === "CARD" ? Number(bill.grandTotal) : 0;

        acc.upi += bill.paymentMethod === "UPI" ? Number(bill.grandTotal) : 0;

        acc.discount += Number(bill.discountAmount || 0);
        acc.gst += Number(bill.gstAmount || 0);

        acc.dineIn += bill.tableId ? 1 : 0;
        acc.takeaway += !bill.tableId ? 1 : 0;

        return acc;
      },
      {
        totalSales: 0,
        totalOrders: 0,
        cash: 0,
        card: 0,
        upi: 0,
        discount: 0,
        gst: 0,
        dineIn: 0,
        takeaway: 0,
      },
    );
  }, [todayBills]);

  //----------------------------------------
  // Hourly Sales
  //----------------------------------------
  const hourlySales = useMemo(() => {
    const map = {};

    todayBills.forEach((bill) => {
      const hour = dayjs(bill.createdAt).format("hh A");

      if (!map[hour]) {
        map[hour] = 0;
      }

      map[hour] += Number(bill.grandTotal || 0);
    });

    return Object.entries(map).map(([hour, sales]) => ({
      hour,
      sales,
    }));
  }, [todayBills]);

  //----------------------------------------
  // Export PDF
  //----------------------------------------
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toFixed(2)}`;
  };

  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ---------------- HEADER ----------------
    doc.setFillColor(33, 150, 243); // blue
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text("DAILY SALES REPORT", pageWidth / 2, 18, { align: "center" });

    // reset text color
    doc.setTextColor(0, 0, 0);

    // ---------------- REPORT META ----------------
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text(`Report Date: ${dayjs().format("DD MMM YYYY")}`, 14, 40);

    doc.text(`Generated On: ${dayjs().format("DD MMM YYYY hh:mm A")}`, 14, 47);

    // ---------------- SUMMARY TABLE ----------------
    autoTable(doc, {
      startY: 58,
      head: [["Sales Summary", "Value"]],
      body: [
        ["Total Sales", formatCurrency(summary.totalSales)],
        ["Total Orders", summary.totalOrders],
        ["Discount Given", formatCurrency(summary.discount)],
        ["GST Collected", formatCurrency(summary.gst)],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // ---------------- PAYMENT BREAKDOWN ----------------
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Payment Method", "Amount"]],
      body: [
        ["Cash", formatCurrency(summary.cash)],
        ["Card", formatCurrency(summary.card)],
        ["UPI", formatCurrency(summary.upi)],
      ],
      theme: "striped",
      headStyles: {
        fillColor: [76, 175, 80], // green
        textColor: [255, 255, 255],
      },
    });

    // ---------------- ORDER TYPE ----------------
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Order Type", "Orders"]],
      body: [
        ["Dine-In", summary.dineIn],
        ["Takeaway", summary.takeaway],
      ],
      theme: "striped",
      headStyles: {
        fillColor: [255, 152, 0], // orange
        textColor: [255, 255, 255],
      },
    });

    // ---------------- HOURLY SALES ----------------
    if (hourlySales.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 12,
        head: [["Hour", "Sales"]],
        body: hourlySales.map((item) => [
          item.hour,
          formatCurrency(item.sales),
        ]),
        theme: "striped",
        headStyles: {
          fillColor: [156, 39, 176], // purple
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
      });
    }

    // ---------------- TOP PERFORMING HOUR ----------------
    if (hourlySales.length > 0) {
      const bestHour = [...hourlySales].sort((a, b) => b.sales - a.sales)[0];

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");

      doc.text(
        `Top Performing Hour: ${bestHour.hour} (${formatCurrency(
          bestHour.sales,
        )})`,
        14,
        doc.lastAutoTable.finalY + 15,
      );
    }

    // ---------------- FOOTER ----------------
    const footerY = pageHeight - 15;

    doc.setDrawColor(200);
    doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

    doc.setFontSize(10);
    doc.setTextColor(100);

    doc.text("Generated by BillFlow POS", pageWidth / 2, footerY, {
      align: "center",
    });

    doc.save(`daily-sales-report-${dayjs().format("DD-MM-YYYY-HH-mm")}.pdf`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }


  const breakdownCardStyle = {
    p: 3,
    borderRadius: "20px",
    background: "linear-gradient(135deg, #ffffff, #f8fafc)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
    },
  };

  return (
    <Box
      sx={{
        p: 3,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 4,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            fontSize={isMobile ? 24 : 30}
            fontWeight={isMobile ? 600 : 700}
            className="text-[#000C5A]"
          >
            Daily Report
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: "16px",
              mt: 0.5,
            }}
          >
            Analyze your daily sales performance
          </Typography>
        </Box>
 {isDesktop && (
        <Button
          startIcon={<PictureAsPdf />}
          variant="contained"
          onClick={handleExportPDF}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
            px: 3,
            py: 1
          }}
        >
          Export PDF
        </Button>
      )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          ...breakdownCardStyle,
          p: 3,
          borderRadius: "20px",
          background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(10px)",
          mb: 4,
        }}
      >
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

          {[
            {
              label: "Total Sales",
              value: `₹${summary.totalSales.toFixed(2)}`,
              color: "#16a34a",
              icon: <CurrencyRupee />,
            },
            {
              label: "Orders",
              value: summary.totalOrders,
              color: "#2563eb",
              icon: <ShoppingCart />,
            },
            {
              label: "Discount",
              value: `₹${summary.discount.toFixed(2)}`,
              color: "#dc2626",
              icon: <Percent />,
            },
            {
              label: "GST",
              value: `₹${summary.gst.toFixed(2)}`,
              color: "#f59e0b",
              icon: <Payments />,
            },
          ].map((item, i) => (
            <Box
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl "
            >
              {/* Icon */}
              <Avatar
                sx={{
                  bgcolor: item.color,
                  width: 44,
                  height: 44,
                }}
              >
                {item.icon}
              </Avatar>

              {/* Text */}
              <Box>
                <Typography fontSize={20} fontWeight={600} className="text-slate-500">
                  {item.label}
                </Typography>

                <Typography
                  className="font-bold text-lg"
                  sx={{ color: item.color }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}

        </Box>
      </Paper>

      {/* BREAKDOWN CARDS */}
      <Box className="grid grid-cols-1 gap-4">

        {/* PAYMENT BREAKDOWN */}
        <Paper elevation={0} sx={{ ...breakdownCardStyle, cursor: 'default' }}>
          <Typography fontSize={20} fontWeight={600} mb={2}>
            💳 Payment Breakdown
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {[
            { label: "Cash", value: summary.cash, icon: "💵" },
            { label: "Card", value: summary.card, icon: "💳" },
            { label: "UPI", value: summary.upi, icon: "📱" },
          ].map((item, index) => (
            <Box
              key={index}
              className="flex justify-between items-center py-2"
            >
              <Typography className="text-slate-600">
                {item.icon} {item.label}
              </Typography>

              <Typography className="font-bold text-slate-900">
                ₹{item.value.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Paper>

        {/* ORDER BREAKDOWN */}
        <Paper elevation={0} sx={{ ...breakdownCardStyle, cursor: 'default' }}>
          <Typography fontSize={20} fontWeight={600} mb={2}>
            🍽️ Order Breakdown
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {[
            { label: "Dine-In", value: summary.dineIn, icon: "🍴" },
            { label: "Takeaway", value: summary.takeaway, icon: "🥡" },
          ].map((item, index) => (
            <Box
              key={index}
              className="flex justify-between items-center py-2"
            >
              <Typography className="text-slate-600">
                {item.icon} {item.label}
              </Typography>

              <Typography className="font-bold text-slate-900">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Paper>

      </Box>

      {/* HOURLY SALES */}
      <Paper
        elevation={0}
        sx={{
          ...breakdownCardStyle,
          mt: 4,
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography fontSize={22} fontWeight={600} mb={3}>
          📊 Hourly Sales
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {hourlySales.map((item, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="space-between"
            py={1.5}
            sx={{
              borderBottom:
                index !== hourlySales.length - 1 ? "1px solid #f1f5f9" : "none",
            }}
          >
            <Typography color="#64748b">{item.hour}</Typography>

            <Box className="flex items-center gap-3">
              <Box className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                <Box
                  className="bg-blue-500 h-full"
                  style={{
                    width: `${Math.min(item.sales / 1000 * 100, 100)}%`,
                  }}
                />
              </Box>

              <Typography className="font-semibold text-slate-900">
                ₹{item.sales.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>


      {(isMobile || isTablet) && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Box
            onClick={handleExportPDF}
            className="
        h-14 w-14
        rounded-full
        bg-gradient-to-br from-[#2563eb] to-[#1e3a8a]
        flex items-center justify-center
        shadow-xl
        cursor-pointer
        active:scale-95
        transition-all duration-300
        hover:shadow-2xl
      "
          >
            <PictureAsPdf sx={{ color: "#fff", fontSize: 26 }} />
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
