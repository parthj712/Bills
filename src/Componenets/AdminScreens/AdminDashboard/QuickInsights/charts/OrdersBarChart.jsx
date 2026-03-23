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
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { filterBillsByRange, getOrdersPerDay } from "@/utils/reportHelper";
import DateRangeFilter from "@/Componenets/CommonComponents/DateRangeFilter";

export default function OrdersBarChart({ bills }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [range, setRange] = useState("week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  /* ---------- FILTER ---------- */
  const filteredBills = useMemo(() => {
    return filterBillsByRange(bills, range);
  }, [bills, range]);

  const { labels, values, tooltipDates } = useMemo(() => {
    return getOrdersPerDay(filteredBills);
  }, [filteredBills]);

  /* ---------- STATS ---------- */
  const totalOrders = values.reduce((a, b) => a + b, 0);
  const avgOrders = values.length
    ? (totalOrders / values.length).toFixed(1)
    : 0;

  /* ================= UI ================= */

  return (
    <Box>
      {/* ================= MOBILE VIEW ================= */}
      {isMobile ? (
        <Box>
          {/* TOP CARD */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #059669, #065f46)",
              color: "#fff",
              mb: 2,
            }}
          >
            <Typography fontSize={12} sx={{ opacity: 0.7 }}>
              Total Orders
            </Typography>

            <Typography fontSize={24} fontWeight={800}>
              {totalOrders}
            </Typography>

            <Chip
              icon={<TrendingUpIcon />}
              label={`Avg ${avgOrders}/day`}
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
            <Box sx={{ overflowX: "auto" }}>
              <BarChart
                height={220}
                xAxis={[
                  {
                    scaleType: "band",
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
                  },
                ]}
                slotProps={{
                  bar: {
                    width: 18,
                    rx: 8,
                  },
                }}
                sx={{
                  "& .MuiChartsAxisHighlight-root": {
                    display: "none",
                  },

                  "& .MuiBarElement-root": {
                    fill: "url(#mobileBarGradient)",
                  },
                }}
              >
                <defs>
                  <linearGradient
                    id="mobileBarGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </BarChart>
            </Box>
          </Box>
        </Box>
      ) : (
        /* ================= DESKTOP VIEW ================= */
        <Card
          sx={{
            p: 3,
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.8))",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          {/* HEADER */}
          <Box mb={2}>
            <Typography fontSize={18} fontWeight={700}>
              📊 Orders Analytics
            </Typography>

            <Typography fontSize={12} sx={{ opacity: 0.6 }}>
              Track order trends & performance insights
            </Typography>
          </Box>

          {/* STATS */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box>
              <Typography fontSize={30} fontWeight={800}>
                {totalOrders}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Total Orders
              </Typography>
            </Box>

            <Chip
              icon={<TrendingUpIcon />}
              label={`Avg ${avgOrders}/day`}
              sx={{
                fontWeight: 600,
                background: "rgba(34,197,94,0.1)",
                color: "#16a34a",
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
          <Box sx={{ overflowX: "auto" }}>
            <BarChart
              height={300}
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
                  valueFormatter: (value, context) => {
                    const index = context.dataIndex;
                    return `${tooltipDates[index]} • ${value} Orders`;
                  },
                },
              ]}
              tooltip={{ trigger: "item" }}
              slotProps={{
                bar: {
                  width: 16,
                  rx: 10,
                },
              }}
              sx={{
                "& .MuiChartsAxisHighlight-root": {
                  display: "none",
                },

                "& .MuiBarElement-root": {
                  fill: "url(#barGradient)",
                  transition: "all 0.3s ease",
                },

                "& .MuiBarElement-root:hover": {
                  opacity: 0.9,
                  transform: "scaleY(1.08)",
                },
              }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </Box>
        </Card>
      )}
    </Box>
  );
}
