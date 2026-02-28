"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
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
  const [expenseList, setExpenseList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");

  // ================= FETCH EXPENSE =================
  const fetchExpense = async () => {
    try {
      const res = await getExpense();
      setExpenseList(res.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, []);
  console.log("bills", bills);

  // ================= FILTERED BILLS =================
  const filteredBills = useMemo(() => {
    if (selectedMonth === "all") return bills || [];

    return bills?.filter((bill) => {
      const billMonth = dayjs(bill.createdAt).month();
      return billMonth === selectedMonth;
    });
  }, [bills, selectedMonth]);

  // ================= FILTERED EXPENSE =================
  const filteredExpenses = useMemo(() => {
    if (selectedMonth === "all") return expenseList;

    return expenseList?.filter((item) => {
      const expenseMonth = dayjs(item.createdAt).month();
      return expenseMonth === selectedMonth;
    });
  }, [expenseList, selectedMonth]);

  // ================= TOTAL INCOME =================
  const totalIncome = useMemo(() => {
    return (
      filteredBills?.reduce((sum, bill) => sum + (bill.subtotal || 0), 0) || 0
    );
  }, [filteredBills]);

  // ================= TOTAL EXPENSE =================
  const totalExpense = useMemo(() => {
    return (
      filteredExpenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0
    );
  }, [filteredExpenses]);

  const profit = totalIncome - totalExpense;

  return (
    <Box>
      {/* Header + Filter */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography fontSize={16} fontWeight={600}>
          Income vs Expense
        </Typography>

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

      {/* ================= DONUT ================= */}
      <PieChart
        height={300}
        series={[
          {
            innerRadius: 70,
            outerRadius: 110,
            paddingAngle: 4,
            data: [
              {
                id: 0,
                value: totalIncome,
                label: "Income",
                color: "#16a34a",
              },
              {
                id: 1,
                value: totalExpense,
                label: "Expense",
                color: "#dc2626",
              },
            ],
          },
        ]}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "middle" },
          },
        }}
      />

      {/* ================= SUMMARY ================= */}
      <Box mt={2}>
        <Typography fontSize={14}>
          💰 Income: ₹ {totalIncome.toLocaleString()}
        </Typography>
        <Typography fontSize={14}>
          💸 Expense: ₹ {totalExpense.toLocaleString()}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={600}
          mt={1}
          color={profit >= 0 ? "success.main" : "error.main"}
        >
          📊 Profit: ₹ {profit.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default IncomeExpenseDonutGraph;
