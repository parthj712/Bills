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
} from "@mui/material";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useState } from "react";
import { addMenuItem } from "@/service/menuService";

const CATEGORIES = ["Main Course", "Chinese", "Snacks"];
const SUB_CATEGORIES = ["Indian", "South Indian"];
const FOOD_TYPES = ["Veg", "Non-Veg"];

export default function AddMenuItems({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    foodType: "",
    priceHalf: "",
    priceFull: "",
    itemCode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log(form);
      await addMenuItem(form);
      onSuccess();
      onClose();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>Add Menu Item</DialogTitle>

      <DialogContent>
        <Box className="grid grid-cols-2 gap-4 mt-2">
          <TextField
            label="Item Name"
            name="name"
            fullWidth
            size="small"
            onChange={handleChange}
          />

          <TextField
            label="Category"
            name="category"
            select
            size="small"
            onChange={handleChange}
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
            size="small"
            onChange={handleChange}
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
            size="small"
            onChange={handleChange}
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
            size="small"
            onChange={handleChange}
          />

          <TextField
            label="Full Price"
            name="priceFull"
            type="number"
            size="small"
            onChange={handleChange}
          />
          <TextField
            label="Item Code"
            name="itemCode"
            size="small"
            className="col-span-2"
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            multiline
            rows={2}
            className="col-span-2"
            onChange={handleChange}
          />
        </Box>
      </DialogContent>

      <DialogActions className="p-4">
        <AppButton label="Cancel" variant="outlined" onClick={onClose} />
        <AppButton
          label="Add Item"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#06558e", color: "#fff" }}
        />
      </DialogActions>
    </Dialog>
  );
}
