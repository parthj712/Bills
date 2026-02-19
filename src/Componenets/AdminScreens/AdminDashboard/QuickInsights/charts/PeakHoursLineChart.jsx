"use client";

import { useState, useMemo } from "react";
import { Card, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme, useMediaQuery } from "@mui/material";


import { filterBillsByRange, getPeakHours } from "@/utils/reportHelper";
import DateRangeFilter from "@/Componenets/CommonComponents/DateRangeFilter";

export default function PeakHoursLineChart({ bills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [range, setRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const filteredBills = useMemo(() => {
    return filterBillsByRange(bills, range, customFrom, customTo);
  }, [bills, range, customFrom, customTo]);

  const { labels, values } = useMemo(() => {
    return getPeakHours(filteredBills);
  }, [filteredBills]);

  return (
    <Card
      sx={{
        borderRadius: 2,
        p: isMobile ? 2 : 3,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <Box mb={isMobile ? 1.5 : 2}>
        <Typography
          fontSize={isMobile ? 16 : 18}
          fontWeight={700}
        >
          ⏰ Peak Order Hours
        </Typography>

        <Typography
          fontSize={isMobile ? 12 : 13}
          sx={{ opacity: 0.6 }}
        >
          Orders distribution across the day
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
      {labels.length > 0 ? (
        <Box sx={{ overflowX: "auto" }}>
          <LineChart
            height={isMobile ? 220 : 270}
            xAxis={[
              {
                scaleType: "point",
                data: labels,
                tickLabelStyle: {
                  fontSize: isMobile ? 10 : 12,
                  fill: "#64748b",
                },
              },
            ]}
            series={[
              {
                data: values,
                curve: "catmullRom",
                showMark: !isMobile, // hide dots on mobile
                area: true,
                lineWidth: isMobile ? 3 : 2, // thicker on mobile
              },
            ]}
            sx={{
              "& .MuiAreaElement-root": {
                opacity: 0.15,
              },
              "& .MuiLineElement-root": {
                transition: "all 0.3s ease",
              },
            }}
          />
        </Box>
      ) : (
        <Box py={4}>
          <Typography
            textAlign="center"
            fontSize={14}
            sx={{ opacity: 0.6 }}
          >
            No orders found
          </Typography>
        </Box>
      )}
    </Card>
  );
}

