export const NOTIFICATIONS = {
    AUTH: {
        LOGIN_SUCCESS: {
            type: "success",
            message: "Login successful. Welcome back!",
        },
        LOGIN_FAILED: {
            type: "error",
            message: "Invalid email or password.",
        },
        LOGOUT_SUCCESS: {
            type: "success",
            message: "You have been logged out successfully.",
        },
        SESSION_EXPIRED: {
            type: "warning",
            message: "Session expired. Please login again.",
        },
    },

    DATA: {
        SAVE_SUCCESS: {
            type: "success",
            message: "Data saved successfully.",
        },
        SAVE_FAILED: {
            type: "error",
            message: "Failed to save data. Try again.",
        },
        UPDATE_SUCCESS: {
            type: "success",
            message: "Changes updated successfully.",
        },
        DELETE_SUCCESS: {
            type: "success",
            message: "Deleted successfully.",
        },
        DELETE_FAILED: {
            type: "error",
            message: "Failed to delete. Please try again.",
        },
    },

    NETWORK: {
        SERVER_ERROR: {
            type: "error",
            message: "Server error. Please try again later.",
        },
        NO_INTERNET: {
            type: "error",
            message: "No internet connection.",
        },
        TIMEOUT: {
            type: "warning",
            message: "Request timeout. Please retry.",
        },
    },

    SYSTEM: {
        SOMETHING_WENT_WRONG: {
            type: "error",
            message: "Something went wrong.",
        },
        UNSAVED_CHANGES: {
            type: "warning",
            message: "You have unsaved changes.",
        },
    },
};
