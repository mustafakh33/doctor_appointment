import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import { useAuth } from "@/app/_context/AuthContext";
import {
    getMyAppointments,
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/app/_utils/Api";

const TAB_KEYS = ["overview", "profile", "bookings", "notifications"];

const normalizeTab = (value) => {
    const tab = String(value || "overview").toLowerCase();
    return TAB_KEYS.includes(tab) ? tab : "overview";
};

const formatDateOnly = (value, locale) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
};

export const useDashboardController = () => {
    const { t, locale, isRTL } = useLanguage();
    const { user, updateProfile, refreshProfile } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState("overview");
    const [bookingFilterTab, setBookingFilterTab] = useState("all");
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        phone: "",
        cityArea: "",
    });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [credentialFiles, setCredentialFiles] = useState([]);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profilePhotoSaving, setProfilePhotoSaving] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const quickPhotoInputRef = useRef(null);

    useEffect(() => {
        const tabFromQuery = normalizeTab(searchParams.get("tab"));
        setActiveTab(tabFromQuery);
    }, [searchParams]);

    useEffect(() => {
        if (!user) return;

        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            cityArea: isRTL
                ? user?.cityArea_ar || user?.cityArea || ""
                : user?.cityArea || user?.cityArea_ar || "",
        });
    }, [isRTL, user]);

    useEffect(() => {
        if (user?.role === "doctor") {
            router.replace("/doctor");
        }
    }, [router, user?.role]);

    const updateTabInUrl = useCallback(
        (nextTab) => {
            const normalized = normalizeTab(nextTab);
            const params = new URLSearchParams(searchParams.toString());

            if (normalized === "overview") {
                params.delete("tab");
            } else {
                params.set("tab", normalized);
            }

            const query = params.toString();
            router.replace(query ? `/dashboard?${query}` : "/dashboard");
            setActiveTab(normalized);
        },
        [router, searchParams],
    );

    const refreshData = useCallback(async () => {
        if (user?.role === "doctor") {
            setLoading(false);
            return;
        }

        setLoading(true);
        const [appointmentsData, notificationsData, unread] = await Promise.all([
            getMyAppointments(),
            getNotifications(),
            getUnreadNotificationCount(),
        ]);

        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        setUnreadCount(unread || 0);
        setLoading(false);
    }, [user?.role]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleMarkAsRead = async (notificationId) => {
        const updated = await markNotificationAsRead(notificationId);
        if (!updated) return;

        setNotifications((previous) =>
            previous.map((item) =>
                item.id === notificationId ? { ...item, isRead: true } : item,
            ),
        );
        setUnreadCount((previous) => Math.max(previous - 1, 0));
    };

    const handleMarkAllAsRead = async () => {
        const success = await markAllNotificationsAsRead();
        if (!success) return;

        setNotifications((previous) =>
            previous.map((item) => ({ ...item, isRead: true })),
        );
        setUnreadCount(0);
    };

    const upcomingAppointments = useMemo(() => {
        const now = new Date();
        return appointments
            .filter((item) => new Date(item.date) >= now && item.status !== "canceled")
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [appointments]);

    const canceledCount = useMemo(
        () => appointments.filter((item) => item.status === "canceled").length,
        [appointments],
    );

    const filteredBookings = useMemo(() => {
        const now = new Date();

        switch (bookingFilterTab) {
            case "upcoming":
                return appointments.filter(
                    (item) => new Date(item.date) >= now && item.status !== "canceled",
                );
            case "past":
                return appointments.filter(
                    (item) => new Date(item.date) < now && item.status !== "canceled",
                );
            case "canceled":
                return appointments.filter((item) => item.status === "canceled");
            default:
                return appointments;
        }
    }, [appointments, bookingFilterTab]);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setProfileSaving(true);

        try {
            const payload = new FormData();
            payload.append("name", profileForm.name || "");
            payload.append("phone", profileForm.phone || "");
            payload.append("cityArea", profileForm.cityArea || "");

            if (profileImageFile) {
                payload.append("profileImage", profileImageFile);
            }

            if (user?.role === "doctor") {
                credentialFiles.forEach((file) => {
                    payload.append("credentials", file);
                });
            }

            await updateProfile(payload);
            await refreshProfile();
            setIsProfileDialogOpen(false);
            setProfileImageFile(null);
            setCredentialFiles([]);
            toast.success(t("profile.save", "Saved successfully"));
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                t("common.error", "Something went wrong"),
            );
        } finally {
            setProfileSaving(false);
        }
    };

    const handleProfileImageChange = (event) => {
        setProfileImageFile(event.target.files?.[0] || null);
    };

    const handleCredentialFilesChange = (event) => {
        setCredentialFiles(Array.from(event.target.files || []));
    };

    const handleQuickPhotoButtonClick = () => {
        if (profilePhotoSaving) return;
        quickPhotoInputRef.current?.click();
    };

    const handleQuickPhotoChange = async (event) => {
        const nextFile = event.target.files?.[0] || null;
        event.target.value = "";

        if (!nextFile) return;

        setProfilePhotoSaving(true);

        try {
            const payload = new FormData();
            payload.append("profileImage", nextFile);

            await updateProfile(payload);
            await refreshProfile();
            toast.success(t("profile.photoUpdated", "Profile photo updated"));
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                t("common.error", "Something went wrong"),
            );
        } finally {
            setProfilePhotoSaving(false);
        }
    };

    const stats = {
        totalAppointments: appointments.length,
        upcomingAppointments: upcomingAppointments.length,
        canceledAppointments: canceledCount,
        unreadNotifications: unreadCount,
    };

    const handleOpenProfileDialog = () => {
        setProfileForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            cityArea: isRTL
                ? user?.cityArea_ar || user?.cityArea || ""
                : user?.cityArea || user?.cityArea_ar || "",
        });
        setProfileImageFile(null);
        setCredentialFiles([]);
        setIsProfileDialogOpen(true);
    };

    const displayedCityArea = isRTL
        ? user?.cityArea_ar || user?.cityArea || t("profile.notSet", "Not set")
        : user?.cityArea || user?.cityArea_ar || t("profile.notSet", "Not set");

    const displayedUserName = user?.name || t("profile.notSet", "Not set");
    const displayedUserEmail = user?.email || t("profile.notSet", "Not set");
    const displayedUserPhone = user?.phone || t("profile.notSet", "Not set");
    const displayedCreatedAt = formatDateOnly(user?.createdAt, locale);
    const profileImageUrl = user?.profileImage?.url || user?.profileImage || "";

    const dashboardTabItems = useMemo(() => {
        const items = [
            {
                value: "overview",
                label: t("dashboard.title", "Dashboard"),
            },
            {
                value: "profile",
                label: t("profile.title", "My Profile"),
            },
            {
                value: "bookings",
                label: t("booking.title", "My Booking"),
            },
            {
                value: "notifications",
                label: t("notifications.title", "Notifications"),
            },
        ];

        return isRTL ? [...items].reverse() : items;
    }, [isRTL, t]);

    const bookingTabItems = useMemo(() => {
        const upcomingCount = appointments.filter(
            (item) => new Date(item.date) >= new Date() && item.status !== "canceled",
        ).length;
        const pastCount = appointments.filter(
            (item) => new Date(item.date) < new Date() && item.status !== "canceled",
        ).length;
        const canceledItemsCount = appointments.filter(
            (item) => item.status === "canceled",
        ).length;

        const items = [
            {
                value: "all",
                label: `${t("booking.all", "All")} (${appointments.length})`,
            },
            {
                value: "upcoming",
                label: `${t("booking.upcoming", "Upcoming")} (${upcomingCount})`,
            },
            {
                value: "past",
                label: `${t("booking.past", "Past")} (${pastCount})`,
            },
            {
                value: "canceled",
                label: `${t("booking.statusCanceled", "Canceled")} (${canceledItemsCount})`,
            },
        ];

        return isRTL ? [...items].reverse() : items;
    }, [appointments, isRTL, t]);

    return {
        t,
        locale,
        isRTL,
        user,
        loading,
        appointments,
        notifications,
        unreadCount,
        activeTab,
        bookingFilterTab,
        profileForm,
        profileSaving,
        profilePhotoSaving,
        isProfileDialogOpen,
        quickPhotoInputRef,
        updateTabInUrl,
        setBookingFilterTab,
        refreshData,
        handleMarkAsRead,
        handleMarkAllAsRead,
        upcomingAppointments,
        filteredBookings,
        handleProfileChange,
        handleProfileSubmit,
        handleProfileImageChange,
        handleCredentialFilesChange,
        handleQuickPhotoButtonClick,
        handleQuickPhotoChange,
        stats,
        handleOpenProfileDialog,
        displayedCityArea,
        displayedUserName,
        displayedUserEmail,
        displayedUserPhone,
        displayedCreatedAt,
        profileImageUrl,
        dashboardTabItems,
        bookingTabItems,
        setIsProfileDialogOpen,
    };
};
