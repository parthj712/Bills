"use client";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { registerStaff } from "@/service/staffService";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

const AddStaff = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    adharCard: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await registerStaff(formData);
      onClose();
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        adharCard: "",
        phone: "",
        role: "",
      });
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to register staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={600} className="text-center">
        ADD STAFF
      </DialogTitle>

      <DialogContent>
        <Box className="grid grid-cols-2 gap-4 mt-2">
          <TextField
            label="Name"
            name="name"
            fullWidth
            onChange={handleChange}
            className="col-span-2"
            size="small"
          />

          <TextField
            label="Address"
            name="address"
            fullWidth
            multiline
            rows={2}
            className="col-span-2"
            onChange={handleChange}
            size="small"
          />
          <TextField
            label="Aadhar Card"
            name="adharCard"
            fullWidth
            onChange={handleChange}
            className="col-span-2"
            size="small"
          />
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            onChange={handleChange}
            size="small"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            onChange={handleChange}
            size="small"
          />
          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            onChange={handleChange}
            size="small"
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="CASHIER">Cashier</MenuItem>
          </TextField>

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            className="col-span-2"
            onChange={handleChange}
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions className="p-4">
        <AppButton
          label="Cancel"
          variant="outlined"
          className="bg-[#e36504]"
          onClick={onClose}
        />
        <AppButton
          label="Add Staff"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#e36504", color: "#fff" }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddStaff;
