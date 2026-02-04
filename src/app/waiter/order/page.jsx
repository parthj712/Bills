export const dynamic = "force-dynamic";

import WaiterMenuForm from "@/Componenets/WaiterScreens/WaiterMenuForm/WaiterMenuForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading order...</div>}>
      <WaiterMenuForm />
    </Suspense>
  );
}
