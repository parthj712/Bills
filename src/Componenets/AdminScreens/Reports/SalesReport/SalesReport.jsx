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
  Select,
  MenuItem,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useEffect, useMemo, useState } from "react";
import { getBills } from "@/service/billsService";
import { motion } from "framer-motion";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

/* Date Picker */
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/* Excel */
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import BillDetails from "../../AdminBillsManagment/BillDetails";
import SalesBillCard from "./SalesBillCard";
import { getShopInfo } from "@/service/shopService";

export default function SalesReport() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [billsData, setBillsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [shopData, setShopData] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const [openBill, setOpenBill] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const [showReport, setShowReport] = useState(false);
  const [billType, setBilltype] = useState("ALL");
  const isDineIn = shopData?.businessCategory === "DINE_IN";

  const quickRanges = [
    { label: "1 Day", days: 1 },
    { label: "1 Week", days: 7 },
    { label: "1 Month", months: 1 },
    { label: "6 Months", months: 6 },
  ];

  const [activeRange, setActiveRange] = useState(null);

  const billTypeOptions = [
    {
      label: "All",
      value: "ALL",
      icon: <ReceiptLongIcon sx={{ fontSize: 18 }} />,
    },

    // show ONLY if shop supports tables
    ...(isDineIn
      ? [
          {
            label: "Dine-In",
            value: "DINEIN",
            icon: <RestaurantIcon sx={{ fontSize: 18 }} />,
          },
        ]
      : []),

    {
      label: "Takeaway",
      value: "TAKEAWAY",
      icon: <TakeoutDiningIcon sx={{ fontSize: 18 }} />,
    },
  ];

  useEffect(() => {
    getBills().then((res) => {
      const bills = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBillsData(bills);
    });
  }, []);

  const fetchShopData = async () => {
    try {
      const res = await getShopInfo();

      // IMPORTANT
      setShopData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchShopData();
  }, []);
  console.log("billData", billsData);

  const filteredBills = useMemo(() => {
    return billsData.filter((b) => {
      const d = new Date(b.createdAt);

      // Date filter
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;

      // Bill Type filter
      if (billType === "DINEIN" && !b.tableId) return false;
      if (billType === "TAKEAWAY" && b.tableId) return false;
      if (paymentFilter !== "ALL" && b.paymentMethod !== paymentFilter)
        return false;

      return true;
    });
  }, [billsData, fromDate, toDate, billType, paymentFilter]);

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

  const paymentSummary = useMemo(() => {
    return filteredBills.reduce(
      (acc, b) => {
        const method = b.paymentMethod || "CASH"; // ✅ default fallback

        if (method === "CASH") {
          acc.cash += Number(b.grandTotal || 0);
        } else if (method === "UPI") {
          acc.upi += Number(b.grandTotal || 0);
        }

        return acc;
      },
      { cash: 0, upi: 0 },
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
      Payment: b.paymentMethod, // ✅ ADD
      GST: b.gstAmount,
      Total: b.grandTotal,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "Sales_Report.xlsx");
  };
  const tabCount = billTypeOptions.length;
  const activeIndex = billTypeOptions.findIndex(
    (item) => item.value === billType,
  );
  return (
    <Box className="min-h-screen p-2 lg:p-4 md:p-4">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography
            fontSize={isMobile ? 24 : 30}
            fontWeight={isMobile ? 600 : 700}
            className="text-[#000C5A]"
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
          borderRadius: 2,
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
                    borderRadius: 2,
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
                  sx={{ minWidth: isMobile ? "100%" : isTablet ? "100%" : 240 }}
                />

                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(val) => {
                    setToDate(val);
                    setShowReport(false);
                  }}
                  sx={{ minWidth: isMobile ? "100%" : isTablet ? "100%" : 240 }}
                />
              </LocalizationProvider>
            </Box>
          </Box>

          {/* RIGHT SIDE CTA */}

          <Button
            fullWidth={isMobile}
            variant="contained"
            onClick={() => setShowReport(true)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.2,
              backgroundColor: "#0f172a",
              "&:hover": {
                backgroundColor: "#020617",
              },
            }}
          >
            Get Report
          </Button>
        </Box>
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          gap: 2,
          flexWrap: "wrap",
          width: "100%",
          my: 3,
        }}
      >
        {isMobile ? (
          // 🔽 MOBILE → Dropdown
          <Select
            value={billType}
            onChange={(e) => {
              setBilltype(e.target.value);
              setShowReport(false);
            }}
            size="small"
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              borderRadius: "10px",
            }}
          >
            {billTypeOptions.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {item.icon}
                  {item.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        ) : (
          // 🖥 DESKTOP → Your Premium Segmented Control
          <Box
            sx={{
              position: "relative",
              display: "flex",
              background: "linear-gradient(145deg,#eef2f7,#ffffff)",
              borderRadius: "14px",
              padding: "6px",
            }}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                position: "absolute",
                top: 6,
                bottom: 6,
                width: `calc(100% / ${tabCount} - 8px)`,
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                left: `calc(${activeIndex * (100 / tabCount)}% + 6px)`,
              }}
            />

            {billTypeOptions.map((item) => {
              const active = billType === item.value;

              return (
                <Box
                  key={item.value}
                  onClick={() => {
                    setBilltype(item.value);
                    setShowReport(false);
                  }}
                  component={motion.div}
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ y: -1 }}
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    px: 2.6,
                    py: 1.2,
                    minWidth: 130,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    cursor: "pointer",
                    borderRadius: "10px",
                    fontWeight: active ? 600 : 500,
                    fontSize: 14,
                    color: active ? "#ffffff" : "#334155",
                    transition: "all .25s ease",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* PAYMENT FILTER */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {["ALL", "CASH", "UPI"].map((type) => (
          <Chip
            key={type}
            label={type}
            clickable
            color={paymentFilter === type ? "primary" : "default"}
            variant={paymentFilter === type ? "filled" : "outlined"}
            onClick={() => {
              setPaymentFilter(type);
              setShowReport(false);
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 2,
            }}
          />
        ))}
      </Box>

      {showReport && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 2,
            mb: 3,
          }}
        >
          {/* TOTAL SALES */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#0f172a,#1e293b)",
              color: "#fff",
            }}
          >
            <Typography fontSize={14}>Total Sales</Typography>
            <Typography fontSize={22} fontWeight={700}>
              ₹ {totals.total.toFixed(2)}
            </Typography>
          </Paper>

          {/* CASH */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#065f46,#047857)",
              color: "#fff",
            }}
          >
            <Typography fontSize={14}>Cash Collection</Typography>
            <Typography fontSize={22} fontWeight={700}>
              ₹ {paymentSummary.cash.toFixed(2)}
            </Typography>
          </Paper>

          {/* UPI */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
              color: "#fff",
            }}
          >
            <Typography fontSize={14}>UPI Collection</Typography>
            <Typography fontSize={22} fontWeight={700}>
              ₹ {paymentSummary.upi.toFixed(2)}
            </Typography>
          </Paper>
        </Box>
      )}

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
                    "Type",
                    "Payment",
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
                    <TableCell align="center">
                      {b.tableId ? (
                        <Chip label="Dine-In" color="success" size="small" />
                      ) : (
                        <Chip label="Takeaway" color="warning" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={b.paymentMethod || "N/A"}
                        color={
                          b.paymentMethod === "CASH"
                            ? "success"
                            : b.paymentMethod === "UPI"
                              ? "primary"
                              : "default"
                        }
                        size="small"
                      />
                    </TableCell>

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
                  <TableRow
                    sx={{
                      background: "#f1f5f9",
                      "& td": {
                        fontWeight: 700,
                        fontSize: 15,
                        borderTop: "2px solid #cbd5e1",
                      },
                    }}
                  >
                    {/* Date column */}
                    <TableCell align="center">TOTAL</TableCell>

                    {/* Bill No */}
                    <TableCell />

                    {/* Type */}
                    <TableCell />
                    <TableCell />

                    {/* Subtotal */}
                    <TableCell align="center" sx={{ color: "#0f172a" }}>
                      ₹{" "}
                      {totals.subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>

                    {/* GST */}
                    <TableCell align="center" sx={{ color: "#0f172a" }}>
                      ₹{" "}
                      {totals.gst.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>

                    {/* Grand Total (highlighted) */}
                    <TableCell
                      align="center"
                      sx={{
                        color: "#047857",
                        fontSize: 16,
                      }}
                    >
                      ₹{" "}
                      {totals.total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>

                    {/* Action */}
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

          <Paper sx={{ borderRadius: 1.5 }}>
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
                    <TableCell align="right">₹ {v.gst.toFixed(2)}</TableCell>
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

      {/* Bill Modal */}
      <BillDetails
        open={openBill}
        onClose={() => setOpenBill(false)}
        bill={selectedBill}
      />

      {(isMobile || isTablet) && (
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
