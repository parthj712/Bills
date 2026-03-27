"use client";

import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import AppButton from "../CommonComponents/AppButton";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "@/service/api";
import RealStepper from "./RealStepper";
import OtpBoxes from "../CommonComponents/OTPBoxes";

//toast notification
import { useAppSnackbar } from "../CommonComponents/SnackbarProvider/SnackbarProvider";

const MotionDiv = motion.div;
const businessCategories = [
  { value: "DINE_IN", label: "Restaurant (Dine-In)" },
  { value: "RESTO_BAR", label: "Restaurant (Resto & Bar)" },
  { value: "QUICK_SERVICE", label: "Fast Food / Snack Center" },
  { value: "CAFE", label: "Cafe / Coffee Shop" },
  { value: "RETAIL", label: "Retail Store / Kirana" },
  { value: "CLOUD_KITCHEN", label: "Cloud Kitchen" },
  { value: "BAKERY", label: "Bakery" },
];
export default function RegisterScreen() {
  const { showSnackbar } = useAppSnackbar();

  const router = useRouter();
  const theme = useTheme();

  // ✅ Stepper Statee
  // 0 = Basic Info, 1 = OTP, 2 = Business Setup
  const [step, setStep] = useState(0);

  // ✅ Form Fields
  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    phone: "",
    gstNumber: "",
    vatNumber: "",
    address: "",
    password: "",
    businessCategory: "",
  });

  // ✅ OTP States
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);

  // ✅ UI States
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // -------------------------------
  // ✅ Input Handler
  // -------------------------------
  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  // -------------------------------
  // ✅ Validation
  // -------------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.ownerName.trim()) newErrors.ownerName = "Full name required";
    if (!form.shopName.trim()) newErrors.shopName = "Business name required";
    if (!/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter valid email";
    if (form.password.length < 6)
      newErrors.password = "Min 6 characters required";
    if (!form.address.trim()) newErrors.address = "Address required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // ✅ Send OTP
  // -------------------------------
  const sendOtp = useCallback(async () => {
    if (!form.email) {
      showSnackbar("Please enter your email address first", "warning");
      return;
    }

    setOtpLoading(true);

    setOtpSent(true);
    // setResendTimer(30);

    try {
      await API.post("/auth/send-otp", { email: form.email });

      setOtpSent(true);
      setResendTimer(30);
      setStep(1);

      setOtpDialogOpen(true); // 👈 OPEN DIALOG

      showSnackbar(
        resendTimer > 0 ? "OTP resent successfully" : "OTP sent to your email",
        "success",
      );
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to send OTP. Try again",
        "error",
      );
    } finally {
      setOtpLoading(false);
    }
  }, [form.email]);

  // -------------------------------
  // ✅ Verify OTP
  // -------------------------------
  const verifyOtp = async () => {
    if (!otp) {
      showSnackbar("Please enter the OTP", "warning");
      return;
    }

    setOtpLoading(true);

    try {
      await API.post("/auth/verify-otp", {
        email: form.email,
        otp,
      });

      setOtpVerified(true);
      setStep(2);

      showSnackbar("Email verified successfully", "success");
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Invalid OTP", "warning");
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------------------
  // ✅ Register
  // -------------------------------
  const handleRegister = async () => {
    if (!validate()) {
      showSnackbar("Please fix the highlighted errors", "warning");
      return;
    }

    if (!otpVerified) {
      showSnackbar(
        "Please verify your email before creating an account",
        "warning",
      );
      return;
    }

    setLoading(true);
    console.log("form", form);
    try {
      await API.post("/auth/register", form);
      showSnackbar("Account created successfully! Please login", "success");
      setTimeout(() => {
        router.push("/login");
      }, 800);

      router.push("/login");
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Registration failed. Please try again ",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // ✅ Reset OTP if Email Changes
  // -------------------------------
  useEffect(() => {
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setResendTimer(0);
  }, [form.email]);

  // -------------------------------
  // ✅ Resend Timer Countdown
  // -------------------------------
  useEffect(() => {
    if (resendTimer === 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (!otpDialogOpen) return;

    const timer = setTimeout(() => {
      setOtpDialogOpen(false);
    }, 2500); // ⏱️ 2.5 seconds

    return () => clearTimeout(timer);
  }, [otpDialogOpen]);

  const Stepper = ({ step }) => {
    const steps = ["Basic Info", "OTP", "Setup"];

    return (
      <Box className="flex items-center justify-between mb-8">
        {steps.map((label, index) => (
          <Box
            key={label}
            className="flex-1 flex flex-col items-center relative"
          >
            {/* Connector line */}
            {index !== 0 && (
              <Box
                className={`absolute top-[7px] left-[-50%] w-full h-[2px]
                ${step >= index ? "bg-blue-600" : "bg-gray-300"}
              `}
              />
            )}

            {/* Circle */}
            <Box
              className={`
              w-4 h-4 rounded-full z-10 transition-all
              ${step >= index ? "bg-blue-600" : "bg-gray-300"}
            `}
            />

            {/* Label */}
            <Typography
              mt={1}
              fontSize={12}
              fontWeight={step === index ? 700 : 400}
              color={step >= index ? "black" : "gray"}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  // const OtpBoxes = ({ otp, setOtp }) => {
  //   const inputsRef = useRef([]);

  //   const handleChange = (value, index) => {
  //     if (!/^\d?$/.test(value)) return;

  //     const otpArr = otp.padEnd(6, "").split("");
  //     otpArr[index] = value;
  //     const newOtp = otpArr.join("");
  //     setOtp(newOtp);

  //     // 👉 move forward
  //     if (value && index < 5) {
  //       inputsRef.current[index + 1]?.focus();
  //     }

  //     // ✅ auto-submit (safe)
  //     if (newOtp.length === 6 && !newOtp.includes("") && onComplete) {
  //       onComplete(newOtp);
  //     }
  //   };

  //   const handleKeyDown = (e, index) => {
  //     if (e.key === "Backspace" && !otp[index] && index > 0) {
  //       inputsRef.current[index - 1]?.focus();
  //     }
  //   };

  //   return (
  //     <Box display="flex" gap={2} justifyContent="center">
  //       {[...Array(6)].map((_, i) => (
  //         <TextField
  //           key={i}
  //           value={otp.padEnd(6, "")[i]}
  //           inputRef={(el) => (inputsRef.current[i] = el)}
  //           onChange={(e) => handleChange(e.target.value, i)}
  //           onKeyDown={(e) => handleKeyDown(e, i)}
  //           inputProps={{
  //             maxLength: 1,
  //             inputMode: "numeric",
  //             pattern: "[0-9]*",
  //             style: {
  //               textAlign: "center",
  //               fontSize: 18,
  //             },
  //           }}
  //           sx={{ width: 48 }}
  //         />
  //       ))}
  //     </Box>
  //   );
  // };

  // const StepWrapper = ({ children, step }) => (
  //   <motion.div
  //     key={step}
  //     initial={{ x: 50, opacity: 0 }}
  //     animate={{ x: 0, opacity: 1 }}
  //     exit={{ x: -50, opacity: 0 }}
  //     transition={{ duration: 0.35, ease: "easeOut" }}
  //   >
  //     {children}
  //   </motion.div>
  // );

  return (
    <Box
      className="min-h-screen w-full flex items-center justify-center"
      sx={{ backgroundColor: "#f8fafc" }}
    >
      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
        w-full max-w-2xl
        bg-white
        border border-gray-200
        rounded-2xl
        shadow-xl
        px-10 py-10
      "
      >
        {/* Title */}
        <Box textAlign="center" mb={4}>
          <Typography fontSize={22} fontWeight={600} color="#0f172a">
            Begin Your Smart Business Journey 🚀
          </Typography>

          <Typography fontSize={14} color="#64748b" mt={1}>
            Create your account in a few simple steps
          </Typography>
        </Box>

        {/* Stepper */}
        <Box mb={5}>
          <RealStepper step={step} />
        </Box>

        <AnimatePresence mode="wait">
          {/* STEP 0 */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Full Name"
                  value={form.ownerName}
                  onChange={handleChange("ownerName")}
                  error={!!errors.ownerName}
                  helperText={errors.ownerName}
                />

                <TextField
                  label="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={otpVerified}
                />

                <TextField
                  label="Phone Number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  disabled={otpVerified}
                />

                <Box display="flex" justifyContent="space-between" gap={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => router.push("/")}
                    sx={{ color: "#64748b" }}
                  >
                    ← Back
                  </Button>

                  <AppButton
                    label={otpLoading ? "Sending OTP..." : "Send OTP"}
                    onClick={sendOtp}
                    disabled={otpLoading}
                    className="
                    !bg-[#4f46e5]
                    hover:!bg-[#4338ca]
                    !text-white
                    px-8
                    !rounded-md
                  "
                  />
                </Box>
              </Box>
            </motion.div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                fontSize={15}
                textAlign="center"
                color="#0f172a"
                mb={3}
              >
                Enter the 6-digit OTP sent to your email
              </Typography>

              <Box display="flex" flexDirection="column" gap={3}>
                <OtpBoxes
                  otp={otp}
                  setOtp={setOtp}
                  onComplete={() => verifyOtp()}
                />

                <Box display="flex" justifyContent="space-between" gap={4}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setStep(0)}
                    sx={{ color: "#64748b" }}
                  >
                    Back
                  </Button>

                  <AppButton
                    label={otpLoading ? "Verifying..." : "Verify OTP"}
                    onClick={verifyOtp}
                    className="
                    !bg-[#4f46e5]
                    hover:!bg-[#4338ca]
                    !text-white
                    px-8
                    !rounded-md
                  "
                  />
                </Box>

                {resendTimer > 0 ? (
                  <Typography align="center" color="#64748b">
                    Resend OTP in {resendTimer}s
                  </Typography>
                ) : (
                  <Button onClick={sendOtp} sx={{ color: "#4f46e5" }}>
                    Resend OTP
                  </Button>
                )}
              </Box>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                color="green"
                fontWeight={600}
                textAlign="center"
                mb={3}
              >
                ✅ Email Verified
              </Typography>

              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Business Name"
                  value={form.shopName}
                  onChange={handleChange("shopName")}
                  error={!!errors.shopName}
                  helperText={errors.shopName}
                />

                <FormControl fullWidth>
                  <InputLabel>Business Type</InputLabel>
                  <Select
                    value={form.businessCategory}
                    label="Business Type"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        businessCategory: e.target.value,
                      })
                    }
                  >
                    {businessCategories.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="GST Number"
                  value={form.gstNumber}
                  onChange={handleChange("gstNumber")}
                />

                {form.businessCategory === "RESTO_BAR" && (
                  <TextField
                    label="VAT Number"
                    value={form.vatNumber}
                    onChange={handleChange("vatNumber")}
                  />
                )}

                <TextField
                  label="Address"
                  multiline
                  rows={2}
                  value={form.address}
                  onChange={handleChange("address")}
                  error={!!errors.address}
                  helperText={errors.address}
                />

                <TextField
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={errors.password}
                />

                <Box display="flex" justifyContent="space-between" mt={3}>
                  <Button onClick={() => setStep(1)} sx={{ color: "#64748b" }}>
                    Back
                  </Button>

                  <AppButton
                    label={loading ? "Creating Account..." : "Create Account"}
                    onClick={handleRegister}
                    disabled={loading}
                    className="
                    !bg-[#4f46e5]
                    hover:!bg-[#4338ca]
                    !text-white
                    px-8
                    !rounded-md
                  "
                  />
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionDiv>
    </Box>
  );
}
