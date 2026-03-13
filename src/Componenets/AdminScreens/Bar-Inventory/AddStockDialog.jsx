"use client";

import { addBarStock } from "@/service/barInventory";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";

import LiquorIcon from "@mui/icons-material/Liquor";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalBarIcon from "@mui/icons-material/LocalBar";

import { useState, useEffect } from "react";

export default function AddStockDialog({ open, onClose, item, onSuccess }) {
  const [bottles, setBottles] = useState("");

  useEffect(() => {
    if (open) {
      setBottles("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!bottles) return;

    await addBarStock({
      menuItemId: item.menuItemId._id,
      bottles: Number(bottles),
    });

    onSuccess();
    onClose();
  };

  if (!item) return null;

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
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(90deg,#0f172a,#1e293b)",
          color: "white",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <LiquorIcon sx={{ fontSize: 28 }} />

          <Box>
            <Typography fontWeight={700} fontSize={18}>
              Add Stock
            </Typography>

            <Typography fontSize={13} sx={{ opacity: 0.8 }}>
              Increase inventory for bar item
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: "#f8fafc" }}>
        {/* ITEM PREVIEW */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "white",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <InventoryIcon sx={{ color: "#64748b" }} />

            <Box>
              <Typography fontWeight={600}>{item.menuItemId?.name}</Typography>

              <Typography fontSize={13} color="text.secondary">
                Bottle Size: {item.bottleSizeML} ml
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* INPUT */}
        <TextField
          label="Bottles to Add"
          type="number"
          fullWidth
          value={bottles}
          onChange={(e) => setBottles(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalBarIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
          }}
        />

        <Typography mt={1} fontSize={12} color="text.secondary">
          Example: Add 3 bottles → stock will increase automatically in ML.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          bgcolor: "#f8fafc",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#16a34a",
            "&:hover": {
              bgcolor: "#15803d",
            },
          }}
        >
          Add Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
}
