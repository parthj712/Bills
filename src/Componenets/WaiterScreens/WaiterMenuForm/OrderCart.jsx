"use client";

import { Card, Typography, Divider, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useDispatch, useSelector } from "react-redux";
import { updateTableStatus } from "@/service/tableService";
import { useRouter, useSearchParams } from "next/navigation";
import { finalizeBillAndOrder } from "@/service/orderService";
import { Suspense, useState, useMemo } from "react";
import { clearCart, decreaseQty, increaseQty } from "@/redux/slices/cartSlice";

export default function OrderCart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tableId = searchParams.get("tableId");
  const orderType = searchParams.get("orderType") || "DINE-IN";
  const isDineIn = orderType === "DINE-IN";

  // ✅ cartKey: tableId for DINE-IN, else orderType
  const cartKey = isDineIn ? tableId : orderType;

  const cartItems = useSelector((state) => state.cart.byTable[cartKey] || []);

  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [cartItems],
  );

  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleProceedToBilling = async () => {
    if (!cartItems.length || loading) return;
    if (isDineIn && !tableId) return;

    setLoading(true);

    try {
      const payload = {
        orderType, // ✅ MUST SEND
        tableId: isDineIn ? tableId : null,
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          itemCode: item.itemCode,
          portion: item.portion,
          price: item.unitPrice,
          qty: item.qty,
        })),
      };

      console.log("payload", payload);

      const res = await finalizeBillAndOrder(payload);
      console.log("Billing Success:", res.data);

      // ✅ clear correct cart
      dispatch(clearCart(cartKey));

      // ✅ update table only for dine-in
      if (isDineIn) {
        await updateTableStatus(tableId, "AVAILABLE");
      }

      router.back();
    } catch (error) {
      console.error("Billing failed", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (!isDineIn || !tableId) return;

    try {
      await updateTableStatus(tableId, "OCCUPIED");
      router.back();
    } catch (error) {
      console.error("Failed to update table status", error);
    }
  };

  const handleCancelOrder = () => {
    dispatch(clearCart(cartKey));
    router.back();
  };

  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <Card className="p-6 !rounded-2xl border-dashed border-3 border-gray-300">
        {/* Items */}
        {cartItems.length === 0 ? (
          <div className="my-6 text-center">
            <Typography fontSize={16} fontWeight={600} color="text.secondary">
              No items added yet
            </Typography>
            <Typography fontSize={14} color="text.secondary" className="mt-1">
              Tap on menu items to add them here
            </Typography>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.cartId}
              className="flex justify-between items-center my-3"
            >
              <div>
                <Typography fontSize={16} fontWeight={600}>
                  {item.name} ({item.portion})
                </Typography>
                <Typography fontSize={14}>₹ {item.unitPrice}/-</Typography>
              </div>

              <div className="flex items-center gap-3">
                {/* Decrease */}
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(decreaseQty({ cartKey, cartId: item.cartId }))
                  }
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
                  fontWeight={700}
                  sx={{
                    minWidth: 32,
                    textAlign: "center",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  {item.qty}
                </Typography>

                {/* Increase */}
                <IconButton
                  size="small"
                  onClick={() =>
                    dispatch(increaseQty({ cartKey, cartId: item.cartId }))
                  }
                  sx={{
                    backgroundColor: "#dcfce7",
                    color: "#16a34a",
                    "&:hover": { backgroundColor: "#bbf7d0" },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </div>
            </div>
          ))
        )}

        <Divider className="my-4" />

        {/* Totals */}
        <div className="my-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (approx)</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>

          <Divider />

          <div className="flex justify-between items-center my-4 p-3 rounded-xl bg-green-50">
            <span className="text-[22px] font-semibold text-gray-800">
              Grand Total
            </span>
            <span className="text-[22px] font-bold text-green-700">
              ₹ {grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col lg:flex-row md:flex-row  justify-end gap-4 mt-6">
        {isDineIn ? (
          <AppButton
            label="Save & Continue"
            className="!bg-green-500 hover:!bg-green-600 !text-white px-6"
            onClick={handleSaveAndContinue}
          />
        ) : (
          <AppButton
            label="Cancel"
            className="!bg-red-500 hover:!bg-red-600 !text-white px-6"
            onClick={handleCancelOrder}
          />
        )}

        <AppButton
          label={loading ? "Processing..." : "Proceed to Billing"}
          disabled={loading}
          className="!bg-blue-500 hover:!bg-blue-600 !text-white px-6"
          onClick={handleProceedToBilling}
        />
      </div>
    </Suspense>
  );
}
