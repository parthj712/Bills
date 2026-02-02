"use client";

import { useState, useMemo } from "react";
import { Card, Typography, Box } from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

import { getPeakHours } from "@/utils/reportHelper";

export default function PeakHoursLineChart({ bills }) {
  const [range, setRange] = useState("week");

  // ✅ Filter Bills
  const filteredBills = useMemo(() => {
    if (!bills?.length) return [];

    const now = new Date();

    return bills.filter((bill) => {
      const billDate = new Date(bill.createdAt);

      if (range === "today") {
        return billDate.toDateString() === now.toDateString();
      }

      if (range === "week") {
        const last7 = new Date();
        last7.setDate(now.getDate() - 7);
        return billDate >= last7;
      }

      if (range === "month") {
        const last30 = new Date();
        last30.setDate(now.getDate() - 30);
        return billDate >= last30;
      }

      return true;
    });
  }, [bills, range]);

  // ✅ Peak Hour Data
  const { labels, values } = useMemo(() => {
    return getPeakHours(filteredBills);
  }, [filteredBills]);

  if (!bills?.length)
    return (
      <Typography sx={{ opacity: 0.6, textAlign: "center" }}>
        No bills available
      </Typography>
    );

  return (
    <Card
      sx={{
        borderRadius: "22px",
        p: 3,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        background: "linear-gradient(180deg,#fff,#fafafa)",
      }}
    >
      {/* Header */}
      <Box mb={2}>
        <Typography fontSize={18} fontWeight={700}>
          ⏰ Peak Order Hours
        </Typography>

        <Typography fontSize={13} sx={{ opacity: 0.65 }}>
          Track busiest ordering times
        </Typography>
      </Box>

      {/* ✅ Filter Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={(e, value) => value && setRange(value)}
          sx={{
            background: "#fff",
            borderRadius: "14px",
            border: "1px solid rgba(0,0,0,0.08)",
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
          }}
        >
          <ToggleButton value="today">Today</ToggleButton>
          <ToggleButton value="week">7 Days</ToggleButton>
          <ToggleButton value="month">30 Days</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ✅ Premium Chart */}
      {labels.length > 0 ? (
        <LineChart
          height={270}
          xAxis={[
            {
              scaleType: "point",
              data: labels,
              tickLabelStyle: {
                fontSize: 12,
                fontWeight: 600,
                fill: "#64748b",
              },
            },
          ]}
          series={[
            {
              data: values,
              curve: "catmullRom",

              // ✅ Remove Points Completely
              showMark: false,

              // ✅ Smooth Premium Line
              area: true,
            },
          ]}
          sx={{
            // Axis Styling
            "& .MuiChartsAxis-line": {
              opacity: 0.15,
            },
            "& .MuiChartsAxis-tick": {
              opacity: 0.15,
            },

            // Line Styling
            "& .MuiLineElement-root": {
              strokeWidth: 3,
            },

            // Area Fill Styling
            "& .MuiAreaElement-root": {
              opacity: 0.15,
            },
          }}
        />
      ) : (
        <Typography sx={{ textAlign: "center", opacity: 0.6, mt: 4 }}>
          No orders found in this range
        </Typography>
      )}
    </Card>
  );
}
