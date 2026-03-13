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

import { updateTableStatus } from "@/service/tableService";
import { useRouter, useSearchParams } from "next/navigation";

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
import BillPreviewKOT from "./BillPreviewKOT";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";

export default function OrderCart() {
  const { showSnackbar } = useAppSnackbar();

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

  const [openKOT, setOpenKOT] = useState(false);

  const currentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-z\s]+$/;
  const [nameError, setNameError] = useState("");
  console.log(cartItems);

  const GST_PERCENT = 5;
  const VAT_PERCENT = 10;
  const { foodSubtotal, liquorSubtotal } = useMemo(() => {
    let food = 0;
    let liquor = 0;

    cartItems.forEach((item) => {
      const total = (Number(item.price) || 0) * (Number(item.qty) || 0);
      console.log("CATEGORY:", item.category);
      const category = item.category?.trim().toLowerCase();

      if (category === "liquor" || category === "liqour") {
        liquor += total;
      } else {
        food += total;
      }
    });

    return {
      foodSubtotal: food,
      liquorSubtotal: liquor,
    };
  }, [cartItems]);

  const subtotal = foodSubtotal + liquorSubtotal;
  const hasGST = !!shopInfo?.gstNumber;
  const gstAmount = hasGST ? foodSubtotal * (GST_PERCENT / 100) : 0;

  const vatAmount = liquorSubtotal * (VAT_PERCENT / 100);

  const grandTotal = subtotal + gstAmount + vatAmount;

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
      portion: item.portion || null,
      variantName: item.variantName || null,
    });
  };
  const handleDecrease = async (item) => {
    await itemDecrement({
      tableId,
      menuItemId: item.menuItemId,
      portion: item.portion || null,
      variantName: item.variantName || null,
    });
  };
  const handleOpenConfirm = () => {
    if (!cartItems.length || loading) return;
    if (isDineIn && !tableId) return;
    setOpenConfirm(true);
  };

  const formatBillForPrint = () => {
    return `
  <div class="center bold" style="font-size:18px;">
    ${shopInfo?.shopName || ""}
  </div>

  <div class="center" style="font-size:12px;">
    ${shopInfo?.tagline || ""}
  </div>

  <div class="divider"></div>

  <div class="center">
    ${orderType}
  </div>

  <div class="center">
    ${new Date().toLocaleString("en-IN")}
  </div>

  <div class="divider"></div>

  ${cartItems
    .map(
      (item) => `
      <div>
        <div class="bold">${item.name}</div>
        <div class="row">
          <span>${item.qty} x ₹${item.price.toFixed(2)}</span>
          <span>₹${(item.qty * item.price).toFixed(2)}</span>
        </div>
      </div>
    `,
    )
    .join("")}

  <div class="divider"></div>

  <div class="row">
    <span>Subtotal</span>
    <span>₹${subtotal.toFixed(2)}</span>
  </div>

  ${
    foodSubtotal > 0 && hasGST
      ? `
      <div class="row">
        <span>GST (5%)</span>
        <span>₹${gstAmount.toFixed(2)}</span>
      </div>
    `
      : ""
  }

  ${
    liquorSubtotal > 0
      ? `
      <div class="row">
        <span>VAT (10%)</span>
        <span>₹${vatAmount.toFixed(2)}</span>
      </div>
    `
      : ""
  }

  <div class="divider"></div>

  <div class="row total">
    <span>TOTAL</span>
    <span>₹${grandTotal.toFixed(2)}</span>
  </div>

  <div class="divider"></div>

  <div class="center bold">
    Thank You • Visit Again
  </div>
  `;
  };

  const formatKOTForPrint = () => {
    return `
    <div style="font-size:18px; font-weight:bold; text-align:center;">
      🔥 KOT
    </div>


    <div class="center bold" style="font-size:16px;">
      ${shopInfo?.shopName || ""}
    </div>

    <div class="divider"></div>

     <div class="center bold" style="font-size:15px;">
      ${isDineIn ? `TABLE NO: ${tableId}` : "TAKEAWAY ORDER"}
    </div>

    <div class="center">
      ${orderType}
    </div>

    <div class="center">
      ${new Date().toLocaleString("en-IN")}
    </div>

    <div class="divider"></div>

    ${cartItems
      .filter((item) => !item.kotPrinted && item.qty > 0) // only new items
      .map(
        (item) => `
        <div style="margin-bottom:6px;">
          <div class="bold">${item.name} (${item.portion})</div>
          <div>Qty: ${item.qty}</div>
        </div>
      `,
      )
      .join("")}

    <div class="divider"></div>

    <div class="center">
      --- END OF KOT ---
    </div>
  `;
  };

  const printThermalKOT = () => {
    const printWindow = window.open("", "_blank", "width=400,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>KOT Print</title>
        <style>
          body {
            margin: 0;
            padding: 10px;
            width: 80mm;
            font-family: monospace;
            font-size: 13px;
          }

          .center {
            text-align: center;
          }

          .bold {
            font-weight: bold;
          }

          .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }
        </style>
      </head>
      <body>
        ${formatKOTForPrint()}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const printThermalBill = () => {
    const billElement = document.getElementById("print-bill");
    if (!billElement) return;

    const printWindow = window.open("", "_blank", "width=400,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          body {
            margin: 0;
            padding: 10px;
            width: 80mm;
            font-family: monospace;
            font-size: 13px;
          }

          .center {
            text-align: center;
          }

          .bold {
            font-weight: bold;
          }

          .divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }

          .total {
            font-size: 18px;
            font-weight: bold;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }
        </style>
      </head>
      <body>
        ${formatBillForPrint()}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleConfirmBilling = async () => {
    if (!cartItems.length) {
      showSnackbar("No items to bill", "warning");
      return;
    }

    setLoading(true);

    showSnackbar("Processing billing...", "info");

    try {
      await finalizeBillAndOrder({ tableId, orderType });

      if (isDineIn) {
        await updateTableStatus(tableId, "AVAILABLE");
      }

      showSnackbar("Billing completed successfully!l", "success");

      setOpenConfirm(false);

      setTimeout(() => {
        printThermalBill();
      }, 300);
    } catch (error) {
      console.error("Billing failed", error);

      showSnackbar(
        error?.response?.data?.message || "Billing failed. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadBillPDF = async () => {
    if (typeof window === "undefined") return;

    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("print-bill");
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
      await printKot(tableId); // backend update

      printThermalKOT(); // frontend thermal print

      showSnackbar("KOT Printed", "success");
    } catch (err) {
      showSnackbar(err?.response?.data?.message || "KOT Failed", "error");
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
          {item.name}
          {item.variantName && ` (${item.variantName})`}
          {item.portion && ` (${item.portion})`}
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
          // boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
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
                  New Items
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

          {foodSubtotal > 0 && hasGST && (
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹ {gstAmount.toFixed(2)}</span>
            </div>
          )}

          {liquorSubtotal > 0 && (
            <div className="flex justify-between">
              <span>VAT (10%)</span>
              <span>₹ {vatAmount.toFixed(2)}</span>
            </div>
          )}

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

            {hasGST && (
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary">GST (5%)</Typography>
                <Typography>₹ {gstAmount.toFixed(2)}</Typography>
              </Box>
            )}

            {liquorSubtotal > 0 && (
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary">VAT (10%)</Typography>
                <Typography>₹ {vatAmount.toFixed(2)}</Typography>
              </Box>
            )}

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
              // onClick={() => setOpenKOT(true)}
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

      {/* Hidden printable bill */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <BillPreview
          items={cartItems}
          subtotal={subtotal}
          gst={gstAmount}
          vat={vatAmount}
          total={grandTotal}
          shopInfo={shopInfo}
          orderType={orderType}
          date={currentDate}
          customerName={customerName}
        />
      </div>

      <Dialog
        open={openKOT}
        onClose={() => setOpenKOT(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 18,
            bgcolor: "#1E293B",
            color: "#fff",
            textAlign: "center",
            py: 2,
          }}
        >
          Kitchen Order Ticket
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
              m: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <BillPreviewKOT
              items={cartItems}
              shopInfo={shopInfo}
              orderType={orderType}
              tableId={tableId}
              date={currentDate}
            />
          </Box>
        </DialogContent>

        <Divider />

        {/* Footer */}
        <DialogActions
          sx={{
            p: 2,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setOpenKOT(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#64748B",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            // onClick={downloadKOTPDF}
            onClick={handlePrintKOT}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#2563EB",
              "&:hover": { bgcolor: "#1D4ED8" },
            }}
          >
            Print KOT
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{ fontWeight: 700, backgroundColor: "#0F172A", color: "white" }}
        >
          Confirm Billing
        </DialogTitle>

        <Box>
          <DialogContent>
            <Typography>
              Are you sure you want to finalize this bill?
            </Typography>

            <Typography fontWeight={600}>
              Grand Total: ₹ {grandTotal.toFixed(2)}
            </Typography>
          </DialogContent>
        </Box>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleConfirmBilling}
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
          >
            {loading ? "Processing..." : "Confirm & Print"}
          </Button>
        </DialogActions>
      </Dialog>
    </Suspense>
  );
}
