"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import Loading from "@/app/_components/loading";
import Header from "@/app/_components/Header";
import Footer from "@/app/_components/Footer";
import {
  getDefaultPathByRole,
  isAdminAreaPath,
  isAllowedAdminPath,
  isAllowedDoctorPath,
  isDoctorAreaPath,
  isProtectedDashboardAreaPath,
} from "@/app/_utils/roleAccess";

function RoleAccessGate({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { user, isAuthenticated, initializing } = useAuth();

  const role = user?.role || "user";
  const inDoctorArea = isDoctorAreaPath(pathname);
  const inAdminArea = isAdminAreaPath(pathname);
  const inUserDashboardArea = isProtectedDashboardAreaPath(pathname);
  const inAuthArea = pathname === "/auth" || pathname.startsWith("/auth/");

  const shouldShowPublicChrome =
    !inDoctorArea && !inAdminArea && role === "user";

  const shouldWaitForGuard =
    initializing && (inDoctorArea || inAdminArea || inUserDashboardArea);

  const shouldRedirectToLogin =
    !initializing &&
    !isAuthenticated &&
    (inDoctorArea || inAdminArea || inUserDashboardArea);

  const shouldRedirectToRoleHome =
    !initializing &&
    isAuthenticated &&
    ((role === "doctor" && !inDoctorArea) ||
      (role === "admin" && !inAdminArea) ||
      (role === "user" && (inDoctorArea || inAdminArea || inAuthArea)));

  const shouldRedirectToAllowedSubPath =
    !initializing &&
    isAuthenticated &&
    ((role === "doctor" && inDoctorArea && !isAllowedDoctorPath(pathname)) ||
      (role === "admin" && inAdminArea && !isAllowedAdminPath(pathname)));

  React.useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace("/auth/login");
      return;
    }

    if (shouldRedirectToRoleHome) {
      router.replace(getDefaultPathByRole(role));
      return;
    }

    if (shouldRedirectToAllowedSubPath) {
      router.replace(getDefaultPathByRole(role));
    }
  }, [
    role,
    router,
    shouldRedirectToAllowedSubPath,
    shouldRedirectToLogin,
    shouldRedirectToRoleHome,
  ]);

  if (
    shouldWaitForGuard ||
    shouldRedirectToLogin ||
    shouldRedirectToRoleHome ||
    shouldRedirectToAllowedSubPath
  ) {
    return <Loading />;
  }

  return (
    <>
      {shouldShowPublicChrome ? <Header /> : null}
      {children}
      {shouldShowPublicChrome ? <Footer /> : null}
    </>
  );
}

export default RoleAccessGate;
