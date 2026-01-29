"use client";

import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import DownloadIcon from "@mui/icons-material/Download";

/* Date Picker */
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

/* Excel Export */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React, { useState } from 'react'

const ItemsReport = () => {

    const [billsData, setBillsData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const [openBill, setOpenBill] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    const [showReport, setShowReport] = useState(false);

    const quickRanges = [
        { label: "1 Day", days: 0 },
        { label: "1 Week", days: 7 },
        { label: "1 Month", months: 1 },
        { label: "6 Months", months: 6 },
    ];

    const [activeRange, setActiveRange] = useState(null);

    const exportExcel = () => {
        const data = filteredBills.map((b) => ({
            "Item Name": b.itemName,
            "Category": b.category,
            "Sub-Category": b.subCategory,
            "Qty Sold": b.qtySold,
            "Total Orders": b.totalOrders,
            "Gross Amount": b.grossAmount,
            "GST": b.gstPercent,
            "GST Amount": b.gstAmount,
            "Final Amount": b.finalAmount,
        }));

        const ws = XLSX.utils.json_to_sheet(data, {
            header: headers,
            skipHeader: false,
        });

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Items Report");

        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), "Items_Report.xlsx");
    };



    return (
        <div>
            <Box className="min-h-screen p-4">
                {/* Header */}
                <Box className="flex items-center justify-between mb-6">
                    <Box>
                        <Typography fontSize={30} fontWeight={700} className="text-[#0b3c5d]">
                            Items Report
                        </Typography>
                        <Typography fontSize={14} color="text.secondary">
                            Helps to analyze sales of items over a period of time.
                        </Typography>
                    </Box>

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
                </Box>


                {/* Filters */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
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
                        <Box display="flex" flexDirection="column" alignItems={"flex-start"} gap={4}>
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
                                            px: 1.5,
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
                                        sx={{ minWidth: 420 }}
                                    />

                                    <DatePicker
                                        label="To Date"
                                        value={toDate}
                                        onChange={(val) => {
                                            setToDate(val);
                                            setShowReport(false);
                                        }}
                                        sx={{ minWidth: 420 }}
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

                {/* Report Table */}

                <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 660 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#0b3c5d" }}>
                                    {["Item Name", "Category", "Sub-Category", "Qty Sold", "Total Orders", "Gross Amount", "GST", "GST Amount", "Final Amount"].map(
                                        (h) => (
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
                                        ),
                                    )}
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                <TableRow
                                    // key={b._id}
                                    hover
                                    sx={{ "&:hover": { backgroundColor: "#f1f5f9" } }}
                                >
                                    <TableCell align="center">
                                        Paneer Kurchaan
                                    </TableCell>
                                    <TableCell align="center">Punjabi</TableCell>
                                    <TableCell align="center">Paneer</TableCell>
                                    <TableCell align="center">40</TableCell>
                                    <TableCell align="center">50</TableCell>
                                    <TableCell align="center">50</TableCell>
                                    <TableCell align="center">5</TableCell>
                                    <TableCell align="center">10</TableCell>
                                    <TableCell align="center">6</TableCell>

                                </TableRow>


                                {/* Totals */}
                                {/* 
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
                                </TableRow> */}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

            </Box>
        </div>
    )
}

export default ItemsReport