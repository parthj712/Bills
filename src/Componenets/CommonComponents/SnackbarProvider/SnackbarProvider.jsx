"use client";

import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext();

export const useAppSnackbar = () => useContext(SnackbarContext);

export default function SnackbarProvider({ children }) {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%", fontWeight: 500 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}
