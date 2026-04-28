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
  useTheme,
  useMediaQuery,
  TableContainer,
  Skeleton,
} from "@mui/material";

import LiquorIcon from "@mui/icons-material/Liquor";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import AddBarInventoryDialog from "./AddBarInventoryDialog";
import AddStockDialog from "./AddStockDialog";
import { deleteBarInventory, getBarInventory } from "@/service/barInventory";
import DeleteIcon from "@mui/icons-material/Delete";
import AppButton from "@/Componenets/CommonComponents/AppButton";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import BarInventoryCard from "./BarInventoryCard";

export default function BarInventory() {
  const { showSnackbar } = useAppSnackbar();

  const theme = useTheme();

  // BREAKPOINTS
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadInventory = async () => {
    try {
      setLoading(true);

      const res = await getBarInventory();
      console.log(res.data.data);
      setInventory(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const hasAccess =
    subscription?.status === "ACTIVE" &&
    allowedPlans.includes(subscription.planType);

  const getColor = (percent) => {
    if (percent < 30) return "error";
    if (percent < 70) return "warning";
    return "success";
  };

  return (
    <Box className="flex flex-col min-h-full p-2">
      {/* HEADER */}

      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={isMobile ? "flex-start" : "center"}
        mb={4}
        gap={isMobile ? 2 : 0}
      >
        {/* <LiquorIcon sx={{ fontSize: 32 }} /> */}
        <Typography
          fontSize={isMobile ? 24 : 30}
          fontWeight={isMobile ? 600 : 700}
          className="text-[#0b3c5d]"
        >
          Bar Inventory
        </Typography>

        <Box className="flex gap-4">
          {/* <AppButton
                    label="Edit Tables"
                    className="!bg-yellow-400 !text-black px-8"
                  /> */}

          {!isMobile && (
            <AppButton
              label="Add Inventory"
              startIcon={<AddIcon />}
              onClick={() => {
                // if (!hasAccess) {
                //   showSnackbar(
                //     "Upgrade to Premium to for Bar Inventory 🚀",
                //     "warning",
                //   );
                //   return;
                // }

                setOpenAdd(true);
              }}
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

        {/* <Button
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
        </Button> */}
      </Box>

      {/* INVENTORY TABLE */}
      {isDesktop && (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflow: "auto",
            // boxShadow: "0 10px 45px rgba(0,0,0,0.10)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Item",
                  "Bottle Size",
                  "Stock (ML)",
                  "Bottles Left",
                  "Stock Level",
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
                        <Skeleton animation="wave" height={25} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                inventory.map((item) => {
                  // const stockPercent =
                  //   (item.currentStockML /
                  //     (item.bottleSizeML * item.remainingBottles || 1)) *
                  //   100;

                  const stockPercent =
                    item.totalStockML > 0
                      ? (item.currentStockML / item.totalStockML) * 100
                      : 0;

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
                          color={getColor(stockPercent)}
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

              {!loading && inventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Inventory Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MOBILE + TABLET CARDS */}
      {!isDesktop && (
        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={160} />
            ))}

          {!loading &&
            inventory.map((item) => (
              <BarInventoryCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onAddStock={(item) => {
                  setSelectedItem(item);
                  setOpenStock(true);
                }}
              />
            ))}

          {!loading && inventory.length === 0 && (
            <Box className="col-span-full text-center py-10">
              <Typography>No Inventory Found</Typography>
            </Box>
          )}
        </Box>
      )}

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
              background: "linear-gradient(135deg, #0b3c5d, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(37,99,235,0.35)",
              cursor: "pointer",
              transition: "0.2s",

              "&:hover": {
                transform: "scale(1.08)",
              },

              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            <AddIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
