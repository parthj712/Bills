"use client";

import {
  Box, IconButton, Select, MenuItem, Typography, Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OrderForm from "./OrderForm";

import OrderCart from "./OrderCart";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

export default function WaiterMenuForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNo = searchParams.get("tableNo");
  const orderType = searchParams.get("orderType") || "DINE-IN";

  const [category, setCategory] = useState("");
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);


  const { items = [] } = useSelector((state) => state.menu);

  const categories = useMemo(() => {
    return [
      ...new Set(items.menu?.map((i) => i.categoryName).filter(Boolean)),
    ];
  }, [items]);

  const isDineIn = orderType === "DINE-IN";
  useEffect(() => {
    if (!isDineIn && searchParams.get("tableNo")) {
      router.replace("/waiter");
    }
  }, [isDineIn]);
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <Box className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <IconButton
            onClick={() => router.back()}
            sx={{
              bgcolor: "#2563EB",
              color: "white",
              "&:hover": {
                bgcolor: "#1E40AF",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {isDineIn ? (
            <Typography fontSize={28} fontWeight={"bold"} color="black">
              Table Number : {tableNo}
            </Typography>
          ) : (
            <Typography fontSize={24} fontWeight={"bold"} color="black">
              {orderType} ORDER
            </Typography>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-7">
            <OrderForm category={category} />

          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-5">
            <OrderCart />
          </div>
        </div>



        {/* Floating Category Button */}
        <Fab
          onClick={() => setOpenCategoryDialog(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 1000,
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            color: "#fff",
            boxShadow: "0 8px 25px rgba(249,115,22,0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #fb923c, #c2410c)",
              boxShadow: "0 10px 30px rgba(249,115,22,0.6)",
            },
          }}
        >
          <RestaurantMenuIcon />
        </Fab>


        <Dialog
          open={openCategoryDialog}
          onClose={() => setOpenCategoryDialog(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Select Category</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              pb: 3,
            }}
          >
            <Chip
              label="All"
              clickable
              color={category === "" ? "primary" : "default"}
              onClick={() => {
                setCategory("");
                setOpenCategoryDialog(false);
              }}
            />

            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                color={category === cat ? "primary" : "default"}
                onClick={() => {
                  setCategory(cat);
                  setOpenCategoryDialog(false);
                }}
              />
            ))}
          </DialogContent>
        </Dialog>

      </Box>
    </Suspense>
  );
}
