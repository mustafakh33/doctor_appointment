"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "@/app/_context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

function MobileMenu({
  open,
  onClose,
  menuItems,
  pathname,
  dashboardPath = "/dashboard",
  dashboardLabel,
}) {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  // Removed unused Image import

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!open}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <aside
        onClick={(event) => event.stopPropagation()}
        className={`absolute top-0 h-full w-[280px] shadow-2xl transition-transform duration-300 ease-out ${isRTL ? "left-0" : "right-0"} ${open ? "translate-x-0" : isRTL ? "-translate-x-full" : "translate-x-full"}`}
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={onClose}
            >
              <span
                className="font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {t("brand.name")}
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
              aria-label={t("common.close")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`block rounded-xl border-b px-4 py-3 text-lg transition-colors ${isActive ? "font-semibold" : "hover:opacity-85"}`}
                  style={{
                    borderColor: "var(--color-border)",
                    background: isActive
                      ? "var(--color-primary-50)"
                      : "transparent",
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-text-primary)",
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div
            className="mt-6 space-y-3 border-t pt-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardPath}
                  onClick={onClose}
                  className="block text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {dashboardLabel || t("nav.dashboard")}
                </Link>
                {user?.role === "doctor" && dashboardPath !== "/doctor" && (
                  <Link
                    href="/doctor"
                    onClick={onClose}
                    className="block text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("nav.doctorPanel")}
                  </Link>
                )}
                {user?.role === "admin" && dashboardPath !== "/admin" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="block text-sm"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("nav.admin")}
                  </Link>
                )}
                <Link
                  href="/dashboard?tab=bookings"
                  onClick={onClose}
                  className="block text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("nav.myBooking")}
                </Link>
                <Link
                  href="/dashboard?tab=profile"
                  onClick={onClose}
                  className="block text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {user?.name || t("nav.profile")}
                </Link>
                <Button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  variant="outline"
                  className="w-full rounded-full"
                >
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" onClick={onClose}>
                  <Button variant="outline" className="w-full rounded-full">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={onClose}>
                  <Button
                    className="w-full rounded-full text-white"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {t("nav.register")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default MobileMenu;
