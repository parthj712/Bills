import { Box, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

const OtpBoxes = ({ otp, setOtp, onComplete }) => {
  const inputsRef = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // ✅ Auto Focus First Input When Component Loads
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // ✅ Handle OTP Digit Change
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    let otpArr = otp.split("");
    otpArr[index] = value;

    const newOtp = otpArr.join("");
    setOtp(newOtp);

    // ✅ Move Cursor Forward Automatically
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // ✅ Auto Submit When OTP Complete
    if (newOtp.length === 6 && !newOtp.includes("") && onComplete) {
      onComplete(newOtp);
    }
  };

  // ✅ Backspace Move Back
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  // ✅ Paste Full OTP Support
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pasteData)) return;

    setOtp(pasteData);

    // Focus Last Box
    inputsRef.current[pasteData.length - 1]?.focus();

    // Auto Complete
    if (pasteData.length === 6 && onComplete) {
      onComplete(pasteData);
    }
  };

  return (
    <Box display="flex" justifyContent="center" gap={2} onPaste={handlePaste}>
      {[...Array(6)].map((_, i) => (
        <TextField
          key={i}
          value={otp[i] || ""}
          inputRef={(el) => (inputsRef.current[i] = el)}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          inputProps={{
            maxLength: 1,
            inputMode: "numeric",
            style: {
              textAlign: "center",
              fontSize: isMobile ? 15 : 20,
              fontWeight: 700,
            },
          }}
          sx={{
            width: 55,
            "& input": {
              padding: isMobile ? "10px" : "14px",
            },
          }}
        />
      ))}
    </Box>
  );
};

export default OtpBoxes;
