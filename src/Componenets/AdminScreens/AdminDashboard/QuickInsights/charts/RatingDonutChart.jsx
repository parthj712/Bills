"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  LinearProgress,
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
      label: `${star} Star`,
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
      {/* HEADER */}
      <Box mb={2}>
        <Typography fontSize={18} fontWeight={600}>
          ⭐ Ratings Overview
        </Typography>
        <Typography fontSize={13} sx={{ opacity: 0.6 }}>
          Customer Satisfaction Distribution
        </Typography>
      </Box>

      {/* DONUT CHART */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "1fr" : "1fr 1fr"}
        gap={4}
        alignItems="center"
      >
        {/* Chart */}
        <Box
          position="relative"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <PieChart
            series={[
              {
                data: donutData,
                innerRadius: isMobile ? 60 : 90,
                outerRadius: isMobile ? 90 : 120,
                paddingAngle: 3,
                cornerRadius: 6,
              },
            ]}
            width={isMobile ? 260 : 340}
            height={isMobile ? 240 : 280}
            slotProps={{ legend: { hidden: true } }}
          />

          <Box position="absolute" textAlign="center">
            <Typography fontSize={12} sx={{ opacity: 0.6 }}>
              Average Rating
            </Typography>

            <Typography fontSize={24} fontWeight={800}>
              {avgRating}
            </Typography>

            <Typography fontSize={11} sx={{ opacity: 0.6 }}>
              {totalFeedbacks} Reviews
            </Typography>
          </Box>
        </Box>

        {/* Category Ratings */}
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
                sx={{
                  height: 8,
                  borderRadius: 5,
                  mt: 1,
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* RATING DISTRIBUTION */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "1fr 1fr" : "repeat(5,1fr)"}
        gap={2}
      >
        {[5, 4, 3, 2, 1].map((star) => (
          <Box
            key={star}
            sx={{
              p: 2,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: `${STAR_COLORS[star]}15`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: STAR_COLORS[star],
                }}
              />
              <Typography fontSize={13}>{star} Star</Typography>
            </Box>

            <Typography fontWeight={600}>{distribution[star] || 0}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
