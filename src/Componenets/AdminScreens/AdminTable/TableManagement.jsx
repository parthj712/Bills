"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import AddTable from "./AddTable";
import { getTables } from "@/service/tableService";
import EditTable from "./EditTable";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Edit, Delete, Add, Search } from "@mui/icons-material";
import { getSubscriptionExpiry } from "@/service/subscriptionService";

import { socket } from "@/app/lib/socket";
import { NOTIFICATIONS } from "@/Componenets/ToastConstant/notifications";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

export const STATUS_CONFIG = {
  AVAILABLE: {
    bg: "bg-green-100",
    border: "border-green-600",
    text: "text-green-700",
    icon: CheckCircleIcon,
    label: "Available",
  },
  OCCUPIED: {
    bg: "bg-red-100",
    border: "border-red-600",
    text: "text-red-700",
    icon: CancelIcon,
    label: "Occupied",
  },
  BILLED: {
    bg: "bg-yellow-100",
    border: "border-yellow-600",
    text: "text-yellow-700",
    icon: ReceiptLongIcon,
    label: "Billed",
  },
  EMPTY: {
    bg: "bg-gray-200",
    border: "border-gray-400",
    text: "text-gray-600",
    icon: HelpOutlineIcon,
    label: "Empty",
  },
};

export default function TableManagement() {
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const allowedPlans = ["PREMIUM", "TRIAL", "STANDARD"];

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription.planType);

  const { showSnackbar } = useAppSnackbar();

  const fetchSubscriptionExpiry = async () => {
    try {
      const res = await getSubscriptionExpiry();
      setSubscription(res.data);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoadingSub(false); // ✅ stop loading
    }
  };

  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [tables, setTables] = useState([]);
  const shopJoinedRef = useRef(false); // ensures we join the shop only once
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const handleTableClick = (table) => {
    setSelectedTable(table);
    setOpenEditDialog(true);
  };
  const [loading, setLoading] = useState(true);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const groupedTables = tables.reduce((acc, table) => {
    const sectionName = table.sectionId?.name || "No Section";

    if (!acc[sectionName]) {
      acc[sectionName] = [];
    }

    acc[sectionName].push(table);
    return acc;
  }, {});

  // Fetch tables
  const handleGetTables = async () => {
    setLoading(true);
    try {
      const res = await getTables();

      setTables(res);
    } catch (err) {
      console.log("Failed to fetch tables", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTables();
    fetchSubscriptionExpiry();
  }, []);

  useEffect(() => {
    const handleTableUpdate = (data) => {
      setTables((prev) =>
        prev.map((t) =>
          t._id === data.tableId ? { ...t, status: data.status } : t,
        ),
      );
    };

    socket.on("tableStatusChanged", handleTableUpdate);

    return () => {
      socket.off("tableStatusChanged", handleTableUpdate);
    };
  }, []);

  const handleAddTable = async () => {
    await handleGetTables();
  };

  return (
    <Box className="flex flex-col min-h-full p-2">
      {/* Header */}

      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={isMobile ? "flex-start" : "center"}
        mb={4}
        gap={isMobile ? 2 : 0}
      >
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={isMobile ? 600 : 700}
          className="text-[#0b3c5d]"
        >
          Table Management
        </Typography>

        {/* Bottom Section */}
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {/* Legend */}
          <Box className="flex gap-8 text-[20px]">
            {/* <span className="flex items-center gap-3">
            <span className="h-6 w-2 bg-green-500 rounded-full"></span>
            Available
          </span>
          <span className="flex items-center gap-3">
            <span className="h-6 w-2 bg-red-500 rounded-full"></span>
            Occupied
          </span>
          <span className="flex items-center gap-3">
            <span className="h-6 w-2 bg-yellow-400 rounded-full"></span>
            Billed
          </span> */}
          </Box>

          {/* Buttons */}
          <Box className="flex gap-4">
            {/* <AppButton
            label="Edit Tables"
            className="!bg-yellow-400 !text-black px-8"
          /> */}

            {!isMobile && (
              <AppButton
                label="Add Tables"
                startIcon={<Add />}
                onClick={() => {
                  if (!hasAccess) {
                    showSnackbar(
                      "Upgrade to Premium to add more tables 🚀",
                      "warning",
                    );
                    return;
                  }

                  setOpenAddDialog(true);
                }}
                sx={{
                  backgroundColor: "#0b3c5d",
                  color: "#fff",
                  px: 2,
                  minWidth: 140,
                  height: 40,
                  borderRadius: 3,
                  fontWeight: 800,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Tables Grid */}
      {Object.entries(groupedTables).map(([section, tables]) => (
        <Box key={section} mb={5}>
          {/* Section Title */}
          <Typography
            fontSize={18}
            fontWeight={700}
            mb={2}
            className="text-[#0b3c5d]"
          >
            {section}
          </Typography>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tables.map((table) => (
              <motion.div
                key={table._id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => handleTableClick(table)}
                className={`relative h-28 w-full rounded-2xl border cursor-pointer flex flex-col items-center justify-center gap-1 text-black shadow-sm hover:shadow-lg transition-all
          ${STATUS_CONFIG[table.status?.toUpperCase()]?.bg}
          ${STATUS_CONFIG[table.status?.toUpperCase()]?.border}`}
              >
                <span className="text-2xl font-bold">{table.tableNo}</span>

                <span className="text-xs font-medium tracking-wide uppercase text-black/60">
                  {table.status || "Available"}
                </span>
              </motion.div>
            ))}
          </div>
        </Box>
      ))}

      <AddTable
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={handleAddTable}
      />

      {/*  Edit and delete Table Dialog */}
      <EditTable
        open={openEditDialog}
        table={selectedTable}
        onClose={() => setOpenEditDialog(false)}
        onSuccess={handleGetTables}
      />

      {isMobile && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-9 right-8 z-50"
        >
          <Box
            onClick={() => setOpenAddDialog(true)}
            sx={{
              height: 56,
              width: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF7A18, #FFB347)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(255,122,24,0.45)",
              cursor: "pointer",
              transition: "0.2s",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Add sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
