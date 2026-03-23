"use client";

import {
  addOrUpdateGST,
  addOrUpdateVAT,
  addTagline,
  addWebsite,
  getShopInfo,
  removeShopLogo,
  removeShopQR,
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

export default function Settings() {
  const { showSnackbar } = useAppSnackbar();
  const router = useRouter();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editWebsite, setEditWebsite] = useState(false);
  const [editTagline, setEditTagline] = useState(false);
  const [editGST, setEditGST] = useState(false);
  const [editVAT, setEditVAT] = useState(false);

  const [logoPreview, setLogoPreview] = useState("");
  const [qrPreview, setQrPreview] = useState("");

  const [logoLoading, setLogoLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const [shopData, setShopData] = useState(null);
  const isBar = shopData?.businessCategory === "RESTO_BAR";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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
            {!shopData.gstNumber || editGST ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.gstNumber || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, gstNumber: e.target.value })
                  }
                />
                {editGST && (
                  <ActionButtons
                    onCancel={() => setEditGST(false)}
                    onSave={handleSaveGST}
                  />
                )}
              </>
            ) : (
              <DisplayValue
                value={shopData.gstNumber}
                onEdit={() => setEditGST(true)}
              />
            )}
          </ModernInputCard>

          {isBar && (
            <ModernInputCard title="VAT">
              {!shopData.vatNumber || editVAT ? (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    value={shopData.vatNumber || ""}
                    onChange={(e) =>
                      setShopData({ ...shopData, vatNumber: e.target.value })
                    }
                  />
                  {editVAT && (
                    <ActionButtons
                      onCancel={() => setEditVAT(false)}
                      onSave={handleSaveVat}
                    />
                  )}
                </>
              ) : (
                <DisplayValue
                  value={shopData.vatNumber}
                  onEdit={() => setEditVAT(true)}
                />
              )}
            </ModernInputCard>
          )}
        </SettingsCard>

        {/* BRANDING */}
        <SettingsCard title="Branding">
          <ModernInputCard title="Website">
            {!shopData.website || editWebsite ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.website || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, website: e.target.value })
                  }
                />
                {editWebsite && (
                  <ActionButtons
                    onCancel={() => setEditWebsite(false)}
                    onSave={() => {
                      handleSaveWebsite();
                      setEditWebsite(false);
                    }}
                  />
                )}
              </>
            ) : (
              <DisplayValue
                value={shopData.website}
                onEdit={() => setEditWebsite(true)}
              />
            )}
          </ModernInputCard>

          <ModernInputCard title="Tagline">
            {!shopData.tagline || editTagline ? (
              <>
                <TextField
                  fullWidth
                  size="small"
                  value={shopData.tagline || ""}
                  onChange={(e) =>
                    setShopData({ ...shopData, tagline: e.target.value })
                  }
                />
                {editTagline && (
                  <ActionButtons
                    onCancel={() => setEditTagline(false)}
                    onSave={() => {
                      handleSaveTagline();
                      setEditTagline(false);
                    }}
                  />
                )}
              </>
            ) : (
              <DisplayValue
                value={shopData.tagline}
                onEdit={() => setEditTagline(true)}
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

        {/* FEEDBACK */}
        <SettingsCard title="Feedback">
          <FeedbackQRSection />
        </SettingsCard>

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

function DisplayValue({ value, onEdit }) {
  return (
    <Box display="flex" justifyContent="space-between">
      <Typography fontWeight={600}>{value}</Typography>
      <Button onClick={onEdit}>✏️</Button>
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
