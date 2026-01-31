"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { Edit, Delete, Add, Search, Close } from "@mui/icons-material";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useMemo, useState } from "react";
import AddMenuItems from "./AddMenuItems";
import {
  deleteMenuItem,
  getMenuItems,
  updateMenuAvailability,
  updateMenuItem,
} from "@/service/menuService";
import UpdateMenuItem from "./UpdateMenu";
import KpiPill from "./KpiPill/KpiPill";
import { motion } from "framer-motion";
import MenuItemCard from "./MenuItemCard";



export default function MenuManagement() {



  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));


  const [openAdd, setOpenAdd] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);


  const handleFetchMenu = async () => {
    try {
      setLoading(true);
      const res = await getMenuItems();
      setMenuItems(res.data || []);
    } catch (error) {
      console.log(error?.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchMenu();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    await deleteMenuItem(id);
    handleFetchMenu();
  };

  const handleUpdate = async (id, data) => {
    await updateMenuItem(id, data);
    handleFetchMenu();
  };

  const handleToggleAvailability = async (item) => {
    try {
      await updateMenuAvailability(item._id, {
        isAvailable: !item.isAvailable,
      });
      setMenuItems((prev) =>
        prev.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m,
        ),
      );
    } catch (error) {
      console.log(error?.response?.data?.message || error?.message || error);
    }
  };

  // ---------- premium: filter + stats ----------
  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return menuItems;

    return menuItems.filter((m) => {
      const blob =
        `${m.itemCode || ""} ${m.name || ""} ${m.description || ""} ${m.categoryName || ""} ${m.price?.half || ""} ${m.price?.full || ""}`
          .toLowerCase()
          .trim();
      return blob.includes(q);
    });
  }, [menuItems, search]);

  const stats = useMemo(() => {
    const total = menuItems.length;
    const available = menuItems.filter((m) => m.isAvailable).length;
    const unavailable = total - available;
    return { total, available, unavailable };
  }, [menuItems]);

  return (
    <Box className="flex flex-col gap-6 p-2">
      {/* Premium Header */}
      <Box className="flex flex-row gap-2">

        <Typography fontSize={isMobile ? 24 : 30} fontWeight={isMobile ? 600 : 700} className="text-[#0b3c5d]">
          Menu Management
        </Typography>

        <Box className="md:ml-auto">
          {!isMobile && (
            <AppButton
              label="Add Menu"
              startIcon={<Add />}
              onClick={() => setOpenAdd(true)}
              sx={{
                backgroundColor: "#0b3c5d",
                color: "#fff",
                px: 2,
                minWidth: 140,
                height: 40,
                borderRadius: 3,
                fontWeight: 800,
              }}
            />
          )}
        </Box>

      </Box>

      {/* Search + KPI Cards */}
      <Box className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, name, description, category..."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#0b3c5d" }} />
              </InputAdornment>
            ),
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ color: "gray.500" }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            gridColumn: { lg: "span 3" },
            backgroundColor: "#f9fafb",
            borderRadius: 2,
            height: 44,
            "& .MuiInputBase-root": {
              height: 44,
            },
            "& input": {
              fontSize: 14,
              padding: "8px 0",
            },
            "& fieldset": { border: "none" },
            boxShadow: "0 6px 10px rgba(0,0,0,0.06)",
            border: "1px solid",
            borderColor: "gray.200",
            bgcolor: "white",
          }}
        />

        <KpiPill label="Total" value={stats.total} color="primary" />
        <KpiPill label="Available" value={stats.available} color="success" />
        <KpiPill label="Unavailable" value={stats.unavailable} color="error" />


      </Box>

      {/* Premium Table */}
      {isDesktop && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            overflow: "auto",
            boxShadow: "0 10px 45px rgba(0,0,0,0.10)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Item Code",
                  "Item",
                  "Category",
                  "Price (Half/Full)",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      backgroundColor: "#0b3c5d",
                      color: "white",
                      fontWeight: 600,
                      borderBottom: "none",
                      py: 2,
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: 7 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton height={22} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                filteredMenu.map((item, index) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                      "&:hover": { backgroundColor: "#eef6ff" },
                      transition: "0.2s",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 300, color: "#0b3c5d" }}>
                      {item.itemCode}
                    </TableCell>

                    <TableCell>
                      <Box className="flex flex-col">
                        <Typography fontWeight={300} className="text-black">
                          {item.name}
                        </Typography>
                        <Typography
                          fontSize={13}
                          className="text-gray-500 line-clamp-1"
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={item.categoryName || "—"}
                        sx={{
                          fontWeight: 300,
                          borderRadius: 2,
                          backgroundColor: "#e3f2fd",
                          color: "#0b3c5d",
                          border: "1px solid",
                          borderColor: "#90caf9",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 300 }}>
                      ₹ {item?.price?.half ?? 0} / {item?.price?.full ?? 0}
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Switch
                          checked={!!item.isAvailable}
                          color="success"
                          onChange={() => handleToggleAvailability(item)}
                        />
                        <Chip
                          size="small"
                          label={item.isAvailable ? "Available" : "Unavailable"}
                          sx={{
                            fontWeight: 300,
                            borderRadius: 2,
                            backgroundColor: item.isAvailable
                              ? "#e8f5e9"
                              : "#ffebee",
                            color: item.isAvailable ? "#2e7d32" : "#d32f2f",
                            border: "1px solid",
                            borderColor: item.isAvailable
                              ? "#81c784"
                              : "#ef9a9a",
                          }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <Tooltip title="Edit Menu" arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedMenu(item);
                              setOpenEdit(true);
                            }}
                            sx={{
                              backgroundColor: "#fff3e0",
                              "&:hover": { backgroundColor: "#ffe0b2" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Menu" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item._id)}
                            sx={{
                              backgroundColor: "#ffebee",
                              color: "#d32f2f",
                              "&:hover": { backgroundColor: "#ffcdd2" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredMenu.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 7 }}>
                    <Typography color="text.secondary" fontWeight={700}>
                      No menu items found.
                    </Typography>
                    <Typography color="text.secondary" fontSize={13}>
                      Try searching by code, name, category or description.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {/* MOBILE + TABLET CARDS */}
      {!isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={160} />
            ))}

          {!loading &&
            filteredMenu.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onToggle={handleToggleAvailability}
                onDelete={handleDelete}
                onEdit={(menu) => {
                  setSelectedMenu(menu);
                  setOpenEdit(true);
                }}
              />
            ))}

          {!loading && filteredMenu.length === 0 && (
            <Box className="col-span-full text-center py-10">
              <Typography fontWeight={700} color="text.secondary">
                No menu items found
              </Typography>
            </Box>
          )}
        </Box>
      )}


      {/* Modals */}
      <AddMenuItems
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={(data) => { }}
        onSuccess={handleFetchMenu}
      />

      <UpdateMenuItem
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        menu={selectedMenu}
        onUpdate={handleUpdate}
      />



      {isMobile && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed bottom-9 right-8 z-50"
        >
          <Box
            onClick={() => setOpenAdd(true)}
            sx={{
              height: 56,
              width: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF7A18, #FFB347)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(255,122,24,0.45)",
              cursor: "pointer",
              transition: "0.2s",
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <Add sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}


    </Box>
  );
}
