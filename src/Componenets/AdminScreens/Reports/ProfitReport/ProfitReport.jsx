"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import {
  CurrencyRupee,
  TrendingUp,
  TrendingDown,
  Receipt,
  AccountBalanceWallet,
  LocalOffer,
  FileDownload,
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getBills } from "@/service/billsService";
import { getExpense } from "@/service/expenseService";

export default function ProfitReport() {
  const [billsData, setBillsData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [showReport, setShowReport] = useState(false);
  const [activeRange, setActiveRange] = useState(null);

  const quickRanges = [
    { label: "Today", days: 1 },
    { label: "7 Days", days: 7 },
    { label: "1 Month", months: 1 },
    { label: "6 Months", months: 6 },
  ];

  useEffect(() => {
    fetchBills();
    fetchExpenses();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await getBills();
      const bills = Array.isArray(res.data) ? res.data : res.data?.data || [];

      setBillsData(bills);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await getExpense();

      const expenses = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setExpensesData(expenses);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuickRange = (range) => {
    const today = dayjs();

    setToDate(today);

    if (range.days) {
      setFromDate(today.subtract(range.days - 1, "day"));
    } else {
      setFromDate(today.subtract(range.months, "month"));
    }

    setActiveRange(range.label);
  };

  const filteredBills = useMemo(() => {
    return billsData.filter((bill) => {
      const billDate = dayjs(bill.createdAt);

      if (fromDate && billDate.isBefore(dayjs(fromDate).startOf("day"))) {
        return false;
      }

      if (toDate && billDate.isAfter(dayjs(toDate).endOf("day"))) {
        return false;
      }

      return true;
    });
  }, [billsData, fromDate, toDate]);

  const filteredExpenses = useMemo(() => {
    return expensesData.filter((expense) => {
      const expenseDate = dayjs(expense.createdAt || expense.date);

      if (fromDate && expenseDate.isBefore(dayjs(fromDate).startOf("day"))) {
        return false;
      }

      if (toDate && expenseDate.isAfter(dayjs(toDate).endOf("day"))) {
        return false;
      }

      return true;
    });
  }, [expensesData, fromDate, toDate]);

  const profitSummary = useMemo(() => {
    const totalRevenue = filteredBills.reduce(
      (sum, bill) => sum + Number(bill.grandTotal || 0),
      0,
    );

    const grossSales = filteredBills.reduce(
      (sum, bill) => sum + Number(bill.subtotal || 0),
      0,
    );

    const totalGST = filteredBills.reduce(
      (sum, bill) => sum + Number(bill.gstAmount || 0),
      0,
    );

    const totalDiscount = filteredBills.reduce(
      (sum, bill) => sum + Number(bill.discountAmount || 0),
      0,
    );

    const totalExpenses = filteredExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0,
    );

    const netProfit = totalRevenue - totalExpenses;

    const profitMargin =
      totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

    return {
      totalRevenue,
      grossSales,
      totalGST,
      totalDiscount,
      totalExpenses,
      netProfit,
      profitMargin,
    };
  }, [filteredBills, filteredExpenses]);

  const expenseCategorySummary = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
      const category = expense.categoryId?.name || "Other";

      if (!acc[category]) {
        acc[category] = 0;
      }

      acc[category] += Number(expense.amount || 0);

      return acc;
    }, {});
  }, [filteredExpenses]);

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toFixed(2)}`;
  };

  const exportToPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();

    // ---------------- HEADER ----------------
    doc.setFillColor(25, 118, 210); // blue header
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("PROFIT REPORT", pageWidth / 2, 18, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // ---------------- REPORT INFO ----------------
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const dateRangeText = `Date Range: ${
      fromDate ? dayjs(fromDate).format("DD MMM YYYY") : "All Time"
    } to ${toDate ? dayjs(toDate).format("DD MMM YYYY") : "All Time"}`;
    doc.text(dateRangeText, 14, 40);

    doc.text(`Generated On: ${dayjs().format("DD MMM YYYY hh:mm A")}`, 14, 47);

    // ---------------- SUMMARY TABLE ----------------
    autoTable(doc, {
      startY: 55,
      head: [["Metric", "Amount"]],
      body: [
        ["Total Revenue", formatCurrency(profitSummary.totalRevenue)],
        ["Gross Sales", formatCurrency(profitSummary.grossSales)],
        ["GST Collected", formatCurrency(profitSummary.totalGST)],
        ["Discount Given", formatCurrency(profitSummary.totalDiscount)],
        ["Total Expenses", formatCurrency(profitSummary.totalExpenses)],
        [
          profitSummary.netProfit >= 0 ? "Net Profit" : "Net Loss",
          formatCurrency(Math.abs(profitSummary.netProfit)),
        ],
        ["Profit Margin", `${profitSummary.profitMargin}%`],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 11,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didParseCell: function (data) {
        if (data.row.index === 5 && data.column.index === 1) {
          if (profitSummary.netProfit >= 0) {
            data.cell.styles.textColor = [34, 139, 34]; // green
          } else {
            data.cell.styles.textColor = [220, 20, 60]; // red
          }
        }
      },
    });

    // ---------------- EXPENSE BREAKDOWN ----------------
    const expenseRows = Object.entries(expenseCategorySummary).map(
      ([category, amount]) => [category, formatCurrency(amount)],
    );

    if (expenseRows.length > 0) {
      const currentY = doc.lastAutoTable.finalY + 15;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Expense Breakdown", 14, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Expense Category", "Amount"]],
        body: expenseRows,
        theme: "striped",
        headStyles: {
          fillColor: [244, 67, 54], // red
          textColor: [255, 255, 255],
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250],
        },
      });
    }

    // ---------------- FOOTER ----------------
    const finalY = doc.internal.pageSize.getHeight() - 15;

    doc.setDrawColor(200);
    doc.line(14, finalY - 5, pageWidth - 14, finalY - 5);

    doc.setFontSize(10);
    doc.setTextColor(100);

    doc.text("Generated by BillFlow POS", pageWidth / 2, finalY, {
      align: "center",
    });

    // Save file
    doc.save(`profit-report-${dayjs().format("DD-MM-YYYY-HH-mm")}.pdf`);
  };

  const reportCards = [
    {
      title: "Revenue",
      value: profitSummary.totalRevenue,
      icon: <CurrencyRupee />,
      color: "#16a34a",
    },
    {
      title: "Expenses",
      value: profitSummary.totalExpenses,
      icon: <AccountBalanceWallet />,
      color: "#dc2626",
    },
    {
      title: profitSummary.netProfit >= 0 ? "Profit" : "Loss",
      value: Math.abs(profitSummary.netProfit),
      icon: profitSummary.netProfit >= 0 ? <TrendingUp /> : <TrendingDown />,
      color: profitSummary.netProfit >= 0 ? "#16a34a" : "#dc2626",
    },
    {
      title: "GST",
      value: profitSummary.totalGST,
      icon: <Receipt />,
      color: "#2563eb",
    },
    {
      title: "Discount",
      value: profitSummary.totalDiscount,
      icon: <LocalOffer />,
      color: "#f59e0b",
    },
  ];

  return (
    <Box className="p-4 min-h-screen bg-[#f8fafc]">
      <Typography fontSize={30} fontWeight={700} mb={3} color="#111827">
        Profit Analytics
      </Typography>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Select Date Range
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" mb={3}>
          {quickRanges.map((range) => (
            <Chip
              key={range.label}
              label={range.label}
              clickable
              color={activeRange === range.label ? "primary" : "default"}
              onClick={() => handleQuickRange(range)}
            />
          ))}
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(val) => setFromDate(val)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(val) => setToDate(val)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  onClick={() => setShowReport(true)}
                  sx={{
                    height: 55,
                    borderRadius: 3,
                  }}
                >
                  Generate Report
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<FileDownload />}
                  onClick={exportToPDF}
                  disabled={!showReport}
                  sx={{
                    height: 55,
                    borderRadius: 3,
                  }}
                >
                  Export PDF
                </Button>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {showReport && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3}>
            {reportCards.map((card, index) => (
              <Grid item xs={12} md={4} lg={2.4} key={index}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 3,
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <Typography color="gray">{card.title}</Typography>

                        <Typography
                          fontSize={24}
                          fontWeight={700}
                          color={card.color}
                        >
                          ₹{card.value.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box color={card.color}>{card.icon}</Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Profit Margin */}
          <Paper
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <Typography color="gray">Profit Margin</Typography>

            <Typography
              fontSize={38}
              fontWeight={700}
              color={profitSummary.netProfit >= 0 ? "green" : "red"}
            >
              {profitSummary.profitMargin}%
            </Typography>
          </Paper>

          {/* Expense Breakdown */}
          <Paper
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 4,
            }}
          >
            <Typography fontSize={22} fontWeight={700} mb={3}>
              Expense Breakdown
            </Typography>

            {Object.keys(expenseCategorySummary).length === 0 ? (
              <Typography>No expenses found</Typography>
            ) : (
              Object.entries(expenseCategorySummary).map(
                ([category, amount]) => (
                  <Box
                    key={category}
                    display="flex"
                    justifyContent="space-between"
                    py={1.5}
                    borderBottom="1px solid #eee"
                  >
                    <Typography>{category}</Typography>

                    <Typography fontWeight={600}>
                      ₹{amount.toFixed(2)}
                    </Typography>
                  </Box>
                ),
              )
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
