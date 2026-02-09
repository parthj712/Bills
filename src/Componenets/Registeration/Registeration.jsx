"use client";

import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import AppButton from "../CommonComponents/AppButton";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import API from "@/service/api";
import RealStepper from "./RealStepper";
import OtpBoxes from "../CommonComponents/OTPBoxes";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { showToast } from "../ToastConstant/toast";

const MotionDiv = motion.div;

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Stepper State
  // 0 = Basic Info, 1 = OTP, 2 = Business Setup
  const [step, setStep] = useState(0);

  // ✅ Form Fields
  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    password: "",
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
    if (!form.gstNumber.trim()) newErrors.gstNumber = "GST Number required";
    if (!form.address.trim()) newErrors.address = "Address required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // ✅ Send OTP
  // -------------------------------
  const sendOtp = useCallback(async () => {
    if (!form.email) {
      showToast({
        type: "warning",
        message: "Please enter your email address first",
      });
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


      showToast({
        type: "success",
        message: resendTimer > 0
          ? "OTP resent successfully"
          : "OTP sent to your email",
      });
    } catch (err) {
      showToast({
        type: "error",
        message:
          err.response?.data?.message || "Failed to send OTP. Try again",
      });
    } finally {
      setOtpLoading(false);
    }
  }, [form.email]);

  // -------------------------------
  // ✅ Verify OTP
  // -------------------------------
  const verifyOtp = async () => {
    if (!otp) {
      showToast({
        type: "warning",
        message: "Please enter the OTP",
      });
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
      showToast({
        type: "success",
        message: "Email verified successfully",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // -------------------------------
  // ✅ Register
  // -------------------------------
  const handleRegister = async () => {
    if (!validate()) {
      showToast({
        type: "warning",
        message: "Please fix the highlighted errors",
      });
      return;
    }

    if (!otpVerified) {
      showToast({
        type: "warning",
        message: "Please verify your email before creating an account",
      });
      return;
    }

    setLoading(true);
    console.log("form", form);
    try {
      await API.post("/auth/register", form);
      showToast({
        type: "success",
        message: "Account created successfully! Please login",
      });
      setTimeout(() => {
        router.push("/login");
      }, 800);

      router.push("/login");
    } catch (err) {
      showToast({
        type: "error",
        message:
          err.response?.data?.message ||
          "Registration failed. Please try again",
      });
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
    <Box className="min-h-screen w-full flex bg-black">
      {/* LEFT IMAGE */}
      <motion.div className=" md:w-1/2 relative">
        <Image
          src="/LandingPage/Landing.avif"
          alt="Food"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* RIGHT FORM */}
      <MotionDiv className="w-full md:w-1/2 flex justify-center items-center bg-white">
        <Box className="w-full max-w-lg px-8 py-10 flex flex-col gap-4">
          {/* Title */}
          <Typography
            fontSize={20}
            fontWeight={700}
            textAlign="center"
            color="black"
          >
            Begin Your Smart Business Journey 🚀
          </Typography>

          <Dialog open={otpDialogOpen} maxWidth="xs" fullWidth>
            <DialogContent>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                py={3}
              >
                <Typography fontSize={26}>📩</Typography>

                <Typography fontSize={16} fontWeight={600} textAlign="center">
                  OTP Sent
                </Typography>

                <Typography fontSize={13} color="gray" textAlign="center">
                  We’ve sent a 6-digit verification code to
                  <br />
                  <strong>{form.email}</strong>
                </Typography>

                <Typography fontSize={12} color="gray">
                  Please check your inbox
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>

          {/* Stepper */}
          <RealStepper step={step} />

          <AnimatePresence mode="wait">
            {/* ---------------- STEP 0 : BASIC INFO ---------------- */}

            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <Box display={"flex"} flexDirection={"column"} gap={3}>
                  {/* Full Name */}
                  <TextField
                    label="Full Name"
                    value={form.ownerName}
                    onChange={handleChange("ownerName")}
                    error={!!errors.ownerName}
                    helperText={errors.ownerName}
                  />

                  {/* Email */}
                  <TextField
                    label="Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={otpVerified}
                  />

                  {/* Phone */}
                  <TextField
                    label="Phone Number"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    disabled={otpVerified}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />

                  <div className="flex items-center gap-6 mt-4">
                    <IconButton
                      onClick={() => router.push("/")}
                      sx={{
                        // position: "absolute",
                        // top: 24,
                        // left: isMobile ? 24 : 800,
                        color: "#111827",
                        background: "#F3F4F6",
                        "&:hover": { background: "#E5E7EB" },
                      }}
                    >

                      <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>


                    <AppButton
                      label={otpLoading ? "Sending OTP..." : "Send OTP"}
                      onClick={sendOtp}
                      disabled={otpLoading}
                      className="!bg-orange-500 hover:!bg-orange-600 !text-white px-10"
                    />
                  </div>
                </Box>
              </motion.div>
            )}

            {/* ---------------- STEP 1 : OTP VERIFICATION ---------------- */}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -80, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <Typography
                  fontSize={16}
                  textAlign="center"
                  color="black"
                  mb={2}
                >
                  Enter the 6-digit OTP sent to your email
                </Typography>

                <Box display="flex" flexDirection="column" gap={3}>
                  {/* ✅ OTP Boxes */}
                  <OtpBoxes
                    otp={otp}
                    setOtp={setOtp}
                    onComplete={() => verifyOtp()}
                  />

                  {/* ✅ Buttons */}
                  <Box display="flex" gap={2}>
                    <AppButton
                      label="← Back"
                      onClick={() => setStep(0)}
                      variant="text"
                      className="!text-gray-600 hover:!text-black"
                    />

                    <AppButton
                      label={otpLoading ? "Verifying..." : "Verify OTP"}
                      onClick={verifyOtp}
                      className="!bg-green-500"
                    />
                  </Box>

                  {/* ✅ Resend OTP Timer */}
                  {resendTimer > 0 ? (
                    <Typography align="center" color="gray">
                      Resend OTP in {resendTimer}s
                    </Typography>
                  ) : (
                    <AppButton
                      label="Resend OTP"
                      variant="text"
                      onClick={sendOtp}
                      className="!bg-orange-500 hover:!bg-orange-600 !text-white px-10"
                    />
                  )}
                </Box>
              </motion.div>
            )}

            {/* ---------------- STEP 2 : BUSINESS SETUP ---------------- */}

            {step === 2 && (
              <>
                <motion.div
                  key="step-2"
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -80, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <Typography color="green" fontWeight={600} textAlign="center">
                    ✅ Email Verified
                  </Typography>

                  <Box display={"flex"} flexDirection={"column"} gap={3}>
                    {/* Shop Name */}
                    <TextField
                      label="Business Name"
                      value={form.shopName}
                      onChange={handleChange("shopName")}
                      error={!!errors.shopName}
                      helperText={errors.shopName}
                    />

                    {/* GST Number */}
                    <TextField
                      label="GST Number"
                      value={form.gstNumber}
                      onChange={handleChange("gstNumber")}
                      error={!!errors.gstNumber}
                      helperText={errors.gstNumber}
                    />

                    {/* Address */}
                    <TextField
                      label="Address"
                      value={form.address}
                      onChange={handleChange("address")}
                      error={!!errors.address}
                      helperText={errors.address}
                      multiline
                      rows={2}
                    />

                    {/* Password */}
                    <TextField
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={handleChange("password")}
                      error={!!errors.password}
                      helperText={errors.password}
                    />

                    <Box display={"flex"} flexDirection={"row"}>
                      <Button
                        label="← Back"
                        onClick={() => setStep(step - 1)}
                        variant="text"
                        className="!text-gray-600 hover:!text-black"
                      />

                      {/* Register */}
                      <AppButton
                        label={
                          !otpVerified
                            ? "Verify Email to Continue"
                            : loading
                              ? "Creating Account..."
                              : "Create Account"
                        }
                        onClick={handleRegister}
                        disabled={loading || !otpVerified}
                        className={`
                                  ${otpVerified
                            ? "!bg-orange-500 hover:!bg-orange-600"
                            : "!bg-gray-300 cursor-not-allowed"}
                               !text-white px-10
                                  `}
                      />

                    </Box>
                  </Box>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* OTP Buttons
          {!otpSent ? (
            <AppButton
              label={otpLoading ? "Sending..." : "Send OTP"}
              onClick={sendOtp}
              disabled={otpLoading}
              className="!bg-blue-500"
            />
          ) : !otpVerified ? (
            <>


              <AppButton
                label={otpLoading ? "Verifying..." : "Verify OTP"}
                onClick={verifyOtp}
                className="!bg-green-500"
              />

              {resendTimer > 0 ? (
                <Typography align="center" color="gray">
                  Resend OTP in {resendTimer}s
                </Typography>
              ) : (
                <AppButton
                  label="Resend OTP"
                  variant="text"
                  onClick={sendOtp}
                  className="!text-blue-600"
                />
              )}
            </>
          ) : (
            <Typography color="green" fontWeight={600}>
              Email Verified ✅
            </Typography>
          )} */}
        </Box>
      </MotionDiv>
    </Box>
  );
}
