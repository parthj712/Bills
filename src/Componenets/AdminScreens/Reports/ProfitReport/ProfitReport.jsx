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
  useTheme,
  useMediaQuery,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

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
      <Typography
        fontSize={isMobile ? 24 : 30}
        fontWeight={isMobile ? 600 : 700}
        className="text-[#000C5A]"
      >
        Profit Analytics
      </Typography>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "20px",
          background: "linear-gradient(135deg, #ffffff, #f8fafc)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography fontWeight={700} mb={2} className="text-slate-800">
          Select Date Range
        </Typography>

        {/* QUICK FILTERS */}
        <Box className="flex flex-wrap gap-2 mb-4">
          {quickRanges.map((range) => (
            <Box
              key={range.label}
              onClick={() => handleQuickRange(range)}
              className={`
          px-4 py-1.5 rounded-full text-sm cursor-pointer transition-all
          ${
            activeRange === range.label
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
        `}
            >
              {range.label}
            </Box>
          ))}
        </Box>

        {/* DATE + ACTIONS */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            {/* FROM DATE */}
            <Box className="bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
              <Typography className="text-xs text-slate-400 mb-1">
                From Date
              </Typography>
              <DatePicker
                value={fromDate}
                onChange={(val) => setFromDate(val)}
                slotProps={{
                  textField: {
                    variant: "standard",
                    InputProps: { disableUnderline: true },
                  },
                }}
              />
            </Box>

            {/* TO DATE */}
            <Box className="bg-white rounded-xl border border-slate-200 px-3 py-2 shadow-sm">
              <Typography className="text-xs text-slate-400 mb-1">
                To Date
              </Typography>
              <DatePicker
                value={toDate}
                onChange={(val) => setToDate(val)}
                slotProps={{
                  textField: {
                    variant: "standard",
                    InputProps: { disableUnderline: true },
                  },
                }}
              />
            </Box>

            {/* GENERATE BUTTON */}
            <Button
              onClick={() => setShowReport(true)}
              className="h-[50px] rounded-xl font-semibold normal-case"
              sx={{
                background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
                color: "#fff",
                boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
                },
              }}
            >
              Generate Report
            </Button>

            {/* EXPORT BUTTON */}
            <Button
              onClick={exportToPDF}
              disabled={!showReport}
              startIcon={<FileDownload />}
              className="h-[50px] rounded-xl font-semibold normal-case"
              sx={{
                border: "1px solid #e2e8f0",
                color: showReport ? "#0f172a" : "#94a3b8",
                background: "#fff",
              }}
            >
              Export PDF
            </Button>
          </Box>
        </LocalizationProvider>
      </Paper>

      {showReport && (
        <>
          {/* Summary Cards */}
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {reportCards.map((card, index) => (
              <Box
                key={index}
                className="bg-white  rounded-2xl p-4 shadow-sm border border-slate-200 
      hover:shadow-lg transition-all duration-300 flex items-center justify-between"
              >
                {/* LEFT */}
                <Box>
                  <Typography className="text-sm text-black">
                    {card.title}
                  </Typography>

                  <Typography
                    className="text-xl font-bold mt-1"
                    sx={{ color: card.color }}
                  >
                    ₹{card.value.toFixed(2)}
                  </Typography>
                </Box>

                {/* ICON */}
                <Box
                  className="h-10 w-10 flex items-center justify-center rounded-xl"
                  sx={{
                    background: `${card.color}15`,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Profit Margin */}
          <Paper
            sx={{
              mt: 4,
              p: 4,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #f8fafc, #ffffff)",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <Typography
              fontSize={20}
              fontWeight={600}
              className="text-slate-500 mb-2"
            >
              Profit Margin
            </Typography>

            <Typography
              fontWeight={600}
              className="text-5xl font-extrabold"
              sx={{
                color: profitSummary.netProfit >= 0 ? "#16a34a" : "#dc2626",
              }}
            >
              {profitSummary.profitMargin}%
            </Typography>

            {/* Optional subtle line */}
            <Box fontSize={16} className="mt-3 text-xs text-slate-400">
              Based on revenue vs expenses
            </Box>
          </Paper>

          {/* Expense Breakdown */}
          <Paper
            sx={{
              p: 3,
              mt: 4,
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
            }}
          >
            <Typography fontSize={20} fontWeight={600} mb={3}>
              💸 Expense Breakdown
            </Typography>

            {Object.keys(expenseCategorySummary).length === 0 ? (
              <Box className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Typography>No expenses found</Typography>
              </Box>
            ) : (
              <Box className="flex flex-col divide-y divide-slate-100">
                {Object.entries(expenseCategorySummary).map(
                  ([category, amount]) => (
                    <Box
                      key={category}
                      className="flex justify-between items-center py-3 hover:bg-slate-50 px-2 rounded-lg transition"
                    >
                      <Typography className="text-slate-600">
                        {category}
                      </Typography>

                      <Typography className="font-semibold text-red-500">
                        ₹{amount.toFixed(2)}
                      </Typography>
                    </Box>
                  ),
                )}
              </Box>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
