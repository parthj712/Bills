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
import WaiterTopProducts from "./WaiterTopProducts/WaiterTopProducts";

const tableStyles = {
  AVAILABLE:
    "!bg-white !text-black border border-gray-300 shadow-xl !rounded-2xl",

  OCCUPIED:
    "!bg-green-300/30 !text-black shadow-md !rounded-2xl border-[2px] border-green-600/90 backdrop-blur-md",
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
  const handleAddTable = async () => {
    await handleGetTables();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [tables, keyBuffer, open]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // clear auth
    localStorage.removeItem("token"); // or cookies
    router.push("/login");
  };

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

  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Top Buttons */}
      {/* Navbar */}
      <WaiterNavbar />

      <div className="grid grid-cols-12 gap-6 p-6">
        {/* LEFT PANEL */}
        <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col gap-4 order-2 md:order-1">
          {/* Takeaway */}
          <AppButton
            label="Takeaway"
            className="!bg-orange-500 !text-white"
            onClick={() => handleOrderTypeClick("TAKEAWAY")}
          />

          {/* Top Products */}
          <WaiterTopProducts />
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 md:col-span-8 lg:col-span-8 order-1 md:order-2 ">
          <Card className="p-7 !rounded-4xl shadow-md !bg-[#F1F1F1]">
            <div className="flex items-center justify-between mb-4">
              <Typography fontSize={24} fontWeight={600}>
                Dine-In Orders
              </Typography>

              <span
                className="
                      border-[1px]
                      border-green-600/90
                      text-[16px]
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      height={96}
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
                      <Card
                        onClick={() =>
                          handleTableClick(table._id, table.tableNo)
                        }
                        className={`
              h-25
              flex items-center justify-center
              cursor-pointer
              transition
              hover:shadow-md
              ${tableStyles[table.status]}
              ${
                highlightTableNo === table.tableNo
                  ? "ring-4 ring-blue-500 ring-offset-2 scale-105"
                  : ""
              }
            `}
                      >
                        <Typography fontSize={24} fontWeight={600}>
                          {table.tableNo}
                        </Typography>
                      </Card>
                    </Tooltip>
                  ))}
            </div>
          </Card>
        </div>
      </div>
    </Box>
  );
}
