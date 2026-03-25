import { useState } from "react";

export const useRefreshData = (showSnackbar) => {
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async (functions = [], message = "Refreshed") => {
    try {
      setRefreshing(true);

      await Promise.all(functions.map((fn) => fn()));

      showSnackbar(message, "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Refresh failed", "error");
    } finally {
      setRefreshing(false);
    }
  };

  return { refresh, refreshing };
};
