"use client";

import { Box, IconButton, Select, MenuItem, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OrderForm from "./OrderForm";

import OrderCart from "./OrderCart";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function WaiterMenuForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNo = searchParams.get("tableNo");
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <Box className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <IconButton onClick={() => router.back()}>
            <ArrowBackIcon />
          </IconButton>

          <Typography fontSize={28} fontWeight={"bold"} color="black">
            {" "}
            Table Number : {tableNo}
          </Typography>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 md:col-span-7">
            <OrderForm />
          </div>

          {/* RIGHT */}
          <div className="col-span-12 md:col-span-5">
            <OrderCart />
          </div>
        </div>
      </Box>
    </Suspense>
  );
}
