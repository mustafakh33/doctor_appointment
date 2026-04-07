"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  CalendarDays,
  Users,
  XCircle,
  Bell,
  CheckCheck,
} from "lucide-react";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Loading from "@/app/_components/loading";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "@/app/_context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getDoctorDashboard,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  updateDoctorAppointmentStatus,
} from "@/app/_utils/Api";

const formatDateTime = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const statusActions = [
  {
    value: "confirmed",
    labelKey: "doctorDashboard.table.confirm",
    color: "var(--color-primary)",
  },
  {
    value: "completed",
    labelKey: "doctorDashboard.table.complete",
    color: "var(--color-success)",
  },
  {
    value: "canceled",
    labelKey: "doctorDashboard.table.cancel",
    color: "var(--color-error)",
  },
];

const statCards = [
  {
    key: "totalAppointments",
    icon: CalendarDays,
    color: "var(--color-primary)",
  },
  { key: "todayAppointments", icon: Clock3, color: "var(--color-info)" },
  {
    key: "upcomingAppointments",
    icon: CalendarDays,
    color: "var(--color-success)",
  },
  {
    key: "completedAppointments",
    icon: CheckCircle2,
    color: "var(--color-success)",
  },
  { key: "canceledAppointments", icon: XCircle, color: "var(--color-error)" },
  { key: "uniquePatients", icon: Users, color: "var(--color-secondary)" },
];

const statusStyles = {
  pending: {
    background: "var(--color-primary-50)",
    color: "var(--color-primary)",
  },
  confirmed: { background: "#e8f4ff", color: "var(--color-info)" },
  canceled: { background: "#fde8e8", color: "var(--color-error)" },
  completed: { background: "#e8f8ef", color: "var(--color-success)" },
};

function DoctorDashboardPage() {
  const router = useRouter();
  const { user, updateProfile, refreshProfile } = useAuth();
  const { t, locale, isRTL } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState("");
  const [dashboard, setDashboard] = React.useState(null);
  const [error, setError] = React.useState("");
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    cityArea: "",
  });
  const [profileImageFile, setProfileImageFile] = React.useState(null);
  const [credentialFiles, setCredentialFiles] = React.useState([]);
  const [profileSaving, setProfileSaving] = React.useState(false);

  React.useEffect(() => {
    if (user && user.role !== "doctor") {
      router.replace("/");
    }
  }, [router, user]);

  React.useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      cityArea: user?.cityArea || "",
    });
  }, [user]);

  React.useEffect(() => {
    const loadDashboard = async () => {
      const data = await getDoctorDashboard();

      if (!data) {
        setError("doctor profile not found");
        setLoading(false);
        return;
      }

      setDashboard(data);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  const refreshNotifications = React.useCallback(async () => {
    const [items, unread] = await Promise.all([
      getNotifications(),
      getUnreadNotificationCount(),
    ]);

    setNotifications(Array.isArray(items) ? items : []);
    setUnreadCount(unread || 0);
  }, []);

  React.useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const stats = dashboard?.stats || {};
  const recentAppointments = dashboard?.recentAppointments || [];
  const upcomingAppointments = dashboard?.upcomingAppointments || [];
  const patients = dashboard?.patients || [];

  const getAppointmentId = React.useCallback(
    (appointment, index = 0, scope = "appointment") =>
      appointment?.id ||
      appointment?.documentId ||
      appointment?._id ||
      `${scope}-${appointment?.email || "unknown"}-${appointment?.date || "date"}-${appointment?.time || "time"}-${index}`,
    [],
  );

  const getPatientId = React.useCallback(
    (patient, index = 0) =>
      patient?.id ||
      patient?.documentId ||
      patient?._id ||
      `${patient?.email || patient?.phone || "patient"}-${index}`,
    [],
  );

  const handleStatusChange = async (appointmentId, status) => {
    if (!appointmentId) {
      toast.error(t("common.error", "Something went wrong"));
      return;
    }

    setUpdatingId(appointmentId);
    const updated = await updateDoctorAppointmentStatus(appointmentId, status);
    if (updated) {
      setDashboard((previous) => ({
        ...previous,
        recentAppointments: previous.recentAppointments.map((item) =>
          (item.id || item.documentId || item._id) === appointmentId
            ? updated
            : item,
        ),
        upcomingAppointments: previous.upcomingAppointments.map((item) =>
          (item.id || item.documentId || item._id) === appointmentId
            ? updated
            : item,
        ),
      }));
    }
    setUpdatingId("");
  };

  const doctorName =
    dashboard?.doctor?.name || user?.name || t("doctorDashboard.title");

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

      credentialFiles.forEach((file) => {
        payload.append("credentials", file);
      });

      await updateProfile(payload);
      await refreshProfile();
      toast.success(t("profile.save", "Saved successfully"));
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
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

  return (
    <ProtectedRoute>
      <div className="page-shell md:px-20">
        <div
          id="dashboard"
          className="rounded-3xl border p-6 md:p-8"
          style={{
            background: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <p
            className="text-sm uppercase tracking-[0.3em]"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("nav.doctorPanel")}
          </p>
          <h1
            className="mt-2 text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {doctorName}
          </h1>
          <p
            className="mt-2 max-w-3xl text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("doctorDashboard.subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="mt-8">
            <Loading />
          </div>
        ) : error ? (
          <div
            className="mt-8 rounded-2xl border p-6"
            style={{
              background: "var(--color-bg-primary)",
              borderColor: "var(--color-border)",
            }}
          >
            <p style={{ color: "var(--color-text-primary)" }}>
              Doctor profile not found. Link your doctor user account to a
              doctor profile first.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {statCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="rounded-2xl border p-5"
                    style={{
                      background: "var(--color-bg-primary)",
                      borderColor: "var(--color-border)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {t(`doctorDashboard.stats.${item.key}`)}
                        </p>
                        <p
                          className="mt-2 text-3xl font-bold"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {stats[item.key] || 0}
                        </p>
                      </div>
                      <span
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                        style={{
                          color: item.color,
                          background: "var(--color-bg-secondary)",
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <section
                className="rounded-3xl border p-5"
                style={{
                  background: "var(--color-bg-primary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("doctorDashboard.sections.recentAppointments")}
                  </h2>
                  <span
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      background: "var(--color-bg-secondary)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {recentAppointments.length}
                  </span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr style={{ color: "var(--color-text-secondary)" }}>
                        <th className="py-3 text-left font-medium">
                          {t("doctorDashboard.table.patient")}
                        </th>
                        <th className="py-3 text-left font-medium">
                          {t("doctorDashboard.table.date")}
                        </th>
                        <th className="py-3 text-left font-medium">
                          {t("doctorDashboard.table.time")}
                        </th>
                        <th className="py-3 text-left font-medium">
                          {t("doctorDashboard.table.status")}
                        </th>
                        <th className="py-3 text-left font-medium">
                          {t("doctorDashboard.table.actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-10 text-center"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            {t("doctorDashboard.table.noAppointments")}
                          </td>
                        </tr>
                      ) : (
                        recentAppointments.map((appointment, index) => {
                          const appointmentStatus =
                            appointment.status || "pending";
                          const appointmentId = getAppointmentId(
                            appointment,
                            index,
                            "recent",
                          );
                          return (
                            <tr
                              key={appointmentId}
                              className="border-t"
                              style={{ borderColor: "var(--color-border)" }}
                            >
                              <td
                                className="py-4"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                <div className="font-medium">
                                  {appointment.user?.name ||
                                    appointment.userName ||
                                    appointment.email}
                                </div>
                                <div
                                  className="text-xs"
                                  style={{
                                    color: "var(--color-text-secondary)",
                                  }}
                                >
                                  {appointment.user?.email || appointment.email}
                                </div>
                              </td>
                              <td
                                className="py-4"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {appointment.date}
                              </td>
                              <td
                                className="py-4"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {appointment.time}
                              </td>
                              <td className="py-4">
                                <span
                                  className="rounded-full px-3 py-1 text-xs font-medium"
                                  style={
                                    statusStyles[appointmentStatus] ||
                                    statusStyles.pending
                                  }
                                >
                                  {t(
                                    `doctorDashboard.status.${appointmentStatus}`,
                                  )}
                                </span>
                              </td>
                              <td className="py-4">
                                <div className="flex flex-wrap gap-2">
                                  {statusActions.map((action) => (
                                    <button
                                      key={action.value}
                                      type="button"
                                      disabled={
                                        updatingId === appointmentId ||
                                        appointmentStatus === action.value
                                      }
                                      onClick={() =>
                                        handleStatusChange(
                                          appointmentId,
                                          action.value,
                                        )
                                      }
                                      className="rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50"
                                      style={{
                                        background: action.color,
                                        color: "#fff",
                                      }}
                                    >
                                      {t(action.labelKey)}
                                    </button>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="space-y-6">
                <section
                  className="rounded-3xl border p-5"
                  style={{
                    background: "var(--color-bg-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("doctorDashboard.sections.upcomingAppointments")}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {upcomingAppointments.length === 0 ? (
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {t("doctorDashboard.table.noAppointments")}
                      </p>
                    ) : (
                      upcomingAppointments.map((appointment, index) => (
                        <div
                          key={getAppointmentId(appointment, index, "upcoming")}
                          className="rounded-2xl border p-4"
                          style={{
                            background: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p
                                className="font-semibold"
                                style={{ color: "var(--color-text-primary)" }}
                              >
                                {appointment.user?.name ||
                                  appointment.userName ||
                                  appointment.email}
                              </p>
                              <p
                                className="text-sm"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                {appointment.date} • {appointment.time}
                              </p>
                            </div>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-medium"
                              style={
                                statusStyles[appointment.status] ||
                                statusStyles.pending
                              }
                            >
                              {t(
                                `doctorDashboard.status.${appointment.status || "pending"}`,
                              )}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section
                  className="rounded-3xl border p-5"
                  style={{
                    background: "var(--color-bg-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("doctorDashboard.sections.patients")}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {patients.length === 0 ? (
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {t("doctorDashboard.table.noAppointments")}
                      </p>
                    ) : (
                      patients.map((patient, index) => (
                        <div
                          key={getPatientId(patient, index)}
                          className="flex items-center justify-between gap-3 rounded-2xl border p-4"
                          style={{
                            background: "var(--color-bg-secondary)",
                            borderColor: "var(--color-border)",
                          }}
                        >
                          <div>
                            <p
                              className="font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {patient.name}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {patient.email || patient.phone}
                            </p>
                          </div>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              background: "var(--color-primary-50)",
                              color: "var(--color-primary)",
                            }}
                          >
                            {patient.appointmentsCount}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </aside>
            </div>

            <section
              id="profile"
              className="rounded-3xl border p-6"
              style={{
                background: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {t("profile.title", "My Profile")}
              </h2>

              <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder={t("profile.name", "Name")}
                  />
                  <Input
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder={t("profile.phone", "Phone")}
                  />
                  <Input
                    name="email"
                    value={profileForm.email}
                    disabled
                    placeholder={t("profile.email", "Email")}
                  />
                  <Input
                    name="cityArea"
                    value={profileForm.cityArea}
                    onChange={handleProfileChange}
                    placeholder={t("auth.cityArea", "City / Area")}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label
                    className="grid gap-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span>{t("auth.profileImageLabel", "Profile Image")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="theme-input h-11 w-full rounded-xl px-3 py-2"
                    />
                  </label>
                  <label
                    className="grid gap-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <span>
                      {t("auth.credentials", "Credentials")} (
                      {t("auth.optional", "Optional")})
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf,application/pdf"
                      multiple
                      onChange={handleCredentialFilesChange}
                      className="theme-input h-11 w-full rounded-xl px-3 py-2"
                    />
                  </label>
                </div>

                <Button
                  className="theme-btn-primary rounded-full"
                  disabled={profileSaving}
                  type="submit"
                >
                  {profileSaving
                    ? t("common.loading", "Loading...")
                    : t("profile.save", "Save")}
                </Button>
              </form>
            </section>

            <section
              id="notifications"
              className="rounded-3xl border p-6"
              style={{
                background: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("notifications.title", "Notifications")}
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {t(
                      "notifications.subtitle",
                      "Track your latest updates and booking alerts.",
                    )}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="inline-flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  {t("notifications.markAllAsRead")}
                </Button>
              </div>

              {notifications.length === 0 ? (
                <p
                  className="mt-4 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("notifications.noNotifications")}
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {notifications.map((item) => {
                    const title = isRTL
                      ? item.titleAr || item.title
                      : item.title;
                    const message = isRTL
                      ? item.messageAr || item.message
                      : item.message;

                    return (
                      <article
                        key={item.id}
                        className="rounded-xl border p-4"
                        style={{
                          borderColor: item.isRead
                            ? "var(--color-border)"
                            : "var(--color-primary-light)",
                          background: item.isRead
                            ? "transparent"
                            : "var(--color-primary-50)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {title}
                            </p>
                            <p
                              className="mt-1 text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {message}
                            </p>
                            <p
                              className="mt-2 text-xs"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {formatDateTime(item.createdAt, locale)}
                            </p>
                          </div>

                          <span
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                            style={{
                              color: item.isRead
                                ? "var(--color-text-secondary)"
                                : "var(--color-primary)",
                              background: item.isRead
                                ? "var(--color-bg-tertiary)"
                                : "var(--color-primary-light)",
                            }}
                          >
                            <Bell className="h-4 w-4" />
                          </span>
                        </div>

                        {!item.isRead ? (
                          <button
                            type="button"
                            className="mt-3 text-xs font-semibold"
                            style={{ color: "var(--color-primary)" }}
                            onClick={() => handleMarkAsRead(item.id)}
                          >
                            {t("notifications.markAsRead")}
                          </button>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default DoctorDashboardPage;
