"use client";

import {
  Box,
  IconButton,
  Select,
  MenuItem,
  Typography,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OrderForm from "./OrderForm";
import CloseIcon from "@mui/icons-material/Close";
import OrderCart from "./OrderCart";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

export default function WaiterMenuForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableNo = searchParams.get("tableNo");
  const orderType = searchParams.get("orderType") || "DINE-IN";
  const section = searchParams.get("section");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const { items = [] } = useSelector((state) => state.menu);
  console.log(section);
  const categories = useMemo(() => {
    return [...new Set(items.menu?.map((i) => i.categoryName).filter(Boolean))];
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
            <>
              <Typography
                fontSize={isMobile ? 20 : 28}
                fontWeight={"bold"}
                color="black"
              >
                {section}
              </Typography>
              <Typography
                fontSize={isMobile ? 20 : 28}
                fontWeight={"bold"}
                color="black"
              >
                Table Number : {tableNo}
              </Typography>
            </>
          ) : (
            <Typography fontSize={24} fontWeight={"bold"} color="black">
              {orderType} ORDER
            </Typography>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-7">
            <OrderForm
              category={category}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
            />
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
  maxWidth="sm"
>
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: 1,
    }}
  >
    <Typography variant="h6" fontWeight={600}>
      Select Category
    </Typography>

    <IconButton onClick={() => setOpenCategoryDialog(false)}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent>
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1.5,
        py: 1,
      }}
    >
      <Chip
        label="All Categories"
        clickable
        onClick={() => {
          setCategory("");
          setOpenCategoryDialog(false);
        }}
        sx={{
          px: 1,
          py: 2.5,
          borderRadius: "12px",
          fontWeight: 600,
          bgcolor: category === "" ? "primary.main" : "grey.100",
          color: category === "" ? "#fff" : "text.primary",
          "&:hover": {
            bgcolor: category === "" ? "primary.dark" : "grey.200",
          },
        }}
      />

      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          clickable
          onClick={() => {
            setCategory(cat);
            setSubCategory("");
            setOpenCategoryDialog(false);
          }}
          sx={{
            px: 1,
            py: 2.5,
            borderRadius: "12px",
            fontWeight: 500,
            bgcolor:
              category === cat ? "primary.main" : "background.paper",
            color: category === cat ? "#fff" : "text.primary",
            border:
              category === cat
                ? "1px solid transparent"
                : "1px solid #e0e0e0",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: 2,
            },
          }}
        />
      ))}
    </Box>
  </DialogContent>
</Dialog>
      </Box>
    </Suspense>
  );
}
