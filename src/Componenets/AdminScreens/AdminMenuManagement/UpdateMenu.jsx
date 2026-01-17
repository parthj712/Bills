"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
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
        name: menu.name,
        description: menu.description,
        category: menu.categoryName,
        subCategory: menu.subCategory,
        foodType: menu.foodType,
        priceHalf: menu.price.half,
        priceFull: menu.price.full,
      });
    }
  }, [menu]);

  if (!form) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(menu._id, form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={600}>Edit Menu Item</DialogTitle>

      <DialogContent>
        <Box className="grid grid-cols-2 gap-4 mt-2">
          <TextField
            label="Item Name"
            name="name"
            value={form.name}
            size="small"
            onChange={handleChange}
          />

          <TextField
            label="Category"
            name="category"
            select
            value={form.category}
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
            value={form.subCategory}
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
            value={form.foodType}
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
            value={form.priceHalf}
            size="small"
            onChange={handleChange}
          />

          <TextField
            label="Full Price"
            name="priceFull"
            type="number"
            value={form.priceFull}
            size="small"
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
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
          label="Update"
          onClick={handleSubmit}
          sx={{ backgroundColor: "#06558e", color: "#fff" }}
        />
      </DialogActions>
    </Dialog>
  );
}
