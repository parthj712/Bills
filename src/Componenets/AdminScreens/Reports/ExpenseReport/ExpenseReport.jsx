"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getExpense } from "@/service/expenseService";
import { motion } from "framer-motion";
import ExpenseCard from "./ExpenseCard"; // Mobile/Tablet Card

const ExpenseReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [expenses, setExpenses] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const quickRanges = [
    { label: "1 Day", days: 1 },
    { label: "1 Week", days: 7 },
    { label: "1 Month", months: 1 },
    { label: "6 Months", months: 6 },
  ];
  const [activeRange, setActiveRange] = useState(null);

  useEffect(() => {
    getExpense().then((res) => setExpenses(res.data || []));
  }, []);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const dateMatch =
        (!fromDate || dayjs(exp.date).isAfter(fromDate.startOf("day"))) &&
        (!toDate || dayjs(exp.date).isBefore(toDate.endOf("day")));
      const categoryMatch = searchCategory
        ? exp.categoryId?.name
          ?.toLowerCase()
          .includes(searchCategory.toLowerCase())
        : true;
      const paymentMatch = paymentMode
        ? exp.paymentMode?.toLowerCase() === paymentMode.toLowerCase()
        : true;

      return dateMatch && categoryMatch && paymentMatch;
    });
  }, [expenses, fromDate, toDate, searchCategory, paymentMode]);

  const totals = useMemo(() => {
    return filteredExpenses.reduce(
      (acc, exp) => {
        acc.amount += exp.amount;
        return acc;
      },
      { amount: 0 },
    );
  }, [filteredExpenses]);

  const exportExcel = () => {
    if (!filteredExpenses.length) return;
    const data = filteredExpenses.map((exp) => ({
      Date: dayjs(exp.date).format("DD/MM/YYYY"),
      Note: exp.note || "-",
      Category: exp.categoryId?.name || "-",
      Amount: exp.amount,
      Payment: exp.paymentMode?.toUpperCase() || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "Expense_Report.xlsx");
  };

  return (
    <Box className="min-h-screen p-2 lg:p-4 md:p-4">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography
            fontSize={isMobile ? 24 : 30}
            fontWeight={isMobile ? 600 : 700}
            className="text-[#000C5A]"
          >
            Expense Report
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Analyze your expenses over time
          </Typography>
        </Box>

        {isDesktop && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportExcel}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
            }}
          >
            Export Excel
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: isMobile ? 8 : 4,
          borderRadius: 2,
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          display="flex"
          flexDirection={isMobile || isTablet ? "column" : "row"}
          gap={3}
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems={isMobile ? "stretch" : "center"}
        >
          {/* LEFT SIDE: Quick ranges + date pickers + Payment Mode */}
          <Box display="flex" flexDirection="column" gap={3} flex={1}>
            {/* Quick Ranges */}
            <Box display="flex" justifyContent={isMobile || isTablet ? "space-between" : null} gap={2} flexWrap="wrap">
              {quickRanges.map((range) => (
                <Chip
                  key={range.label}
                  label={range.label}
                  size="small"
                  clickable
                  variant={activeRange === range.label ? "filled" : "outlined"}
                  color={activeRange === range.label ? "primary" : "default"}
                  onClick={() => {
                    const today = dayjs();
                    setToDate(today);
                    if (range.days)
                      setFromDate(today.subtract(range.days, "day"));
                    else setFromDate(today.subtract(range.months, "month"));
                    setActiveRange(range.label);
                    setShowReport(false);
                  }}
                  sx={{ fontSize: 14, px: isMobile ? 0 : 0.5, py: isMobile ? 0 : 1.5, borderRadius: 2 }}
                />
              ))}
            </Box>

            {/* Date Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" gap={3} flexWrap="wrap">
                {/* Payment Mode Filter */}
                <FormControl sx={{ minWidth: isMobile ? "100%" : isTablet ? "100%" : 240 }}>
                  <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
                  <Select
                    labelId="payment-mode-label"
                    value={paymentMode}
                    label="Payment Mode"
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Wallet">Wallet</MenuItem>
                  </Select>
                </FormControl>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(val) => {
                    setFromDate(val);
                    setShowReport(false);
                  }}
                  sx={{ minWidth: isMobile ? "100%" : isTablet ? "100%" : 240 }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(val) => {
                    setToDate(val);
                    setShowReport(false);
                  }}
                  sx={{ minWidth: isMobile ? "100%" : isTablet ? "100%" : 240 }}
                />
              </Box>
            </LocalizationProvider>


          </Box>

          {/* RIGHT SIDE: Get Report Button */}
          <Box
            mt={isMobile ? 2 : 0}
            display="flex"
            justifyContent={isMobile ? "stretch" : "flex-end"}
            alignItems="center"
          >
            <Button
              
              variant="contained"
              onClick={() => setShowReport(true)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 4,
                py: 1.2,
                minHeight: 40,
                width: isMobile || isTablet ? "100%" :  "auto",
                backgroundColor: "#0f172a",
                "&:hover": { backgroundColor: "#020617" },
              }}
            >
              Get Report
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Desktop Table */}
      {/* Desktop Table */}
      {showReport && isDesktop && (
        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 660, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0b3c5d" }}>
                  {["Date", "Note", "Category", "Amount", "Payment"].map(
                    (h) => (
                      <TableCell
                        key={h}
                        align="center"
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          backgroundColor: "#0b3c5d",
                          top: 0, // ensures sticky
                          position: "sticky", // required for stickyHeader to work
                          zIndex: 2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ),
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExpenses.length > 0 ? (
                  <>
                    {filteredExpenses.map((exp, i) => (
                      <TableRow key={exp._id} hover>
                        <TableCell align="center">
                          {dayjs(exp.date).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="center">{exp.note || "-"}</TableCell>
                        <TableCell align="center">
                          {exp.categoryId?.name || "-"}
                        </TableCell>
                        <TableCell align="center">₹{exp.amount}</TableCell>
                        <TableCell align="center">
                          {exp.paymentMode?.toUpperCase() || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Totals */}
                    <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{ fontWeight: 700 }}
                      >
                        TOTAL
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        ₹{totals.amount}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Mobile/Tablet Cards */}
      {showReport && !isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((exp) => (
              <ExpenseCard key={exp._id} expense={exp} />
            ))
          ) : (
            <Box className="col-span-full text-center py-6">
              <Typography color="text.secondary">No data found</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Mobile/Tablet Export Button */}
      {(isMobile || isTablet) && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-9 right-8 z-50"
        >
          <Box
            onClick={exportExcel}
            className="h-14 w-14 rounded-full bg-[#0b3c5d] flex items-center justify-center shadow-lg cursor-pointer active:scale-95"
          >
            <DownloadIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default ExpenseReport;
