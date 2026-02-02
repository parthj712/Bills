"use client";

import { Card, Typography, Box, Divider } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { getDineInTakeAway } from "@/utils/reportHelper";

export default function RevenueDonutChart({ bills }) {
  if (!bills?.length) return null;

  const { totalRevenue, data } = getDineInTakeAway(bills);

  const dineIn = data.find((d) => d.label === "Dine In")?.value || 0;
  const takeAway = data.find((d) => d.label === "Take Away")?.value || 0;
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
          🍽 Revenue Split
        </Typography>

        <Typography fontSize={13} sx={{ opacity: 0.65 }}>
          Dine-In vs TakeAway Contribution
        </Typography>
      </Box>

      {/* Chart Container */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 320,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* ✅ Donut Chart Centered */}
        <PieChart
          series={[
            {
              innerRadius: 75,
              outerRadius: 115,
              paddingAngle: 4,
              cornerRadius: 8,
              data,
            },
          ]}
          width={360}
          height={300}
          slotProps={{
            legend: {
              direction: "row", // ✅ legend below
              position: { vertical: "bottom", horizontal: "middle" },
              padding: 10,
            },
          }}
        />

        {/* ✅ Center Revenue Text */}
        <Box
          sx={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography fontSize={13} sx={{ opacity: 0.6 }}>
            Total Revenue
          </Typography>

          <Typography fontSize={22} fontWeight={800}>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Breakdown Totals */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Dine In */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "16px",
            background: "rgba(34,197,94,0.08)",
            textAlign: "center",
          }}
        >
          <Typography fontSize={13} sx={{ opacity: 0.7 }}>
            Dine In
          </Typography>

          <Typography fontWeight={800} fontSize={16}>
            ₹{dineIn.toLocaleString("en-IN")}
          </Typography>
        </Box>

        {/* Take Away */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "16px",
            background: "rgba(59,130,246,0.08)",
            textAlign: "center",
          }}
        >
          <Typography fontSize={13} sx={{ opacity: 0.7 }}>
            Take Away
          </Typography>

          <Typography fontWeight={800} fontSize={16}>
            ₹{takeAway.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
