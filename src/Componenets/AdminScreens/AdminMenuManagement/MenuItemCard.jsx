import { Box, Typography, Chip, Switch, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import ExpandableText from "@/Componenets/ExpandableText/ExpandableText";

export default function MenuItemCard({ item, onEdit, onDelete, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Box
        sx={{
          borderRadius: "18px",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
        className="flex flex-col"
      >
        {/* HEADER */}
        <Box className="flex justify-between items-start bg-[#0b3c5d] p-5 rounded-t-[18px]">
          <Box>
            <Typography fontWeight={700} fontSize={16} color="white">
              {item.name}
            </Typography>

            <Typography fontSize={12} color="white">
              {item.itemCode}
            </Typography>
          </Box>

          <Chip
            size="small"
            label={item.categoryName || "Main"}
            sx={{
              backgroundColor: "#e3f2fd",
              color: "#0b3c5d",
              fontWeight: 600,
              borderRadius: "8px",
            }}
          />
        </Box>

        <Box px={3} py={2} className="flex flex-col gap-2">
          {/* DESCRIPTION */}
          {item.description && <ExpandableText text={item.description} />}

          {/* PRICE SECTION */}
          {item.priceType === "VARIANT" ? (
            <Box className="flex flex-wrap gap-2 mt-1">
              {item.variants?.map((v, i) => (
                <Chip
                  key={i}
                  label={`${v.name} • ₹${v.price}`}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                  }}
                />
              ))}
            </Box>
          ) : item.priceType === "HALF_FULL" ? (
            <Typography fontWeight={700} fontSize={18} color="#000" mt={1}>
              ₹ {item?.price?.half ?? 0} / ₹ {item?.price?.full ?? 0}
            </Typography>
          ) : (
            <Typography fontWeight={700} fontSize={18} color="#000" mt={1}>
              ₹ {item?.price?.full ?? 0}
            </Typography>
          )}

          {/* FOOTER */}
          <Box className="flex justify-between items-center mt-2">
            <Box className="flex items-center gap-2">
              <Switch
                checked={!!item.isAvailable}
                onChange={() => onToggle(item)}
                sx={{
                  "& .MuiSwitch-thumb": {
                    backgroundColor: item.isAvailable ? "#2e7d32" : "#9e9e9e",
                  },
                }}
              />

              <Chip
                size="small"
                label={item.isAvailable ? "Available" : "Unavailable"}
                sx={{
                  fontWeight: 600,
                  backgroundColor: item.isAvailable ? "#e8f5e9" : "#ffebee",
                  color: item.isAvailable ? "#2e7d32" : "#d32f2f",
                }}
              />
            </Box>

            <Box className="flex gap-2">
              <IconButton
                size="small"
                onClick={() => onEdit(item)}
                sx={{
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => onDelete(item._id)}
                sx={{
                  backgroundColor: "#ffebee",
                  color: "#d32f2f",
                  "&:hover": {
                    backgroundColor: "#ffcdd2",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
