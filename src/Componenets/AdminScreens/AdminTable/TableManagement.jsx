"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { Box, Typography, Button } from "@mui/material";

const tables = [
    { id: 1, status: "available" },
    { id: 2, status: "empty" },
    { id: 3, status: "occupied" },
    { id: 4, status: "empty" },
    { id: 5, status: "empty" },
    { id: 6, status: "empty" },
    { id: 7, status: "empty" },
    { id: 8, status: "empty" },
    { id: 9, status: "empty" },
    { id: 10, status: "billed" },
    { id: 11, status: "empty" },
    { id: 12, status: "empty" },
];

const STATUS_STYLE = {
    available: "bg-green-100 border-green-400",
    occupied: "bg-red-100 border-red-400",
    billed: "bg-yellow-100 border-yellow-400",
    empty: "bg-gray-200 border-transparent",
};

export default function TableManagement() {
    return (
        // ✅ THIS IS THE KEY
        <Box className="flex flex-col min-h-full p-2">
            {/* Header */}
            <Typography color="black" fontSize={30} fontWeight={600} mb={6}>
                Table Management
            </Typography>

            {/* Tables Grid */}
            <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className={`
              h-28 w-full flex items-center justify-center
              rounded-xl text-xl font-semibold
              border-2 cursor-pointer text-black
              ${STATUS_STYLE[table.status]}
            `}
                    >
                        {table.id}
                    </div>
                ))}
            </div>

            {/* ✅ Legend + Actions pinned to bottom */}
            <Box className="mt-auto pt-10 flex items-center justify-between gap-4">
                {/* Legend */}
                <Box className="flex items-center gap-8 text-black">
                    <span className="flex items-center gap-3 text-[20px]">
                        <span className="h-6 w-2 rounded-full bg-green-500"></span>
                        Available
                    </span>

                    <span className="flex items-center gap-3 text-[20px]">
                        <span className="h-6 w-2 rounded-full bg-yellow-400"></span>
                        Occupied
                    </span>

                    <span className="flex items-center gap-3 text-[20px]">
                        <span className="h-6 w-2 rounded-full bg-red-500"></span>
                        Billed / Cleaning
                    </span>
                </Box>

                {/* Buttons (RIGHT SIDE) */}
                <Box className="flex gap-4">
                    <AppButton
                        label="Edit Tables"
                        className="!bg-yellow-400 hover:!bg-yellow-500 !text-black px-8"
                    />

                    <AppButton
                        label="Add Tables"
                        className="!bg-green-500 hover:!bg-green-600 !text-white px-8"
                    />
                </Box>
            </Box>

        </Box>
    );
}
