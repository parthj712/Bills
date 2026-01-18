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
} from "@mui/material";

import { Edit, Delete, Add } from "@mui/icons-material";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useEffect, useState } from "react";
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
  const handleFetchMenu = async () => {
    try {
      const res = await getMenuItems();
      console.log(res.data);
      setMenuItems(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    handleFetchMenu();
  }, []);
  const handleDelete = async (id) => {
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
        isAvailable: !item.isAvailable, // BOOLEAN
      });

      setMenuItems((prev) =>
        prev.map((m) =>
          m._id === item._id ? { ...m, isAvailable: !m.isAvailable } : m,
        ),
      );
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  return (
    <Box className="flex flex-col gap-6 p-2">
      {/* Header */}
      <Box className="flex items-center justify-between">
        <Typography fontSize={28} fontWeight={600} className="text-black">
          Menu Management
        </Typography>
      </Box>

      {/* Search + Add */}
      <Box className="flex items-center justify-between gap-4">
        <TextField
          fullWidth
          placeholder="Search Menu"
          size="small"
          className="max-w-3xl bg-gray-50"
        />

        <AppButton
          label="Add Menu"
          startIcon={<Add />}
          onClick={() => setOpenAdd(true)}
          sx={{
            backgroundColor: "#06558e",
            color: "#fff",
            px: 2,
            minWidth: 120,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#075792" },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer
        sx={{ borderRadius: 4 }}
        component={Paper}
        className="rounded-2xl shadow-none"
      >
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow className="bg-[#06558e]">
              <TableCell className="!text-white">Item Code</TableCell>
              <TableCell className="!text-white">
                Item Name & Description
              </TableCell>
              <TableCell className="!text-white">Category</TableCell>
              <TableCell className="!text-white">Price(Half/Full)</TableCell>
              <TableCell className="!text-white">Status</TableCell>
              <TableCell className="!text-white">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.itemCode}</TableCell>
                {/* Name & Desc */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold text-black ">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500 line-clamp-1">
                      {item.description}
                    </span>
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell>{item.categoryName}</TableCell>

                {/* Price */}
                <TableCell sx={{ fontWeight: 600 }}>
                  Rs.{item.price.half}/{item.price.full}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Switch
                    checked={item.isAvailable}
                    color="success"
                    onChange={() => handleToggleAvailability(item)}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Tooltip title="Delete Menu" arrow>
                      <IconButton
                        size="small"
                        className="!text-red-500"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Menu" arrow>
                      <IconButton
                        size="small"
                        className="!text-orange-500"
                        onClick={() => {
                          setSelectedMenu(item);
                          setOpenEdit(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
