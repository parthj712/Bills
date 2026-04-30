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
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import QRCode from "qrcode";

import { updateTableStatus } from "@/service/tableService";
import { useRouter, useSearchParams } from "next/navigation";

// import html2pdf from "html2pdf.js";
import BillPreview from "./BillPreview";
import {
  fetchActiveOrder,
  fetchActiveTakaway,
  finalizeBillAndOrder,
  itemDecrement,
  printKot,
} from "@/service/orderService";
import { Suspense, useState, useMemo, useEffect } from "react";
import { getFeedbackLink, getShopInfo } from "@/service/shopService";
import { socket } from "@/app/lib/socket";
import BillPreviewKOT from "./BillPreviewKOT";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import CircularProgress from "@mui/material/CircularProgress";
export default function OrderCart() {
  const { showSnackbar } = useAppSnackbar();
  const searchParams = useSearchParams();
  const [openConfirm, setOpenConfirm] = useState(false);
  const tableId = searchParams.get("tableId");
  const tableNo = searchParams.get("tableNo");
  const orderType = searchParams.get("orderType") || "DINE-IN";
  const isDineIn = orderType === "DINE-IN";
  const [shopInfo, setShopInfo] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [feedbackLink, setFeedbackLink] = useState("");
  const [feedbackQr, setFeedbackQr] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [kotMessage, setKotMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [openKOT, setOpenKOT] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paperSize, setPaperSize] = useState("58"); // "58" or "80"

  const currentDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const [loadingItems, setLoadingItems] = useState({});
  const [loading, setLoading] = useState(false);

  const GST_PERCENT = 5;
  const VAT_PERCENT = 10;
  const { foodSubtotal, liquorSubtotal } = useMemo(() => {
    let food = 0;
    let liquor = 0;

    cartItems.forEach((item) => {
      const total = (Number(item.price) || 0) * (Number(item.qty) || 0);
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
  const hasVAT = !!shopInfo?.vatNumber;

  const discountAmount = subtotal * (discountPercent / 100);

  // split discount proportionally like backend
  const foodRatio = subtotal > 0 ? foodSubtotal / subtotal : 0;
  const liquorRatio = subtotal > 0 ? liquorSubtotal / subtotal : 0;

  const foodDiscount = discountAmount * foodRatio;
  const liquorDiscount = discountAmount * liquorRatio;

  // discounted subtotals
  const discountedFoodSubtotal = foodSubtotal - foodDiscount;
  const discountedLiquorSubtotal = liquorSubtotal - liquorDiscount;

  // tax AFTER discount
  const cgst = hasGST ? discountedFoodSubtotal * (GST_PERCENT / 2 / 100) : 0;

  const sgst = hasGST ? discountedFoodSubtotal * (GST_PERCENT / 2 / 100) : 0;

  const gstAmount = cgst + sgst;

  const vatAmount = hasVAT ? discountedLiquorSubtotal * (VAT_PERCENT / 100) : 0;

  // final total
  const grandTotal =
    discountedFoodSubtotal + discountedLiquorSubtotal + gstAmount + vatAmount;
  const handleFecthShopInfo = async () => {
    try {
      const res = await getShopInfo();

      setShopInfo(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeedbackLink = async () => {
    try {
      const res = await getFeedbackLink();

      const url = res.data?.feedbackUrl;

      if (url) {
        setFeedbackLink(url);

        // generate QR image
        const qrBase64 = await QRCode.toDataURL(url, {
          width: 190,
          margin: 1,
        });

        setFeedbackQr(qrBase64);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleFecthShopInfo();
    fetchFeedbackLink();
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

  const handleDecrease = async (item) => {
    const key = item.menuItemId + "_" + item.addedAt;

    setLoadingItems((prev) => ({ ...prev, [key]: true }));

    try {
      await itemDecrement({
        tableId,
        menuItemId: item.menuItemId,
        portion: item.portion || null,
        variantName: item.variantName || null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [key]: false }));
    }
  };
  const handleOpenConfirm = () => {
    if (!cartItems.length || loading) return;
    if (isDineIn && !tableId) return;
    setOpenConfirm(true);
  };

  const formatBillForPrint = () => {
    return `
    <div style="
       width: ${paperSize === "80" ? "72mm" : "52mm"}
      font-family: monospace;
      padding: 0 8px;
      box-sizing: border-box;
    ">

      <!-- Header -->
     <div style="text-align:left;">

  ${
    shopInfo?.logoUrl
      ? `
      <div style="text-align:center;">
        <img 
          src="${shopInfo.logoUrl}" 
          style="
            width:80px;
            max-height:60px;
            object-fit:contain;
            margin-bottom:6px;
          "
        />
      </div>
    `
      : ""
  }

  <div style="
    text-align:center;
    font-weight:bold;
    font-size:16px;
  ">
    ${shopInfo?.shopName || ""}
  </div>

  ${
    shopInfo?.tagline
      ? `
      <div style="
        text-align:center;
        font-size:11px;
        margin-top:2px;
      ">
        ${shopInfo.tagline}
      </div>
    `
      : ""
  }

  <!-- NEW: Address + Contact Info -->
  <div style="
    text-align:center;
    font-size:10px;
    margin-top:4px;
    line-height:1.4;
  ">

    ${shopInfo?.address ? `<div>Address: ${shopInfo.address}</div>` : ""}

    ${shopInfo?.phone ? `<div>Phone: ${shopInfo.phone}</div>` : ""}

    ${shopInfo?.gstNumber ? `<div>GST: ${shopInfo.gstNumber}</div>` : ""}

    ${shopInfo?.fssaiNumber ? `<div>FSSAI: ${shopInfo.fssaiNumber}</div>` : ""}

  </div>

</div>

      <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>

      <!-- Order Type -->
      <div style="
        text-align:center;
        font-weight:bold;
        font-size:12px;
      ">
        ${orderType}
      </div>

      <div style="
           text-align:center;
        font-size:11px;
        margin-top:4px;
         font-weight:semi-bold;
      ">
        ${new Date().toLocaleString("en-IN")}
      </div>

      <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>

      <!-- Items -->
      ${cartItems
        .map(
          (item) => `
            <div style="margin-bottom:8px;">

              <div style="
                font-size:12px;
                font-weight:bold;
                margin-bottom:3px;
                word-wrap: break-word;
              ">
                ${item.name}
                ${item.variantName ? ` (${item.variantName})` : ""}
                ${item.portion ? ` (${item.portion})` : ""}
              </div>

              <div style="
                display:flex;
                justify-content:space-between;
                width:92%;
                margin:0 auto;
                font-size:11px;
              ">
                <span>
                  ${item.qty} x Rs.${Number(item.price).toFixed(2)}
                </span>

                <span style="
                  min-width:65px;
                  text-align:right;
                ">
                  Rs.${Number(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            </div>
          `,
        )
        .join("")}

      <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>

      <div style="
  display:flex;
  justify-content:space-between;
  margin-bottom:6px;
  font-size:12px;
  font-weight:bold;
">
  <span>Total Items</span>
  <span>${totalItemsCount} (${totalQty} qty)</span>
</div>

  <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>

      <!-- Subtotal, Taxes, Discount -->
      <div style="
        width:92%;
        margin:0 auto;
        font-size:12px;
          font-weight:bold;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          margin-bottom:4px;
        ">
          <span>Subtotal</span>
          <span>Rs.${Number(subtotal).toFixed(2)}</span>
        </div>

        ${
          discountAmount > 0
            ? `
            <div style="
              display:flex;
              justify-content:space-between;
              margin-bottom:4px;
            ">
              <span>Discount (${discountPercent}%)</span>
              <span>-Rs.${Number(discountAmount).toFixed(2)}</span>
            </div>
          `
            : ""
        }

        ${
          hasGST
            ? `
            <div style="
              display:flex;
              justify-content:space-between;
              margin-bottom:4px;
            ">
              <span>CGST (2.5%)</span>
              <span>Rs.${Number(cgst).toFixed(2)}</span>
            </div>

            <div style="
              display:flex;
              justify-content:space-between;
              margin-bottom:4px;
            ">
              <span>SGST (2.5%)</span>
              <span>Rs.${Number(sgst).toFixed(2)}</span>
            </div>
          `
            : ""
        }

        ${
          liquorSubtotal > 0 && hasVAT
            ? `
            <div style="
              display:flex;
              justify-content:space-between;
              margin-bottom:4px;
            ">
              <span>VAT (10%)</span>
              <span>Rs.${Number(vatAmount).toFixed(2)}</span>
            </div>
          `
            : ""
        }
      </div>

      <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>

      <!-- Total -->
      <div style="
        width:92%;
        margin:0 auto;
        display:flex;
        justify-content:space-between;
        font-size:13px;
        font-weight:bold;
      ">
        <span>Total</span>
        <span>Rs.${Number(grandTotal).toFixed(2)}</span>
      </div>

      <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>


    <!-- Payment Mode -->
    <div style="
      width:92%;
      margin:6px auto;
      font-size:12px;
      display:flex;
      justify-content:space-between;
    ">
      <span>Pay Mode</span>
      <span style="font-weight:bold;">
        ${paymentMethod}
      </span>
    </div>

    <div class="divider" style="
      border-top:1px dashed black;
      margin:8px 0;
    "></div>

      <!-- Feedback QR -->
      ${
        feedbackQr
          ? `
          <div style="
            text-align:center;
            margin-top:8px;
          ">
            <div style="
              font-size:11px;
              font-weight:bold;
            ">
              Scan For Feedback
            </div>

            <img 
              src="${feedbackQr}" 
              style="
                width:95px;
                height:95px;
                object-fit:contain;
                margin-top:6px;
              "
            />

            <div style="
              font-size:10px;
              margin-top:4px;
            ">
              We value your feedback ❤️
            </div>
          </div>
        `
          : ""
      }

      <div class="divider" style="
        border-top:1px dashed black;
        margin:8px 0;
      "></div>

      <!-- Footer -->
      <div style="
        text-align:center;
        font-size:11px;
      ">
        Thank You • Visit Again
      </div>

    </div>
  `;
  };

  const formatKOTForPrint = () => {
    const newItems = cartItems.filter(
      (item) => !item.kotPrinted && item.qty > 0,
    );

    return `
    <div class="center bold" style="font-size:20px; text-align:left;">
      KOT
    </div>

    <div class="center bold" style="font-size:16px; margin-top:4px; text-align:left;">
      ${shopInfo?.shopName || ""}
    </div>

    <div class="divider"></div>

    <div class="center bold" style="font-size:15px; text-align:left;">
      ${
        isDineIn
          ? `TABLE NO: ${tableNo}`
          : orderType === "TAKEAWAY"
            ? "TAKEAWAY ORDER"
            : "QUICK ORDER"
      }
    </div>

    <div style="margin-top:4px; text-align:left; font-size:15px;">
      ${orderType}
    </div>

    <div  style="font-size:12px; text-align:left; font-size:15px">
      ${new Date().toLocaleString("en-IN")}
    </div>

    <div class="divider"></div>

    <div style="
  font-size:14px;
  font-weight:bold;
  margin-top:6px;
">
  Items: ${newItems.length}
</div>

    <div class="divider"></div>
    
    ${newItems
      .map((item) => {
        const itemDetails = [
          item.variantName,
          item.portion && item.portion !== "full" && item.portion !== "null"
            ? item.portion
            : null,
        ]
          .filter(Boolean)
          .join(" • ");

        return `
          <div style="margin-bottom:10px;">
            <div class="bold" style="font-size:17px;">
              ${item.name}
              ${
                itemDetails
                  ? `<span style="font-size:12px;">(${itemDetails})</span>`
                  : ""
              }
            </div>

            <div style="font-size:15px;">
              Qty: ${item.qty}
            </div>
          </div>
        `;
      })
      .join("")}

    ${
      kotMessage?.trim()
        ? `
        <div class="divider"></div>

        <div class="bold center" style="font-size:16px;">
          SPECIAL INSTRUCTION
        </div>

        <div 
          style="
            text-align:left;
            font-size:14px;
            font-weight:bold;
            margin-top:6px;
          "
        >
          ${kotMessage}
        </div>
      `
        : ""
    }

    <div class="divider"></div>

    <div  style="font-size:12px; text-align:left;">
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

    const width = paperSize === "80" ? "80mm" : "58mm";

    const printWindow = window.open("", "_blank", "width=400,height=600");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
     <style>
  body {
    margin: 0;
    padding: 10px;
    width:  ${width};
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

  table {
    width: 100%;
    border-collapse: collapse;
  }

  td {
    padding: 2px 0;
  }

  @page {
    size: ${width} auto;
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
      await finalizeBillAndOrder({
        tableId,
        orderType,
        paymentMethod,
        discountPercent,
      });

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
      await printKot({
        tableId,
        kotMessage,
      });

      printThermalKOT();

      setKotMessage("");
      setOpenKOT(false);

      showSnackbar("KOT Printed", "success");
    } catch (err) {
      showSnackbar(err?.response?.data?.message || "KOT Failed", "error");
    }
  };

  const printedItems = cartItems.filter((item) => item.kotPrinted);

  // New items (not printed)
  const newItems = cartItems.filter((item) => !item.kotPrinted);

  // NOW safe to use
  const totalItemsCount = cartItems.length;
  const newItemsCount = newItems.length;

  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const newQty = newItems.reduce((sum, item) => sum + item.qty, 0);

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

  const renderItem = (item, highlight = false) => {
    const key = item.menuItemId + "_" + item.addedAt;

    return (
      <div key={key} className="flex justify-between items-center my-3">
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
          <Typography
            fontWeight={700}
            sx={{
              backgroundColor: "#F1F5F9",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              minWidth: 32,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {item.qty}
          </Typography>

          <IconButton
            size="small"
            onClick={() => handleDecrease(item)}
            disabled={loadingItems[key]}
            sx={{
              color: "#dc2626",
              "&:hover": { backgroundColor: "#fee2e2" },
            }}
          >
            {loadingItems[key] ? (
              <CircularProgress size={16} />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
        </div>
      </div>
    );
  };
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

        {/* <Divider className="my-4" /> */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "#F8FAFC",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Total Items */}
          <Typography fontSize={14} fontWeight={600}>
            🧾 Items: {totalItemsCount} ({totalQty} qty)
          </Typography>

          {/* New Items */}
          {newItemsCount > 0 && (
            <Typography
              fontSize={13}
              sx={{
                color: "#dc2626",
                fontWeight: 700,
                backgroundColor: "#fee2e2",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              🔥 New: {newItemsCount} ({newQty})
            </Typography>
          )}
        </Box>
        {/* Totals */}
        {/* <div className="my-2 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          {foodSubtotal > 0 && hasGST && (
            <>
              <div className="flex justify-between">
                <span>CGST (2.5%)</span>
                <span>₹ {cgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>SGST (2.5%)</span>
                <span>₹ {sgst.toFixed(2)}</span>
              </div>
            </>
          )}

          {liquorSubtotal > 0 && hasVAT && (
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
            <Box display="flex" justifyContent="space-between"  mb={0.5}>
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
                Grand Totale
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
        </div> */}
      </Card>

      {/* Buttons */}
      {cartItems.length > 0 && (
        <div className="flex flex-col lg:flex-row md:flex-row  justify-end gap-4 mt-6">
          {isDineIn ? (
            <AppButton
              label="Send to Kitchen"
              // onClick={() => setOpenKOT(true)}
              sx={{
                backgroundColor: "#F1F5F9",
                color: "#334155",
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": { backgroundColor: "#E2E8F0" },
              }}
              onClick={() => setOpenKOT(true)}
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
          cgst={cgst}
          sgst={sgst}
          gst={gstAmount}
          vat={vatAmount}
          total={grandTotal}
          shopInfo={shopInfo}
          orderType={orderType}
          date={currentDate}
          customerName={customerName}
          discountPercent={discountPercent}
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
            <TextField
              fullWidth
              label="Kitchen Message"
              placeholder="Example: Less spicy / No onion / Urgent"
              value={kotMessage}
              onChange={(e) => setKotMessage(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: 18,
            bgcolor: "#0F172A",
            color: "#fff",
            textAlign: "center",
            py: 2,
            letterSpacing: "0.5px",
          }}
        >
          Confirm Billing
        </DialogTitle>

        {/* CONTENT */}
        <DialogContent sx={{ py: 3 }}>
          {/* MESSAGE */}

          <Typography
            fontWeight={600}
            my={1.5}
            sx={{ color: "#334155", fontSize: 14 }}
          >
            Select Discount
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
            {[0, 5, 10, 15].map((percent) => (
              <Chip
                key={percent}
                label={percent === 0 ? "No Discount" : `${percent}% OFF`}
                clickable
                onClick={() => setDiscountPercent(percent)}
                sx={{
                  fontWeight: 600,
                  borderRadius: "10px",
                  backgroundColor:
                    discountPercent === percent ? "#0F172A" : "#F1F5F9",
                  color: discountPercent === percent ? "#fff" : "#334155",
                  "&:hover": {
                    backgroundColor:
                      discountPercent === percent ? "#0F172A" : "#E2E8F0",
                  },
                }}
              />
            ))}
          </Box>

          {/* TOTAL CARD */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #0F172A, #1E293B)",
              color: "#fff",
              borderRadius: 3,
              px: 2.5,
              py: 2,
              boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
            }}
          >
            {/* Title */}
            <Typography
              fontSize={13}
              sx={{ opacity: 0.7, textAlign: "center", mb: 1 }}
            >
              Final Bill Summary
            </Typography>

            {/* Subtotal */}
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography fontSize={14} sx={{ opacity: 0.85 }}>
                Subtotal
              </Typography>
              <Typography fontSize={14}>₹ {subtotal.toFixed(2)}</Typography>
            </Box>

            {/* Discount */}
            {discountPercent > 0 && (
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography
                  fontSize={14}
                  sx={{ color: "#f87171", fontWeight: 600 }}
                >
                  Discount ({discountPercent}%)
                </Typography>
                <Typography
                  fontSize={14}
                  sx={{ color: "#f87171", fontWeight: 600 }}
                >
                  -₹ {discountAmount.toFixed(2)}
                </Typography>
              </Box>
            )}

            {/* CGST */}
            {hasGST && (
              <>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography fontSize={13} sx={{ opacity: 0.7 }}>
                    CGST (2.5%)
                  </Typography>
                  <Typography fontSize={13}>₹ {cgst.toFixed(2)}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography fontSize={13} sx={{ opacity: 0.7 }}>
                    SGST (2.5%)
                  </Typography>
                  <Typography fontSize={13}>₹ {sgst.toFixed(2)}</Typography>
                </Box>
              </>
            )}

            {/* VAT */}
            {vatAmount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography fontSize={13} sx={{ opacity: 0.7 }}>
                  VAT (10%)
                </Typography>
                <Typography fontSize={13}>₹ {vatAmount.toFixed(2)}</Typography>
              </Box>
            )}

            {/* Divider */}
            <Divider sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.2)" }} />

            {/* Savings */}
            {discountAmount > 0 && (
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "#22c55e",
                  fontWeight: 600,
                }}
              >
                🎉 You saved ₹ {discountAmount.toFixed(2)}
              </Typography>
            )}

            {/* Final Total */}
            <Box
              textAlign="center"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography fontSize={12} sx={{ opacity: 0.7 }}>
                Total Payable
              </Typography>

              <Typography
                fontSize={22}
                fontWeight={700}
                sx={{ letterSpacing: 1 }}
              >
                ₹ {grandTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* PAYMENT METHOD */}
          <Typography
            fontWeight={600}
            my={1.5}
            sx={{ color: "#334155", fontSize: 14 }}
          >
            Payment Method
          </Typography>

          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            {/* CASH */}
            <Box
              onClick={() => setPaymentMethod("CASH")}
              sx={{
                flex: 1,
                cursor: "pointer",
                borderRadius: 3,
                p: 2,
                textAlign: "center",
                border:
                  paymentMethod === "CASH"
                    ? "2px solid #16a34a"
                    : "1px solid #E5E7EB",
                backgroundColor: paymentMethod === "CASH" ? "#ECFDF5" : "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Typography fontSize={22}>💵</Typography>
              <Typography fontWeight={600} fontSize={14}>
                Cash
              </Typography>
            </Box>

            {/* UPI */}
            <Box
              onClick={() => setPaymentMethod("UPI")}
              sx={{
                flex: 1,
                cursor: "pointer",
                borderRadius: 3,
                p: 2,
                textAlign: "center",
                border:
                  paymentMethod === "UPI"
                    ? "2px solid #2563eb"
                    : "1px solid #E5E7EB",
                backgroundColor: paymentMethod === "UPI" ? "#EFF6FF" : "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Typography fontSize={22}>📱</Typography>
              <Typography fontWeight={600} fontSize={14}>
                UPI
              </Typography>
            </Box>

            {/* CARD */}
            <Box
              onClick={() => setPaymentMethod("CARD")}
              sx={{
                flex: 1,
                cursor: "pointer",
                borderRadius: 3,
                p: 2,
                textAlign: "center",
                border:
                  paymentMethod === "CARD"
                    ? "2px solid #7c3aed"
                    : "1px solid #E5E7EB",
                backgroundColor: paymentMethod === "CARD" ? "#F5F3FF" : "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Typography fontSize={22}>💳</Typography>

              <Typography fontWeight={600} fontSize={14}>
                Card
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        {/* FOOTER */}
        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setOpenConfirm(false)}
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
            onClick={handleConfirmBilling}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #0F172A, #1E293B)",
              color: "#fff",
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              textTransform: "none",
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              "&:hover": {
                background: "linear-gradient(135deg, #020617, #0F172A)",
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
