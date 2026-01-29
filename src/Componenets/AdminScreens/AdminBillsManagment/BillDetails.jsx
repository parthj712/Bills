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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{borderRadius : 6}}>
      <DialogTitle
        sx={{
          color: "white",
          backgroundColor: "#2563EB",
        }}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            Bill No: {bill.billNo}
          </Typography>
          <Typography fontSize={16} fontWeight={600}>
            {new Date(bill.createdAt).toLocaleString("en-IN")}
          </Typography>


        </Box>
      </DialogTitle>
      <DialogContent>


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
