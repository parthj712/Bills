"use client";

import { useState, useMemo } from "react";
import { Card, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme, useMediaQuery } from "@mui/material";


import { filterBillsByRange, getOrdersPerDay } from "@/utils/reportHelper";
import DateRangeFilter from "@/Componenets/CommonComponents/DateRangeFilter";

export default function OrdersBarChart({ bills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [range, setRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const filteredBills = useMemo(() => {
    return filterBillsByRange(bills, range);
  }, [bills, range]);

  const { labels, values, tooltipDates } = useMemo(() => {
    return getOrdersPerDay(filteredBills);
  }, [filteredBills]);

  const totalOrders = values.reduce((a, b) => a + b, 0);

  return (
    <Box>
      {/* Header */}
      <Box mb={isMobile ? 1.5 : 2}>
        <Typography
          fontSize={isMobile ? 16 : 18}
          fontWeight={600}
        >
          📊 Orders Report
        </Typography>

        <Typography
          fontSize={isMobile ? 12 : 13}
          sx={{ opacity: 0.65 }}
        >
          Weekly order activity with insights
        </Typography>
      </Box>

      {/* Total Orders Highlight */}
      <Box mb={2}>
        <Typography
          fontSize={isMobile ? 24 : 28}
          fontWeight={800}
          color="#1e293b"
        >
          {totalOrders}
        </Typography>
        <Typography fontSize={12} color="#64748b">
          Total Orders
        </Typography>
      </Box>

      {/* Filter */}
      <Box mb={2}>
        <DateRangeFilter
          range={range}
          setRange={setRange}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
          isMobile={isMobile}
        />
      </Box>

      {/* Chart */}
      <Box sx={{ overflowX: "auto" }}>
        <BarChart
          height={isMobile ? 220 : 280}
          xAxis={[
            {
              scaleType: "band",
              data: labels,
              tickLabelStyle: {
                fontSize: isMobile ? 11 : 13,
                fontWeight: 600,
                fill: "#64748b",
              },
            },
          ]}
          series={[
            {
              data: values,
              valueFormatter: (value, context) => {
                const index = context.dataIndex;
                return `${tooltipDates[index]} • ${value} Orders`;
              },
              barRadius: 8,
            },
          ]}
          tooltip={{ trigger: "item" }}
          slotProps={{
            bar: {
              width: isMobile ? 18 : 14, // ✅ thicker on mobile
              rx: 8,
            },
          }}
          sx={{
            "& .MuiBarElement-root": {
              transition: "all 0.3s ease",
            },
            "& .MuiBarElement-root:hover": {
              opacity: 0.85,
              transform: "scaleY(1.05)",
            },
            "& .MuiChartsAxis-line": {
              opacity: 0.1,
            },
            "& .MuiChartsAxis-tick": {
              opacity: 0.1,
            },
          }}
        />
      </Box>
    </Box>
  );
}

