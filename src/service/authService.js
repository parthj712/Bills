import API from "./api";

export const forgetPassword = async (data) => {
  console.log("data", data);

  return await API.post("/auth/forget-password", data);
};

export const verifyForgotOtp = async (email, otp) => {
  return await API.post("/auth/verify-forgot-password-otp", {
    email,
    otp,
  });
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (email, newPassword) => {
  return await API.post("/auth/reset-password", {
    email,
    newPassword,
  });
};
