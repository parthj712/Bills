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
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AddStaff from "./AddStaff";
import {
  deleteStaff,
  getStaff,
  toggleStaffStatus,
} from "@/service/staffService";
import EditStaff from "./EditStaff";

const MainStaffManagement = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

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
        <Box className="flex items-center justify-between gap-3">
          <Box>
            <Typography
              fontSize={30}
              fontWeight={800}
              className="text-[#0b3c5d]"
            >
              Staff Management
            </Typography>
            <Typography fontSize={13} className="text-gray-500">
              Manage staff records, status, and actions in one place.
            </Typography>
          </Box>

          <AppButton
            label="Add Staff"
            startIcon={<Add />}
            onClick={() => setOpenAdd(true)}
            sx={{
              backgroundColor: "#0b3c5d",
              color: "#fff",
              px: 2,
              minWidth: 140,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "0 10px 20px rgba(11,60,93,0.25)",
              "&:hover": { backgroundColor: "#0a3552" },
            }}
            size="medium"
          />
        </Box>

        <Box className="h-[4px] w-40 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
      </Box>

      {/* Search + Stats */}
      <Box className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-stretch">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, Aadhaar, address..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "#8a8a8a" }} />,
          }}
          sx={{
            gridColumn: { lg: "span 3" },
            backgroundColor: "#f9fafb",
            borderRadius: 3,
            "& fieldset": { border: "none" },
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            Total Staff
          </Typography>
          <Typography fontSize={22} fontWeight={800} color="#0b3c5d">
            {stats.total}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            Active
          </Typography>
          <Typography fontSize={22} fontWeight={800} color="#2e7d32">
            {stats.active}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            Inactive
          </Typography>
          <Typography fontSize={22} fontWeight={800} color="#d32f2f">
            {stats.inactive}
          </Typography>
        </Paper>
      </Box>

      {/* Premium Table */}
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
                "Aadhaar",
                "Address",
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
                  }}
                >
                  <TableCell sx={{ fontWeight: 700, color: "#0b3c5d" }}>
                    {staff.name}
                  </TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.phone}</TableCell>
                  <TableCell>{staff.adharCard}</TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography
                      fontSize={13}
                      className="text-gray-700 line-clamp-2"
                    >
                      {staff.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell>
                    <Box className="flex items-center gap-3">
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
                        }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box className="flex items-center gap-2">
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
    </Box>
  );
};

export default MainStaffManagement;
