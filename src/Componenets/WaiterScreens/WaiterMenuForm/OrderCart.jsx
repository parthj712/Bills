"use client";

import {
  Card,
  Typography,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useDispatch } from "react-redux";
import { updateTableStatus } from "@/service/tableService";
import { useRouter, useSearchParams } from "next/navigation";

import { showToast } from "@/Componenets/ToastConstant/toast";
// import html2pdf from "html2pdf.js";
import BillPreview from "./BillPreview";
import {
  fetchActiveOrder,
  fetchActiveTakaway,
  finalizeBillAndOrder,
  itemDecrement,
  itemIncrement,
  printKot,
} from "@/service/orderService";
import { Suspense, useState, useMemo, useEffect } from "react";
import { getShopInfo } from "@/service/shopService";
import { socket } from "@/app/lib/socket";

export default function OrderCart() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openConfirm, setOpenConfirm] = useState(false);
  const tableId = searchParams.get("tableId");
  const orderType = searchParams.get("orderType") || "DINE-IN";
  const isDineIn = orderType === "DINE-IN";
  const [shopInfo, setShopInfo] = useState([]);
  const [orderId, setOrderId] = useState(null);

  // ✅ cartKey: tableId for DINE-IN, else orderType
  const cartKey = isDineIn ? tableId : orderType;

  const [cartItems, setCartItems] = useState([]);

  const [customerName, setCustomerName] = useState("");

  const currentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-z\s]+$/;
  const [nameError, setNameError] = useState("");

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        return sum + price * qty;
      }, 0),
    [cartItems],
  );

  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleFecthShopInfo = async () => {
    try {
      const res = await getShopInfo();

      setShopInfo(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleFecthShopInfo();
  }, []);

  const loadOrder = async () => {
    try {
      let res;

      if (orderType === "TAKEAWAY") {
        res = await fetchActiveTakaway();
      } else {
        res = await fetchActiveOrder(tableId);
      }

      setCartItems(res?.data?.items || []);
      setOrderId(res.data.orderId);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (orderType === "TAKEAWAY") {
      loadOrder();
    } else if (tableId) {
      loadOrder();
    }
  }, [tableId, orderType]);

  useEffect(() => {
    const handleDineInUpdate = ({ tableId: updated }) => {
      if (updated === tableId) {
        loadOrder();
      }
    };

    const handleTakeawayUpdate = () => {
      if (orderType === "TAKEAWAY") {
        loadOrder();
      }
    };

    socket.on("orderItemsUpdated", handleDineInUpdate);
    socket.on("takeawayUpdated", handleTakeawayUpdate);

    return () => {
      socket.off("orderItemsUpdated", handleDineInUpdate);
      socket.off("takeawayUpdated", handleTakeawayUpdate);
    };
  }, [tableId, orderType]);

  const handleCancelOrder = () => {
    router.back();
  };
  const handleIncrease = async (item) => {
    await itemIncrement({
      tableId,
      menuItemId: item.menuItemId,
      price: item.price,
    });
  };
  const handleDecrease = async (item) => {
    await itemDecrement({
      tableId,
      menuItemId: item.menuItemId,
      price: item.price,
    });
  };

  const handleOpenConfirm = () => {
    if (!cartItems.length || loading) return;
    if (isDineIn && !tableId) return;
    setOpenConfirm(true);
  };

  const handleConfirmBilling = async () => {
    setLoading(true);

    try {
      await finalizeBillAndOrder({ tableId, orderType });
      if (isDineIn) {
        await updateTableStatus(tableId, "AVAILABLE");
      }

      setOpenConfirm(false);
      router.back(); // billing machine
    } catch (error) {
      console.error("Billing failed", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadBillPDF = async () => {
    if (typeof window === "undefined") return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("bill-pdf");
    if (!element) return;

    html2pdf()
      .set({
        margin: 5,
        filename: "bill-preview.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const handlePrintKOT = async () => {
    try {
      await printKot(tableId);

      showToast({
        type: "success",
        message: "KOT Printed",
      });
    } catch (err) {
      showToast({
        type: "error",
        message: err?.response?.data?.message || "KOT Failed",
      });
    }
  };
  const printedItems = cartItems.filter((item) => item.kotPrinted);

  // New items (not printed)
  const newItems = cartItems.filter((item) => !item.kotPrinted);

  useEffect(() => {
    if (!socket) return;

    // 🟢 when captain adds items
    const handleNewItemsAdded = ({ tableId: updatedTable, items }) => {
      if (isDineIn && updatedTable !== tableId) return;

      setCartItems((prev) => {
        // avoid duplicate items when loadOrder also triggers
        const existing = new Set(
          prev.map((i) => i.menuItemId + "_" + i.addedAt),
        );

        const uniqueItems = items.filter(
          (i) => !existing.has(i.menuItemId + "_" + i.addedAt),
        );

        return [...prev, ...uniqueItems];
      });
    };

    socket.on("newItemsAdded", handleNewItemsAdded);

    return () => {
      socket.off("newItemsAdded", handleNewItemsAdded);
    };
  }, [tableId, orderType]);

  useEffect(() => {
    if (!socket) return;

    const handleKotPrinted = ({ tableId: updatedTable, kotNumber }) => {
      if (isDineIn && updatedTable !== tableId) return;

      setCartItems((prev) =>
        prev.map((item) =>
          item.kotPrinted
            ? item
            : {
                ...item,
                kotPrinted: true,
                kotNumber: kotNumber,
              },
        ),
      );
    };

    socket.on("kotPrinted", handleKotPrinted);

    return () => {
      socket.off("kotPrinted", handleKotPrinted);
    };
  }, [tableId, orderType]);

  const renderItem = (item, highlight = false) => (
    <div
      key={item.menuItemId + item.portion + item.addedAt}
      className="flex justify-between items-center my-3"
    >
      <div>
        <Typography fontSize={16} fontWeight={600}>
          {item.name} ({item.portion})
        </Typography>

        <Typography fontSize={14}>₹ {item.price}/-</Typography>

        {highlight && (
          <Typography fontSize={12} sx={{ color: "red", fontWeight: 700 }}>
            NEW ITEM
          </Typography>
        )}
      </div>

      <div className="flex items-center gap-3">
        <IconButton size="small" onClick={() => handleDecrease(item)}>
          <RemoveIcon fontSize="small" />
        </IconButton>

        <Typography fontWeight={700}>{item.qty}</Typography>

        <IconButton size="small" onClick={() => handleIncrease(item)}>
          <AddIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <Card
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        {/* Items */}
        {cartItems.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              color: "#64748B",
            }}
          >
            <Typography fontSize={16} fontWeight={600}>
              No items added
            </Typography>
            <Typography fontSize={14}>
              Add items from menu to build this order
            </Typography>
          </Box>
        ) : (
          <>
            {/* 1️⃣ Already Printed Items (Kitchen already received) */}
            {printedItems.map((item) => renderItem(item, false))}

            {/* 2️⃣ Divider (shows only when new items exist) */}
            {newItems.length > 0 && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#dc2626",
                    mb: 2,
                  }}
                >
                  New Items (Not Sent To Kitchen)
                </Typography>
              </>
            )}

            {/* 3️⃣ Newly Added Items */}
            {newItems.map((item) => renderItem(item, true))}
          </>
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

          <Box
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 2,
              border: "1px solid #E5E7EB",
              backgroundColor: "#F8FAFC",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>₹ {subtotal.toFixed(2)}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography color="text.secondary">Tax (approx)</Typography>
              <Typography>₹ {tax.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={700} fontSize={18}>
                Grand Total
              </Typography>
              <Typography
                fontWeight={700}
                fontSize={20}
                sx={{ color: "#1E293B" }}
              >
                ₹ {grandTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </div>
      </Card>

      {/* Buttons */}
      {cartItems.length > 0 && (
        <div className="flex flex-col lg:flex-row md:flex-row  justify-end gap-4 mt-6">
          {isDineIn ? (
            <AppButton
              label="Print KOT"
              sx={{
                backgroundColor: "#F1F5F9",
                color: "#334155",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#E2E8F0" },
              }}
              onClick={handlePrintKOT}
            />
          ) : (
            <AppButton
              label="Cancel"
              sx={{
                backgroundColor: "#F1F5F9",
                color: "#334155",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#E2E8F0" },
              }}
            />
          )}

          <AppButton
            label={loading ? "Processing..." : "Proceed to Billing"}
            disabled={loading}
            sx={{
              backgroundColor: "#1E293B",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              "&:hover": {
                backgroundColor: "#0F172A",
              },
            }}
            onClick={handleOpenConfirm}
          />
        </div>
      )}

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 20,
            pb: 1,
          }}
        >
          Confirm Billing
        </DialogTitle>

        <Divider />

        {/* CONTENT */}
        <DialogContent sx={{ pt: 3 }}>
          {/* Order Meta Info */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography fontWeight={600}>
              Order Type:{" "}
              <span
                style={{
                  color: orderType === "TAKEAWAY" ? "#f97316" : "#2563eb",
                }}
              >
                {orderType}
              </span>
            </Typography>

            <Typography fontSize={14} color="text.secondary">
              {currentDate}
            </Typography>
          </Box>

          {/* Bill Preview */}
          <Box
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: 2,
              p: 2,
            }}
          >
            <BillPreview
              items={cartItems}
              subtotal={subtotal}
              tax={tax}
              total={grandTotal}
              shopInfo={shopInfo}
              orderType={orderType}
              date={currentDate}
              customerName={customerName}
            />
          </Box>

          {/* Download Button */}
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={downloadBillPDF}
          >
            Download Bill PDF
          </Button>
        </DialogContent>

        <Divider />

        {/* FOOTER ACTIONS */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setOpenConfirm(false)}
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              textTransform: "none",
            }}
            onClick={handleConfirmBilling}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm & Bill"}
          </Button>
        </DialogActions>
      </Dialog>
    </Suspense>
  );
}
