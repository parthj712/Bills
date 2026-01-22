"use client";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { Add, Delete, Edit } from "@mui/icons-material";
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
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

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await getStaff();
      console.log(res.data?.data);
      setStaffData(res.data?.data);
    } catch (error) {
      console.log(error.message);
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

  return (
    <Box className="flex flex-col gap-12 p-2">
      <Box className="flex items-center gap-3 w-full">
        <Typography
          fontSize={28}
          fontWeight={600}
          className="text-black  whitespace-nowrap"
        >
          Staff Management
        </Typography>

        <Box className="flex-1 h-[2px] bg-[#06558e]" />
      </Box>

      <Box className="flex item-center justify-between gap-4">
        <TextField
          fullWidth
          placeholder="Search Staff"
          className="max-w-3xl bg-gray-50 rounded-2xl"
        />
        <AppButton
          label="Add Staff"
          startIcon={<Add />}
          onClick={() => setOpenAdd(true)}
          sx={{
            backgroundColor: "#06558e",
            color: "#fff",
            px: 2,
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#075792" },
          }}
          size="small"
        />
      </Box>

      <TableContainer
        sx={{ borderRadius: 4 }}
        component={Paper}
        className="rounded-2xl shadow-none"
      >
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow className="bg-[#06558e]">
              <TableCell className="!text-white">Name</TableCell>

              <TableCell className="!text-white">Email</TableCell>
              <TableCell className="!text-white">Phone</TableCell>
              <TableCell className="!text-white">Adhaar Card</TableCell>
              <TableCell className="!text-white">Address</TableCell>
              <TableCell className="!text-white">Joining Date</TableCell>
              <TableCell className="!text-white">Status</TableCell>
              <TableCell className="!text-white">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffData.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.adharCard}</TableCell>
                <TableCell>{staff.address}</TableCell>
                <TableCell>
                  {new Date(staff.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  <Switch
                    checked={staff.isActive}
                    color="success"
                    onChange={() => handleToggleStatus(staff._id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Tooltip title="Delete Staff" arrow>
                      <IconButton
                        size="small"
                        className="!text-red-500"
                        onClick={() => handleDelete(staff._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Staff" arrow>
                      <IconButton
                        size="small"
                        className="!text-orange-500"
                        onClick={() => handleEdit(staff)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
