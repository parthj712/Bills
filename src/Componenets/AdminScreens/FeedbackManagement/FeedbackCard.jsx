import { Box, Typography, Chip, Switch } from "@mui/material";
import { motion } from "framer-motion";

export default function FeedbackCard({ feedback, onToggle }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25 }}
        >
            <Box
                sx={{
                    borderRadius: "18px",
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
                className="flex flex-col"
            >
                {/* HEADER */}
                <Box className="flex justify-between items-start bg-[#0b3c5d] p-5 rounded-t-[18px]">
                    <Box>
                        <Typography fontWeight={700} fontSize={15} color="white">
                            Name: {feedback.customerName || "Anonymous"}
                        </Typography>

                        {feedback.customerMobile ? (
                            <Typography fontSize={12} color="white">
                                Mobile: {feedback.customerMobile}
                            </Typography>
                        ) : (
                            <Typography fontSize={12} color="#cfd8dc">
                                No contact info
                            </Typography>
                        )}
                    </Box>

                    <Chip
                        size="small"
                        label={`⭐ ${feedback.overallRating}`}
                        sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#0b3c5d",
                            fontWeight: 600,
                        }}
                    />
                </Box>

                {/* BODY */}
                <Box px={3} py={2} className="flex flex-col gap-2">
                    {/* COMMENT */}
                    <Typography fontSize={13} color="text.secondary">
                        {feedback.comment || "No comment"}
                    </Typography>

                    {/* RATINGS */}
                    <Box className="flex flex-wrap gap-2 mt-1">
                        <Chip label={`🍽 Food: ${feedback.foodRating}`} size="small" />
                        <Chip label={`🛎 Service: ${feedback.serviceRating}`} size="small" />
                        <Chip label={`🏡 Ambience: ${feedback.ambienceRating}`} size="small" />
                    </Box>

                    {/* FOOTER */}
                    <Box className="flex justify-between items-center mt-2">
                        <Typography fontSize={12} color="text.secondary">
                            {new Date(feedback.createdAt).toLocaleDateString("en-IN")}
                        </Typography>

                        <Box className="flex items-center gap-2">
                            <Switch
                                checked={feedback.isResolved}
                                onChange={() => onToggle(feedback)}
                                color="success"
                            />

                            <Chip
                                size="small"
                                label={feedback.isResolved ? "Resolved" : "Pending"}
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: feedback.isResolved
                                        ? "#e8f5e9"
                                        : "#fff3e0",
                                    color: feedback.isResolved ? "#2e7d32" : "#ef6c00",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}