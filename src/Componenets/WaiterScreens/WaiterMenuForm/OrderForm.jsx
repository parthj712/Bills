"use client";

import {
  Card,
  TextField,
  Chip,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "@/redux/slices/menuSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useSearchParams } from "next/navigation";
import { nanoid } from "@reduxjs/toolkit";

export default function OrderForm() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const { items } = useSelector((state) => state.menu);

  const [category, setCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [portion, setPortion] = useState("full");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const categories = [...new Set(items.map((i) => i.categoryName))];
  const filteredItems = items.filter((i) => i.categoryName === category);

  const unitPrice =
    portion === "half" && selectedItem?.price?.half
      ? selectedItem.price.half
      : selectedItem?.price?.full || 0;

  const handleAddToOrder = () => {
    if (!selectedItem || !tableId) return;

    dispatch(
      addToCart({
        cartId: nanoid(),
        _id: selectedItem._id,
        name: selectedItem.name,
        itemCode: selectedItem.itemCode,
        portion,
        unitPrice,
        qty,
        tableId,
      }),
    );

    setSelectedItem(null);
    setQty(1);
    setPortion("full");
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg flex flex-col gap-5">
      <Typography fontSize={20} fontWeight={600}>
        Add Order
      </Typography>

      {/* Search */}
      <TextField placeholder="Search item..." size="small" fullWidth />

      {/* Category Chips */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={category === cat ? "primary" : "default"}
            onClick={() => {
              setCategory(cat);
              setSelectedItem(null);
            }}
          />
        ))}
      </div>

      {/* Menu Items */}
      {category && (
        <>
          <Divider />
          <Typography fontSize={16} fontWeight={500}>
            Menu Items
          </Typography>

          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <Card
                key={item._id}
                onClick={() => {
                  setSelectedItem(item);
                  setPortion("full");
                }}
                className={`p-3 cursor-pointer border rounded-xl transition ${
                  selectedItem?._id === item._id
                    ? "border-orange-500 bg-orange-50"
                    : "hover:shadow"
                }`}
              >
                <Typography fontWeight={500}>{item.name}</Typography>
                <Typography fontSize={13} color="text.secondary">
                  ₹ {item.price.full}
                </Typography>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Selected Item Controls */}
      {selectedItem && (
        <>
          <Divider />

          {/* Portion */}
          <div className="flex gap-2">
            <Chip
              label={`Full ₹${selectedItem.price.full}`}
              color={portion === "full" ? "primary" : "default"}
              onClick={() => setPortion("full")}
            />
            {selectedItem.price?.half && (
              <Chip
                label={`Half ₹${selectedItem.price.half}`}
                color={portion === "half" ? "primary" : "default"}
                onClick={() => setPortion("half")}
              />
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <IconButton onClick={() => setQty(Math.max(1, qty - 1))}>
              <RemoveIcon />
            </IconButton>

            <Typography fontSize={18} fontWeight={600}>
              {qty}
            </Typography>

            <IconButton onClick={() => setQty(qty + 1)}>
              <AddIcon />
            </IconButton>

            <Typography className="ml-auto font-semibold">
              ₹ {unitPrice * qty}
            </Typography>
          </div>

          {/* Add Button */}
          <AppButton
            label="Add to Order"
            className="!bg-orange-500 hover:!bg-orange-600 !text-white"
            onClick={handleAddToOrder}
          />
        </>
      )}
    </Card>
  );
}
