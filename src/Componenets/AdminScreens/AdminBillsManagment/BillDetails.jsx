"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";

export default function BillDetails({ open, onClose, bill }) {
  if (!bill) return null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const orderType = bill.tableId ? "Dine-In" : "Takeaway";
  const payment = bill.paymentMethod || "CASH";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg,#0f172a,#1e293b)",
          color: "#fff",
          py: 2,
        }}
      >
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          gap={1}
        >
          <Typography fontWeight={700} fontSize={18}>
            {bill.billNo}
          </Typography>

          <Typography fontSize={13} sx={{ opacity: 0.8 }}>
            {new Date(bill.createdAt).toLocaleString("en-IN")}
          </Typography>
        </Box>

        {/* Chips */}
        <Box mt={1} display="flex" gap={1}>
          <Chip
            label={orderType}
            size="small"
            color={orderType === "Dine-In" ? "success" : "warning"}
          />

          <Chip
            label={payment}
            size="small"
            color={payment === "CASH" ? "success" : "primary"}
          />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* ITEMS TABLE */}
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            mt: 2,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell>
                  <b>Item</b>
                </TableCell>
                <TableCell align="center">
                  <b>Qty</b>
                </TableCell>
                <TableCell align="right">
                  <b>Price</b>
                </TableCell>
                <TableCell align="right">
                  <b>Total</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bill.items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Typography fontWeight={500}>{item.name}</Typography>
                    {item.category && (
                      <Typography fontSize={11} color="text.secondary">
                        {item.category}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="center">{item.qty}</TableCell>
                  <TableCell align="right">₹ {item.price}</TableCell>
                  <TableCell align="right">₹ {item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* SUMMARY */}
        <Box mt={3}>
          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>₹ {bill.subtotal}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">GST</Typography>
            <Typography>₹ {bill.gstAmount}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={700}>Grand Total</Typography>
            <Typography fontWeight={700} color="#047857">
              ₹ {bill.grandTotal}
            </Typography>
          </Box>
        </Box>

        {/* FOOTER */}
        <Box mt={3} textAlign="center">
          <Typography fontSize={12} color="text.secondary">
            Thank you! Visit again 🙏
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
