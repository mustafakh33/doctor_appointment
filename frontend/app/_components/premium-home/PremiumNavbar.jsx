"use client";

import Link from "next/link";
import { Bell, Globe, Menu, Moon, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";

const navItems = [
  { label: "Find Doctors", href: "/doctors", active: true },
  { label: "Departments", href: "/categories" },
  { label: "Telehealth", href: "/explore" },
  { label: "About Us", href: "/about" },
];

function PremiumNavbar({
  menuItems,
  pathname = "/",
  isAuthenticated = false,
  user,
  unreadCount = 0,
  roleDashboardPath = "/dashboard",
  roleDashboardLabel = "Profile",
  isRTL = false,
  t,
  onLogout,
  onOpenMobileMenu,
}) {
  const getText = (key, fallback) => {
    if (typeof t !== "function") {
      return fallback;
    }

    const translated = t(key);
    return translated || fallback;
  };

  const getLabel = (key, fallback) => getText(key, fallback);
  const usingAppLogic = Array.isArray(menuItems) && menuItems.length > 0;
  const links = usingAppLogic
    ? menuItems.map((item) => ({
        label: item.name,
        href: item.path,
        active: pathname === item.path || pathname.startsWith(item.path + "/"),
      }))
    : navItems.map((item) => ({
        ...item,
        label:
          item.href === "/doctors"
            ? getLabel("nav.doctors", item.label)
            : item.href === "/categories"
              ? getLabel("premiumHome.departments.title", item.label)
              : item.href === "/explore"
                ? getLabel("explore.title", item.label)
                : item.href === "/about"
                  ? getLabel("nav.about", item.label)
                  : item.label,
      }));

  return (
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-20 md:py-6">
      <Link
        href="/"
        className="text-2xl font-extrabold tracking-[-0.02em] md:text-[30px]"
        style={{
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-manrope), var(--font-inter), sans-serif",
        }}
      >
        {getText("brand.name", "Shifaa")}
      </Link>

      <nav className="hidden items-center gap-5 md:flex">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative text-sm transition-opacity hover:opacity-85"
            style={{
              color: item.active
                ? "var(--color-primary)"
                : "var(--color-text-secondary)",
              fontWeight: item.active ? 600 : 500,
            }}
          >
            {item.label}
            {item.active ? (
              <span
                className="absolute -bottom-2 left-0 h-px w-full"
                style={{ background: "var(--color-primary)" }}
              />
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1.5 md:gap-2">
        {usingAppLogic && onOpenMobileMenu ? (
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full md:hidden"
            style={{ color: "var(--color-text-primary)" }}
            onClick={onOpenMobileMenu}
            aria-label={getText("header.openMenu", "Open menu")}
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}

        {usingAppLogic ? (
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard?tab=notifications"
                  className="relative inline-flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    background: "var(--color-surface-2)",
                    color: "var(--color-text-primary)",
                  }}
                  aria-label={getText("notifications.title", "Notifications")}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span
                      className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
                      style={{
                        background: "var(--color-error)",
                        color: "var(--color-text-inverse)",
                      }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>

                <Popover>
                  <PopoverTrigger>
                    <div
                      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-xs font-semibold"
                      style={{
                        background: "var(--color-primary-light)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {user?.profileImage?.url ? (
                        <img
                          src={user.profileImage.url}
                          alt={user?.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>
                          {(user?.name || "U").slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-52">
                    <ul>
                      <li>
                        <Link
                          href={roleDashboardPath}
                          className="block rounded-md px-3 py-2 text-sm"
                        >
                          {roleDashboardLabel}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard?tab=profile"
                          className="block rounded-md px-3 py-2 text-sm"
                        >
                          {getText("nav.profile", "Profile")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard?tab=bookings"
                          className="block rounded-md px-3 py-2 text-sm"
                        >
                          {getText("nav.myBooking", "My Booking")}
                        </Link>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={onLogout}
                          className={
                            "w-full rounded-md px-3 py-2 text-sm " +
                            (isRTL ? "text-right" : "text-left")
                          }
                        >
                          {getText("nav.logout", "Logout")}
                        </button>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="h-9 px-3 text-xs">
                    {getText("nav.login", "Login")}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="theme-btn-primary h-9 rounded-full px-4 text-xs font-semibold">
                    {getText("nav.register", "Register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {[Globe, Moon, Bell].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                style={{ color: "var(--color-text-primary)" }}
                aria-label="Header action"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}

            <button
              type="button"
              className="theme-btn-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            >
              <UserRound className="h-3.5 w-3.5" />
              Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PremiumNavbar;
