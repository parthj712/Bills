"use client";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import React, { useEffect, useMemo, useState } from "react";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { updateStaff } from "@/service/staffService";

const EditStaff = ({ open, onClose, staff, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    adharCard: "",
  });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        address: staff.address || "",
        adharCard: staff.adharCard || "",
      });
      setTouched({});
      setLoading(false);
    }
  }, [staff, open]);

  const markTouched = (name) => setTouched((p) => ({ ...p, [name]: true }));

  const errors = useMemo(() => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    if (!formData.email.trim()) e.email = "Email is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      e.email = "Enter a valid email";
    if (!formData.adharCard.trim()) e.adharCard = "Aadhaar is required";
    if (!formData.address.trim()) e.address = "Address is required";
    return e;
  }, [formData]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!staff) return;

    if (!canSubmit) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        address: true,
        adharCard: true,
      });
      return;
    }

    try {
      setLoading(true);
      await updateStaff(staff._id, formData);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!staff) return null;

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
          background: "linear-gradient(90deg,#7c2d12,#f97316)",
        }}
      >
        <Box className="flex items-start justify-between gap-3">
          <Box className="flex items-center gap-2">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.18)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <EditRoundedIcon sx={{ color: "white" }} />
            </Box>

            <Box>
              <DialogTitle
                sx={{ p: 0, color: "white", fontWeight: 900, fontSize: 20 }}
              >
                Edit Staff
              </DialogTitle>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Update staff details and keep records accurate.
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Body */}
      <DialogContent sx={{ p: 2.5, backgroundColor: "#fffaf7" }}>
        <Typography fontWeight={900} className="text-[#7c2d12]" mb={1}>
          Staff Details
        </Typography>
        <Typography fontSize={12} className="text-gray-500" mb={2}>
          Make sure email and phone are correct for login and communication.
        </Typography>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Full Name"
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
            label="Email Address"
            name="email"
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
            label="Phone Number"
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
            label="Aadhaar Card Number"
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
            multiline
            rows={2}
            sx={fieldStyle}
            className="md:col-span-2"
          />
        </Box>

        <Divider sx={{ mt: 2 }} />
        <Typography fontSize={12} className="text-gray-500 mt-2">
          Tip: Keep staff details updated for billing logs & access control.
        </Typography>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: 2.5, backgroundColor: "#fffaf7" }}>
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
          label={loading ? "Updating..." : "Update"}
          onClick={handleUpdate}
          disabled={loading}
          sx={{
            backgroundColor: "#7c2d12",
            color: "#fff",
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 900,
            px: 2.5,
            boxShadow: "0 14px 30px rgba(124,45,18,0.30)",
            "&:hover": { backgroundColor: "#6b240f" },
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default EditStaff;

const fieldStyle = {
  backgroundColor: "white",
  borderRadius: 3,
  "& fieldset": { borderColor: "#e5e7eb" },
};
