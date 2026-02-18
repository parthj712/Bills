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
  TextField,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getBills } from "@/service/billsService";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BillCard from "./BillCard";

const BillsMain = () => {
  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [billsData, setBillsData] = useState([]);
  const [search, setSearch] = useState("");

  console.log("bills", billsData);
  const fetchBills = async () => {
    try {
      const res = await getBills();
      // If your API returns { data: [...] } then use res.data.data
      // If your API returns directly [...] then use res.data
      const bills = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBillsData(bills);
    } catch (error) {
      console.log(error?.message || error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ---------- helpers ----------
  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  const monthIndexFromName = (name) => {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const idx = months.findIndex((m) => name.startsWith(m));
    return idx; // -1 if not found
  };

  // Accept: "2026-01" "2026/01" "01/2026" "01-2026" "jan 2026" "january 2026" "jan"
  const parseMonthYearQuery = (q) => {
    const s = normalize(q);
    if (!s) return null;

    // yyyy-mm or yyyy/mm
    let m = s.match(/^(\d{4})[\/\-](\d{1,2})$/);
    if (m) return { year: Number(m[1]), month: Number(m[2]) - 1 };

    // mm-yyyy or mm/yyyy
    m = s.match(/^(\d{1,2})[\/\-](\d{4})$/);
    if (m) return { year: Number(m[2]), month: Number(m[1]) - 1 };

    // "jan 2026" / "january 2026"
    m = s.match(/^([a-z]+)\s+(\d{4})$/);
    if (m) {
      const mi = monthIndexFromName(m[1]);
      if (mi >= 0) return { year: Number(m[2]), month: mi };
    }

    // only "jan" / "january"
    const mi = monthIndexFromName(s);
    if (mi >= 0) return { year: null, month: mi };

    return null;
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const filteredBills = useMemo(() => {
    const q = normalize(search);
    if (!q) return billsData;

    const monthYear = parseMonthYearQuery(q);

    // If query looks like month/year, filter by month/year
    if (monthYear) {
      return billsData.filter((bill) => {
        const d = new Date(bill.createdAt);
        if (Number.isNaN(d.getTime())) return false;

        const monthOk = d.getMonth() === monthYear.month;
        const yearOk =
          monthYear.year == null ? true : d.getFullYear() === monthYear.year;

        return monthOk && yearOk;
      });
    }

    // Try parse as a full date (any browser supported format)
    const parsed = new Date(search);
    const parsedValid = !Number.isNaN(parsed.getTime());

    return billsData.filter((bill) => {
      const d = new Date(bill.createdAt);
      if (Number.isNaN(d.getTime())) return false;

      // If user entered a valid date, match exact day
      if (parsedValid) return isSameDay(d, parsed);

      // Fallback: string contains match on formatted date
      const formatted = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      // Example formatted: "22 Jan 2026"
      return normalize(formatted).includes(q);
    });
  }, [billsData, search]);

  const totals = useMemo(() => {
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    return filteredBills.reduce(
      (acc, bill) => {
        acc.subtotal += toNum(bill.subtotal);
        acc.gstAmount += toNum(bill.gstAmount);
        acc.grandTotal += toNum(bill.grandTotal);
        return acc;
      },
      { subtotal: 0, gstAmount: 0, grandTotal: 0 },
    );
  }, [filteredBills]);

  return (
    <Box className="flex flex-col gap-6 px-4">
      <Box className="flex flex-col gap-2 w-full">
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          className="text-[#000C5A]"
        >
          Bills Management
        </Typography>

        {/* <Box className="h-[4px] w-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" /> */}
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-1 gap-4 items-stretch">
        {/* Search */}
        <TextField
          size="medium"
          placeholder="Search by date or month (Jan 2026, 22/01/2026...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#0b3c5d" }} />,
          }}
          // className="grid-cols-1"
          sx={{
            gridColumn: { lg: "span 3" },
            backgroundColor: "#f9fafb",
            borderRadius: 1.5,
            height: 44,
            "& .MuiInputBase-root": {
              height: 44,
            },
            "& input": {
              fontSize: 14,
              padding: "8px 0",
            },
            "& fieldset": { border: "none" },
            // boxShadow: "0 6px 10px rgba(0,0,0,0.06)",
            border: "2px solid",
            borderColor: "gray.200",
            bgcolor: "white",
          }}
        />

        {/* Subtotal */}
        {/* <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            transition: "0.3s",
            "&:hover": { transform: "translateY(-3px)" },
          }}
        >
          <Typography fontSize={13} color="text.secondary">
            Subtotal
          </Typography>
          <Typography fontSize={22} fontWeight={700} color="#1976d2">
            ₹ {totals.subtotal.toFixed(2)}
          </Typography>
        </Paper> */}

        {/* GST */}
        {/* <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            transition: "0.3s",
            "&:hover": { transform: "translateY(-3px)" },
          }}
        >
          <Typography fontSize={13} color="text.secondary">
            GST
          </Typography>
          <Typography fontSize={22} fontWeight={700} color="#ed6c02">
            ₹ {totals.gstAmount.toFixed(2)}
          </Typography>
        </Paper> */}

        {/* Grand Total */}
        {/* <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            transition: "0.3s",
            "&:hover": { transform: "translateY(-3px)" },
          }}
        >
          <Typography fontSize={13} color="text.secondary">
            Grand Total
          </Typography>
          <Typography fontSize={22} fontWeight={700} color="#2e7d32">
            ₹ {totals.grandTotal.toFixed(2)}
          </Typography>
        </Paper> */}
      </Box>
      {isDesktop && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            // boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            alignItems: "left",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Date",
                  "Bill No",
                  "SubTotal",
                  "GST Amount",
                  "Grand Total",
                  "Action",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "#0b3c5d",
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBills.map((bills, index) => (
                <TableRow
                  key={bills._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                    "&:hover": { backgroundColor: "#eef6ff" },
                    textAlign: "left",
                  }}
                >
                  <TableCell align="center">
                    {new Date(bills.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell fontWeight={600} align="center">
                    {bills.billNo}
                  </TableCell>
                  <TableCell align="center">₹ {bills.subtotal}</TableCell>
                  <TableCell align="center">₹ {bills.gstAmount}</TableCell>
                  <TableCell align="center" fontWeight={700}>
                    ₹ {bills.grandTotal}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1.5,
                      }}
                    >
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: "#e3f2fd",
                            "&:hover": { backgroundColor: "#bbdefb" },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: "#e8f5e9",
                            "&:hover": { backgroundColor: "#c8e6c9" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: "#ffebee",
                            "&:hover": { backgroundColor: "#ffcdd2" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {filteredBills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      No bills found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MOBILE + TABLET CARDS */}
      {!isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredBills.map((bill) => (
            <BillCard key={bill._id} bill={bill} />
          ))}

          {filteredBills.length === 0 && (
            <Box className="col-span-full text-center py-8">
              <Typography color="text.secondary">No bills found</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default BillsMain;
