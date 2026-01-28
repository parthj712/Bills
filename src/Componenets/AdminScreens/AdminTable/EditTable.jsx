"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { Box } from "@mui/system";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { updateTable, deleteTable } from "@/service/tableService";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";

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

const EditTable = ({ open, table, onClose, onSuccess }) => {
  const [tableNo, setTableNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (table) setTableNo(table.tableNo);
  }, [table]);

  const triggerShake = () => {
    controls.start({
      x: [0, -8, 8, -6, 6, 0],
      transition: { duration: 0.4 },
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateTable(table._id, { tableNo });

      setSuccess(true);
      onSuccess();

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      setLoading(true);
      await deleteTable(table._id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  if (!table) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={loading ? undefined : onClose}
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
              p: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            },
          }}
        >
          {/* Header */}
          <DialogTitle sx={{ px: 0 }}>
            <Box className="flex items-center gap-3">
              <Box className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TableRestaurantIcon className="text-blue-600" />
              </Box>
              <Box display={"flex"} flexDirection={"column"}>
                <Typography fontSize={20} fontWeight={700}>Edit Table</Typography>
                <Typography fontSize={13} className="text-gray-500">Perform Edit and Delete Operations Table</Typography>
              </Box>
            </Box>
          </DialogTitle>

          <Divider />

          {/* Content */}
          <DialogContent sx={{ pt: 4 }}>
            {success ? (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center py-8"
              >
                <CheckCircleIcon
                  className="text-green-500"
                  sx={{ fontSize: 56 }}
                />
                <Typography fontWeight={600} mt={2}>
                  Table updated successfully
                </Typography>
              </motion.div>
            ) : (
              <motion.div animate={controls}>
                <TextField
                  label="Table Number"
                  type="number"
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  fullWidth
                  autoFocus
                />
              </motion.div>
            )}
          </DialogContent>

          {/* Footer */}
          <DialogActions className="p-4 flex items-center justify-between">
            {/* LEFT — Cancel */}
            <AppButton
              label="Cancel"
              variant="text"
              onClick={onClose}
              disabled={loading}
            />

            {/* RIGHT — Actions */}
            <Box className="flex gap-6">
              <motion.div whileTap={{ scale: 0.95 }}>
                <AppButton
                  label="Delete"
                  variant="outlined"
                  className="!border-red-400 !text-red-500 hover:!bg-red-50"
                  loading={loading}
                  onClick={handleDelete}
                />
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <AppButton
                  label="Update"
                  loading={loading}
                  onClick={handleUpdate}
                  className="!bg-green-500 !text-white px-6"
                />
              </motion.div>
            </Box>
          </DialogActions>

        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default EditTable;
