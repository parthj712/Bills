"use client";

import { createBarInventory, getLiquorMenuItems } from "@/service/barInventory";

import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";

import LiquorIcon from "@mui/icons-material/Liquor";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ScaleIcon from "@mui/icons-material/Scale";

import { useEffect, useState } from "react";

export default function AddBarInventoryDialog({ open, onClose, onSuccess }) {
  const [menuItems, setMenuItems] = useState([]);

  const [menuItemId, setMenuItemId] = useState("");
  const [bottleSizeML, setBottleSizeML] = useState("");
  const [bottles, setBottles] = useState("");

  const loadMenuItems = async () => {
    try {
      const res = await getLiquorMenuItems();

      setMenuItems(res.data);
    } catch (error) {
      console.error("Failed to load menu items");
    }
  };

  useEffect(() => {
    if (open) {
      loadMenuItems();
      setMenuItemId("");
      setBottleSizeML("");
      setBottles("");
    }
  }, [open]);

  const selectedItem = menuItems.find((i) => i._id === menuItemId);

  const handleSubmit = async () => {
    if (!menuItemId || !bottleSizeML || !bottles) return;

    await createBarInventory({
      menuItemId,
      bottleSizeML: Number(bottleSizeML),
      bottles: Number(bottles),
    });

    onSuccess();
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
              Add Bar Inventory
            </Typography>

            <Typography fontSize={13} sx={{ opacity: 0.8 }}>
              Register liquor stock for inventory tracking
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: "#f8fafc" }}>
        {/* ITEM SELECT */}
        <TextField
          select
          label="Select Liquor Item"
          fullWidth
          value={menuItemId}
          onChange={(e) => setMenuItemId(e.target.value)}
          sx={{ mb: 3, backgroundColor: "white", borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Inventory2Icon />
              </InputAdornment>
            ),
          }}
        >
          {menuItems.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name} ({item.itemCode})
            </MenuItem>
          ))}
        </TextField>

        {/* ITEM PREVIEW */}
        {selectedItem && (
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
              <LocalBarIcon sx={{ color: "#64748b" }} />

              <Box>
                <Typography fontWeight={600}>{selectedItem.name}</Typography>

                <Typography fontSize={13} color="text.secondary">
                  Code: {selectedItem.itemCode}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* BOTTLE SIZE */}
        <TextField
          label="Bottle Size (ML)"
          type="number"
          fullWidth
          value={bottleSizeML}
          onChange={(e) => setBottleSizeML(e.target.value)}
          sx={{ mb: 3, backgroundColor: "white", borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ScaleIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* BOTTLES */}
        <TextField
          label="Number of Bottles"
          type="number"
          fullWidth
          value={bottles}
          onChange={(e) => setBottles(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalBarIcon />
              </InputAdornment>
            ),
          }}
        />

        <Typography mt={1.5} fontSize={12} color="text.secondary">
          Example: 750ml × 10 bottles = 7500ml stock added to inventory.
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
            bgcolor: "#0ea5e9",
            "&:hover": {
              bgcolor: "#0284c7",
            },
          }}
        >
          Create Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
}
