"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import OrdersBarChart from "./charts/OrdersBarChart";
import PeakHoursLineChart from "./charts/PeakHoursLineChart";
import RevenueDonutChart from "./charts/RevenueDonutGraph";
import IncomeExpenseDonutGraph from "./charts/IncomeExpenseDonutGraph";

export default function InsightDialog({ open, onClose, insight, bills }) {
  if (!insight) return null;

  /* Render Chart Based on Type */
  const renderChart = () => {
    switch (insight.chartType) {
      case "bar":
        return <OrdersBarChart bills={bills} />;

      case "line":
        return <PeakHoursLineChart bills={bills} />;

      case "donut":
        return <RevenueDonutChart bills={bills} />;

      case "incomeExpense":
        return <IncomeExpenseDonutGraph bills={bills} />;

      default:
        return (
          <Typography fontSize={14} sx={{ opacity: 0.7 }}>
            Chart not available for this insight yet.
          </Typography>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 18px 55px rgba(0,0,0,0.18)",
        },
      }}
    >
      {/* ================= HEADER ================= */}
      <Box
        sx={{
          px: 3,
          py: 2.2,
          background: "linear-gradient(90deg,#0f172a,#1e293b)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Title + Subtitle */}
        <Box>
          <Typography fontSize={18} fontWeight={600}>
            {insight.label} Report
          </Typography>

          <Typography fontSize={13} sx={{ opacity: 0.75 }}>
            Detailed analytics & performance insights
          </Typography>
        </Box>

        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            background: "rgba(255,255,255,0.12)",
            "&:hover": {
              background: "rgba(255,255,255,0.25)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {/* ================= CONTENT ================= */}
      <DialogContent
        sx={{
          p: 3,
          background: "linear-gradient(180deg,#ffffff,#f8fafc)",
        }}
      >
        {renderChart()}
      </DialogContent>

      {/* ================= FOOTER (Optional) ================= */}
      {/* <Box
        sx={{
          px: 3,
          py: 1.5,
          textAlign: "right",
          background: "#f9fafb",
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Typography fontSize={12} sx={{ opacity: 0.6 }}>
          Powered by POS Analytics Suite ⚡
        </Typography>
      </Box> */}
    </Dialog>
  );
}
