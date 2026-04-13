"use client";
import { QRCodeCanvas } from "qrcode.react";
import {
  generateFeedbackLink,
  getFeedbackLink,
  removeFeedbackSlug,
} from "@/service/shopService";
import { useEffect, useState } from "react";
import { useAppSnackbar } from "@/Componenets/CommonComponents/SnackbarProvider/SnackbarProvider";
import { Box, Button, Typography } from "@mui/material";

const FeedbackQRSection = () => {
  const [feedbackUrl, setFeedbackUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useAppSnackbar();

  useEffect(() => {
    fetchExistingLink();
  }, []);

  const fetchExistingLink = async () => {
    try {
      const res = await getFeedbackLink();

      setFeedbackUrl(res.data.feedbackUrl);
    } catch (err) {
      // ignore if not generated yet
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);

      // optional: remove old first (clean regenerate)
      if (feedbackUrl) {
        await removeFeedbackSlug();
      }

      const res = await generateFeedbackLink();

      setFeedbackUrl(res.data.feedbackUrl);
      showSnackbar("Feedback link generated ✅");
    } catch (err) {
      console.log(err.message);
      showSnackbar("Failed to generate link ❌");
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = async () => {
    if (!confirm("Remove feedback link?")) return;

    try {
      await removeFeedbackSlug();
      setFeedbackUrl("");
      showSnackbar("Feedback link removed 🗑️");
    } catch (err) {
      showSnackbar("Failed to remove ❌");
    }
  };
  return (
    <Box>
      {!feedbackUrl ? (
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {loading ? "Generating..." : "Generate Feedback Link"}
        </Button>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 3,
            p: 2,
            border: "1px solid #e2e8f0",
            borderRadius: 3,
          }}
        >
          {/* LEFT - QR */}
          <Box textAlign="center">
            <QRCodeCanvas value={feedbackUrl} size={140} />
            <Typography fontSize={12} mt={1} color="gray">
              Scan to give feedback
            </Typography>
          </Box>

          {/* RIGHT - CONTENT */}
          <Box flex={1}>
            {/* URL */}
            <Typography
              sx={{
                fontSize: 14,
                wordBreak: "break-all",
                mb: 2,
                color: "#334155",
              }}
            >
              {feedbackUrl}
            </Typography>

            {/* ACTION BUTTONS */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                size="small"
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(feedbackUrl);
                  showSnackbar("Copied to clipboard 📋");
                }}
              >
                Copy
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={handleGenerate}
                disabled={loading}
              >
                Regenerate
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackQRSection;
