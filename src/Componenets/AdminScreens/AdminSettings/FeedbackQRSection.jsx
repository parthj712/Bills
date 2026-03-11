"use client";
import { QRCodeCanvas } from "qrcode.react";
import { generateFeedbackLink, getFeedbackLink } from "@/service/shopService";
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
        <>
          <Typography sx={{ mb: 2 }}>{feedbackUrl}</Typography>

          <QRCodeCanvas value={feedbackUrl} size={200} />

          <Box mt={2}>
            <Button
              variant="outlined"
              onClick={handleGenerate}
              sx={{ textTransform: "none" }}
            >
              Regenerate
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FeedbackQRSection;
