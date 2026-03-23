"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import { getExpense } from "@/service/expenseService";

const months = [
  { label: "All", value: "all" },
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const IncomeExpenseDonutGraph = ({ bills }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [expenseList, setExpenseList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");

  // ================= FETCH =================
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await getExpense();
        setExpenseList(res.data || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchExpense();
  }, []);

  // ================= FILTER =================
  const filteredBills = useMemo(() => {
    if (selectedMonth === "all") return bills || [];
    return bills?.filter(
      (bill) => dayjs(bill.createdAt).month() === selectedMonth,
    );
  }, [bills, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    if (selectedMonth === "all") return expenseList;
    return expenseList?.filter(
      (item) => dayjs(item.createdAt).month() === selectedMonth,
    );
  }, [expenseList, selectedMonth]);

  // ================= TOTALS =================
  const totalIncome = useMemo(
    () =>
      filteredBills?.reduce((sum, bill) => sum + (bill.subtotal || 0), 0) || 0,
    [filteredBills],
  );

  const totalExpense = useMemo(
    () =>
      filteredExpenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0,
    [filteredExpenses],
  );

  const total = totalIncome + totalExpense;
  const profit = totalIncome - totalExpense;

  const incomePercent = total ? ((totalIncome / total) * 100).toFixed(1) : 0;
  const expensePercent = total ? ((totalExpense / total) * 100).toFixed(1) : 0;

  return (
    <Box>
      {/* ================= MOBILE VIEW ================= */}
      {isMobile ? (
        <Box>
          {/* BALANCE CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #1e293b, #0f172a)",
              color: "#fff",
              mb: 2,
            }}
          >
            <Typography fontSize={12} sx={{ opacity: 0.7 }}>
              Total Balance
            </Typography>

            <Typography fontSize={22} fontWeight={700}>
              ₹ {profit.toLocaleString()}
            </Typography>

            <Typography
              fontSize={11}
              sx={{
                mt: 0.5,
                color: profit >= 0 ? "#4ade80" : "#f87171",
              }}
            >
              {profit >= 0 ? "Profit" : "Loss"}
            </Typography>
          </Box>

          {/* DONUT CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              mb: 2,
            }}
          >
            <Box position="relative" display="flex" justifyContent="center">
              <PieChart
                series={[
                  {
                    innerRadius: 55,
                    outerRadius: 80,
                    paddingAngle: 2,
                    data: [
                      { value: totalIncome, color: "#22c55e" },
                      { value: totalExpense, color: "#ef4444" },
                    ],
                  },
                ]}
                width={220}
                height={200}
              />

              {/* CENTER TEXT */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: "translate(-50%, -50%)" }}
                textAlign="center"
              >
                <Typography fontSize={11} color="text.secondary">
                  Income
                </Typography>
                <Typography fontWeight={700} fontSize={14}>
                  ₹ {totalIncome.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* KPI CARDS */}
          <Box display="flex" gap={1}>
            <KpiCard title="Income" value={totalIncome} color="#22c55e" />
            <KpiCard title="Expense" value={totalExpense} color="#ef4444" />
          </Box>
        </Box>
      ) : (
        /* ================= DESKTOP VIEW ================= */
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            border: "1px solid #eee",
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
          }}
        >
          {/* HEADER */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
              <Typography fontWeight={600} fontSize={16}>
                Financial Overview
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Income vs Expense breakdown
              </Typography>
            </Box>

            <FormControl size="small">
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <MenuItem key={month.label} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* DONUT */}
          <Box position="relative" display="flex" justifyContent="center">
            <PieChart
              series={[
                {
                  innerRadius: 75,
                  outerRadius: 110,
                  paddingAngle: 2,
                  cornerRadius: 5,
                  data: [
                    { value: totalIncome, color: "#4CAF50" },
                    { value: totalExpense, color: "#F44336" },
                  ],
                },
              ]}
              width={300}
              height={260}
            />

            <Box
              position="absolute"
              top="50%"
              left="50%"
              sx={{ transform: "translate(-50%, -50%)" }}
              textAlign="center"
            >
              <Typography fontSize={12} color="text.secondary">
                Total
              </Typography>
              <Typography fontWeight={700} fontSize={16}>
                ₹ {totalIncome.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* DETAILS */}
          <Stack spacing={1.5}>
            <Row
              label="Income"
              value={totalIncome}
              percent={incomePercent}
              color="#4CAF50"
            />
            <Row
              label="Expense"
              value={totalExpense}
              percent={expensePercent}
              color="#F44336"
            />
            <Row
              label="Profit"
              value={profit}
              color={profit >= 0 ? "#4CAF50" : "#F44336"}
              bold
            />
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

// ================= KPI CARD =================
const KpiCard = ({ title, value, color }) => (
  <Box
    flex={1}
    sx={{
      p: 1.5,
      borderRadius: 2,
      background: "#fff",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    }}
  >
    <Typography fontSize={11} color="text.secondary">
      {title}
    </Typography>
    <Typography fontWeight={700} fontSize={14} sx={{ color }}>
      ₹ {value.toLocaleString()}
    </Typography>
  </Box>
);

// ================= ROW =================
const Row = ({ label, value, percent, color, bold }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <Typography fontSize={13} color="text.secondary">
        {label}
      </Typography>
    </Box>

    <Box textAlign="right">
      <Typography fontWeight={bold ? 700 : 600} fontSize={13}>
        ₹ {value.toLocaleString()}
      </Typography>
      {percent && (
        <Typography fontSize={11} color="text.secondary">
          {percent}%
        </Typography>
      )}
    </Box>
  </Box>
);

export default IncomeExpenseDonutGraph;
