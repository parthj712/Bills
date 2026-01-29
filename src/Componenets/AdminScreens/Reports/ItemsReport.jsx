"use client";

import { Box, Button, Typography } from '@mui/material'
import DownloadIcon from "@mui/icons-material/Download";
import React from 'react'

const ItemsReport = () => {


    const exportExcel = () => {
        const data = filteredBills.map((b) => ({
            Date: new Date(b.createdAt).toLocaleDateString("en-IN"),
            BillNo: b.billNo,
            Subtotal: b.subtotal,
            GST: b.gstAmount,
            Total: b.grandTotal,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Items Report");

        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), "Items_Report.xlsx");
    };


    return (
        <div>
            <Box className="min-h-screen p-4">
                {/* Header */}
                <Box className="flex items-center justify-between mb-6">
                    <Box>
                        <Typography fontSize={30} fontWeight={700} className="text-[#0b3c5d]">
                            Items Report
                        </Typography>
                        <Typography fontSize={14} color="text.secondary">
                            Helps to analyze sales of items over a period of time.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={exportExcel}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            background: "linear-gradient(135deg,#0b3c5d,#1976d2)",
                        }}
                    >
                        Export Excel
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default ItemsReport