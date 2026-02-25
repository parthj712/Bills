import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import dayjs from "dayjs";

export default function ExpenseCard({ expense }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Paper
        sx={{
          borderRadius: "18px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
        }}
        className="flex flex-col gap-2"
      >
        {/* HEADER */}
        <Box className="flex justify-between items-start bg-[#0b3c5d] p-5 rounded-t-[18px]">
          <Typography fontWeight={700} fontSize={16} color="white">
            {expense.categoryId?.name || "No Category"}
          </Typography>
          <Typography fontWeight={700} fontSize={14} color="white">
            {dayjs(expense.date).format("DD/MM/YYYY")}
          </Typography>
        </Box>

        {/* METRICS */}
        <Box pb={2.5} pt={1.5} px={2.5} className="grid grid-cols-2 gap-3 mt-1">
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Note
            </Typography>
            <Typography fontWeight={700}>{expense.note || "-"}</Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color="text.secondary">
              Amount
            </Typography>
            <Typography fontWeight={700} color="#d32f2f">
              ₹ {expense.amount}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color="text.secondary">
              Payment
            </Typography>
            <Typography fontWeight={600}>
              {expense.paymentMode?.toUpperCase() || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={14} color="text.secondary">
              Status
            </Typography>
            <Typography
              fontWeight={800}
              color={expense.amount > 0 ? "#2e7d32" : "#d32f2f"}
            >
              {expense.amount > 0 ? "Paid" : "Pending"}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
