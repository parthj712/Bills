"use client";

import {
  addOrUpdateFssai,
  addOrUpdateGST,
  addOrUpdateVAT,
  addTagline,
  addWebsite,
  getShopInfo,
  removeFSSAI,
  removeGST,
  removeShopLogo,
  removeShopQR,
  removeTagline,
  removeVAT,
  removeWebsite,
  uploadShopLogo,
  uploadShopQR,
} from "@/service/shopService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  CircularProgress,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfoRow from "./InfoCard";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import FeedbackQRSection from "./FeedbackQRSection";
import API from "@/service/api";
import { getSubscriptionExpiry } from "@/service/subscriptionService";

export default function Settings() {
  const { showSnackbar } = useAppSnackbar();
  const router = useRouter();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editWebsite, setEditWebsite] = useState(false);
  const [editTagline, setEditTagline] = useState(false);
  const [editGST, setEditGST] = useState(false);
  const [editVAT, setEditVAT] = useState(false);
  const [editFssai, setEditFssai] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [qrPreview, setQrPreview] = useState("");

  const [logoLoading, setLogoLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const [shopData, setShopData] = useState(null);
  const isBar = shopData?.businessCategory === "RESTO_BAR";
  const isRetail = shopData?.businessCategory === "RETAIL";

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await getSubscriptionExpiry(); // adjust API
        setSubscription(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSubscription();
  }, []);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await getShopInfo();
        setShopData(res.data?.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    if (!shopData) return;

    if (shopData.logo?.url) setLogoPreview(shopData.logo.url);
    if (shopData.upiQr?.url) setQrPreview(shopData.upiQr.url);
  }, [shopData]);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");

      localStorage.removeItem("token");

      showSnackbar("Logout Successful", "success");

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("token");

      showSnackbar("Logged out (local)", "warning");

      router.push("/login");
    }
  };

  const handleSaveGST = async () => {
    await addOrUpdateGST({ gstNumber: shopData.gstNumber });
    showSnackbar("GST Saved ✅");
    setEditGST(false);
  };

  const handleSaveVat = async () => {
    await addOrUpdateVAT({ vatNumber: shopData.vatNumber });
    showSnackbar("VAT Saved ✅");
    setEditVAT(false);
  };

  const handleSaveFssai = async () => {
    await addOrUpdateFssai({ fssaiNumber: shopData.fssaiNumber });
    showSnackbar("Fssai Saved ✅");
    setEditFssai(false);
  };

  const handleSaveWebsite = async () => {
    await addWebsite({ website: shopData.website });
    showSnackbar("Website Updated ✅");
  };

  const handleSaveTagline = async () => {
    await addTagline({ tagline: shopData.tagline });
    showSnackbar("Tagline Updated ✅");
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoLoading(true);

    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);

    const res = await uploadShopLogo(file);
    setLogoPreview(res.data.logo);
    setLogoLoading(false);
  };

  const handleQrChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setQrLoading(true);

    const preview = URL.createObjectURL(file);
    setQrPreview(preview);

    const res = await uploadShopQR(file);
    setQrPreview(res.data.qr);
    setQrLoading(false);
  };

  const handleRemoveLogo = async () => {
    await removeShopLogo();
    setLogoPreview("");
  };

  const handleRemoveQr = async () => {
    await removeShopQR();
    setQrPreview("");
  };
  const handleRemoveGST = async () => {
    await removeGST();
    setShopData({ ...shopData, gstNumber: "" });
    showSnackbar("GST Removed 🗑️");
  };

  const handleRemoveFssai = async () => {
    await removeFSSAI();
    setShopData({ ...shopData, fssaiNumber: "" });
    showSnackbar("FSSAI Removed 🗑️");
  };

  const handleRemoveVAT = async () => {
    await removeVAT();
    setShopData({ ...shopData, vatNumber: "" });
    showSnackbar("VAT Removed 🗑️");
  };

  const handleRemoveTagline = async () => {
    await removeTagline();
    setShopData({ ...shopData, tagline: "" });
    showSnackbar("Tagline Removed 🗑️");
  };
  const handleRemoveWebsite = async () => {
    await removeWebsite();
    setShopData({ ...shopData, website: "" });
    showSnackbar("Website Removed 🗑️");
  };
  if (loading) return <SettingsSkeleton />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1.5, sm: 3 },
        py: { xs: 2, sm: 3 },
        // background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
      }}
    >
      <Typography
        fontSize={{ xs: 22, sm: 28 }}
        color="black"
        fontWeight={800}
        mb={3}
      >
        ⚙️ Settings
      </Typography>

      <Box display="flex" flexDirection="column" gap={3} maxWidth={900}>
        {/* BUSINESS */}
        <SettingsCard title="Business Info">
          <InfoRow label="Business Name" value={shopData.shopName} />
          <InfoRow label="Phone" value={shopData.phone} />
          <InfoRow label="Email" value={shopData.email} />
          <InfoRow label="Address" value={shopData.address} multiline />

          <ModernInputCard title="GST">
            {editGST ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.gstNumber || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, gstNumber: e.target.value })
                  }
                />
                <ActionButtons
                  onCancel={() => setEditGST(false)}
                  onSave={handleSaveGST}
                />
              </>
            ) : (
              <DisplayValue
                value={shopData.gstNumber}
                onEdit={() => setEditGST(true)}
                onDelete={handleRemoveGST}
              />
            )}
          </ModernInputCard>
          <ModernInputCard title="FSSAI">
            {editFssai ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.fssaiNumber || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, fssaiNumber: e.target.value })
                  }
                />
                <ActionButtons
                  onCancel={() => setEditFssai(false)}
                  onSave={handleSaveFssai}
                />
              </>
            ) : (
              <DisplayValue
                value={shopData.fssaiNumber}
                onEdit={() => setEditFssai(true)}
                onDelete={handleRemoveFssai}
              />
            )}
          </ModernInputCard>

          {isBar && (
            <ModernInputCard title="VAT">
              {editVAT ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={shopData.vatNumber || ""}
                    onChange={(e) =>
                      setShopData({ ...shopData, vatNumber: e.target.value })
                    }
                  />
                  <ActionButtons
                    onCancel={() => setEditVAT(false)}
                    onSave={handleSaveVat}
                  />
                </>
              ) : (
                <DisplayValue
                  value={shopData.vatNumber}
                  onEdit={() => setEditVAT(true)}
                  onDelete={handleRemoveVAT}
                />
              )}
            </ModernInputCard>
          )}
        </SettingsCard>

        {/* BRANDING */}
        <SettingsCard title="Branding">
          <ModernInputCard title="Website">
            {editWebsite ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.website || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, website: e.target.value })
                  }
                />
                <ActionButtons
                  onCancel={() => setEditWebsite(false)}
                  onSave={() => {
                    handleSaveWebsite();
                    setEditWebsite(false);
                  }}
                />
              </>
            ) : (
              <DisplayValue
                value={shopData.website}
                onEdit={() => setEditWebsite(true)}
                onDelete={handleRemoveWebsite}
              />
            )}
          </ModernInputCard>

          <ModernInputCard title="Tagline">
            {editTagline ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.tagline || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, tagline: e.target.value })
                  }
                />
                <ActionButtons
                  onCancel={() => setEditTagline(false)}
                  onSave={() => {
                    handleSaveTagline();
                    setEditTagline(false);
                  }}
                />
              </>
            ) : (
              <DisplayValue
                value={shopData.tagline}
                onEdit={() => setEditTagline(true)}
                onDelete={handleRemoveTagline}
              />
            )}
          </ModernInputCard>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
          >
            <UploadCard
              title="Logo"
              preview={logoPreview}
              loading={logoLoading}
              onRemove={handleRemoveLogo}
              onUpload={handleLogoChange}
            />
            <UploadCard
              title="QR Code"
              preview={qrPreview}
              loading={qrLoading}
              onRemove={handleRemoveQr}
              onUpload={handleQrChange}
            />
          </Box>
        </SettingsCard>

        {!isRetail && (
          <>
            {/* FEEDBACK */}
            <SettingsCard title="Feedback">
              <FeedbackQRSection />
            </SettingsCard>
          </>
        )}

        {subscription && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            }}
          >
            {/* HEADER */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography fontWeight={700} fontSize={18}>
                Subscription
              </Typography>

              {/* STATUS BADGE */}
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: 12,
                  fontWeight: 600,
                  background:
                    subscription.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                  color:
                    subscription.status === "ACTIVE" ? "#166534" : "#991b1b",
                }}
              >
                {subscription.status}
              </Box>
            </Box>

            {/* PLAN */}
            <Typography fontSize={14} color="text.secondary">
              Current Plan
            </Typography>
            <Typography fontWeight={700} fontSize={20} mb={2}>
              {subscription.planType}
            </Typography>

            {/* DETAILS */}
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Days Remaining</Typography>
              <Typography
                fontWeight={600}
                color={subscription.daysLeft <= 3 ? "error" : "text.primary"}
              >
                {subscription.daysLeft} days
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary">Expires On</Typography>
              <Typography fontWeight={600}>
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </Typography>
            </Box>

            {/* PROGRESS BAR */}
            <Box
              mt={2}
              sx={{
                height: 6,
                borderRadius: 10,
                background: "#e5e7eb",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${Math.min(subscription.daysLeft * 10, 100)}%`,
                  background:
                    subscription.daysLeft <= 3 ? "#ef4444" : "#6366f1",
                  transition: "0.4s",
                }}
              />
            </Box>

            {/* OPTIONAL CTA */}
          </Paper>
        )}

        {/* LOGOUT */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => setOpenLogoutDialog(true)}
          >
            Sign Out
          </Button>
        </Paper>
      </Box>

      {/* LOGOUT DIALOG */}
      <Dialog open={openLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)}>Cancel</Button>
          <Button color="error" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* ---------- UI COMPONENTS ---------- */

function SettingsCard({ title, children }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography fontWeight={700} mb={2}>
        {title}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Paper>
  );
}

function ModernInputCard({ title, children }) {
  return (
    <Box sx={{ p: 2, border: "1px solid #e2e8f0", borderRadius: 3 }}>
      <Typography fontSize={13} fontWeight={600} mb={1}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function DisplayValue({ value, onEdit, onDelete }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography fontWeight={600}>{value || "— Not Added —"}</Typography>

      <Box display="flex" gap={1}>
        <Button onClick={onEdit}>✏️</Button>
        {value && <Button onClick={onDelete}>🗑️</Button>}
      </Box>
    </Box>
  );
}

function ActionButtons({ onCancel, onSave }) {
  return (
    <Box
      mt={1}
      display="flex"
      gap={1}
      flexDirection={{ xs: "column", sm: "row" }}
    >
      <Button fullWidth variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
      <Button fullWidth variant="contained" onClick={onSave}>
        Save
      </Button>
    </Box>
  );
}

function UploadCard({ title, preview, loading, onRemove, onUpload }) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        textAlign: "center",
      }}
    >
      <Typography fontWeight={600}>{title}</Typography>

      {loading ? (
        <CircularProgress size={24} />
      ) : preview ? (
        <Box position="relative">
          <img src={preview} style={{ height: 80, borderRadius: 8 }} />
          <Button
            onClick={onRemove}
            sx={{ position: "absolute", top: -10, right: -10 }}
          >
            ✕
          </Button>
        </Box>
      ) : null}

      <Button fullWidth variant="outlined" component="label" sx={{ mt: 2 }}>
        Upload
        <input hidden type="file" onChange={onUpload} />
      </Button>
    </Box>
  );
}

function SettingsSkeleton() {
  return (
    <Box p={3}>
      <Skeleton width={200} height={40} />
      <Skeleton height={200} sx={{ mt: 2 }} />
    </Box>
  );
}
