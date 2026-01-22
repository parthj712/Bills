"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { registerStaff } from "@/service/staffService";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import React, { useEffect, useMemo, useState } from "react";

const AddStaff = ({ open, onClose, onSuccess }) => {
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
  const [touched, setTouched] = useState({});

  // Reset when opening (premium UX)
  useEffect(() => {
    if (open) {
      setTouched({});
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const markTouched = (name) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.adharCard.trim()) e.adharCard = "Aadhaar is required";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    if (!formData.email.trim()) e.email = "Email is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      e.email = "Enter a valid email";
    if (!formData.role) e.role = "Role is required";
    if (!formData.password) e.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      e.password = "Min 6 characters";
    return e;
  }, [formData]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setTouched({
        name: true,
        email: true,
        password: true,
        address: true,
        adharCard: true,
        phone: true,
        role: true,
      });
      return;
    }

    try {
      setLoading(true);
      await registerStaff(formData);

      onClose?.();
      onSuccess?.();

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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,0.20)",
        },
      }}
    >
      {/* Premium Header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2.2,
          pb: 1.6,
          background: "linear-gradient(90deg,#0b3c5d,#0ea5e9)",
        }}
      >
        <Box className="flex items-start justify-between gap-3">
          <Box className="flex items-center gap-2">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.16)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <PersonAddRoundedIcon sx={{ color: "white" }} />
            </Box>

            <Box>
              <DialogTitle
                sx={{ p: 0, color: "white", fontWeight: 900, fontSize: 20 }}
              >
                Add Staff
              </DialogTitle>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Create staff account and assign role
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.12)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.20)" },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 2.5, backgroundColor: "#fbfdff" }}>
        <Typography fontWeight={900} className="text-[#0b3c5d]" mb={1}>
          Staff Details
        </Typography>
        <Typography fontSize={12} className="text-gray-500" mb={2}>
          Please enter correct details for billing access and login credentials.
        </Typography>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => markTouched("name")}
            error={!!(touched.name && errors.name)}
            helperText={touched.name && errors.name ? errors.name : " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
            className="md:col-span-2"
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => markTouched("phone")}
            error={!!(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone ? errors.phone : " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIphoneRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => markTouched("email")}
            error={!!(touched.email && errors.email)}
            helperText={touched.email && errors.email ? errors.email : " "}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
          />

          <TextField
            label="Aadhaar Card"
            name="adharCard"
            value={formData.adharCard}
            onChange={handleChange}
            onBlur={() => markTouched("adharCard")}
            error={!!(touched.adharCard && errors.adharCard)}
            helperText={
              touched.adharCard && errors.adharCard ? errors.adharCard : " "
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
            className="md:col-span-2"
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            multiline
            rows={2}
            onChange={handleChange}
            onBlur={() => markTouched("address")}
            error={!!(touched.address && errors.address)}
            helperText={
              touched.address && errors.address ? errors.address : " "
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
            className="md:col-span-2"
          />

          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            onBlur={() => markTouched("role")}
            error={!!(touched.role && errors.role)}
            helperText={touched.role && errors.role ? errors.role : " "}
            sx={fieldStyle}
          >
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="CASHIER">Cashier</MenuItem>
          </TextField>

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => markTouched("password")}
            error={!!(touched.password && errors.password)}
            helperText={
              touched.password && errors.password ? errors.password : " "
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
          />
        </Box>

        <Divider sx={{ mt: 2 }} />
        <Typography fontSize={12} className="text-gray-500 mt-2">
          Tip: Use a strong password and verify phone/email before sharing
          credentials.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, backgroundColor: "#fbfdff" }}>
        <AppButton
          label="Cancel"
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            px: 2,
          }}
        />

        <AppButton
          label={loading ? "Adding..." : "Add Staff"}
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: "#0b3c5d",
            color: "#fff",
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 900,
            px: 2.5,
            boxShadow: "0 14px 30px rgba(11,60,93,0.25)",
            "&:hover": { backgroundColor: "#0a3552" },
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddStaff;

const fieldStyle = {
  backgroundColor: "white",
  borderRadius: 3,
  "& fieldset": { borderColor: "#e5e7eb" },
};
