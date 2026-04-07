"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "@/app/_context/LanguageContext";
import { getUnreadNotificationCount } from "@/app/_utils/Api";
import MobileMenu from "./MobileMenu";
import PremiumNavbar from "./premium-home/PremiumNavbar";

const getDashboardPathByRole = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "doctor") return "/doctor/dashboard";
  return "/dashboard";
};

const getDashboardLabelByRole = (role, t) => {
  if (role === "admin") return t("nav.admin");
  if (role === "doctor") return t("nav.doctorPanel");
  return t("nav.dashboard");
};

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const roleDashboardPath = getDashboardPathByRole(user?.role);
  const roleDashboardLabel = getDashboardLabelByRole(user?.role, t);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    let active = true;

    const fetchCount = async () => {
      const count = await getUnreadNotificationCount();
      if (active) {
        setUnreadCount(count);
      }
    };

    fetchCount();
    const intervalId = window.setInterval(fetchCount, 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const menuItems = [
    { id: 1, name: t("nav.categories"), path: "/categories" },
    { id: 2, name: t("nav.doctors"), path: "/doctors" },
    { id: 3, name: t("nav.about"), path: "/about" },
    { id: 4, name: t("nav.contactUs"), path: "/contact-us" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          background:
            "color-mix(in srgb, var(--color-bg-primary) 95%, transparent)",
          borderColor: "var(--color-border)",
          boxShadow: scrolled ? "var(--shadow-md)" : "var(--shadow-sm)",
        }}
      >
        <PremiumNavbar
          menuItems={menuItems}
          pathname={pathname}
          isAuthenticated={isAuthenticated}
          user={user}
          unreadCount={unreadCount}
          roleDashboardPath={roleDashboardPath}
          roleDashboardLabel={roleDashboardLabel}
          isRTL={isRTL}
          t={t}
          onLogout={() => {
            logout();
            router.push("/");
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
      </header>

      <MobileMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
        pathname={pathname}
        dashboardPath={roleDashboardPath}
        dashboardLabel={roleDashboardLabel}
      />
    </>
  );
}

export default Navbar;
