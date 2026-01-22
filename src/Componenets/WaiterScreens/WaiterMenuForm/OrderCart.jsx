"use client";

import { Card, Typography, Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { updateTableStatus } from "@/service/tableService";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import { finalizeBillAndOrder } from "@/service/orderService";
import { Suspense, useState } from "react";
import { clearCart, decreaseQty, increaseQty } from "@/redux/slices/cartSlice";

export default function OrderCart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const cartItems = useSelector((state) => state.cart.byTable[tableId] || []);

  const [loading, setLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.qty,
    0,
  );

  // DISPLAY ONLY
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleProceedToBilling = async () => {
    if (!cartItems.length || !tableId || loading) return;

    setLoading(true);

    try {
      const payload = {
        tableId,
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          itemCode: item.itemCode,
          portion: item.portion,
          price: item.unitPrice,
          qty: item.qty,
        })),
      };

      const res = await finalizeBillAndOrder(payload);

      console.log("Billing Success:", res.data);

      dispatch(clearCart(tableId));
      await updateTableStatus(tableId, "AVAILABLE");
    } catch (error) {
      console.error("Billing failed", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveAndContinue = async () => {
    if (!tableId) return;

    try {
      await updateTableStatus(tableId, "OCCUPIED");

      // optional: clear cart or keep it
      router.back(); // ⬅️ go to previous screen
    } catch (error) {
      console.error("Failed to update table status", error);
    }
  };

  return (
    <>
      <Suspense fallback={<div>Loading order...</div>}>
        <Card className="p-6 rounded-2xl border-dashed border-2 border-gray-300">
          {/* Items */}
          {cartItems.map((item) => (
            <div
              key={item.cartId}
              className="flex justify-between items-center my-3"
            >
              <div>
                <Typography fontSize={14}>
                  {item.name} ({item.portion})
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  ₹ {item.unitPrice}/-
                </Typography>
              </div>

              <div className="flex items-center gap-2">
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(decreaseQty({ tableId, cartId: item.cartId }))
                  }
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Typography>{item.qty}</Typography>

                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(increaseQty({ tableId, cartId: item.cartId }))
                  }
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))}

          <Divider className="my-4" />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (approx)</span>
              <span>₹ {tax.toFixed(2)}</span>
            </div>

            <Divider />

            <div className="flex justify-between font-semibold my-3">
              <span>Grand Total</span>
              <span>₹ {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <AppButton
            label="Save & Continue"
            className="!bg-green-500 hover:!bg-green-600 !text-white px-6"
            onClick={handleSaveAndContinue}
          />

          <AppButton
            label={loading ? "Processing..." : "Proceed to Billing"}
            disabled={loading}
            className="!bg-blue-500 hover:!bg-blue-600 !text-white px-6"
            onClick={handleProceedToBilling}
          />
        </div>
      </Suspense>
    </>
  );
}
