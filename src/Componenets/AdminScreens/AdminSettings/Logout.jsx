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
        const res = await getSubscriptionExpiry();
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
      console.error(error);
      localStorage.removeItem("token");
      showSnackbar("Logged out locally", "warning");
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
    showSnackbar("FSSAI Saved ✅");
    setEditFssai(false);
  };

  const handleSaveWebsite = async () => {
    await addWebsite({ website: shopData.website });
    showSnackbar("Website Updated ✅");
    setEditWebsite(false);
  };

  const handleSaveTagline = async () => {
    await addTagline({ tagline: shopData.tagline });
    showSnackbar("Tagline Updated ✅");
    setEditTagline(false);
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
        width: "100%",
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

      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        maxWidth={900}
        mx="auto"
        width="100%"
      >
        {/* BUSINESS */}
        <SettingsCard title="Business Info">
          <InfoRow label="Business Name" value={shopData.shopName} />
          <InfoRow label="Phone" value={shopData.phone} />
          <InfoRow label="Email" value={shopData.email} />
          <InfoRow label="Address" value={shopData.address} multiline />

          <EditableField
            title="GST"
            value={shopData.gstNumber}
            edit={editGST}
            setEdit={setEditGST}
            onSave={handleSaveGST}
            onDelete={handleRemoveGST}
            field="gstNumber"
            shopData={shopData}
            setShopData={setShopData}
          />

          <EditableField
            title="FSSAI"
            value={shopData.fssaiNumber}
            edit={editFssai}
            setEdit={setEditFssai}
            onSave={handleSaveFssai}
            onDelete={handleRemoveFssai}
            field="fssaiNumber"
            shopData={shopData}
            setShopData={setShopData}
          />

          {isBar && (
            <EditableField
              title="VAT"
              value={shopData.vatNumber}
              edit={editVAT}
              setEdit={setEditVAT}
              onSave={handleSaveVat}
              onDelete={handleRemoveVAT}
              field="vatNumber"
              shopData={shopData}
              setShopData={setShopData}
            />
          )}
        </SettingsCard>

        {/* BRANDING */}
        <SettingsCard title="Branding">
          <EditableField
            title="Website"
            value={shopData.website}
            edit={editWebsite}
            setEdit={setEditWebsite}
            onSave={handleSaveWebsite}
            onDelete={handleRemoveWebsite}
            field="website"
            shopData={shopData}
            setShopData={setShopData}
          />

          <EditableField
            title="Tagline"
            value={shopData.tagline}
            edit={editTagline}
            setEdit={setEditTagline}
            onSave={handleSaveTagline}
            onDelete={handleRemoveTagline}
            field="tagline"
            shopData={shopData}
            setShopData={setShopData}
          />

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
          <SettingsCard title="Feedback">
            <FeedbackQRSection />
          </SettingsCard>
        )}

        {/* SUBSCRIPTION */}
        {subscription && (
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
              border: "1px solid #e2e8f0",
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={1}
              mb={2}
            >
              <Typography fontWeight={700}>Subscription</Typography>

              <Typography fontWeight={600}>{subscription.status}</Typography>
            </Box>

            <Typography color="text.secondary">Current Plan</Typography>

            <Typography fontWeight={700} mb={2}>
              {subscription.planType}
            </Typography>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              mb={1}
            >
              <Typography color="text.secondary">Days Remaining</Typography>

              <Typography fontWeight={600}>
                {subscription.daysLeft} days
              </Typography>
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
            >
              <Typography color="text.secondary">Expires On</Typography>

              <Typography fontWeight={600}>
                {new Date(subscription.expiresAt).toLocaleDateString()}
              </Typography>
            </Box>
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

/* ---------------- COMPONENTS ---------------- */

function SettingsCard({ title, children }) {
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        width: "100%",
      }}
    >
      <Typography fontWeight={700} mb={2}>
        {title}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Paper>
  );
}

function EditableField({
  title,
  value,
  edit,
  setEdit,
  onSave,
  onDelete,
  field,
  shopData,
  setShopData,
}) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: "1px solid #e2e8f0",
        borderRadius: 3,
      }}
    >
      <Typography fontSize={13} fontWeight={600} mb={1}>
        {title}
      </Typography>

      {edit ? (
        <>
          <TextField
            fullWidth
            size="small"
            value={value || ""}
            onChange={(e) =>
              setShopData({
                ...shopData,
                [field]: e.target.value,
              })
            }
          />

          <ActionButtons onCancel={() => setEdit(false)} onSave={onSave} />
        </>
      ) : (
        <DisplayValue
          value={value}
          onEdit={() => setEdit(true)}
          onDelete={onDelete}
        />
      )}
    </Box>
  );
}

function DisplayValue({ value, onEdit, onDelete }) {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={1}
    >
      <Typography
        fontWeight={600}
        sx={{
          wordBreak: "break-word",
        }}
      >
        {value || "— Not Added —"}
      </Typography>

      <Box display="flex" gap={1}>
        <Button size="small" onClick={onEdit}>
          ✏️
        </Button>

        {value && (
          <Button size="small" onClick={onDelete}>
            🗑️
          </Button>
        )}
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
        width: "100%",
      }}
    >
      <Typography fontWeight={600}>{title}</Typography>

      {loading ? (
        <Box mt={2}>
          <CircularProgress size={24} />
        </Box>
      ) : preview ? (
        <Box position="relative" mt={2} display="flex" justifyContent="center">
          <img
            src={preview}
            alt={title}
            style={{
              maxWidth: "100%",
              height: "80px",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />

          <Button
            onClick={onRemove}
            sx={{
              position: "absolute",
              top: -10,
              right: 0,
              minWidth: "unset",
            }}
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
