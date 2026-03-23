"use client";

import { Typography, Box, Divider } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { getDineInTakeAway } from "@/utils/reportHelper";
import { useEffect, useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { getShopInfo } from "@/service/shopService";

export default function RevenueDonutChart({ bills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const res = await getShopInfo();
        setShopData(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchShopData();
  }, []);

  const isDineIn = shopData?.businessCategory === "DINE_IN";
  if (!bills?.length) return null;

  const totalRevenue = bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);

  let data = [];
  let dineIn = 0;
  let takeAway = 0;

  if (isDineIn) {
    const result = getDineInTakeAway(bills);
    data = result.data;

    dineIn = data.find((d) => d.label === "Dine In")?.value || 0;
    takeAway = data.find((d) => d.label === "Take Away")?.value || 0;
  } else {
    takeAway = totalRevenue;

    data = [
      {
        id: 0,
        value: totalRevenue,
        label: "Orders",
        color: "url(#revenueGradient)",
      },
    ];
  }

  return (
    <Box>
      {/* HEADER */}
      <Box mb={2}>
        <Typography fontSize={isMobile ? 16 : 18} fontWeight={700}>
          {isDineIn ? "🍽 Revenue Split" : "🧾 Total Sales"}
        </Typography>

        <Typography fontSize={12} sx={{ opacity: 0.6 }}>
          {isDineIn
            ? "Dine-In vs TakeAway Contribution"
            : "Total billing revenue"}
        </Typography>
      </Box>

      {/* DONUT */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PieChart
          series={[
            {
              innerRadius: isMobile ? 70 : 95,
              outerRadius: isMobile ? 95 : 120,
              paddingAngle: 2,
              cornerRadius: 6,
              data,
            },
          ]}
          width={isMobile ? 260 : 340}
          height={isMobile ? 240 : 260}
          slotProps={{
            legend: { hidden: true },
          }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
        </PieChart>

        {/* CENTER TEXT */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1.2,
          }}
        >
          <Typography fontSize={11} sx={{ opacity: 0.6 }}>
            Total Revenue
          </Typography>

          <Typography
            fontWeight={800}
            fontSize={isMobile ? 16 : 22}
            sx={{ letterSpacing: "0.5px" }}
          >
            ₹{totalRevenue.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>

      {/* SPLIT CARDS */}
      {isDineIn && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2}
          >
            <SplitCard
              label="Dine In"
              value={dineIn}
              color="#22c55e"
              bg="rgba(34,197,94,0.08)"
            />

            <SplitCard
              label="Take Away"
              value={takeAway}
              color="#3b82f6"
              bg="rgba(59,130,246,0.08)"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

/* ================= SPLIT CARD ================= */
const SplitCard = ({ label, value, color, bg }) => (
  <Box
    flex={1}
    sx={{
      p: 2,
      borderRadius: 3,
      background: bg,
      textAlign: "center",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    }}
  >
    <Typography fontSize={12} sx={{ opacity: 0.7 }}>
      {label}
    </Typography>

    <Typography fontWeight={800} fontSize={16} sx={{ color }}>
      ₹{value.toLocaleString("en-IN")}
    </Typography>
  </Box>
);
