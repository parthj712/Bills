export const checkFeatureAccess = (shopCategory, feature) => {
  const accessMap = {
    BAR_INVENTORY: ["RESTO_&_BAR"],
    TABLE_MANAGEMENT: ["DINE_IN", "RESTO_&_BAR"],
    REPORTS: ["DINE_IN", "RESTO_&_BAR", "CAFE"],
  };

  return accessMap[feature]?.includes(shopCategory);
};
