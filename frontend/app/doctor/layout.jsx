"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  User,
  Bell,
  Menu,
  X,
} from "lucide-react";
import Loading from "@/app/_components/loading";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "@/app/_context/LanguageContext";
import LanguageSwitcher from "@/app/_components/LanguageSwitcher";
import ThemeToggle from "@/app/_components/ThemeToggle";
import { getDefaultPathByRole } from "@/app/_utils/roleAccess";

const links = [
  { key: "dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { key: "schedule", href: "/doctor/schedule", icon: Calendar },
  { key: "bookings", href: "/doctor/bookings", icon: BookOpen },
  { key: "profile", href: "/doctor/profile", icon: User },
  { key: "notifications", href: "/doctor/notifications", icon: Bell },
];

export default function DoctorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initializing, isAuthenticated, logout } = useAuth();
  const { t, isRTL } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const brandName = isRTL ? "شفاء" : "Shifaa";
  const preferencesLabel = isRTL ? "التفضيلات" : "Preferences";
  const doctorDisplayName =
    user?.name || (isRTL ? "طبيب شفاء" : "Shifaa Doctor");
  const roleDisplay =
    user?.role === "doctor" ? (isRTL ? "طبيب" : "Doctor") : user?.role;

  React.useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (!initializing && isAuthenticated && user?.role !== "doctor") {
      router.replace(getDefaultPathByRole(user?.role));
    }
  }, [initializing, isAuthenticated, router, user?.role]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (initializing || !isAuthenticated || user?.role !== "doctor") {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <>
      <style jsx global>{`
        header,
        footer {
          display: none !important;
        }
      `}</style>

      <div
        className="min-h-screen"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <button
          type="button"
          className="fixed top-20 z-40 rounded-lg p-2 text-white md:hidden"
          style={{
            background: "var(--color-bg-dark)",
            [isRTL ? "left" : "right"]: "1rem",
          }}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle doctor menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="mx-auto flex max-w-[1600px]">
          <aside
            className={`fixed top-0 z-30 h-screen w-[320px] overflow-hidden p-4 text-white transition-transform duration-300 md:translate-x-0 ${open ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}`}
            style={{
              background: "var(--color-bg-dark)",
              [isRTL ? "right" : "left"]: 0,
            }}
          >
            <div className="flex h-full flex-col">
              <div className="mb-8 mt-20 md:mt-4">
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/img/logo.png"
                    alt="Shifaa logo"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-sm object-contain"
                  />
                  <p className="text-xs uppercase tracking-widest text-slate-300">
                    {brandName}
                  </p>
                </div>
                <h2 className="mt-2 text-xl font-bold">
                  {t("doctorDashboard.title")}
                </h2>
              </div>

              <nav className="space-y-2">
                {links.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition"
                      style={{
                        background: active
                          ? "var(--color-primary)"
                          : "transparent",
                        color: "white",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {t(`doctorDashboard.sidebar.${item.key}`, item.key)}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 rounded-lg border border-white/20 p-3">
                <p className="text-xs uppercase tracking-widest text-slate-300">
                  {preferencesLabel}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-auto rounded-lg border border-white/20 p-3">
                <p className="text-sm font-semibold">{doctorDisplayName}</p>
                <span className="mt-2 inline-flex rounded-full bg-white/20 px-2 py-1 text-xs uppercase">
                  {roleDisplay}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-md border border-white/20 px-3 py-2 text-sm font-medium transition hover:bg-white/10"
                >
                  {t("doctorDashboard.sidebar.logout", "Logout")}
                </button>
              </div>
            </div>
          </aside>

          <main
            className={`w-full p-4 md:p-8 ${isRTL ? "md:mr-80" : "md:ml-80"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
