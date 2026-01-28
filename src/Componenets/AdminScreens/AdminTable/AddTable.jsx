"use client";

import React, { useState } from "react";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { createNewTable } from "@/service/tableService";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Divider,
  InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAnimation } from "framer-motion";


const AddTable = ({ open, onClose, onSuccess }) => {
  const [tableNo, setTableNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);



  const handleAdd = async () => {
    if (!tableNo) {
      setError("Table number is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newTable = await createNewTable({
        tableNo: Number(tableNo),
      });

      onSuccess(newTable);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setTableNo("");
        onClose();
      }, 1200);
    } catch (err) {
      setError("Table with this number already exists");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };


  const MotionPaper = motion.div;

  const controls = useAnimation();

  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1], // premium easing
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 20,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  };


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
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            component: MotionPaper,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit",
            sx: {
              borderRadius: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            },
          }}
        >
          {/* Header */}
          <DialogTitle sx={{ pb: 2 }}>
            <Box className="flex items-center gap-3">
              <Box className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                <TableRestaurantIcon className="text-green-600" />
              </Box>

              <Box>
                <Typography fontSize={18} fontWeight={700}>
                  Add New Table
                </Typography>
                <Typography fontSize={13} className="text-gray-500">
                  Create a unique table for your restaurant
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <Divider />

          {/* Content */}
          <DialogContent sx={{ pt: 4 }}>
            <motion.div animate={controls}>
              <TextField
                label="Table Number"
                type="number"
                value={tableNo}
                onChange={(e) => setTableNo(e.target.value)}
                fullWidth
                autoFocus
                error={Boolean(error)}
                helperText={error || "Use a unique table number"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TableRestaurantIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>


            {success && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <CheckCircleIcon className="text-green-500" sx={{ fontSize: 56 }} />
                <Typography fontWeight={600} mt={2}>
                  Table added successfully
                </Typography>
              </motion.div>
            )}

          </DialogContent>

          {/* Footer */}
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
              label="Add Table"
              loading={loading}
              disabled={!tableNo || loading}
              onClick={handleAdd}
              className="!bg-green-500 !text-white px-8 hover:!bg-green-600"
            />
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AddTable;
