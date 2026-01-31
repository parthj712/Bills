"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AddStaff from "./AddStaff";
import {
  deleteStaff,
  getStaff,
  toggleStaffStatus,
} from "@/service/staffService";
import EditStaff from "./EditStaff";
import KpiPill from "../AdminMenuManagement/KpiPill/KpiPill";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewBillStaffDialog from "../AdminBillsManagment/ViewBillStaffDialog/ViewBillStaffDialog";
import { motion } from "framer-motion";
import StaffCard from "./StaffCard";

const MainStaffManagement = () => {


  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));



  const [openAdd, setOpenAdd] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);


  const [openViewDialog, setOpenViewDialog] = useState(false);
  // const [selectedStaff, setSelectedStaff] = useState(null);


  const [search, setSearch] = useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await getStaff();
      setStaffData(res.data?.data || []);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEditOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this staff?")) return;
    try {
      await deleteStaff(id);
      fetchStaff();
    } catch (error) {
      alert("Failed to delete staff");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleStaffStatus(id);
      fetchStaff();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // -------- premium: filter + stats --------
  const filteredStaff = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staffData;

    return staffData.filter((s) => {
      const blob =
        `${s.name || ""} ${s.email || ""} ${s.phone || ""} ${s.adharCard || ""} ${s.address || ""}`
          .toLowerCase()
          .trim();
      return blob.includes(q);
    });
  }, [staffData, search]);

  const stats = useMemo(() => {
    const total = staffData.length;
    const active = staffData.filter((s) => s.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [staffData]);

  return (
    <Box className="flex flex-col gap-6 p-2">
      {/* Premium Header */}
      <Box className="flex flex-col gap-2">
        <Box className="flex w-full items-start md:items-center gap-3 flex-col md:flex-row">
          <Box>
            <Typography fontSize={isMobile ? 24 : 30} fontWeight={isMobile ? 600 : 700} className="text-[#0b3c5d]">
              Staff Management
            </Typography>
          </Box>

          <Box className="md:ml-auto">
            {!isMobile && (
              <AppButton
                label="Add Staff"
                startIcon={<Add />}
                onClick={() => setOpenAdd(true)}
                sx={{
                  backgroundColor: "#0b3c5d",
                  color: "#fff",
                  px: 2,
                  minWidth: 140,
                  height: 40,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "0 10px 20px rgba(11,60,93,0.25)",
                  "&:hover": { backgroundColor: "#0a3552" },
                }}
                size="medium"
              />
            )}
          </Box>
        </Box>

        {/* <Box className="h-[4px] w-40 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" /> */}
      </Box>

      {/* Search + Stats */}
      <Box className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, Aadhaar, address..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "#0b3c5d" }} />,
          }}
          sx={{
            gridColumn: { lg: "span 3" },
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            height: 44,
            "& .MuiInputBase-root": {
              height: 42,
            },
            "& input": {
              fontSize: 14,
              padding: "8px 0",
            },
            "& fieldset": { border: "none" },
            boxShadow: "0 6px 10px rgba(0,0,0,0.06)",
            border: "1px solid",
            borderColor: "gray.200",
            bgcolor: "white",
          }}
        />

        <KpiPill label="Total Staff" value={stats.total} color="primary" />
        <KpiPill label="Active Staff" value={stats.active} color="success" />
        <KpiPill label="Inactive Staff" value={stats.inactive} color="error" />
      </Box>

      {/* Premium Table */}
      {isDesktop && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 45px rgba(0,0,0,0.10)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  // "Aadhaar",
                  // "Address",
                  "Joining Date",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "#0b3c5d",
                      color: "white",
                      fontWeight: 700,
                      borderBottom: "none",
                      py: 2,
                      textAlign: "center",
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
                    {Array.from({ length: 8 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                filteredStaff.map((staff, index) => (
                  <TableRow
                    key={staff._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                      "&:hover": { backgroundColor: "#eef6ff" },
                      transition: "0.2s",
                      textAlign: "center",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: "#0b3c5d", textAlign: "center" }}>
                      {staff.name}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{staff.email}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{staff.phone}</TableCell>
                    {/* <TableCell sx={{ textAlign: "center" }}>{staff.adharCard}</TableCell> */}
                    {/* <TableCell sx={{ maxWidth: 260 }}>
                    <Typography
                      fontSize={13}
                      className="text-gray-700 line-clamp-2"
                    >
                      {staff.address}
                    </Typography>
                  </TableCell> */}
                    <TableCell sx={{ textAlign: "center" }}>
                      {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell sx={{ textAlign: "center" }}>
                      <Box className="flex items-center justify-center gap-3">
                        <Switch
                          checked={!!staff.isActive}
                          color="success"
                          onChange={() => handleToggleStatus(staff._id)}
                        />
                        <Chip
                          size="small"
                          label={staff.isActive ? "Active" : "Inactive"}
                          sx={{
                            fontWeight: 700,
                            borderRadius: 2,
                            backgroundColor: staff.isActive
                              ? "#e8f5e9"
                              : "#ffebee",
                            color: staff.isActive ? "#2e7d32" : "#d32f2f",
                            border: staff.isActive
                              ? "1.5px solid #81c784"
                              : "1.5px solid #ef9a9a",
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell sx={{ textAlign: "right" }}>
                      <Box className="flex items-center justify-center gap-3">
                        <Tooltip title="Edit Staff" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(staff)}
                            sx={{
                              backgroundColor: "#fff3e0",
                              "&:hover": { backgroundColor: "#ffe0b2" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Staff" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(staff._id)}
                            sx={{
                              backgroundColor: "#ffebee",
                              color: "#d32f2f",
                              "&:hover": { backgroundColor: "#ffcdd2" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: "#e3f2fd",
                              "&:hover": { backgroundColor: "#bbdefb" },
                            }}
                            onClick={() => {
                              setSelectedStaff(staff);
                              setOpenViewDialog(true);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 7 }}>
                    <Typography color="text.secondary" fontWeight={600}>
                      No staff found.
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      Try searching with name, email, phone, or Aadhaar.
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
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={160} />
            ))}

          {!loading &&
            filteredStaff.map((staff) => (
              <StaffCard
                key={staff._id}
                staff={staff}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggleStatus}
                onView={(s) => {
                  setSelectedStaff(s);
                  setOpenViewDialog(true);
                }}
              />
            ))}

          {!loading && filteredStaff.length === 0 && (
            <Box className="col-span-full text-center py-8">
              <Typography color="text.secondary">
                No staff found
              </Typography>
            </Box>
          )}
        </Box>
      )}


      {/* Modals */}
      <AddStaff
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={fetchStaff}
      />
      <EditStaff
        open={editOpen}
        onClose={() => setEditOpen(false)}
        staff={selectedStaff}
        onSuccess={fetchStaff}
      />


      <ViewBillStaffDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        staff={selectedStaff}
      />


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
              transition: "0.2s",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Add sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}


    </Box>
  );
};

export default MainStaffManagement;
