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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tableStyles = {
  AVAILABLE: "!bg-green-400 !text-white shadow-md",
  OCCUPIED: "!bg-red-400 !text-white shadow-md",
};

const topProducts = [
  { name: "Chicken Chilly", percent: 40, color: "bg-red-500" },
  { name: "Misal-Pav", percent: 40, color: "bg-green-500" },
  { name: "Cheese Chilly Toast", percent: 40, color: "bg-yellow-400" },
  { name: "Cheese Sandwich", percent: 40, color: "bg-purple-400" },
  { name: "Vegetable Salad", percent: 40, color: "bg-pink-400" },
];

export default function WaiterHomePage() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

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
  return (
    <Box className="min-h-screen bg-gray-50 p-6">
      {/* Top Buttons */}
      <div className="flex items-center gap-4 mb-6">
        <AppButton
          label="Swiggy"
          className="!bg-orange-500 !text-white flex-1"
        />
        <AppButton label="Zomato" className="!bg-red-600 !text-white flex-1" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT PANEL */}
        <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col gap-4 order-2 md:order-1">
          {/* Takeaway */}
          <AppButton label="Takeaway" className="!bg-orange-500 !text-white" />

          {/* Top Products */}
          <Card className="p-6 rounded-xl">
            <Typography fontSize={26} fontWeight={600} mb={2}>
              Top Products
            </Typography>

            <div className="flex flex-col gap-6">
              {topProducts.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <Typography fontSize={16}>{item.name}</Typography>
                    <span className="font-semibold text-[14px] bg-gray-100 px-2 py-0.5 rounded-full">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div className="flex justify-baseline">
            <IconButton onClick={handleMenuOpen}>
              <Avatar className="!bg-orange-500">A</Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" className="mr-2" />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-12 md:col-span-8 lg:col-span-8 order-1 md:order-2">
          <Card className="p-7 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Typography fontSize={24} fontWeight={600}>
                Dine-In Orders
              </Typography>

              <span
                className="
    text-sm
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
              {tables.map((table) => (
                <Card
                  key={table._id}
                  onClick={() => handleTableClick(table._id, table.tableNo)}
                  className={`
        h-25
        flex items-center justify-center
        rounded-xl
        cursor-pointer
        transition
        hover:shadow-md
        ${tableStyles[table.status]}
      `}
                >
                  <Typography fontSize={18} fontWeight={600}>
                    {table.tableNo}
                  </Typography>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Box>
  );
}
