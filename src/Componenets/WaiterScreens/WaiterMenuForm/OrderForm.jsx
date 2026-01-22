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
import { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "@/redux/slices/menuSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { useSearchParams } from "next/navigation";
import { nanoid } from "@reduxjs/toolkit";

export default function OrderForm() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const { items = [] } = useSelector((state) => state.menu);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [kotMessage, setKotMessage] = useState("");
  // selectedItems: [{ tempId, item, portion, qty }]

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const categories = useMemo(() => {
    return [...new Set(items.map((i) => i.categoryName).filter(Boolean))];
  }, [items]);

  const filteredItems = useMemo(() => {
    const byCategory = category
      ? items.filter((i) => i.categoryName === category)
      : items;

    const q = search.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory.filter((i) => {
      const name = (i.name || "").toLowerCase();
      const code = (i.itemCode || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [items, category, search]);

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

  // If you want same item to be a single line even after switching portion,
  // this keeps it as one line. If you want separate lines for half/full, tell me.
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

  const handleAddAllToOrder = () => {
    if (!tableId || selectedItems.length === 0) return;

    selectedItems.forEach((x) => {
      const unitPrice = getUnitPrice(x.item, x.portion);

      dispatch(
        addToCart({
          cartId: nanoid(),
          _id: x.item._id,
          name: x.item.name,
          itemCode: x.item.itemCode,
          portion: x.portion,
          unitPrice,
          qty: x.qty,
          tableId,
          kotMessage,
        }),
      );
    });

    setSelectedItems([]);
    setKotMessage("");
  };

  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <Card className="p-6 rounded-2xl shadow-lg flex flex-col gap-5">
        <Typography fontSize={20} fontWeight={600}>
          Add Order
        </Typography>

        {/* Search */}
        <TextField
          placeholder="Search item (name / code)..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
{/* Message for Kitchen */}
<TextField
  label="KOT Message"
  placeholder="Ex: No onion, extra spicy..."
  size="small"
  fullWidth
  value={kotMessage}
  onChange={(e) => setKotMessage(e.target.value)}
  multiline
  minRows={2}
/>

        {/* Category Chips */}
        <div className="flex gap-2 flex-wrap">
          <Chip
            label="All"
            clickable
            color={category === "" ? "primary" : "default"}
            onClick={() => setCategory("")}
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              color={category === cat ? "primary" : "default"}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>

        {/* Menu Items */}
        {(category || search.trim()) && (
          <>
            <Divider />
            <Typography fontSize={16} fontWeight={500}>
              Menu Items
            </Typography>

            {filteredItems.length === 0 ? (
              <Typography fontSize={14} color="text.secondary">
                No items found.
              </Typography>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <Card
                    key={item._id}
                    onClick={() => handleSelectItem(item)}
                    className="p-3 cursor-pointer border rounded-xl transition hover:shadow"
                  >
                    <Typography fontWeight={500}>{item.name}</Typography>
                    <Typography fontSize={13} color="text.secondary">
                      ₹ {item?.price?.full ?? 0}
                      {item?.price?.half ? ` (Half ₹${item.price.half})` : ""}
                    </Typography>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <>
            <Divider />
            <Typography fontSize={16} fontWeight={600}>
              Selected Items
            </Typography>

            <div className="flex flex-col gap-3">
              {selectedItems.map((x) => {
                const price = getUnitPrice(x.item, x.portion);
                return (
                  <Card key={x.tempId} className="p-3 rounded-xl border">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Typography fontWeight={600}>{x.item.name}</Typography>
                        <Typography fontSize={13} color="text.secondary">
                          ₹ {price} / {x.portion}
                        </Typography>
                      </div>

                      <AppButton
                        label="Remove"
                        className="!bg-gray-200 !text-black"
                        onClick={() => removeSelected(x.tempId)}
                      />
                    </div>

                    {/* Portion */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Chip
                        label={`Full ₹${x.item?.price?.full ?? 0}`}
                        color={x.portion === "full" ? "primary" : "default"}
                        onClick={() => updatePortion(x.tempId, "full")}
                      />
                      {x.item?.price?.half && (
                        <Chip
                          label={`Half ₹${x.item.price.half}`}
                          color={x.portion === "half" ? "primary" : "default"}
                          onClick={() => updatePortion(x.tempId, "half")}
                        />
                      )}
                    </div>

                    {/* Qty */}
                    <div className="flex items-center gap-3 mt-2">
                      <IconButton onClick={() => updateQty(x.tempId, x.qty - 1)}>
                        <RemoveIcon />
                      </IconButton>

                      <Typography fontSize={18} fontWeight={600}>
                        {x.qty}
                      </Typography>

                      <IconButton onClick={() => updateQty(x.tempId, x.qty + 1)}>
                        <AddIcon />
                      </IconButton>

                      <Typography className="ml-auto font-semibold">
                        ₹ {price * x.qty}
                      </Typography>
                    </div>
                  </Card>
                );
              })}

              <div className="flex items-center justify-between">
                <Typography fontWeight={700}>Total: ₹ {totalAmount}</Typography>
              </div>

              <AppButton
                label="Add All to Order"
                className="!bg-orange-500 hover:!bg-orange-600 !text-white"
                onClick={handleAddAllToOrder}
              />
            </div>
          </>
        )}
      </Card>
    </Suspense>
  );
}
