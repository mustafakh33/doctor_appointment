"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/_components/loading";
import { useAuth } from "@/app/_context/AuthContext";
import { getDefaultPathByRole } from "@/app/_utils/roleAccess";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { initializing, isAuthenticated, user } = useAuth();

  const hasRoleRestriction =
    Array.isArray(allowedRoles) && allowedRoles.length > 0;
  const isAllowedRole =
    !hasRoleRestriction || allowedRoles.includes(user?.role);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (!initializing && isAuthenticated && !isAllowedRole) {
      router.replace(getDefaultPathByRole(user?.role));
    }
  }, [initializing, isAuthenticated, isAllowedRole, router, user?.role]);

  if (initializing || !isAuthenticated || !isAllowedRole) {
    return <Loading />;
  }

  return children;
}

export default ProtectedRoute;
