"use client";

import { useState, useMemo } from "react";
import { Card, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import { filterBillsByRange, getOrdersPerDay } from "@/utils/reportHelper";
import DateRangeFilter from "@/Componenets/CommonComponents/DateRangeFilter";

export default function OrdersBarChart({ bills }) {
  const [range, setRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // ✅ Filter Bills
  const filteredBills = useMemo(() => {
    return filterBillsByRange(bills, range);
  }, [bills, range]);

  // ✅ Chart Data
  const { labels, values, tooltipDates } = useMemo(() => {
    return getOrdersPerDay(filteredBills);
  }, [filteredBills]);

  return (
    <Card
      sx={{
        borderRadius: "22px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        p: 3,
        background: "linear-gradient(180deg,#fff,#fafafa)",
      }}
    >
      {/* Header */}
      <Box mb={2}>
        <Typography fontSize={18} fontWeight={800}>
          📊 Orders Report
        </Typography>

        <Typography fontSize={13} sx={{ opacity: 0.65 }}>
          Weekly order activity with premium insights
        </Typography>
      </Box>

      {/* ✅ Common Filter */}
      <DateRangeFilter
        range={range}
        setRange={setRange}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
      />

      {/* ✅ Premium Bar Chart */}
      <BarChart
        height={280}
        xAxis={[
          {
            scaleType: "band",
            data: labels,
            tickLabelStyle: {
              fontSize: 13,
              fontWeight: 600,
              fill: "#64748b",
            },
          },
        ]}
        series={[
          {
            data: values,

            // ✅ Tooltip: Show Date + Orders
            valueFormatter: (value, context) => {
              const index = context.dataIndex;
              return `${tooltipDates[index]} • ${value} Orders`;
            },

            // ✅ Rounded Premium Bars
            barRadius: 12,
          },
        ]}
        tooltip={{ trigger: "item" }}
        // ✅ Reduce Bar Width + Premium Shape
        slotProps={{
          bar: {
            rx: 10,
            width: 14, // ✅ Thin Premium Bars
          },
        }}
        sx={{
          // ✅ Smooth Animation
          "& .MuiBarElement-root": {
            transition: "all 0.35s ease",
          },

          // ✅ Hover Effect (Premium Highlight)
          "& .MuiBarElement-root:hover": {
            opacity: 0.85,
            transform: "scaleY(1.08)",
          },

          // Axis styling
          "& .MuiChartsAxis-line": {
            opacity: 0.15,
          },
          "& .MuiChartsAxis-tick": {
            opacity: 0.15,
          },
        }}
      />
    </Card>
  );
}
