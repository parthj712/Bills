"use client";

import { Card, Typography, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getOrdersPerDay } from "@/utils/reportHelper";

export default function OrdersBarChart({ bills }) {
  if (!bills?.length) return null;

  const { labels, values, tooltipDates } = getOrdersPerDay(bills);

  return (
    <Card
      sx={{
        borderRadius: "22px",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        p: 3,
        background: "linear-gradient(180deg,#ffffff,#fafafa)",
      }}
    >
      {/* Header */}
      <Box mb={2}>
        <Typography fontSize={18} fontWeight={700}>
          📊 Orders This Week
        </Typography>

        <Typography fontSize={13} sx={{ opacity: 0.65 }}>
          Weekly order activity overview
        </Typography>
      </Box>

      {/* Premium Chart */}
      <BarChart
        height={260}
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

            // ✅ Tooltip shows full date + orders
            valueFormatter: (value, context) => {
              const index = context.dataIndex;
              return `${tooltipDates[index]} • ${value} Orders`;
            },

            barRadius: 10,
          },
        ]}
        tooltip={{ trigger: "item" }}
        slotProps={{
          bar: {
            rx: 6,
            width: 18,
          },
        }}
        sx={{
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
