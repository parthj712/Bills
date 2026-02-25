"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";

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
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import NotesIcon from "@mui/icons-material/Notes";
import CategoryIcon from "@mui/icons-material/Category";
import PaymentIcon from "@mui/icons-material/Payment";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addExpense, getExpenseCategories } from "@/service/expenseService";

const AddExpense = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    amount: "",
    paymentMode: "cash",
    note: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const controls = useAnimation();

  // Load Categories
  const fetchCategories = async () => {
    try {
      const res = await getExpenseCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const errors = useMemo(() => {
    const e = {};
    if (!formData.categoryId) e.categoryId = "Select category";
    if (!formData.amount) e.amount = "Enter amount";
    if (formData.amount && formData.amount <= 0) e.amount = "Invalid amount";
    return e;
  }, [formData]);

  const canSubmit = Object.keys(errors).length === 0;

  const triggerShake = () => {
    controls.start({
      x: [0, -8, 8, -6, 6, 0],
      transition: { duration: 0.4 },
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      triggerShake();
      return;
    }

    try {
      setLoading(true);
      await addExpense(formData);

      setSuccess(true);
      onSuccess?.();

      setTimeout(() => {
        setSuccess(false);
        onClose?.();
        setFormData({
          categoryId: "",
          amount: "",
          paymentMode: "cash",
          note: "",
        });
      }, 1000);
    } catch (error) {
      triggerShake();
      alert(error?.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={loading ? undefined : onClose}
          fullWidth
          maxWidth="sm"
        >
          ```
          {/* Header */}
          <Box
            sx={{
              px: 2.5,
              pt: 2.2,
              pb: 1.6,
              background: "linear-gradient(90deg,#b91c1c,#ef4444)",
            }}
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center gap-2">
                <ReceiptLongIcon sx={{ color: "white" }} />
                <DialogTitle sx={{ p: 0, color: "white", fontWeight: 900 }}>
                  Add Expense
                </DialogTitle>
              </Box>

              <IconButton onClick={onClose} sx={{ color: "white" }}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>
          </Box>
          <DialogContent sx={{ p: 2.5, backgroundColor: "#fbfdff" }}>
            {success ? (
              <Box className="flex flex-col items-center justify-center py-10">
                <CheckCircleIcon sx={{ fontSize: 64, color: "#16a34a" }} />
                <Typography fontWeight={700} mt={2}>
                  Expense Added Successfully
                </Typography>
              </Box>
            ) : (
              <motion.div animate={controls}>
                <Box className="grid grid-cols-1 gap-4">
                  {/* Category */}
                  <TextField
                    select
                    label="Category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    error={!!errors.categoryId}
                    helperText={errors.categoryId || " "}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Amount */}
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    error={!!errors.amount}
                    helperText={errors.amount || " "}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Payment Mode */}
                  <TextField
                    select
                    label="Payment Mode"
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaymentIcon />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="bank">Bank Transfer</MenuItem>
                  </TextField>

                  {/* Note */}
                  <TextField
                    label="Note (Optional)"
                    name="note"
                    multiline
                    rows={2}
                    value={formData.note}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotesIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <AppButton
              label="Cancel"
              variant="outlined"
              onClick={onClose}
              disabled={loading}
            />
            <AppButton
              label={loading ? "Saving..." : "Add Expense"}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                backgroundColor: "#dc2626",
                color: "#fff",
                "&:hover": { backgroundColor: "#b91c1c" },
              }}
            />
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AddExpense;
