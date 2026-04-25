"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@mui/material";
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
            sx={{
              fontSize: "42px",
              fontWeight: 700,
              color: "#0f172a",
            }}
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

        <Button
          startIcon={<PictureAsPdf />}
          variant="contained"
          onClick={handleExportPDF}
          sx={{
            background: "#1976d2",
            borderRadius: "12px",
            px: 3,
            py: 1.2,
            textTransform: "none",
            boxShadow: "0px 4px 12px rgba(25,118,210,0.25)",
          }}
        >
          Export PDF
        </Button>
      </Box>

      {/* MAIN SUMMARY CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          mb: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography color="#64748b">Total Sales</Typography>
            <Typography fontSize={32} fontWeight={700} color="#16a34a">
              ₹{summary.totalSales.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography color="#64748b">Orders</Typography>
            <Typography fontSize={32} fontWeight={700} color="#2563eb">
              {summary.totalOrders}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography color="#64748b">Discount</Typography>
            <Typography fontSize={32} fontWeight={700} color="#dc2626">
              ₹{summary.discount.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography color="#64748b">GST</Typography>
            <Typography fontSize={32} fontWeight={700} color="#f59e0b">
              ₹{summary.gst.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* BREAKDOWN CARDS */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontSize={22} fontWeight={600} mb={3}>
              Payment Breakdown
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {[
              { label: "Cash", value: summary.cash },
              { label: "Card", value: summary.card },
              { label: "UPI", value: summary.upi },
            ].map((item, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                py={1.5}
              >
                <Typography color="#64748b">{item.label}</Typography>
                <Typography fontWeight={600}>
                  ₹{item.value.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontSize={22} fontWeight={600} mb={3}>
              Order Breakdown
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {[
              { label: "Dine-In", value: summary.dineIn },
              { label: "Takeaway", value: summary.takeaway },
            ].map((item, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                py={1.5}
              >
                <Typography color="#64748b">{item.label}</Typography>
                <Typography fontWeight={600}>{item.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* HOURLY SALES */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography fontSize={22} fontWeight={600} mb={3}>
          Hourly Sales
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

            <Typography fontWeight={600}>₹{item.sales.toFixed(2)}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
