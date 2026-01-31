import {
    Box,
    Typography,
    IconButton,
    Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";

export default function SalesBillCard({ bill, onView }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
        >
            <Box
                sx={{
                    borderRadius: "18px",
                    backgroundColor: "#fff",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                {/* HEADER */}
                <Box className="flex justify-between items-start bg-[#0b3c5d] p-6 rounded-t-[18px]">
                    <Box>
                        <Typography
                            fontWeight={700}
                            fontSize={15}
                            color="white"
                        >
                            Bill #{bill.billNo}
                        </Typography>
                        <Typography fontSize={12} color="white">
                            Completed order
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
                            backgroundColor: "#e3f2fd",
                            color: "#0b3c5d",
                            fontWeight: 600,
                            borderRadius: "20px",
                        }}
                    />
                </Box>

                {/* AMOUNTS */}
                <Box
                    sx={{
                        mx: 2,
                        p: 2,
                        borderRadius: "14px",
                        // backgroundColor: "#f9fafb",
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        textAlign: "center",
                    }}
                >
                    <Box>
                        <Typography fontSize={11} color="text.secondary">
                            Subtotal
                        </Typography>
                        <Typography fontWeight={600} color="#424242">
                            ₹ {bill.subtotal}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography fontSize={11} color="text.secondary">
                            GST
                        </Typography>
                        <Typography fontWeight={600} color="#424242">
                            ₹ {bill.gstAmount}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography fontSize={11} color="text.secondary">
                            Total
                        </Typography>
                        <Typography
                            fontWeight={800}
                            fontSize={16}
                            color="#2e7d32"
                        >
                            ₹ {bill.grandTotal}
                        </Typography>
                    </Box>
                </Box>

                {/* FOOTER ACTION */}
                <Box
                    sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        justifyContent: "flex-end",

                    }}
                >
                    <IconButton
                        onClick={() => onView(bill)}
                        sx={{
                            backgroundColor: "#e3f2fd",
                            "&:hover": { backgroundColor: "#bbdefb" },
                        }}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Box>
            </Box>
        </motion.div>
    );
}
