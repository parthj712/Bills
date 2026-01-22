"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useState } from "react";

const CATEGORIES = ["Main Course", "Chinese", "Snacks"];
const SUB_CATEGORIES = ["Indian", "South Indian"];
const FOOD_TYPES = ["Veg", "Non-Veg"];

export default function UpdateMenuItem({ open, onClose, menu, onUpdate }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (menu) {
      setForm({
        name: menu.name || "",
        description: menu.description || "",
        category: menu.categoryName || "",
        subCategory: menu.subCategory || "",
        foodType: menu.foodType || "",
        priceHalf: menu.price?.half || "",
        priceFull: menu.price?.full || "",
      });
    }
  }, [menu]);

  if (!form) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onUpdate(menu._id, form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,0.20)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1.6,
          background: "linear-gradient(90deg,#7c2d12,#f97316)",
        }}
      >
        <Box className="flex items-center justify-between">
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
                Edit Menu Item
              </DialogTitle>
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                Update menu details carefully
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

      {/* Content */}
      <DialogContent sx={{ p: 2.5, backgroundColor: "#fffaf7" }}>
        <Typography fontWeight={900} mb={1} className="text-[#7c2d12]">
          Item Information
        </Typography>
        <Typography fontSize={12} className="text-gray-500 mb-3">
          Modify name, category, pricing or availability details.
        </Typography>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <TextField
            label="Item Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            sx={fieldStyle}
          />

          <TextField
            label="Category"
            name="category"
            select
            value={form.category}
            onChange={handleChange}
            sx={fieldStyle}
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Sub Category"
            name="subCategory"
            select
            value={form.subCategory}
            onChange={handleChange}
            sx={fieldStyle}
          >
            {SUB_CATEGORIES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Food Type"
            name="foodType"
            select
            value={form.foodType}
            onChange={handleChange}
            sx={fieldStyle}
          >
            {FOOD_TYPES.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Half Price"
            name="priceHalf"
            type="number"
            value={form.priceHalf}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
          />

          <TextField
            label="Full Price"
            name="priceFull"
            type="number"
            value={form.priceFull}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CurrencyRupeeRoundedIcon sx={{ color: "#8a8a8a" }} />
                </InputAdornment>
              ),
            }}
            sx={fieldStyle}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            multiline
            rows={3}
            onChange={handleChange}
            className="md:col-span-2"
            sx={fieldStyle}
          />
        </Box>

        <Divider sx={{ mt: 2 }} />
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2.5, backgroundColor: "#fffaf7" }}>
        <AppButton
          label="Cancel"
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
          }}
        />

        <AppButton
          label="Update Item"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#7c2d12",
            color: "#fff",
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 900,
            px: 2.5,
            boxShadow: "0 14px 30px rgba(124,45,18,0.3)",
            "&:hover": { backgroundColor: "#6b240f" },
          }}
        />
      </DialogActions>
    </Dialog>
  );
}

/* Shared input style */
const fieldStyle = {
  backgroundColor: "white",
  borderRadius: 3,
  "& fieldset": { borderColor: "#e5e7eb" },
};
