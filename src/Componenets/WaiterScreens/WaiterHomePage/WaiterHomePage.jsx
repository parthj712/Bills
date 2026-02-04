"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { getTables } from "@/service/tableService";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  Typography,
  Card,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Skeleton,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WaiterNavbar from "../WaiterNavbar/WaiterNavbar";

import { TopProductsCard } from "@/Componenets/AdminScreens/AdminDashboard/TopProductsCard/TopProductsCard";

const tableStyles = {
  AVAILABLE:
    "!bg-green-300/30 !text-black shadow-md !rounded-2xl border-[2px] border-green-600/90 backdrop-blur-md",

  OCCUPIED:
    "!bg-red-300/30 !text-black shadow-md !rounded-2xl border-[2px] border-red-600/90 backdrop-blur-md",
};

export default function WaiterHomePage() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  // keyboard states
  const [keyBuffer, setKeyBuffer] = useState("");
  const [highlightTableNo, setHighlightTableNo] = useState(null);

  const handleGetTables = async () => {
    try {
      setLoading(true);
      const res = await getTables();
      console.log(res);

      setTables(res);
    } catch (error) {
      console.log("failed to get tables", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTables();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [tables, keyBuffer, open]);

  //   // clear auth

  const handleTableClick = (tableId, tableNo) => {
    router.push(`/waiter/order?tableId=${tableId}&tableNo=${tableNo}`);
  };

  const totalActiveTables = tables.reduce((acc, table) => {
    return acc + (table.status === "OCCUPIED" ? 1 : 0);
  }, 0);

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  let keyTimeout = null;

  const handleKeyPress = (event) => {
    // ❌ Disable keyboard when menu is open
    if (open) return;

    // ❌ Ignore typing in inputs
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA"
    ) {
      return;
    }

    // ✅ TAKEAWAY shortcut (T)
    if (event.key.toLowerCase() === "t") {
      handleTakeaway();
      return;
    }

    // ✅ Only number keys (for tables)
    if (!/^[0-9]$/.test(event.key)) return;

    // Clear previous timeout
    if (keyTimeout) clearTimeout(keyTimeout);

    const newBuffer = keyBuffer + event.key;
    setKeyBuffer(newBuffer);

    keyTimeout = setTimeout(() => {
      const tableNo = Number(newBuffer);

      const table = tables.find((t) => Number(t.tableNo) === tableNo);

      if (table) {
        setHighlightTableNo(table.tableNo);

        setTimeout(() => {
          handleTableClick(table._id, table.tableNo);
          setHighlightTableNo(null);
        }, 300);
      }

      setKeyBuffer("");
    }, 600);
  };

  const handleTakeaway = () => {
    // router.push("/waiter/menu?type=takeaway");
    console.log("Takeaway clicked");
  };

  const handleOrderTypeClick = (orderType) => {
    router.push(`/waiter/order?orderType=${orderType}`);
  };

  const topProducts = [
    { name: "Paneer Butter Masala", percent: 72 },
    { name: "Veg Biryani", percent: 65 },
    { name: "Butter Naan", percent: 54 },
    { name: "Cold Coffee", percent: 41 },
  ];

  const getRunningTime = (occupiedAt) => {
    if (!occupiedAt) return "";

    const start = new Date(occupiedAt);
    const now = new Date();

    const diff = now - start;
    const mins = Math.floor(diff / 60000);

    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)} hr ${mins % 60} min`;
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Top Buttons */}
      {/* Navbar */}
      <WaiterNavbar />

      <div className="grid grid-cols-12 gap-6 p-6">
        {/* LEFT PANEL */}
        <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col gap-4 order-2 md:order-1">
          {/* Takeaway */}

          {isDesktop && (
            <AppButton
              label="Takeaway"
              className="!bg-orange-500 !text-white "
              onClick={() => handleOrderTypeClick("TAKEAWAY")}
            />
          )}
          {/* Top Products */}
          <TopProductsCard topProducts={topProducts} />
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 md:col-span-8 lg:col-span-8 order-1 md:order-2 ">
          {!isDesktop && !isTablet && (
            <AppButton
              label="Takeaway"
              className="!bg-orange-500 !text-white"
              onClick={() => handleOrderTypeClick("TAKEAWAY")}
            />
          )}

          <Card className="p-7 my-6 !rounded-4xl shadow-md !bg-[#F1F1F1]">
            <div className="flex items-center justify-between  mb-4">
              <Typography fontSize={isMobile ? 20 : 24} fontWeight={600}>
                Dine-In Orders
              </Typography>

              <span
                className="
                      border-[1px]
                      border-green-600/90 text-[14px]
                      md:test-[16px] lg:text-[16px]
                      font-semibold
                      bg-green-100
                      text-green-700
                      px-3
                      py-1
                      rounded-full
                    "
              >
                {totalActiveTables} Active
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {loading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      height={110}
                      className="!rounded-2xl"
                    />
                  ))
                : tables.map((table) => (
                    <Tooltip
                      key={table._id}
                      title={
                        table.status === "OCCUPIED"
                          ? "Active table"
                          : "Add order"
                      }
                      arrow
                      placement="bottom"
                    >
                      <div
                        onClick={() =>
                          handleTableClick(table._id, table.tableNo)
                        }
                        className={`
              relative
              h-28 w-full
              rounded-2xl
              border
              cursor-pointer
              flex flex-col
              items-center
              justify-center
              gap-2
              px-4 py-3
              text-black
              shadow-sm
              transition-all duration-300
              hover:shadow-lg hover:scale-[1.03]
              ${tableStyles[table.status]}
              ${
                highlightTableNo === table.tableNo
                  ? "ring-4 ring-blue-500 ring-offset-2 scale-105"
                  : ""
              }
            `}
                      >
                        {/* ✅ Table Number */}
                        <Typography fontSize={26} fontWeight={600}>
                          {table.tableNo}
                        </Typography>

                        {/* ✅ Status Badge */}
                        <Typography
                          fontSize={13}
                          fontWeight={500}
                          className={`px-3 py-[2px] rounded-full
                ${
                  table.status === "OCCUPIED"
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                }
              `}
                        >
                          {table.status}
                        </Typography>

                        {/* ✅ Time (only if occupied) */}
                        {table.status === "OCCUPIED" && table.occupiedAt && (
                          <div className="text-xs font-semibold text-red-700 bg-red-100 px-3 py-[2px] rounded-full">
                            {getRunningTime(table.occupiedAt)}
                          </div>
                        )}
                      </div>
                    </Tooltip>
                  ))}
            </div>
          </Card>
        </div>
      </div>
    </Box>
  );
}
