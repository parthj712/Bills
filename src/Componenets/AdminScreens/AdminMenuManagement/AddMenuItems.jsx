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
  Chip,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useMemo, useState } from "react";
import { addMenuItem, getCatgories } from "@/service/menuService";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!open) return;

    const loadCategories = async () => {
      try {
        const res = await getCatgories();
        console.log("categories", res);
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    loadCategories();
  }, [open]);

  // Reset when dialog opens (premium UX)

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        foodType: "",
        priceHalf: "",
        priceFull: "",
        itemCode: "",
      });
      setTouched({});
      setLoading(false);
    }
  }, [open]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const markTouched = (name) =>
    setTouched((prev) => ({ ...prev, [name]: true }));
  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      category: value,
      subCategory: "",
    }));

    if (value === "Other") {
      setSubCategories([]);
      return;
    }

    const selected = categories.find((c) => c.name === value);
    setSubCategories(selected?.subCategories || []);
  };

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Item name is required";
    if (!form.category) e.category = "Category is required";
    if (!form.foodType) e.foodType = "Food type is required";
    if (!form.itemCode.trim()) e.itemCode = "Item code is required";
    if (form.category === "Other" && !customCategory.trim()) {
      e.category = "Enter new category name";
    }

    if (form.subCategory === "Other" && !customSubCategory.trim()) {
      e.subCategory = "Enter new sub category name";
    }

    const half = Number(form.priceHalf);
    const full = Number(form.priceFull);
    // if (form.priceHalf === "" || !Number.isFinite(half) || half < 0)
    //   e.priceHalf = "Enter valid half price";
    if (form.priceFull === "" || !Number.isFinite(full) || full < 0)
      e.priceFull = "Enter valid full price";
    if (
      Number.isFinite(half) &&
      Number.isFinite(full) &&
      full > 0 &&
      half > full
    )
      e.priceHalf = "Half price can’t be more than full";
    return e;
  }, [form]);

  const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleSubmit = async () => {
    // ❌ VALIDATION FAIL → SHAKE
    if (!canSubmit) {
      triggerShake();
      setTouched({
        name: true,
        category: true,
        subCategory: true,
        foodType: true,
        priceHalf: true,
        priceFull: true,
        itemCode: true,
        description: true,
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        category: form.category === "Other" ? customCategory : form.category,
        subCategory:
          form.subCategory === "Other" ? customSubCategory : form.subCategory,
      };
      console.log(payload);

      await addMenuItem(payload);

      // ✅ SUCCESS ANIMATION
      setSuccess(true);
      onSuccess?.();

      // auto close after animation
      setTimeout(() => {
        setSuccess(false);
        onClose?.();
      }, 1200);
    } catch (error) {
      // ❌ API ERROR → SHAKE

      triggerShake();

      if (error?.response?.status === 403) {
        alert(
          error.response.data?.message ||
            "Your subscription has expired. Please renew to add new menu items.",
        );
        return;
      }

      alert(error?.response?.data?.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  const MotionPaper = motion.div;

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 20,
      transition: { duration: 0.25 },
    },
  };

  const controls = useAnimation();
  const [success, setSuccess] = useState(false);

  const triggerShake = () => {
    controls.start({
      x: [0, -8, 8, -6, 6, 0],
      transition: { duration: 0.4 },
    });
  };

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
                  <RestaurantMenuRoundedIcon sx={{ color: "white" }} />
                </Box>

                <Box>
                  <DialogTitle
                    sx={{ p: 0, color: "white", fontWeight: 900, fontSize: 20 }}
                  >
                    Add Menu Item
                  </DialogTitle>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}
                  >
                    Fill details to create a new item.
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={onClose}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.12)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.20)" },
                  border: "1.5px solid rgba(255,255,255,0.25)",
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Quick chips preview */}
            <Box className="flex flex-wrap gap-2 mt-3">
              {form.category ? (
                <Chip
                  size="small"
                  label={form.category}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
                  variant="outlined"
                />
              ) : (
                <Chip
                  size="small"
                  label="Choose Category"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                  variant="outlined"
                />
              )}

              {form.foodType ? (
                <Chip
                  size="small"
                  label={form.foodType}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
                  variant="outlined"
                />
              ) : (
                <Chip
                  size="small"
                  label="Choose Food Type"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                  variant="outlined"
                />
              )}

              {form.itemCode?.trim() ? (
                <Chip
                  size="small"
                  label={`Code: ${form.itemCode}`}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)" }}
                  variant="outlined"
                />
              ) : (
                <Chip
                  size="small"
                  label="Add Item Code"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <DialogContent sx={{ p: 2.5, backgroundColor: "#fbfdff" }}>
            {success ? (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center justify-center py-10"
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: "#16a34a" }} />
                <Typography fontWeight={700} mt={2} fontSize={18}>
                  Menu item added successfully
                </Typography>
                <Typography fontSize={13} className="text-gray-500">
                  Your item is now available for billing
                </Typography>
              </motion.div>
            ) : (
              <motion.div animate={controls}>
                <Box py={0.5}>
                  <Typography
                    fontSize={22}
                    fontWeight={700}
                    className="text-[#0b3c5d]"
                  >
                    Item Details
                  </Typography>
                  <Typography fontSize={14} className="text-gray-500" mb={2}>
                    Keep the name clear, pricing accurate, and add a short
                    description.
                  </Typography>
                </Box>

                <Box>
                  <Box display={"flex"} flexDirection={"column"}>
                    <TextField
                      label="Item Name"
                      name="name"
                      fullWidth
                      value={form.name}
                      size="medium"
                      onChange={handleChange}
                      onBlur={() => markTouched("name")}
                      error={!!(touched.name && errors.name)}
                      helperText={
                        touched.name && errors.name ? errors.name : " "
                      }
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#e5e7eb" },
                      }}
                    />

                    <TextField
                      label="Description"
                      name="description"
                      multiline
                      rows={3}
                      value={form.description}
                      onChange={handleChange}
                      onBlur={() => markTouched("description")}
                      // className="md:col-span-2"
                      helperText=" "
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#e5e7eb" },
                      }}
                    />
                  </Box>

                  <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Item Code"
                      name="itemCode"
                      value={form.itemCode}
                      size="medium"
                      onChange={handleChange}
                      onBlur={() => markTouched("itemCode")}
                      error={!!(touched.itemCode && errors.itemCode)}
                      helperText={
                        touched.itemCode && errors.itemCode
                          ? errors.itemCode
                          : " "
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TagRoundedIcon sx={{ color: "#8a8a8a" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#e5e7eb" },
                      }}
                    />

                    <TextField
                      select
                      label="Category"
                      value={form.category}
                      onChange={handleCategoryChange}
                      fullWidth
                      error={!!(touched.category && errors.category)}
                      helperText={
                        touched.category && errors.category
                          ? errors.category
                          : " "
                      }
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat.name}>
                          {cat.name}
                        </MenuItem>
                      ))}
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    {form.category === "Other" && (
                      <TextField
                        label="New Category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        fullWidth
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 3,
                          "& fieldset": { borderColor: "#e5e7eb" },
                        }}
                      />
                    )}

                    <TextField
                      select
                      label="Sub Category"
                      value={form.subCategory}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          subCategory: e.target.value,
                        }))
                      }
                      fullWidth
                      disabled={!form.category}
                      error={!!(touched.subCategory && errors.subCategory)}
                      helperText={
                        touched.subCategory && errors.subCategory
                          ? errors.subCategory
                          : " "
                      }
                    >
                      {subCategories.map((sub) => (
                        <MenuItem key={sub} value={sub}>
                          {sub}
                        </MenuItem>
                      ))}
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    {(form.subCategory === "Other" ||
                      form.category === "Other") && (
                      <TextField
                        label="New Sub Category"
                        value={customSubCategory}
                        onChange={(e) => setCustomSubCategory(e.target.value)}
                        fullWidth
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 3,
                          "& fieldset": { borderColor: "#e5e7eb" },
                        }}
                      />
                    )}

                    <TextField
                      label="Food Type"
                      name="foodType"
                      select
                      value={form.foodType}
                      size="medium"
                      onChange={handleChange}
                      onBlur={() => markTouched("foodType")}
                      error={!!(touched.foodType && errors.foodType)}
                      helperText={
                        touched.foodType && errors.foodType
                          ? errors.foodType
                          : " "
                      }
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#e5e7eb" },
                      }}
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
                      size="medium"
                      onChange={handleChange}
                      onBlur={() => markTouched("priceHalf")}
                      // error={!!(touched.priceHalf && errors.priceHalf)}
                      helperText={
                        touched.priceHalf && errors.priceHalf
                          ? errors.priceHalf
                          : " "
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
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#e5e7eb" },
                      }}
                    />

                    <TextField
                      label="Full Price"
                      name="priceFull"
                      type="number"
                      value={form.priceFull}
                      size="medium"
                      onChange={handleChange}
                      onBlur={() => markTouched("priceFull")}
                      error={!!(touched.priceFull && errors.priceFull)}
                      helperText={
                        touched.priceFull && errors.priceFull
                          ? errors.priceFull
                          : " "
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
                      sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#e5e7eb" },
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ mt: 1.5 }} />
                <Typography fontSize={12} className="text-gray-500 mt-2">
                  Tip: Use unique item codes (e.g. <b>MC-101</b>) for faster
                  billing/search.
                </Typography>
              </motion.div>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2.5, backgroundColor: "#fbfdff" }}>
            <AppButton
              label="Cancel"
              variant="outlined"
              onClick={onClose}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                px: 2,
              }}
              disabled={loading}
            />

            <AppButton
              label={loading ? "Adding..." : "Add Item"}
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
      )}
    </AnimatePresence>
  );
}
