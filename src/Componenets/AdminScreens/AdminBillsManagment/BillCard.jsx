import { Box, Typography, IconButton, Chip, Divider } from "@mui/material";
import { Visibility, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function BillCard({ bill, onView, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Box
        sx={{
          p: 2.5,
          borderRadius: "20px",
          background: "#fff",
          border: "1px solid #f1f5f9",
          boxShadow: "0px 8px 24px rgba(15,23,42,0.06)",
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography fontWeight={700} fontSize={15} color="#0f172a">
              {bill.billNo}
            </Typography>

            <Typography fontSize={12} color="text.secondary">
              Generated bill
            </Typography>
          </Box>

          <Chip
            size="small"
            label={new Date(bill.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            sx={{
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* GRAND TOTAL */}
        <Box textAlign="center" mb={2}>
          <Typography fontSize={12} color="text.secondary">
            Grand Total
          </Typography>

          <Typography fontWeight={800} fontSize={24} color="#16a34a">
            ₹ {bill.grandTotal}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* BILL BREAKDOWN */}
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={13} color="text.secondary">
              Subtotal
            </Typography>
            <Typography fontWeight={600} color="black">
              ₹ {bill.subtotal}
            </Typography>
          </Box>

          {bill.discountAmount > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={13} color="text.secondary">
                Discount
              </Typography>

              <Typography fontWeight={600} color="#dc2626">
                -₹ {bill.discountAmount}
              </Typography>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between">
            <Typography fontSize={13} color="text.secondary">
              GST
            </Typography>

            <Typography fontWeight={600} color="black">
              ₹ {bill.gstAmount}
            </Typography>
          </Box>

          {bill.vatAmount > 0 && (
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={13} color="text.secondary">
                VAT
              </Typography>

              <Typography fontWeight={600} color="black">
                ₹ {bill.vatAmount}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ACTIONS */}
        <Box display="flex" justifyContent="flex-end" gap={1.5}>
          <IconButton
            onClick={() => onView?.(bill)}
            size="small"
            sx={{
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              "&:hover": {
                backgroundColor: "#dbeafe",
              },
            }}
          >
            <Visibility fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => onDelete?.(bill._id)}
            size="small"
            sx={{
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              "&:hover": {
                backgroundColor: "#fee2e2",
              },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </motion.div>
  );
}
