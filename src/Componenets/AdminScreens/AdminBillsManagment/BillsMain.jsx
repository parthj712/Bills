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
  Dialog,
  Button,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { deleteBills, getBills } from "@/service/billsService";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import BillCard from "./BillCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRefreshData } from "@/hooks/useRefreshData";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import BillDetails from "../AdminBillsManagment/BillDetails"; // ✅ import modal

const BillsMain = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [billsData, setBillsData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [openBill, setOpenBill] = useState(false); // ✅ modal state
  const [selectedBill, setSelectedBill] = useState(null); // ✅ selected bill

  const { showSnackbar } = useAppSnackbar();
  const { refresh } = useRefreshData(showSnackbar);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh([fetchBills], "Bills refreshed");
    setRefreshing(false);
  };

  // const handleDelete = async (id) => {

  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this bill?",
  //   );

  //   if (!confirmDelete) return;

  //   try {
  //     await deleteBills(id);
  //     setBillsData((prev) => prev.filter((b) => b._id !== id));
  //     showSnackbar("Bill deleted successfully", "success");
  //   } catch (error) {
  //     showSnackbar("Failed to delete bill", "error");
  //   }
  // };

  const handleDelete = async () => {
    try {
      await deleteBills(selectedDeleteId);

      setBillsData((prev) =>
        prev.filter((b) => b._id !== selectedDeleteId)
      );

      showSnackbar("Bill deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete bill", "error");
    } finally {
      setDeleteDialog(false);
      setSelectedDeleteId(null);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchBills = async () => {
    try {
      const res = await getBills();
      const bills = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBillsData(bills);
    } catch (error) {
      console.log(error?.message || error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // ---------- SEARCH ----------
  const normalize = (s) => (s || "").toString().trim().toLowerCase();

  const filteredBills = useMemo(() => {
    const q = normalize(search);
    if (!q) return billsData;

    return billsData.filter((bill) => {
      const d = new Date(bill.createdAt);
      const formatted = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return (
        normalize(formatted).includes(q) || normalize(bill.billNo).includes(q)
      );
    });
  }, [billsData, search]);

  return (
    <Box className="flex flex-col gap-6 px-4">
      {/* HEADER */}
      <Box className="flex justify-between items-center w-full">
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={700}
          className="text-[#000C5A]"
        >
          Bills Management
        </Typography>

        <IconButton
          onClick={handleRefresh}
          sx={{
            backgroundColor: "#ede7f6",
            color: "#5e35b1",
            "&:hover": { backgroundColor: "#d1c4e9" },
          }}
        >
          <RefreshIcon className={refreshing ? "animate-spin" : ""} />
        </IconButton>
      </Box>

      {/* SEARCH */}
      <TextField
        placeholder="Search bill or date..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      />

      {/* DESKTOP TABLE */}
      {isDesktop && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Date", "Bill No", "SubTotal", "GST", "Total", "Action"].map(
                  (h) => (
                    <TableCell
                      key={h}
                      align="center"
                      sx={{
                        backgroundColor: "#0b3c5d",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBills
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((bill) => (
                  <TableRow key={bill._id} hover>
                    <TableCell align="center">
                      {new Date(bill.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>

                    <TableCell align="center">{bill.billNo}</TableCell>

                    <TableCell align="center">₹ {bill.subtotal}</TableCell>

                    <TableCell align="center">₹ {bill.gstAmount}</TableCell>

                    <TableCell align="center" fontWeight={700}>
                      ₹ {bill.grandTotal}
                    </TableCell>

                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        {/* 👁️ VIEW BUTTON */}
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => {
                              setSelectedBill(bill);
                              setOpenBill(true);
                            }}
                            sx={{
                              backgroundColor: "#e3f2fd",
                              "&:hover": { backgroundColor: "#bbdefb" },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {/* ❌ DELETE ONLY */}
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => {
                              setSelectedDeleteId(bill._id);
                              setDeleteDialog(true);
                            }}
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
                  <TableCell colSpan={6} align="center">
                    No bills found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredBills.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              borderTop: "1px solid #e5e7eb",
            }}
          />
        </TableContainer>
      )}

      {/* MOBILE */}
      {!isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill._id}
              bill={bill}
              onView={(b) => {
                setSelectedBill(b);
                setOpenBill(true);
              }}
              onDelete={(id) => {
                setSelectedDeleteId(id);
                setDeleteDialog(true);
              }} 
            />
          ))}
        </Box>
      )}

      {/* ✅ BILL DETAILS MODAL */}
      <BillDetails
        open={openBill}
        onClose={() => setOpenBill(false)}
        bill={selectedBill}
      />


      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            textAlign: "center",
          },
        }}
      >
        {/* ICON */}
        <Box mb={2}>
          <Typography fontSize={40}>⚠️</Typography>
        </Box>

        {/* TITLE */}
        <Typography fontWeight={700} fontSize={18}>
          Delete Bill?
        </Typography>

        {/* DESCRIPTION */}
        <Typography fontSize={14} color="text.secondary" mt={1}>
          This action cannot be undone. The bill will be permanently removed.
        </Typography>

        {/* ACTIONS */}
        <Box mt={3} display="flex" gap={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setDeleteDialog(false)}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BillsMain;
