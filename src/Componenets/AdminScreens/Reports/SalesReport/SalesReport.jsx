"use client";

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useEffect, useMemo, useState } from "react";
import { getBills } from "@/service/billsService";
import { motion } from "framer-motion";

/* Date Picker */
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/* Excel */
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import BillDetails from "../../AdminBillsManagment/BillDetails";
import SalesBillCard from "./SalesBillCard";
import MonthlySummaryCard from "./MonthlySummaryCard";

export default function SalesReport() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [billsData, setBillsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [openBill, setOpenBill] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [showReport, setShowReport] = useState(false);

  const quickRanges = [
    { label: "1 Day", days: 1 },
    { label: "1 Week", days: 7 },
    { label: "1 Month", months: 1 },
    { label: "6 Months", months: 6 },
  ];

  const [activeRange, setActiveRange] = useState(null);

  useEffect(() => {
    getBills().then((res) => {
      const bills = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBillsData(bills);
    });
  }, []);

  const filteredBills = useMemo(() => {
    return billsData.filter((b) => {
      const d = new Date(b.createdAt);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;
      return true;
    });
  }, [billsData, fromDate, toDate]);

  const totals = useMemo(() => {
    return filteredBills.reduce(
      (acc, b) => {
        acc.subtotal += Number(b.subtotal || 0);
        acc.gst += Number(b.gstAmount || 0);
        acc.total += Number(b.grandTotal || 0);
        return acc;
      },
      { subtotal: 0, gst: 0, total: 0 },
    );
  }, [filteredBills]);

  const monthlySummary = useMemo(() => {
    return filteredBills.reduce((acc, b) => {
      const key = new Date(b.createdAt).toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });

      if (!acc[key]) acc[key] = { total: 0, gst: 0 };
      acc[key].total += Number(b.grandTotal || 0);
      acc[key].gst += Number(b.gstAmount || 0);
      return acc;
    }, {});
  }, [filteredBills]);

  const exportExcel = () => {
    const data = filteredBills.map((b) => ({
      Date: new Date(b.createdAt).toLocaleDateString("en-IN"),
      BillNo: b.billNo,
      Subtotal: b.subtotal,
      GST: b.gstAmount,
      Total: b.grandTotal,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "Sales_Report.xlsx");
  };

  return (
    <Box className="min-h-screen p-4">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography
            fontSize={isMobile ? 24 : 30}
            fontWeight={isMobile ? 600 : 700}
            className="text-[#0b3c5d]"
          >
            Sales Report
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Detailed billing & revenue insights
          </Typography>
        </Box>

        {isDesktop && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportExcel}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
            }}
          >
            Export Excel
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: isMobile ? 8 : 4,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={3}
          flexWrap="wrap"
        >
          {/* LEFT SIDE */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems={"flex-start"}
            gap={4}
          >
            {/* Quick Date Shortcuts */}
            <Box display="flex" gap={1} flexWrap="wrap">
              {quickRanges.map((range) => (
                <Chip
                  key={range.label}
                  size="small"
                  label={range.label}
                  clickable
                  variant={activeRange === range.label ? "filled" : "outlined"}
                  color={activeRange === range.label ? "primary" : "default"}
                  onClick={() => {
                    const today = dayjs();
                    setToDate(today);

                    if (range.days !== undefined) {
                      setFromDate(today.subtract(range.days, "day"));
                    } else {
                      setFromDate(today.subtract(range.months, "month"));
                    }

                    setActiveRange(range.label);
                    setShowReport(false);
                  }}
                  sx={{
                    fontSize: 14,
                    px: isMobile ? 0.5 : 1.5,
                    fontWeight: activeRange === range.label ? 600 : 500,
                  }}
                />
              ))}
            </Box>

            {/* Date Pickers */}
            <Box display="flex" gap={3} flexWrap="wrap">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(val) => {
                    setFromDate(val);
                    setShowReport(false);
                  }}
                  sx={{ minWidth: isMobile ? "100%" : 420 }}
                />

                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(val) => {
                    setToDate(val);
                    setShowReport(false);
                  }}
                  sx={{ minWidth: isMobile ? "100%" : 420 }}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          {/* RIGHT SIDE CTA */}
          <Box>
            <Button
              variant="contained"
              onClick={() => setShowReport(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.2,
                background: "linear-gradient(135deg, #2563EB, #22D3EE)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1E40AF, #06B6D4)",
                },
              }}
            >
              Get Report
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Sales Table */}
      {showReport && isDesktop && (
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 660 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#0b3c5d" }}>
                  {[
                    "Date",
                    "Bill No",
                    "Subtotal",
                    "GST",
                    "Total",
                    "Action",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      align="center"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        backgroundColor: "#0b3c5d",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredBills.map((b) => (
                  <TableRow
                    key={b._id}
                    hover
                    sx={{ "&:hover": { backgroundColor: "#f1f5f9" } }}
                  >
                    <TableCell align="center">
                      {new Date(b.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell align="center">{b.billNo}</TableCell>
                    <TableCell align="center">₹ {b.subtotal}</TableCell>
                    <TableCell align="center">₹ {b.gstAmount}</TableCell>
                    <TableCell align="center" fontWeight={700}>
                      ₹ {b.grandTotal}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          setSelectedBill(b);
                          setOpenBill(true);
                        }}
                        sx={{
                          backgroundColor: "#e3f2fd",
                          "&:hover": { backgroundColor: "#bbdefb" },
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Totals */}
                {filteredBills.length > 0 && (
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell align="center" fontWeight={700}>
                      TOTAL
                    </TableCell>
                    <TableCell />
                    <TableCell align="center" fontWeight={700}>
                      ₹ {totals.subtotal.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" fontWeight={700}>
                      ₹ {totals.gst.toFixed(2)}
                    </TableCell>
                    <TableCell align="center" fontWeight={700}>
                      ₹ {totals.total.toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* MOBILE + TABLET CARDS */}
      {showReport && !isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredBills.map((bill) => (
            <SalesBillCard
              key={bill._id}
              bill={bill}
              onView={(b) => {
                setSelectedBill(b);
                setOpenBill(true);
              }}
            />
          ))}

          {filteredBills.length === 0 && (
            <Box className="col-span-full text-center py-8">
              <Typography color="text.secondary">
                No sales data found
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Monthly Summary */}
      {isDesktop && (
        <Box mt={6}>
          <Typography fontSize={24} fontWeight={700} mb={2} color="#0b3c5d">
            Monthly Summary
          </Typography>

          <Paper sx={{ borderRadius: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell fontWeight={600}>Month</TableCell>
                  <TableCell align="right" fontWeight={600}>
                    GST
                  </TableCell>
                  <TableCell align="right" fontWeight={600}>
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(monthlySummary).map(([m, v]) => (
                  <TableRow key={m} hover>
                    <TableCell>{m}</TableCell>
                    <TableCell align="right">₹ {v.gst}</TableCell>
                    <TableCell align="right" fontWeight={600}>
                      ₹ {v.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* MOBILE + TABLET MONTHLY SUMMARY */}
      {/* {!isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(monthlySummary).map(([month, v]) => (
            <MonthlySummaryCard
              key={month}
              month={month}
              gst={v.gst}
              total={v.total}
            />
          ))}

          {Object.keys(monthlySummary).length === 0 && (
            <Box className="col-span-full text-center py-6">
              <Typography color="text.secondary">
                No summary data available
              </Typography>
            </Box>
          )}
        </Box>
      )} */}

      {/* Bill Modal */}
      <BillDetails
        open={openBill}
        onClose={() => setOpenBill(false)}
        bill={selectedBill}
      />

      {isMobile && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-9 right-8 z-50"
        >
          <Box
            onClick={exportExcel}
            className="
                          h-14 w-14
                          rounded-full
                          bg-[#0b3c5d]
                          flex items-center justify-center
                          shadow-lg
                          cursor-pointer
            active:scale-95
                  "
          >
            <DownloadIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
