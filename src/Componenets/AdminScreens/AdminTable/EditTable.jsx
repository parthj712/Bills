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

const EditTable = ({ open, table, onClose, onSuccess }) => {
  const [tableNo, setTableNo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table) setTableNo(table.tableNo);
  }, [table]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateTable(table._id, { tableNo });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
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
    } finally {
      setLoading(false);
    }
  };

  if (!table) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography fontWeight={600}>Edit Table</Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box className="flex flex-col gap-4 mt-4">
          <TextField
            label="Table Number"
            type="number"
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>

      <DialogActions className="p-4 flex justify-between">
        <AppButton
          label="Delete"
          className="!bg-red-500 !text-white"
          loading={loading}
          onClick={handleDelete}
        />

        <Box className="flex gap-2">
          <AppButton label="Cancel" variant="outlined" onClick={onClose} />
          <AppButton
            label="Update"
            loading={loading}
            onClick={handleUpdate}
            className="!bg-green-500 !text-white"
          />
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditTable;
