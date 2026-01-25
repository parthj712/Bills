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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useEffect, useMemo, useState } from "react";
import { getBills } from "@/service/billsService";

/* Date Picker */
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/* Excel */
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import BillDetails from "../AdminBillsManagment/BillDetails";

export default function SalesReport() {
  const [billsData, setBillsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [openBill, setOpenBill] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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
    <Box className="min-h-screen bg-[#f4f7fb] p-6">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography fontSize={30} fontWeight={700} color="#0b3c5d">
            Sales Report
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Detailed billing & revenue insights
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
        <Box display="flex" gap={3} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
            />
            <DatePicker label="To Date" value={toDate} onChange={setToDate} />
          </LocalizationProvider>

          <Chip
            label={`${filteredBills.length} Bills`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Sales Table */}
      <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#0b3c5d" }}>
                {["Date", "Bill No", "Subtotal", "GST", "Total", "Action"].map(
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

      {/* Monthly Summary */}
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

      {/* Bill Modal */}
      <BillDetails
        open={openBill}
        onClose={() => setOpenBill(false)}
        bill={selectedBill}
      />
    </Box>
  );
}
