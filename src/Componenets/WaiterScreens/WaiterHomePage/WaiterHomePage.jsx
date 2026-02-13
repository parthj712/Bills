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
  Button,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WaiterNavbar from "../WaiterNavbar/WaiterNavbar";
import { motion, AnimatePresence } from "framer-motion";

import { TopProductsCard } from "@/Componenets/AdminScreens/AdminDashboard/TopProductsCard/TopProductsCard";
import { getRecentBills } from "@/service/billsService";

const tableStyles = {
  AVAILABLE: `
    bg-white
    border border-green-500
    text-green-700
    hover:bg-green-50
    hover:shadow-md
  `,

  OCCUPIED: `
    bg-white
    border border-red-500
    text-red-600
    hover:bg-red-50
    hover:shadow-md
  `,
};



export default function WaiterHomePage() {
  const [recentBills, setRecentBills] = useState([]);

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialCount = 5;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [expanded, setExpanded] = useState(false);



  // keyboard states
  const [keyBuffer, setKeyBuffer] = useState("");
  const [highlightTableNo, setHighlightTableNo] = useState(null);

  const fetchRecentBills = async () => {
    try {
      const res = await getRecentBills();

      setRecentBills(res.data?.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      console.error("Recent Bills Error:", message);
    }
  };

  const handleGetTables = async () => {
    try {
      setLoading(true);
      const res = await getTables();
      setTables(res);
    } catch (error) {
      console.log("failed to get tables", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetTables();
    fetchRecentBills();
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

  // const topProducts = [
  //   { name: "Paneer Butter Masala", percent: 72 },
  //   { name: "Veg Biryani", percent: 65 },
  //   { name: "Butter Naan", percent: 54 },
  //   { name: "Cold Coffee", percent: 41 },
  // ];

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

      <div>
        <Box
          display="flex"
          p={4}
          flexDirection={isDesktop ? "row" : "column-reverse"}
          gap={4}
        >

          {/* LEFT PANEL */}
          <div className="flex-1 flex flex-col gap-4 ">

            {/* Recent Bills */}
            <Card className="p-5 !rounded-3xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <Typography fontSize={isMobile ? 20 : 24} fontWeight={600}>
                  Recent Bills
                </Typography>

                {recentBills.length > initialCount && (
                  <Button
                    variant="text"
                    onClick={() => {
                      if (expanded) {
                        setVisibleCount(initialCount);
                        setExpanded(false);
                      } else {
                        setVisibleCount(recentBills.length);
                        setExpanded(true);
                      }
                    }}
                  >
                    {expanded ? "View Less" : "View More"}
                  </Button>
                )}
              </div>

              <motion.div
                layout
                className="flex flex-col gap-3 overflow-hidden"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >

                {recentBills.slice(0, visibleCount).map((bill) => (
                  <div
                    key={bill._id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div>
                      <Typography fontSize={14} fontWeight={600}>
                        {bill.billNo}
                      </Typography>
                      <Typography fontSize={12} color="text.secondary">
                        Table {bill.tableNo} • {bill.time}
                      </Typography>
                    </div>

                    <Typography fontSize={14} fontWeight={600} color="green">
                      ₹{bill.grandTotal}
                    </Typography>
                  </div>
                ))}

              </motion.div>

            </Card>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <AppButton
                label="Takeaway"
                onClick={() => handleOrderTypeClick("TAKEAWAY")}
                sx={{
                  backgroundColor: "#334155",
                  color: "#ffffff",
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                  textTransform: "none",
                  letterSpacing: "0.5px",
                  "&:hover": {
                    backgroundColor: "#1E293B",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
                  },
                }}
              />


            </div>


            <Card className="p-7 shadow-md ">
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
                      rounded-xl
                    "
                >
                  {totalActiveTables} Active
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
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
                          rounded-xl
                          cursor-pointer
                          flex flex-col
                          items-center
                          justify-center
                          gap-2
                          px-4 py-3
                          
                          transition-all duration-300
                          hover:shadow-lg hover:scale-[1.03]
                          ${tableStyles[table.status]}
                          ${highlightTableNo === table.tableNo
                            ? table.status === "OCCUPIED"
                              ? "ring-4 ring-red-500 ring-offset-2"
                              : "ring-4 ring-green-500 ring-offset-2"
                            : ""
                          }
                        `}
                      >
                        {/* ✅ Table Number */}
                        <Typography
                          fontSize={22}
                          fontWeight={600}
                          className={
                            table.status === "OCCUPIED"
                              ? "text-red-800"
                              : "text-green-600"
                          }
                        >
                          {table.tableNo}
                        </Typography>

                        {/* ✅ Status Badge */}
                        <Typography
                          fontSize={table.status === "OCCUPIED" ? 12 : 13}
                          fontWeight={table.status === "OCCUPIED" ? 700 : 600}
                          className={`px-2 py-[2px] rounded-full
                          ${table.status === "OCCUPIED"
                              ? "bg-red-100 text-red-700 border border-red-500"
                              : "bg-green-100 text-green-700 border border-green-500"
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


        </Box>

      </div>
    </Box>
  );
}
