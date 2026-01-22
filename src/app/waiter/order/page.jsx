import WaiterMenuForm from "@/Componenets/WaiterScreens/WaiterMenuForm/WaiterMenuForm";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading order...</div>}>
        <WaiterMenuForm />
      </Suspense>
    </div>
  );
};

export default page;
