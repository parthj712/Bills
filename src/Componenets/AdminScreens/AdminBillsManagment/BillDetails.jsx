"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";

export default function BillDetails({ open, onClose, bill }) {
  if (!bill) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Bill No: {bill.billNo}</DialogTitle>

      <DialogContent>
        <Typography fontSize={13} color="text.secondary" mb={2}>
          {new Date(bill.createdAt).toLocaleString("en-IN")}
        </Typography>

        <Box mt={3}>
          <Typography>Subtotal: ₹ {bill.subtotal}</Typography>
          <Typography>GST: ₹ {bill.gstAmount}</Typography>
          <Typography fontWeight={700}>
            Grand Total: ₹ {bill.grandTotal}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
