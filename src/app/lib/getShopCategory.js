import { getShopInfo } from "@/service/shopService";

export async function getShopCategory() {
  const res = await getShopInfo();

  return res?.data?.data?.businessCategory;
}
