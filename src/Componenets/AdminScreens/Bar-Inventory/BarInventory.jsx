"use client";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Chip,
  LinearProgress,
  Stack,
} from "@mui/material";

import LiquorIcon from "@mui/icons-material/Liquor";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { useEffect, useState } from "react";

import AddBarInventoryDialog from "./AddBarInventoryDialog";
import AddStockDialog from "./AddStockDialog";
import { deleteBarInventory, getBarInventory } from "@/service/barInventory";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BarInventory() {
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadInventory = async () => {
    const res = await getBarInventory();
    setInventory(res.data.data);
  };

  useEffect(() => {
    loadInventory();
  }, []);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory item?",
    );

    if (!confirmDelete) return;

    await deleteBarInventory(id);

    loadInventory();
  };

  return (
    <Box p={3} bgcolor="#f6f8fb" minHeight="100vh">
      {/* HEADER */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(90deg,#0f172a,#1e293b)",
          color: "white",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <LiquorIcon sx={{ fontSize: 32 }} />

            <Box>
              <Typography variant="h5" fontWeight={700}>
                Bar Inventory
              </Typography>

              <Typography fontSize={13} sx={{ opacity: 0.8 }}>
                Manage liquor stock and bottle usage
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAdd(true)}
            sx={{
              bgcolor: "#22c55e",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#16a34a",
              },
            }}
          >
            Add Inventory
          </Button>
        </Stack>
      </Paper>

      {/* INVENTORY TABLE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
        }}
      >
        <Table>
          <TableHead
            sx={{
              bgcolor: "#f9fafb",
            }}
          >
            <TableRow>
              <TableCell>
                <Typography fontWeight={600}>Item</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={600}>Bottle Size</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={600}>Stock (ML)</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={600}>Bottles Left</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={600}>Stock Level</Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={600}>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {inventory.map((item) => {
              const stockPercent =
                (item.currentStockML /
                  (item.bottleSizeML * item.remainingBottles || 1)) *
                100;

              return (
                <TableRow
                  key={item._id}
                  sx={{
                    "&:hover": {
                      bgcolor: "#f8fafc",
                    },
                  }}
                >
                  {/* ITEM */}
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Inventory2Icon sx={{ color: "#64748b" }} />

                      <Typography fontWeight={500}>
                        {item.menuItemId?.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* BOTTLE SIZE */}
                  <TableCell>
                    <Chip
                      label={`${item.bottleSizeML} ml`}
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  </TableCell>

                  {/* STOCK ML */}
                  <TableCell>
                    <Typography fontWeight={500}>
                      {item.currentStockML} ml
                    </Typography>
                  </TableCell>

                  {/* BOTTLES */}
                  <TableCell>
                    <Chip
                      label={`${item.remainingBottles} bottles`}
                      size="small"
                      color={item.remainingBottles < 3 ? "error" : "success"}
                    />
                  </TableCell>

                  {/* PROGRESS */}
                  <TableCell width={200}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(stockPercent, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                      }}
                    />
                  </TableCell>

                  {/* ACTION */}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedItem(item);
                          setOpenStock(true);
                        }}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Add Stock
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(item._id)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      {/* DIALOGS */}
      <AddBarInventoryDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={loadInventory}
      />

      <AddStockDialog
        open={openStock}
        item={selectedItem}
        onClose={() => setOpenStock(false)}
        onSuccess={loadInventory}
      />
    </Box>
  );
}
