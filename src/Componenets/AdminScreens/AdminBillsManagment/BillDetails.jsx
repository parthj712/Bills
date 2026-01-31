"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function BillDetails({ open, onClose, bill }) {
  if (!bill) return null;


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ borderRadius: 2 }}>
      <DialogTitle
        sx={{
          color: "white",
          backgroundColor: isMobile ? "#2563EB" : "#1E40AF",
        }}>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight={isMobile ? 600 : 700}>
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
