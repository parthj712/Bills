"use client";

import { Box, Typography, Divider } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function BillPreviewKOT({
    items,
    shopInfo,
    orderType,
    tableId,
    date,
}) {

    const searchParams = useSearchParams();
    const tableNo = searchParams.get("tableNo");

    return (
        <Box
            id="kot-pdf"
            sx={{
                width: "100%",
                fontFamily: "monospace",
                fontSize: 13,
            }}
        >
            <Typography align="center" fontWeight={700} fontSize={16}>
                {shopInfo?.shopName || "Restaurant Name"}
            </Typography>

            <Typography align="center" fontSize={12} sx={{ letterSpacing: 1 }}>
                KITCHEN ORDER TICKET
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ fontSize: 12 }}>
                <Typography>Order Type: {orderType}</Typography>

                {tableNo && (
                    <Typography>Table No: {tableNo}</Typography>
                )}

                <Typography>Date: {date}</Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            {items.map((item) => (
                <Box key={item.menuItemId} sx={{ mb: 1.5 }}>
                    <Typography fontSize={16} fontWeight={600}>
                        {item.name} ({item.portion})
                    </Typography>

                    <Typography fontSize={16}>
                        Qty: {item.qty}
                    </Typography>

                    {item.note && (
                        <Typography fontSize={12} color="error">
                            Note: {item.note}
                        </Typography>
                    )}

                    <Divider sx={{ mt: 1 }} />
                </Box>
            ))}

            <Typography
                align="center"
                fontSize={12}
                sx={{ mt: 2, fontStyle: "italic", color: "#64748B" }}
            >
                --- Kitchen Copy ---
            </Typography>
        </Box>

    );
}
