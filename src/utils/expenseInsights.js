export const generateLocalExpenseInsights = (expenses) => {
  if (!expenses.length) return [];

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const categoryMap = {};
  const paymentMap = {};

  expenses.forEach((e) => {
    const cat = e.categoryId?.name || "Other";
    categoryMap[cat] = (categoryMap[cat] || 0) + e.amount;

    const pay = e.paymentMode || "Unknown";
    paymentMap[pay] = (paymentMap[pay] || 0) + e.amount;
  });
  const insights = [];

  //High category spending
  Object.entries(categoryMap).forEach(([cat, amt]) => {
    const percent = (amt / total) * 100;
    if (percent > 40) {
      insights.push(`⚠️ High spending on ${cat} (${percent.toFixed(1)}%)`);
    }
  });
  // 🔹 Payment pattern
  if (paymentMap["online"] > total * 0.5) {
    insights.push("💳 More than 50% expenses via online payments");
  }

  // 🔹 Daily spike detection
  const today = new Date().toDateString();
  const todayExpense = expenses
    .filter((e) => new Date(e.date).toDateString() === today)
    .reduce((sum, e) => sum + e.amount, 0);

  if (todayExpense > total * 0.3) {
    insights.push("📈 High spending detected today");
  }

  return insights;
};
