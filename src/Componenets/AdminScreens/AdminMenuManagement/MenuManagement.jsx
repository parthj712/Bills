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
  TextField,
  Tooltip,
  Chip,
  Skeleton,
} from "@mui/material";

import { Edit, Delete, Add, Search } from "@mui/icons-material";
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

export default function MenuManagement() {
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
      <Box className="flex flex-col gap-2">
        <Box className="flex w-full items-start md:items-center gap-3 flex-col md:flex-row">
          <Box>
            <Typography
              fontSize={30}
              fontWeight={800}
              className="text-[#0b3c5d]"
            >
              Menu Management
            </Typography>
            <Typography fontSize={13} className="text-gray-500">
              Manage menu items, pricing, categories, and availability.
            </Typography>
          </Box>

          <Box className="md:ml-auto">
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
          </Box>
        </Box>

        <Box className="h-[4px] w-40 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
      </Box>

      {/* Search + KPI Cards */}
      <Box className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-stretch">
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, name, description, category..."
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "#8a8a8a" }} />,
          }}
          sx={{
            gridColumn: { lg: "span 3" },
            backgroundColor: "#f9fafb",
            borderRadius: 3,
            "& fieldset": { border: "none" },
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            Total Items
          </Typography>
          <Typography fontSize={22} fontWeight={900} color="#0b3c5d">
            {stats.total}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            Available
          </Typography>
          <Typography fontSize={22} fontWeight={900} color="#2e7d32">
            {stats.available}
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: "0 14px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            Unavailable
          </Typography>
          <Typography fontSize={22} fontWeight={900} color="#d32f2f">
            {stats.unavailable}
          </Typography>
        </Paper>
      </Box>

      {/* Premium Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 45px rgba(0,0,0,0.10)",
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
                    fontWeight: 400,
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

      {/* Modals */}
      <AddMenuItems
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={(data) => {}}
        onSuccess={handleFetchMenu}
      />

      <UpdateMenuItem
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        menu={selectedMenu}
        onUpdate={handleUpdate}
      />
    </Box>
  );
}
