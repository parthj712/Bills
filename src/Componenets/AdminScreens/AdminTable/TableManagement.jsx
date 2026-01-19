"use client";

import { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import AddTable from "./AddTable";
import { getTables } from "@/service/tableService";
import EditTable from "./EditTable";

const STATUS_STYLE = {
  AVAILABLE: "bg-green-100 border-green-400",
  occupied: "bg-red-100 border-red-400",
  billed: "bg-yellow-100 border-yellow-400",
  empty: "bg-gray-200 border-transparent",
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
      <Typography fontSize={30} fontWeight={600} mb={6}>
        Table Management
      </Typography>

      {/* Tables Grid */}
      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6">
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
              <div
                key={table._id}
                onClick={() => handleTableClick(table)}
                className={`
            h-28 w-full flex items-center justify-center
            rounded-xl text-xl font-semibold
            border-2 cursor-pointer text-black
            ${STATUS_STYLE[table.status]}
          `}
              >
                {table.tableNo}
              </div>
            ))}
      </div>

      {/* Bottom Section */}
      <Box className="mt-auto pt-10 flex items-center justify-between">
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
            className="!bg-green-500 !text-white px-8"
            onClick={() => setOpenAddDialog(true)}
          />
        </Box>
      </Box>

      {/*  Add Table Dialog */}
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
