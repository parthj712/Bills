"use client";

import {
  Card,
  TextField,
  Chip,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "@/redux/slices/menuSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "@reduxjs/toolkit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRef } from "react";
import { addTakeawayOrder, saveOrdersToDraft } from "@/service/orderService";

import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

export default function OrderForm() {

  const { showSnackbar } = useAppSnackbar();

  const searchRef = useRef(null);
  const kotRef = useRef(null);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tableId = searchParams.get("tableId");
  const { items = [] } = useSelector((state) => state.menu);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [kotMessage, setKotMessage] = useState("");
  const orderType = searchParams.get("orderType") || "DINE-IN";

  const [customerName, setCustomerName] = useState("");
  const [nameError, setNameError] = useState("");

  const [activeIndex, setActiveIndex] = useState(0);

  // keyboatd shortcuts

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);
  useEffect(() => {
    searchRef.current?.focus();
  }, []);
  const categories = useMemo(() => {
    return [...new Set(items.menu?.map((i) => i.categoryName).filter(Boolean))];
  }, [items]);

  const filteredItems = useMemo(() => {
    const byCategory = category
      ? items.menu?.filter((i) => i.categoryName === category)
      : items;

    const q = search.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory?.filter((i) => {
      const name = (i.name || "").toLowerCase();
      const code = (i.itemCode || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [items, category, search]);
  console.log("byCa", selectedItems);
  useEffect(() => {
    setActiveIndex(0);
  }, [filteredItems]);

  const getUnitPrice = (item, portion) => {
    if (!item?.price) return 0;
    if (portion === "half" && item.price.half) return item.price.half;
    return item.price.full || 0;
  };

  // Add "full" by default. If same item+portion already selected, increase qty.
  const handleSelectItem = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find(
        (x) => x.item?._id === item._id && x.portion === "full",
      );

      if (existing) {
        return prev.map((x) =>
          x.tempId === existing.tempId ? { ...x, qty: x.qty + 1 } : x,
        );
      }

      return [
        ...prev,
        {
          tempId: nanoid(),
          item,
          portion: "full",
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (tempId, newQty) => {
    setSelectedItems((prev) =>
      prev.map((x) =>
        x.tempId === tempId ? { ...x, qty: Math.max(1, newQty) } : x,
      ),
    );
  };

  const updatePortion = (tempId, portion) => {
    setSelectedItems((prev) =>
      prev.map((x) => (x.tempId === tempId ? { ...x, portion } : x)),
    );
  };

  const removeSelected = (tempId) => {
    setSelectedItems((prev) => prev.filter((x) => x.tempId !== tempId));
  };

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((sum, x) => {
      const price = getUnitPrice(x.item, x.portion);
      return sum + price * x.qty;
    }, 0);
  }, [selectedItems]);

  // From here we add the items to the cart
  const handleAddAllToOrder = async () => {
    if (!selectedItems.length) return;

    // 🚨 Takeaway name validation
    if (orderType === "TAKEAWAY") {
      if (!customerName.trim()) {
        setNameError("Customer name is required");



        showSnackbar("Please add customer name first", "error");

        document.querySelector("input[label='Customer Name']")?.focus();
        return;
      }

      if (nameError) {


        showSnackbar("Customer name is invalid", "error");

        return;
      }
    }

    try {
      const payload = {
        orderType,
        tableId,
        customerName,
        items: selectedItems.map((x) => ({
          menuItemId: x.item._id,
          name: x.item.name,
          category: x.item.categoryName,
          price: getUnitPrice(x.item, x.portion),
          qty: x.qty,
          itemCode: x.item.itemCode,
          portion: x.portion,
        })),
      };
      console.log(payload);

      if (orderType === "TAKEAWAY") {
        console.log("hellp");
        await addTakeawayOrder(payload);
      } else {
        console.log("hellooo");
        await saveOrdersToDraft(payload);
      }

      // ✅ SUCCESS TOAST HERE

      showSnackbar("Order added successfully", "success");

      // clear UI selections
      setSelectedItems([]);
      setSearch("");
      setKotMessage("");

      // ✅ Redirect after short delay
      // if (orderType === "DINE-IN") {
      //   setTimeout(() => {
      //     router.replace("/waiter");
      //   }, 1100);
      // }
    } catch (err) {
      console.error("Add item failed", err);


      showSnackbar("Failed to add order. Please try again.", "error");
    }
  };

  const isItemSelected = (itemId) => {
    return selectedItems.some(
      (x) => x.item?._id === itemId && x.portion === "full",
    );
  };

  useEffect(() => {
    if (selectedItems.length === 1) {
      kotRef.current?.focus();
    }
  }, [selectedItems]);

  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <Card className="p-6 !rounded-2xl shadow-lg flex flex-col gap-5">
        <Typography fontSize={20} fontWeight={600}>
          Add Order
        </Typography>

        {/* Customer Name – Only for TAKEAWAY */}
        {orderType === "TAKEAWAY" && (
          <TextField
            size="small"
            fullWidth
            label="Customer Name"
            placeholder="Enter customer name"
            value={customerName}
            error={!!nameError}
            helperText={nameError}
            onChange={(e) => {
              const value = e.target.value;

              // Allow only letters & spaces
              if (value && !/^[A-Za-z\s]+$/.test(value)) {
                setNameError("Only letters allowed");
              } else {
                setNameError("");
              }

              // Capitalize first letters
              setCustomerName(
                value.replace(/\b\w/g, (char) => char.toUpperCase()),
              );
            }}
          />
        )}

        {/* Search */}
        <TextField
          inputRef={searchRef}
          placeholder="Search item (name / code)..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Chips */}
        <div className="flex gap-2 flex-wrap">
          <Chip
            sx={{ fontWeight: 600 }}
            label="All"
            clickable
            color={category === "" ? "primary" : "default"}
            onClick={() => setCategory("")}
          />
          {categories.map((cat) => (
            <Chip
              sx={{ fontWeight: 600, borderColor: "black", borderWidth: 1 }}
              key={cat}
              label={cat}
              clickable
              color={category === cat ? "primary" : "default"}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>

        <Box className="grid lg:grid-cols-1 gap-4">
          <Box>
            {/* Menu Items */}
            {(category || search.trim()) && (
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                {/* <Divider /> */}

                <Typography fontSize={20} fontWeight={600}>
                  Menu Items
                </Typography>

                <>
                  {filteredItems.length === 0 ? (
                    <Typography fontSize={14} color="text.secondary">
                      No items found.
                    </Typography>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredItems.map((item, index) => (
                        <Card
                          key={item._id}
                          elevation={0}
                          onClick={() => handleSelectItem(item)}
                          className={`
                            p-3 cursor-pointer border  transition-all duration-150
                            ${isItemSelected(item._id)
                              ? "border-slate-800 bg-slate-50 shadow-sm"
                              : "border-gray-200 hover:border-slate-300 hover:shadow-sm"
                            }

`}
                        >
                          <Typography fontWeight={600}>{item.name}</Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            color="text.secondary"
                          >
                            ₹ {item?.price?.full ?? 0}
                            {item?.price?.half
                              ? ` (Half ₹${item.price.half})`
                              : ""}
                          </Typography>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              </Box>
            )}
          </Box>

          <Box>
            {/* Selected Items */}
            {selectedItems.length > 0 && (
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                {/* <Divider /> */}
                <Typography fontSize={20} fontWeight={600}>
                  Selected Items
                </Typography>

                <div className="flex flex-col gap-3">
                  {selectedItems.map((x) => {
                    const price = getUnitPrice(x.item, x.portion);
                    return (
                      <Card
                        key={x.tempId}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: "1px solid #E5E7EB",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div className="flex flex-col lg:flex-row md:flex-row items-start lg:items-center md:items-center justify-between gap-3">
                          <div className="flex gap-3">
                            <Typography fontWeight={600}>
                              {x.item.name}
                            </Typography>
                            <Typography fontSize={16} color="text.secondary">
                              ₹ {price} / {x.portion}
                            </Typography>
                          </div>

                          {/* Portion */}
                          <div className="flex gap-2 flex-wrap">
                            {x.item?.price?.full && (
                              <Chip
                                label={`Full ₹${x.item.price.full}`}
                                sx={{
                                  fontWeight: 600,
                                  borderRadius: 2,
                                  backgroundColor:
                                    x.portion === "full"
                                      ? "#334155"
                                      : "#F1F5F9",
                                  color:
                                    x.portion === "full" ? "#fff" : "#475569",
                                  "&:hover": {
                                    backgroundColor:
                                      x.portion === "full"
                                        ? "#1E293B"
                                        : "#E2E8F0",
                                  },
                                }}
                                onClick={() => updatePortion(x.tempId, "full")}
                              />
                            )}

                            {x.item?.price?.half && (
                              <Chip
                                sx={{ fontWeight: 600 }}
                                label={`Half ₹${x.item.price.half}`}
                                color={
                                  x.portion === "half" ? "primary" : "default"
                                }
                                onClick={() => updatePortion(x.tempId, "half")}
                              />
                            )}
                          </div>

                          {/* Qty */}
                          <div className="flex items-center gap-3">
                            {/* Decrease */}
                            <IconButton
                              size="small"
                              onClick={() => updateQty(x.tempId, x.qty - 1)}
                              sx={{
                                backgroundColor: "#f3f4f6",
                                color: "#374151",
                                "&:hover": { backgroundColor: "#e5e7eb" },
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>

                            {/* Quantity */}
                            <Typography
                              fontSize={16}
                              fontWeight={700}
                              sx={{
                                minWidth: 32,
                                textAlign: "center",
                                backgroundColor: "#f9fafb",
                                borderRadius: "8px",
                                padding: "4px 10px",
                                border: "1px solid #e5e7eb",
                              }}
                            >
                              {x.qty}
                            </Typography>

                            {/* Increase */}
                            <IconButton
                              size="small"
                              onClick={() => updateQty(x.tempId, x.qty + 1)}
                              sx={{
                                backgroundColor: "#F1F5F9",
                                color: "#334155",
                                "&:hover": { backgroundColor: "#E2E8F0" },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>

                            {/* Price */}
                            {/* <Typography
                        className="ml-auto"
                        fontWeight={700}
                        sx={{ color: "#111827" }}
                      >
                        ₹ {price * x.qty}
                      </Typography> */}
                          </div>

                          <Tooltip title="Remove item" sx={{ fontWeight: 600 }}>
                            <IconButton
                              onClick={() => removeSelected(x.tempId)}
                              size="small"
                              sx={{
                                backgroundColor: "#fee2e2", // light red
                                color: "#dc2626", // red icon
                                "&:hover": {
                                  backgroundColor: "#fecaca",
                                },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Card>
                    );
                  })}

                  {/* Message for Kitchen */}
                  <TextField
                    // inputRef={kotRef}
                    label="KOT Message"
                    placeholder="Ex: No onion, extra spicy..."
                    size="small"
                    fullWidth
                    value={kotMessage}
                    onChange={(e) => setKotMessage(e.target.value)}
                    multiline
                    minRows={2}
                  />

                  <Box
                    sx={{
                      backgroundColor: "#F8FAFC",
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#1E293B",
                        textAlign: "center",
                      }}
                    >
                      Total ₹ {totalAmount}
                    </Typography>
                  </Box>

                  <AppButton
                    label="Add All to Order"
                    sx={{
                      backgroundColor: "#1E293B",
                      color: "#fff",
                      py: 1.6,
                      borderRadius: 3,
                      fontWeight: 600,
                      letterSpacing: "0.4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      "&:hover": {
                        backgroundColor: "#0F172A",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                      },
                    }}
                    onClick={handleAddAllToOrder}
                  />
                </div>
              </Box>
            )}
          </Box>
        </Box>
      </Card>
    </Suspense>
  );
}
