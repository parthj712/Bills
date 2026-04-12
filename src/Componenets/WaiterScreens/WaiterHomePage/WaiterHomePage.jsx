"use client";

import AppButton from "@/Componenets/CommonComponents/AppButton";
import { getTables, updateTableStatus } from "@/service/tableService";
import {
  Box,
  Typography,
  Card,
  useTheme,
  useMediaQuery,
  MenuItem,
  Tooltip,
  Skeleton,
  Button,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import WaiterNavbar from "../WaiterNavbar/WaiterNavbar";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import { TopProductsCard } from "@/Componenets/AdminScreens/AdminDashboard/TopProductsCard/TopProductsCard";
import { getRecentBills } from "@/service/billsService";
import { getShopInfo } from "@/service/shopService";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";

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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const [shopData, setShopData] = useState(null);

  const [selectedSection, setSelectedSection] = useState("Foor 1");

  const [billsLoading, setBillsLoading] = useState(false);
  const [billsLoaded, setBillsLoaded] = useState(false);
  const [billsCache, setBillsCache] = useState(null);

  // keyboard states
  const [keyBuffer, setKeyBuffer] = useState("");
  const [highlightTableNo, setHighlightTableNo] = useState(null);
  // const isDineIn = shopData?.businessCategory === "DINE_IN";
  // const isBar = shopData?.businessCategory === "RESTO_BAR";.

  const showTables =
    shopData?.businessCategory === "DINE_IN" ||
    shopData?.businessCategory === "RESTO_BAR";

  const fecthShopData = async () => {
    try {
      const res = await getShopInfo();

      // IMPORTANT
      setShopData(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleMenuOpen = (event, table) => {
    event.stopPropagation(); // prevent table click
    setMenuAnchor(event.currentTarget);
    setSelectedTable(table);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTable(null);
  };

  const fetchRecentBills = async (forceRefresh = false) => {
    // ✅ If already cached and not forcing refresh, use cache
    if (billsCache && !forceRefresh) {
      setRecentBills(billsCache);
      setBillsLoaded(true);
      return;
    }

    try {
      setBillsLoading(true);

      const res = await getRecentBills();

      const data = res.data?.data || [];
      console.log(data);

      setRecentBills(data);
      setBillsCache(data); // 🔥 cache it
      setBillsLoaded(true);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      console.error("Recent Bills Error:", message);
    } finally {
      setBillsLoading(false);
    }
  };

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
    const init = async () => {
      await fecthShopData();
    };
    init();
  }, []);

  useEffect(() => {
    if (showTables) {
      handleGetTables();
    }
    // fetchRecentBills();
  }, [showTables]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [tables, keyBuffer, open]);

  //   // clear auth

  const handleTableClick = (tableId, tableNo, section) => {
    router.push(
      `/waiter/order?tableId=${tableId}&tableNo=${tableNo}&section=${section}`,
    );
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
    //these blocks everything
    if (!showTables) return;
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
          handleTableClick(table._id, table.tableNo, table.sectionId?.name);
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

  const getRunningTime = (occupiedAt) => {
    if (!occupiedAt) return "";

    const start = new Date(occupiedAt);
    const now = new Date();

    const diff = now - start;
    const mins = Math.floor(diff / 60000);

    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)} hr ${mins % 60} min`;
  };
  const groupedTables = tables.reduce((acc, table) => {
    const section = table.sectionId?.name || "Default";

    if (!acc[section]) {
      acc[section] = [];
    }

    acc[section].push(table);

    return acc;
  }, {});

  const handleTableStatus = async (tableId, newStatus) => {
    try {
      // Optimistic UI update (fast UX)
      setTables((prev) =>
        prev.map((t) => (t._id === tableId ? { ...t, status: newStatus } : t)),
      );

      await updateTableStatus(tableId, newStatus);

      // Optional: re-fetch for accuracy
      // await handleGetTables();
    } catch (error) {
      console.log("Failed to update status", error);

      // rollback if error
      handleGetTables();
    }
  };

  const sectionList = Object.keys(groupedTables);
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
            <Card className="p-5 !rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <Typography fontSize={isMobile ? 20 : 24} fontWeight={600}>
                  Recent Bills
                </Typography>

                <div className="flex gap-2">
                  {!billsLoaded && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => fetchRecentBills()}
                      disabled={billsLoading}
                    >
                      {billsLoading ? "Loading..." : "Load Bills"}
                    </Button>
                  )}

                  {billsLoaded && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => fetchRecentBills(true)} // force refresh
                    >
                      Refresh
                    </Button>
                  )}
                </div>
              </div>

              <motion.div
                layout
                className="flex flex-col gap-3 overflow-hidden"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {!billsLoaded && (
                  <Typography fontSize={14} color="text.secondary">
                    Click "Load Bills" to view recent bills.
                  </Typography>
                )}

                {billsLoaded && recentBills.length === 0 && (
                  <Typography fontSize={14} color="text.secondary">
                    No recent bills found.
                  </Typography>
                )}

                {billsLoaded &&
                  recentBills.slice(0, visibleCount).map((bill) => (
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
                label={showTables ? "Takeaway" : "Add Order"}
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
            {showTables && (
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

                <FormControl size="small" sx={{ minWidth: "100%", mb: 3 }}>
                  <InputLabel>Section</InputLabel>

                  <Select
                    value={selectedSection}
                    label="Section"
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    {sectionList.map((section) => (
                      <MenuItem key={section} value={section}>
                        {section}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="max-h-[520px] overflow-y-auto pr-1">
                  {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
                      {Array.from({ length: 9 }).map((_, index) => (
                        <Skeleton
                          key={index}
                          variant="rounded"
                          height={110}
                          className="!rounded-2xl"
                        />
                      ))}
                    </div>
                  ) : (
                    Object.entries(groupedTables)
                      .filter(([sectionName]) =>
                        selectedSection === "ALL"
                          ? true
                          : sectionName === selectedSection,
                      )
                      .map(
                        // const sectionList = Object.keys(groupedTables);

                        ([sectionName, sectionTables]) => (
                          <div key={sectionName} className="mb-6 ">
                            {/* Section Title */}
                            <Typography
                              fontSize={16}
                              fontWeight={600}
                              gutterBottom
                              className="mb-3 text-gray-700"
                            >
                              {sectionName}
                            </Typography>

                            {/* Tables Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                              {sectionTables.map((table) => (
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
                                      handleTableClick(
                                        table._id,
                                        table.tableNo,
                                        table.sectionId?.name,
                                      )
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
                  hover:shadow-lg hover:scale-[1.0]
                  ${tableStyles[table.status]}
                  ${
                    highlightTableNo === table.tableNo
                      ? table.status === "OCCUPIED"
                        ? "ring-4 ring-red-500 ring-offset-2"
                        : "ring-4 ring-green-500 ring-offset-2"
                      : ""
                  }
                `}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleMenuOpen(e, table)}
                                      sx={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                      }}
                                    >
                                      <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                    {/* Table Number */}
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

                                    {/* Status Badge */}
                                    <Typography
                                      fontSize={
                                        table.status === "OCCUPIED" ? 12 : 13
                                      }
                                      fontWeight={
                                        table.status === "OCCUPIED" ? 700 : 600
                                      }
                                      className={`px-2 py-[2px] rounded-full
                    ${
                      table.status === "OCCUPIED"
                        ? "bg-red-100 text-red-700 border border-red-500"
                        : "bg-green-100 text-green-700 border border-green-500"
                    }`}
                                    >
                                      {table.status}
                                    </Typography>

                                    {/* Running Time */}
                                    {table.status === "OCCUPIED" &&
                                      table.occupiedAt && (
                                        <div className="text-xs font-semibold text-red-700 bg-red-100 px-3 py-[2px] rounded-full">
                                          {getRunningTime(table.occupiedAt)}
                                        </div>
                                      )}
                                  </div>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        ),
                      )
                  )}
                </div>
              </Card>
            )}
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  borderRadius: 3,
                  minWidth: 180,
                  padding: "6px",
                },
              }}
            >
              {/* AVAILABLE */}
              <MenuItem
                disabled={selectedTable?.status === "AVAILABLE"}
                onClick={() => {
                  handleTableStatus(selectedTable._id, "AVAILABLE");
                  handleMenuClose();
                }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  display: "flex",
                  gap: 1,
                  color:
                    selectedTable?.status === "AVAILABLE" ? "gray" : "green",
                }}
              >
                <CheckCircleIcon fontSize="small" />
                Mark as Available
              </MenuItem>

              {/* OCCUPIED */}
              <MenuItem
                disabled={selectedTable?.status === "OCCUPIED"}
                onClick={() => {
                  handleTableStatus(selectedTable._id, "OCCUPIED");
                  handleMenuClose();
                }}
                sx={{
                  borderRadius: 2,
                  display: "flex",
                  gap: 1,
                  color: selectedTable?.status === "OCCUPIED" ? "gray" : "red",
                }}
              >
                <CancelIcon fontSize="small" />
                Mark as Occupied
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </div>
    </Box>
  );
}
