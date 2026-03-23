"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Typography,
  Box,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { LineChart } from "@mui/x-charts/LineChart";

import DateRangeFilter from "@/Componenets/CommonComponents/DateRangeFilter";
import { filterBillsByRange, getPeakHours } from "@/utils/reportHelper";

export default function PeakHoursLineChart({ bills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  const [range, setRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* ---------- FILTER ---------- */
  const filteredBills = useMemo(() => {
    return filterBillsByRange(bills, range, customFrom, customTo);
  }, [bills, range, customFrom, customTo]);

  const { labels, values } = useMemo(() => {
    return getPeakHours(filteredBills);
  }, [filteredBills]);

  /* ---------- INSIGHTS ---------- */
  const total = values.reduce((a, b) => a + b, 0);
  const avg = values.length ? (total / values.length).toFixed(1) : 0;

  const peakIndex = values.indexOf(Math.max(...values));
  const peakHour = labels[peakIndex] || "-";
  const peakValue = values[peakIndex] || 0;

  /* ================= UI ================= */

  return (
    <Box>
      {/* ================= MOBILE VIEW ================= */}
      {isMobile ? (
        <Box>
          {/* TOP HIGHLIGHT CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #4f46e5, #312e81)",
              color: "#fff",
              mb: 2,
            }}
          >
            <Typography fontSize={12} sx={{ opacity: 0.7 }}>
              Peak Hour
            </Typography>

            <Typography fontSize={22} fontWeight={800}>
              {peakHour}
            </Typography>

            <Typography fontSize={11} sx={{ opacity: 0.8 }}>
              {peakValue} orders
            </Typography>

            <Chip
              icon={<AccessTimeIcon />}
              label={`Avg ${avg}/hr`}
              sx={{
                mt: 1,
                fontSize: 11,
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            />
          </Box>

          {/* FILTER */}
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

          {/* CHART CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "#fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            }}
          >
            {labels.length > 0 ? (
              <LineChart
                height={220}
                xAxis={[
                  {
                    scaleType: "point",
                    data: labels,
                    tickLabelStyle: {
                      fontSize: 10,
                      fill: "#64748b",
                    },
                  },
                ]}
                series={[
                  {
                    data: values,
                    curve: "catmullRom",
                    showMark: false,
                    area: true,
                    lineWidth: 3,
                  },
                ]}
                sx={{
                  "& .MuiChartsAxisHighlight-root": { display: "none" },
                  "& .MuiChartsHighlight-root": { display: "none" },

                  "& .MuiLineElement-root": {
                    stroke: "#4f46e5",
                  },

                  "& .MuiAreaElement-root": {
                    fill: "url(#areaGradientMobile)",
                  },
                }}
              >
                <defs>
                  <linearGradient
                    id="areaGradientMobile"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop
                      offset="100%"
                      stopColor="#4f46e5"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
              </LineChart>
            ) : (
              <Typography textAlign="center" py={3}>
                No orders found
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        /* ================= DESKTOP VIEW ================= */
        <Card
          sx={{
            p: 3,
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            background: isDark
              ? "linear-gradient(135deg, #1e293b, #0f172a)"
              : "linear-gradient(135deg, #ffffff, #f8fafc)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER */}
          <Box mb={2}>
            <Typography fontSize={18} fontWeight={700}>
              ⏰ Peak Order Hours
            </Typography>

            <Typography fontSize={12} sx={{ opacity: 0.6 }}>
              Orders distribution across the day
            </Typography>
          </Box>

          {/* INSIGHTS */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography fontSize={26} fontWeight={800}>
                {peakHour}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Peak Hour ({peakValue} orders)
              </Typography>
            </Box>

            <Chip
              icon={<AccessTimeIcon />}
              label={`Avg ${avg}/hr`}
              sx={{
                fontWeight: 600,
                background: "rgba(59,130,246,0.1)",
                color: "#2563eb",
              }}
            />
          </Stack>

          {/* FILTER */}
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

          {/* CHART */}
          {labels.length > 0 ? (
            <LineChart
              height={280}
              xAxis={[{ scaleType: "point", data: labels }]}
              series={[
                {
                  data: values,
                  curve: "catmullRom",
                  area: true,
                },
              ]}
            />
          ) : (
            <Typography textAlign="center" py={4}>
              No orders found
            </Typography>
          )}
        </Card>
      )}
    </Box>
  );
}
