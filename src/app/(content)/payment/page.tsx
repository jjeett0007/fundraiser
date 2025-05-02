"use client";

import React, { Suspense } from "react";
import PaymentPageComponent from "./payment-component/index-comp";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment...</div>}>
      <PaymentPageComponent />
    </Suspense>
  );
}
