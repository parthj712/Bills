// utils/reportHelpers.js

// Orders Per Day (Bar Chart)
export const getOrdersPerDay = (bills) => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const map = {};
  const dateMap = {};

  weekDays.forEach((day) => {
    map[day] = 0;
    dateMap[day] = null;
  });

  bills.forEach((bill) => {
    const billDate = new Date(bill.createdAt);

    const day = billDate.toLocaleDateString("en-IN", {
      weekday: "short",
    });

    if (map[day] !== undefined) {
      map[day] += 1;

      // ✅ Tooltip Date Format: 02 Feb 2026
      dateMap[day] = billDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  });

  return {
    labels: weekDays,
    values: weekDays.map((day) => map[day]),
    tooltipDates: weekDays.map((day) => dateMap[day] || "No Orders"),
  };
};

// Peak Hours (Line Chart)
export const getPeakHours = (bills) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Initialize with 0
  const map = {};
  hours.forEach((h) => (map[h] = 0));

  bills.forEach((bill) => {
    const hour = new Date(bill.createdAt).getHours();
    map[hour] += 1;
  });

  // Convert to Labels
  const labels = hours.map((hour) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  });

  return {
    labels,
    values: hours.map((h) => map[h]),
  };
};

// DineIn vs TakeAway (Donut)
export const getDineInTakeAway = (bills) => {
  const dineInTotal = bills
    .filter((b) => b.tableId)
    .reduce((sum, b) => sum + b.grandTotal, 0);

  const takeAwayTotal = bills
    .filter((b) => !b.tableId)
    .reduce((sum, b) => sum + b.grandTotal, 0);

  const totalRevenue = dineInTotal + takeAwayTotal;

  return {
    totalRevenue,
    data: [
      { label: "Dine In", value: dineInTotal },
      { label: "Take Away", value: takeAwayTotal },
    ],
  };
};

export const filterBillsByRange = (bills, range, customFrom, customTo) => {
  if (!bills?.length) return [];

  const now = new Date();

  return bills.filter((bill) => {
    const billDate = new Date(bill.createdAt);

    if (range === "today") {
      return billDate.toDateString() === now.toDateString();
    }

    if (range === "week") {
      const last7 = new Date();
      last7.setDate(now.getDate() - 7);
      return billDate >= last7;
    }

    if (range === "month") {
      const last30 = new Date();
      last30.setDate(now.getDate() - 30);
      return billDate >= last30;
    }

    // ✅ Custom Date Range
    if (range === "custom" && customFrom && customTo) {
      const from = new Date(customFrom);
      const to = new Date(customTo);

      // include full "to" day
      to.setHours(23, 59, 59, 999);

      return billDate >= from && billDate <= to;
    }

    return true;
  });
};
