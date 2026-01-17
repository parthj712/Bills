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

const AddTable = ({ open, onClose, onSuccess }) => {
  const [tableNo, setTableNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      onClose();
      setTableNo("");
    } catch (err) {
      console.error(err);
      setError("Table with this number already exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        className: "rounded-2xl",
      }}
    >
      {/* Title */}
      <DialogTitle>
        <Box className="flex items-center gap-2">
          <TableRestaurantIcon className="text-green-600" />
          <Typography variant="h6" fontWeight={600}>
            Add New Table
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-4">
          <TextField
            label="Table Number"
            type="number"
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            fullWidth
            error={Boolean(error)}
            helperText={error || "Enter a unique table number"}
          />
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions className="p-4 flex gap-2">
        <AppButton
          label="Cancel"
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        />

        <AppButton
          label="Add Table"
          loading={loading}
          disabled={!tableNo || loading}
          onClick={handleAdd}
          className="!bg-green-500 !text-white hover:!bg-green-600"
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddTable;
