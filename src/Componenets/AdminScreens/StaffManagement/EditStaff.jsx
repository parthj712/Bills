"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { updateStaff } from "@/service/staffService";

const EditStaff = ({ open, onClose, staff, onSuccess }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        address: staff.address || "",
        adharCard: staff.adharCard || "",
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateStaff(staff._id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Header */}
      <DialogTitle>
        <Typography fontSize={20} fontWeight={600}>
          Edit Staff Details
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ backgroundColor: "#fafafa" }}>
        <Box className="grid gap-4 mt-4">
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Aadhar Card Number"
            name="adharCard"
            value={formData.adharCard}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={2}
            fullWidth
          />
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#06558e",
            textTransform: "none",
            px: 3,
            "&:hover": { backgroundColor: "#075792" },
          }}
          onClick={handleUpdate}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStaff;
