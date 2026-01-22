"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const Logout = () => {
  const router = useRouter();
  const handleLogout = () => {
    // clear auth
    localStorage.removeItem("token"); // or cookies
    router.push("/login");
  };
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );
};

export default Logout;
