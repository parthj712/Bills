import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function MonthlySummaryCard({ month, gst, total }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Paper
        sx={{
          p: 2.5,
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <Typography fontWeight={700} fontSize={16} color="#0b3c5d">
          {month}
        </Typography>

        <Box className="flex justify-between mt-2">
          <Box>
            <Typography fontSize={12} color="text.secondary">
              GST
            </Typography>
            <Typography fontWeight={600}>₹ {gst.toFixed(2)}</Typography>
          </Box>

          <Box textAlign="right">
            <Typography fontSize={12} color="text.secondary">
              Total
            </Typography>
            <Typography fontWeight={800} fontSize={15} color="#2e7d32">
              ₹ {total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}
