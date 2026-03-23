"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  LinearProgress,
  Paper,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { getRatingsSummary } from "@/service/reportService";

const STAR_COLORS = {
  5: "#4f46e5",
  4: "#f59e0b",
  3: "#ef4444",
  2: "#0ea5e9",
  1: "#22c55e",
};

export default function RatingsDonutChart() {
  const [summary, setSummary] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getRatingsSummary();
        setSummary(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSummary();
  }, []);

  if (!summary || !summary.distribution) return null;

  const {
    distribution,
    avgRating,
    totalFeedbacks,
    avgFoodRating,
    avgServiceRating,
    avgAmbienceRating,
  } = summary;

  const donutData = [5, 4, 3, 2, 1]
    .map((star) => ({
      id: star,
      value: distribution[star] || 0,
      color: STAR_COLORS[star],
    }))
    .filter((item) => item.value > 0);

  const ratingBars = [
    { label: "Food", value: Number(avgFoodRating) },
    { label: "Service", value: Number(avgServiceRating) },
    { label: "Ambience", value: Number(avgAmbienceRating) },
  ];

  return (
    <Box>
      {/* ================= MOBILE VIEW ================= */}
      {isMobile ? (
        <Box>
          {/* TOP RATING CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#fff",
              mb: 2,
            }}
          >
            <Typography fontSize={12} sx={{ opacity: 0.7 }}>
              Average Rating
            </Typography>

            <Typography fontSize={26} fontWeight={800}>
              ⭐ {avgRating}
            </Typography>

            <Typography fontSize={11} sx={{ opacity: 0.8 }}>
              {totalFeedbacks} reviews
            </Typography>
          </Box>

          {/* DONUT CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              mb: 2,
            }}
          >
            <Box position="relative" display="flex" justifyContent="center">
              <PieChart
                series={[
                  {
                    data: donutData,
                    innerRadius: 55,
                    outerRadius: 85,
                    paddingAngle: 2,
                  },
                ]}
                width={240}
                height={220}
              />

              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: "translate(-50%, -50%)" }}
                textAlign="center"
              >
                <Typography fontSize={12} color="text.secondary">
                  Rating
                </Typography>
                <Typography fontWeight={700} fontSize={16}>
                  {avgRating}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* CATEGORY CARDS */}
          <Box display="flex" gap={1} mb={2}>
            {ratingBars.map((item) => (
              <Box
                key={item.label}
                flex={1}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: "#fff",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <Typography fontSize={11} color="text.secondary">
                  {item.label}
                </Typography>
                <Typography fontWeight={700} fontSize={14}>
                  {item.value.toFixed(1)} ⭐
                </Typography>
              </Box>
            ))}
          </Box>

          {/* DISTRIBUTION */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Box
                key={star}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: `${STAR_COLORS[star]}15`,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography fontSize={12}>{star} ⭐</Typography>
                <Typography fontWeight={600}>
                  {distribution[star] || 0}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        /* ================= DESKTOP VIEW ================= */
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: "linear-gradient(145deg,#fff,#f8fafc)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER */}
          <Box mb={2}>
            <Typography fontSize={18} fontWeight={600}>
              ⭐ Ratings Overview
            </Typography>
            <Typography fontSize={13} sx={{ opacity: 0.6 }}>
              Customer Satisfaction Distribution
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={4}>
            {/* DONUT */}
            <Box position="relative" display="flex" justifyContent="center">
              <PieChart
                series={[
                  {
                    data: donutData,
                    innerRadius: 90,
                    outerRadius: 120,
                    paddingAngle: 3,
                  },
                ]}
                width={320}
                height={260}
              />

              <Box
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: "translate(-50%, -50%)" }}
                textAlign="center"
              >
                <Typography fontSize={12} sx={{ opacity: 0.6 }}>
                  Avg Rating
                </Typography>
                <Typography fontSize={24} fontWeight={800}>
                  {avgRating}
                </Typography>
                <Typography fontSize={11} sx={{ opacity: 0.6 }}>
                  {totalFeedbacks} Reviews
                </Typography>
              </Box>
            </Box>

            {/* CATEGORY BARS */}
            <Box>
              {ratingBars.map((item) => (
                <Box key={item.label} mb={3}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={14}>{item.label}</Typography>
                    <Typography fontWeight={600}>
                      {item.value.toFixed(1)} ⭐
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={(item.value / 5) * 100}
                    sx={{ height: 8, borderRadius: 5, mt: 1 }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* DISTRIBUTION */}
          <Box display="grid" gridTemplateColumns="repeat(5,1fr)" gap={2}>
            {[5, 4, 3, 2, 1].map((star) => (
              <Box
                key={star}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  background: `${STAR_COLORS[star]}15`,
                }}
              >
                <Typography>{star} ⭐</Typography>
                <Typography fontWeight={600}>
                  {distribution[star] || 0}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
