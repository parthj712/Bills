import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function ItemReportCard({ row }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Paper
                sx={{
                    // p: 2.5,
                    borderRadius: "18px",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                }}
                className="flex flex-col gap-2"
            >
                {/* HEADER */}
                <Box className="flex justify-between items-start bg-[#0b3c5d] p-5 rounded-t-[18px]">
                    <Typography fontWeight={700} fontSize={16} color="white">
                        {row.itemName}
                    </Typography>
                </Box>

                {/* METRICS */}
                <Box pb={2.5} pt={1.5} px={2.5} className="grid grid-cols-2 gap-3 mt-1">
                    <Box>
                        <Typography fontSize={14} color="text.secondary">
                            Orders
                        </Typography>
                        <Typography fontWeight={700}>
                            {row.totalOrders}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography fontSize={14} color="text.secondary">
                            Qty Sold
                        </Typography>
                        <Typography fontWeight={700}>
                            {row.qtySold}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography fontSize={14} color="text.secondary">
                            Unit Price
                        </Typography>
                        <Typography fontWeight={600}>
                            ₹ {row.unitPrice}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography fontSize={14} color="text.secondary">
                            Revenue
                        </Typography>
                        <Typography
                            fontWeight={800}
                            color="#2e7d32"
                        >
                            ₹ {row.totalRevenue}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
}
