"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import Loading from "@/app/_components/loading";

export default function DoctorPage() {
  const router = useRouter();
  const { initializing } = useAuth();

  React.useEffect(() => {
    if (!initializing) {
      router.replace("/doctor/dashboard");
    }
  }, [initializing, router]);

  return <Loading />;
}
