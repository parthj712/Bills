"use client";

import { useState, useMemo } from "react";
import { Card, Typography, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

import { filterBillsByRange, getPeakHours } from "@/utils/reportHelper";
import DateRangeFilter from "@/Componenets/CommonComponents/DateRangeFilter";

export default function PeakHoursLineChart({ bills }) {
  const [range, setRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // ✅ Filter Bills Using Helper
  const filteredBills = useMemo(() => {
    return filterBillsByRange(bills, range, customFrom, customTo);
  }, [bills, range, customFrom, customTo]);

  // ✅ Chart Data
  const { labels, values } = useMemo(() => {
    return getPeakHours(filteredBills);
  }, [filteredBills]);

  return (
    <Card sx={{ borderRadius: "22px", p: 3 }}>
      <Box mb={2}>
        <Typography fontSize={18} fontWeight={700}>
          ⏰ Peak Order Hours
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

      {/* Chart */}
      {labels.length > 0 ? (
        <LineChart
          height={270}
          xAxis={[{ scaleType: "point", data: labels }]}
          series={[
            {
              data: values,
              curve: "catmullRom",
              showMark: false,
              area: true,
            },
          ]}
        />
      ) : (
        <Typography textAlign="center" sx={{ opacity: 0.6 }}>
          No orders found
        </Typography>
      )}
    </Card>
  );
}
