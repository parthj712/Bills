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
  InputAdornment,
  Button,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useState } from "react";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

const CATEGORIES = ["Main Course", "Chinese", "Snacks"];
const SUB_CATEGORIES = ["Indian", "South Indian"];
const FOOD_TYPES = ["Veg", "Non-Veg"];
const PRICE_TYPES = ["SINGLE", "HALF_FULL", "VARIANT"];

export default function UpdateMenuItem({ open, onClose, menu, onUpdate }) {
  const { showSnackbar } = useAppSnackbar();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const MotionPaper = motion.div;
  const controls = useAnimation();
  console.log("menu", menu);

  useEffect(() => {
    if (menu) {
      setForm({
        name: menu.name || "",
        description: menu.description || "",
        category: menu.categoryName || "",
        subCategory: menu.subCategory || "",
        foodType: menu.foodType || "",
        priceType: menu.priceType || "SINGLE",
        priceHalf: menu.price?.half || "",
        priceFull: menu.price?.full || "",
        variants: menu.variants || [],
      });
    }
  }, [menu]);

  if (!form) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index][field] = value;
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: "" }],
    }));
  };

  const removeVariant = (index) => {
    const updatedVariants = [...form.variants];
    updatedVariants.splice(index, 1);
    setForm((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        categoryName: form.category,
        subCategory: form.subCategory,
        price:
          form.priceType === "HALF_FULL"
            ? {
                half: form.priceHalf,
                full: form.priceFull,
              }
            : form.priceType === "SINGLE"
              ? { full: form.priceFull }
              : undefined,
        variants: form.priceType === "VARIANT" ? form.variants : undefined,
      };

      await onUpdate(menu._id, payload);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (error) {
      triggerShake();
      showSnackbar("Failed to update menu item");
    } finally {
      setLoading(false);
    }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.25 } },
  };

  const triggerShake = () => {
    controls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
  };
  const categoryOptions = form
    ? Array.from(new Set([...CATEGORIES, form.category])) // add current category
    : CATEGORIES;

  const subCategoryOptions = form
    ? Array.from(new Set([...SUB_CATEGORIES, form.subCategory])) // add current subCategory
    : SUB_CATEGORIES;
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={loading ? undefined : onClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: MotionPaper,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
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
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}
                  >
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
            {success ? (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: "#16a34a" }} />
                <Typography fontWeight={700} mt={2} fontSize={18}>
                  Menu item updated successfully
                </Typography>
                <Typography fontSize={13} className="text-gray-500">
                  Changes have been saved
                </Typography>
              </motion.div>
            ) : (
              <motion.div animate={controls}>
                <Typography fontWeight={900} mb={1} className="text-[#7c2d12]">
                  Item Information
                </Typography>
                <Typography fontSize={12} className="text-gray-500 mb-3">
                  Modify name, category, pricing or availability details.
                </Typography>

                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Basic Fields */}
                  <TextField
                    label="Item Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    sx={fieldStyle}
                  />
                  {/* <TextField
                    label="Category"
                    name="category"
                    select
                    value={form.category}
                    onChange={handleChange}
                    sx={fieldStyle}
                  >
                    {categoryOptions.map((c) => (
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
                    {subCategoryOptions.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField> */}
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
                    label="Price Type"
                    name="priceType"
                    select
                    value={form.priceType}
                    onChange={handleChange}
                    sx={fieldStyle}
                  >
                    {PRICE_TYPES.map((pt) => (
                      <MenuItem key={pt} value={pt}>
                        {pt}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Price Fields or Variants */}
                  {form.priceType === "SINGLE" && (
                    <TextField
                      label="Price"
                      name="priceFull"
                      type="number"
                      value={form.priceFull}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupeeRoundedIcon
                              sx={{ color: "#8a8a8a" }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldStyle}
                    />
                  )}

                  {form.priceType === "HALF_FULL" && (
                    <>
                      <TextField
                        label="Half Price"
                        name="priceHalf"
                        type="number"
                        value={form.priceHalf}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CurrencyRupeeRoundedIcon
                                sx={{ color: "#8a8a8a" }}
                              />
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
                              <CurrencyRupeeRoundedIcon
                                sx={{ color: "#8a8a8a" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={fieldStyle}
                      />
                    </>
                  )}

                  {form.priceType === "VARIANT" && (
                    <Box className="md:col-span-2 flex flex-col gap-3 mt-3">
                      {form.variants?.map((v, i) => (
                        <Box
                          key={i}
                          className="flex flex-col md:flex-row gap-2 items-start md:items-center"
                        >
                          <TextField
                            label="Variant Name"
                            value={v.name}
                            onChange={(e) =>
                              handleVariantChange(i, "name", e.target.value)
                            }
                            sx={{ flex: 1, ...fieldStyle }}
                          />
                          <TextField
                            label="Price"
                            type="number"
                            value={v.price}
                            onChange={(e) =>
                              handleVariantChange(i, "price", e.target.value)
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CurrencyRupeeRoundedIcon
                                    sx={{ color: "#8a8a8a" }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ width: 140, ...fieldStyle }}
                          />
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => removeVariant(i)}
                            sx={{ height: 40, mt: { xs: 1, md: 0 } }}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                      <Button
                        variant="contained"
                        onClick={addVariant}
                        sx={{ alignSelf: "flex-start", mt: 1 }}
                      >
                        Add Variant
                      </Button>
                    </Box>
                  )}

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
              </motion.div>
            )}
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ p: 2.5, backgroundColor: "#fffaf7" }}>
            <AppButton
              label="Cancel"
              variant="outlined"
              onClick={onClose}
              sx={{ borderRadius: 3, textTransform: "none", fontWeight: 800 }}
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
      )}
    </AnimatePresence>
  );
}

const fieldStyle = {
  backgroundColor: "white",
  borderRadius: 3,
  "& fieldset": { borderColor: "#e5e7eb" },
};
