"use client";

import React, { useEffect, useMemo, useState } from "react";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { Add, Delete, Search } from "@mui/icons-material";
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
  TextField,
  Tooltip,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { UploadFile, Description } from "@mui/icons-material";

import AddExpense from "./AddExpense";

import {
  deleteExpense,
  getExpense,
  uploadExcelFile,
} from "@/service/expenseService";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import ExpenseCard from "./ExpenseCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRefreshData } from "@/hooks/useRefreshData";

const ExpenseManagement = () => {
  const { showSnackbar } = useAppSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [openAdd, setOpenAdd] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { refresh } = useRefreshData(showSnackbar);

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpense();

      setExpenseData(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Search Filter
  const filteredExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenseData;

    return expenseData.filter((e) => {
      const blob =
        `${e.note || ""} ${e.paymentMode || ""} ${e.categoryId?.name || ""}`
          .toLowerCase()
          .trim();
      return blob.includes(q);
    });
  }, [expenseData, search]);

  // Total Expense
  const totalExpense = useMemo(() => {
    return expenseData.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenseData]);

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      showSnackbar("Failed to delete expense");
    }
  };

  // Excel Export
  // const handleDownloadExcel = () => {
  //   if (!filteredExpenses.length) return;

  //   const data = filteredExpenses.map((e) => ({
  //     Note: e.note,
  //     Category: e.categoryId?.name || "No Category",
  //     Amount: e.amount,
  //     Payment: e.paymentMode,
  //     Date: new Date(e.date).toLocaleDateString("en-IN"),
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const file = new Blob([excelBuffer], {
  //     type: "application/octet-stream",
  //   });

  //   saveAs(file, `Expenses-${Date.now()}.xlsx`);
  // };

  const handleDownloadEmptyTemplate = () => {
    const headers = ["note", "categoryName", "amount", "paymentMode", "date"];

    const worksheet = XLSX.utils.json_to_sheet([], {
      header: headers,
    });

    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Template");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "expense-upload-template.xlsx");
  };

  const handleExcelSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isExcel) {
      showSnackbar("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    setExcelFile(file);
  };

  const handleUploadExcel = async () => {
    if (!excelFile) return;

    try {
      const res = await uploadExcelFile(excelFile);

      showSnackbar(
        `Uploaded Successfully: ${res.data.inserted} expenses added`,
      );

      setExcelFile(null);
      fetchExpenses();
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };

  const handleRefresh = async () => {
    refresh([fetchExpenses], "Expenses Fetched");
  };
  return (
    <Box className="flex flex-col gap-6 p-2 lg:p-4 md:p-4">
      {/* Header */}
      <Box className="flex flex-col gap-2">
        <Box className="flex w-full items-center gap-3">
          <Typography
            fontSize={isMobile ? 24 : 30}
            fontWeight={700}
            className="text-[#000C5A]"
          >
            Expense Tracker
          </Typography>

          {!isMobile && (
            <Box className="ml-auto">
              <AppButton
                label="Add Expense"
                startIcon={<Add />}
                onClick={() => setOpenAdd(true)}
                sx={{
                  backgroundColor: "#0b3c5d",
                  color: "#fff",
                  px: 2,
                  height: 40,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { backgroundColor: "#0a3552" },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Search + Total */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search note, category, payment..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "#0b3c5d" }} />,
          }}
          sx={{
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            "& fieldset": { border: "none" },
            border: "2px solid",
            borderColor: "gray.200",
            bgcolor: "white",
          }}
        />

        <Box
          sx={{
            backgroundColor: "#e3f2fd",
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontWeight={700} color="#0b3c5d">
            Total Expense: ₹ {totalExpense.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>

      {/* Excel Download */}
      <Box className="flex justify-end gap-2 flex-wrap">
        {/* Download Template */}

        <Tooltip title="Refresh">
          <IconButton
            onClick={handleRefresh}
            sx={{
              backgroundColor: "#ede7f6",
              color: "#5e35b1",
              "&:hover": { backgroundColor: "#d1c4e9" },
            }}
          >
            <RefreshIcon className={loading ? "animate-spin" : ""} />
          </IconButton>
        </Tooltip>
        <Tooltip title="View File Template">
          <IconButton
            onClick={handleDownloadEmptyTemplate}
            sx={{
              backgroundColor: "#fff3e0",
              color: "#ef6c00",
              "&:hover": { backgroundColor: "#ffe0b2" },

              // boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Description />
          </IconButton>
        </Tooltip>

        {/* Upload Excel */}
        <Tooltip title="Upload Excel">
          <IconButton
            component="label"
            sx={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              "&:hover": { backgroundColor: "#c8e6c9" },
            }}
          >
            <UploadFile />
            <input
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelSelect}
            />
          </IconButton>
        </Tooltip>

        {/* Confirm Upload Button */}
        {excelFile && (
          <AppButton
            label="Upload"
            onClick={handleUploadExcel}
            sx={{
              backgroundColor: "#0b3c5d",
              color: "#fff",
              px: 2,
              height: 40,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          />
        )}

        {/* Download Existing Expenses */}
        {/* <Tooltip title="Download Excel">
          <IconButton
            onClick={handleDownloadExcel}
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#0b3c5d",
              "&:hover": { backgroundColor: "#bbdefb" },
            }}
          >
            <Download />
          </IconButton>
        </Tooltip> */}
      </Box>

      {/* Desktop Table */}
      {isDesktop && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Expenses Type",
                  "Category",
                  "Amount",
                  "Payment Mode",
                  "Date",
                  "Actions",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "#0b3c5d",
                      color: "white",
                      fontWeight: 700,
                      textAlign: "center",
                      textTransform: "capitalize",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                filteredExpenses.map((expense, index) => (
                  <TableRow
                    key={expense._id}
                    sx={{
                      textTransform: "capitalize",
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                      "&:hover": { backgroundColor: "#eef6ff" },
                      textAlign: "center",
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>
                      {expense.note || "-"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {expense.categoryId?.name || "No Category"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "#d32f2f",
                        textAlign: "center",
                      }}
                    >
                      ₹ {expense.amount}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {expense.paymentMode?.toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Date(expense.date).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Box className="flex justify-center gap-2">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(expense._id)}
                          sx={{
                            backgroundColor: "#ffebee",
                            color: "#d32f2f",
                            textAlign: "center",
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredExpenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" fontWeight={600}>
                      No expenses found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!isDesktop && (
        <Box className="flex flex-col gap-4">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-9 right-8 z-50"
        >
          <Box
            onClick={() => setOpenAdd(true)}
            sx={{
              height: 56,
              width: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF7A18, #FFB347)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(255,122,24,0.45)",
              cursor: "pointer",
            }}
          >
            <Add sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}

      {/* Modals */}
      <AddExpense
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchExpenses}
      />
    </Box>
  );
};

export default ExpenseManagement;
