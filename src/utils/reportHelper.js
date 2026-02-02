// utils/reportHelpers.js

// Orders Per Day (Bar Chart)
export const getOrdersPerDay = (bills) => {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Initialize counts
  const map = {};
  const dateMap = {}; // ✅ Store full date for tooltip

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

      // Store latest full date for tooltip
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
    tooltipDates: weekDays.map((day) => dateMap[day] || "No Data"),
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
