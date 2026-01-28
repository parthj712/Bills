"use client";

import { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
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
  // ✅ tables must be state
  const [tables, setTables] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const handleTableClick = (table) => {
    setSelectedTable(table);
    setOpenEditDialog(true);
  };
  const [loading, setLoading] = useState(true);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleGetTables = async () => {
    try {
      setLoading(true);
      const res = await getTables();
      setTables(res);
    } catch (error) {
      console.log("failed to get tables", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTables();
  }, []);

  const handleAddTable = async () => {
    await handleGetTables();
  };

  return (
    <Box className="flex flex-col min-h-full p-2">
      {/* Header */}

      <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} mb={4}>
        <Typography fontSize={30} fontWeight={700} className="text-[#0b3c5d]">
          Table Management
        </Typography>

        {/* Bottom Section */}
        <Box className=" flex items-center justify-between">
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

            <AppButton
              label="Add Tables"
              startIcon={<Add />}
              // className="!bg-green-500 !text-white px-8"
              onClick={() => setOpenAddDialog(true)}
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
          </Box>
        </Box>

      </Box>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rounded"
              height={112}
              sx={{ borderRadius: "12px" }}
            />
          ))
          : tables.map((table) => (
            <motion.div
              key={table._id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => handleTableClick(table)}
              className={`
                  relative
                  h-28 w-full
                  rounded-2xl
                  border
                  cursor-pointer
                  flex flex-col
                  items-center
                  justify-center
                  gap-1
                  text-black
                  shadow-sm
                  hover:shadow-lg
                  transition-all
                 ${STATUS_CONFIG[table.status?.toUpperCase()]?.bg} ${STATUS_CONFIG[table.status?.toUpperCase()]?.border}

                `}
            >
              {/* Table number */}
              <span className="text-2xl font-bold">
                {table.tableNo}
              </span>

              {/* Status label */}
              <span className="text-xs font-medium tracking-wide uppercase text-black/60">
                {table.status || "Available"}
              </span>
            </motion.div>

          ))}
      </div>


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
    </Box>
  );
}