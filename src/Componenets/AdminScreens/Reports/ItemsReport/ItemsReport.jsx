"use client";

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

/* Date Picker */
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

/* Excel Export */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useEffect, useMemo, useState } from "react";
import { getOrders } from "@/service/orderService";
import { motion } from "framer-motion";
import ItemReportCard from "./ItemReportCard";

const ItemsReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [orders, setOrders] = useState([]);

  const [showReport, setShowReport] = useState(false);

  const quickRanges = [
    { label: "1 Day", days: 1 },
    { label: "1 Week", days: 7 },
    { label: "1 Month", months: 1 },
    { label: "6 Months", months: 6 },
  ];

  const [activeRange, setActiveRange] = useState(null);

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.data?.orders || []);
    });
  }, []);
  console.log("orders", orders);
  const filteredOrders = useMemo(() => {
    if (!fromDate || !toDate) return orders;

    return orders.filter((order) => {
      const orderDate = dayjs(order.createdAt);

      return (
        orderDate.isAfter(fromDate.startOf("day")) &&
        orderDate.isBefore(toDate.endOf("day"))
      );
    });
  }, [orders, fromDate, toDate]);

  const itemsReport = useMemo(() => {
    let reportMap = {};

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!reportMap[item.name]) {
          reportMap[item.name] = {
            itemName: item.name,
            category: item.category,
            totalOrders: 0,
            qtySold: 0,
            unitPrice: item.price,
            totalRevenue: 0,
            itemCode: item.itemCode,
          };
        }

        reportMap[item.name].totalOrders += 1;
        reportMap[item.name].qtySold += item.qty;
        reportMap[item.name].totalRevenue += item.total;
      });
    });

    // ✅ Sort highest order count first
    return Object.values(reportMap).sort(
      (a, b) => b.totalOrders - a.totalOrders,
    );
  }, [filteredOrders]);

  const exportExcel = () => {
    const data = itemsReport.map((row) => ({
      "Item Name": row.itemName,
      "Item Category": row.category,
      "Item Code": row.itemCode,
      "Total Orders": row.totalOrders,
      "Qty Sold": row.qtySold,
      "Unit Price": row.unitPrice,
      "Total Revenue": row.totalRevenue,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Items Report");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "Items_Report.xlsx");
  };

  const totals = useMemo(() => {
    return itemsReport.reduce(
      (acc, row) => {
        acc.totalOrders += row.totalOrders;
        acc.qtySold += row.qtySold;
        acc.totalRevenue += row.totalRevenue;
        return acc;
      },
      {
        totalOrders: 0,
        qtySold: 0,
        totalRevenue: 0,
      },
    );
  }, [itemsReport]);

  return (
    <div>
      <Box className="min-h-screen p-2 lg:p-4 md:p-4">
        {/* Header */}
        <Box className="flex items-center justify-between mb-6">
          <Box>
            <Typography
              fontSize={isMobile ? 24 : 30}
              fontWeight={isMobile ? 600 : 700}
              className="text-[#000C5A]"
            >
              Items Report
            </Typography>
            <Typography fontSize={14} color="text.secondary">
              Helps to analyze sales of items over a period of time.
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
                    variant={
                      activeRange === range.label ? "filled" : "outlined"
                    }
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
                      px: 1.5,
                      fontWeight: activeRange === range.label ? 600 : 500,
                      borderRadius: 2
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

        {/* Report Table */}
        {showReport && isDesktop && (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 660 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#0b3c5d" }}>
                    {[
                      "Item Name",
                      "Item Code",
                      "Category",

                      "Total Order Count",
                      "Total Qty Sold",
                      "Unit Price",
                      "Total Revenue",
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
                  {itemsReport.length > 0 ? (
                    <>
                      {/* ✅ Items Rows */}
                      {itemsReport.map((row, index) => (
                        <TableRow key={index} hover>
                          <TableCell align="center">{row.itemName}</TableCell>

                          <TableCell align="center">
                            {row.itemCode || "-"}
                          </TableCell>

                          <TableCell align="center">
                            {row.category || "-"}
                          </TableCell>

                          <TableCell align="center">
                            {row.totalOrders}
                          </TableCell>

                          <TableCell align="center">{row.qtySold}</TableCell>

                          <TableCell align="center">₹{row.unitPrice}</TableCell>

                          <TableCell align="center">
                            ₹{row.totalRevenue}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* ✅ Totals Row */}
                      <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          TOTAL
                        </TableCell>

                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          {totals.totalOrders}
                        </TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          {totals.qtySold}
                        </TableCell>

                        <TableCell align="center">-</TableCell>

                        <TableCell align="center" sx={{ fontWeight: 700 }}>
                          ₹{totals.totalRevenue}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No Data Found
                      </TableCell>
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
            {itemsReport.length > 0 ? (
              itemsReport.map((row, index) => (
                <ItemReportCard key={index} row={row} />
              ))
            ) : (
              <Box className="col-span-full text-center py-6">
                <Typography color="text.secondary">No data found</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

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
    </div>
  );
};

export default ItemsReport;
