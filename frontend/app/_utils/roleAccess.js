export const getDefaultPathByRole = (role) => {
    if (role === "doctor") return "/doctor/dashboard";
    if (role === "admin") return "/admin/dashboard";
    return "/dashboard";
};

export const isDoctorAreaPath = (pathname = "") =>
    pathname === "/doctor" || pathname.startsWith("/doctor/");

export const isAdminAreaPath = (pathname = "") =>
    pathname === "/admin" || pathname.startsWith("/admin/");

export const isProtectedDashboardAreaPath = (pathname = "") =>
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

const startsWithAny = (pathname, prefixes) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export const isAllowedDoctorPath = (pathname = "") => {
    const allowed = [
        "/doctor",
        "/doctor/dashboard",
        "/doctor/schedule",
        "/doctor/bookings",
        "/doctor/profile",
        "/doctor/notifications",
    ];

    return startsWithAny(pathname, allowed);
};

export const isAllowedAdminPath = (pathname = "") => {
    const allowed = [
        "/admin",
        "/admin/dashboard",
        "/admin/doctors",
        "/admin/users",
        "/admin/bookings",
        "/admin/reports",
    ];

    return startsWithAny(pathname, allowed);
};
