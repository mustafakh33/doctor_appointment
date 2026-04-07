"use client";

import Link from "next/link";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Loading from "@/app/_components/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardStats from "./_components/DashboardStats";
import QuickActions from "./_components/QuickActions";
import UpcomingAppointments from "./_components/UpcomingAppointments";
import RecentNotifications from "./_components/RecentNotifications";
import NotificationsTab from "./_components/NotificationsTab";
import MyBookingList from "../my-booking/_components/MyBookingList";
import AppointmentCalendar from "@/app/_components/AppointmentCalendar";
import { useDashboardController } from "./_hooks/useDashboardController";

function DashboardPage() {
  const {
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
  } = useDashboardController();

  if (user?.role === "doctor") {
    return (
      <ProtectedRoute>
        <div className="mt-8">
          <Loading />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-7xl px-5 py-8 md:px-20">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("dashboard.title")}
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("dashboard.subtitle")}
        </p>

        <Tabs value={activeTab} onValueChange={updateTabInUrl} className="mt-8">
          <TabsList
            className={
              "h-auto w-full flex-wrap gap-2 rounded-full p-1 " +
              (isRTL ? "justify-end" : "justify-start")
            }
            style={{ background: "var(--color-bg-tertiary)" }}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {dashboardTabItems.map((tabItem) => (
              <TabsTrigger
                key={tabItem.value}
                value={tabItem.value}
                className="rounded-full data-[state=active]:bg-brand data-[state=active]:text-white"
              >
                {tabItem.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {loading ? (
            <div className="mt-8">
              <Loading />
            </div>
          ) : (
            <>
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <DashboardStats stats={stats} />
                  <QuickActions />
                  <div className="grid gap-6 xl:grid-cols-2">
                    <UpcomingAppointments appointments={upcomingAppointments} />
                    <RecentNotifications
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      disableMarkAll={unreadCount === 0}
                    />
                  </div>
                  <section
                    className="rounded-2xl border p-6"
                    style={{
                      background: "var(--color-bg-primary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <h3
                      className="mb-4 text-lg font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {t("dashboard.calendarTitle", "Appointments Calendar")}
                    </h3>
                    <AppointmentCalendar appointments={appointments} />
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <section
                  className="overflow-hidden rounded-4xl border"
                  style={{
                    borderColor: "var(--color-border)",
                    background:
                      "linear-gradient(180deg, var(--color-bg-primary), var(--color-primary-50))",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="p-6 sm:p-8 lg:p-10">
                    <div
                      className="flex flex-wrap items-start justify-between gap-4 border-b pb-6"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.24em]"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {t("profile.title", "My Profile")}
                        </p>
                        <h2
                          className="mt-1 text-2xl font-bold sm:text-3xl"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {displayedUserName}
                        </h2>
                      </div>

                      <Button
                        className="theme-btn-primary rounded-full px-5"
                        onClick={handleOpenProfileDialog}
                      >
                        {t("profile.editProfile", "Edit Profile")}
                      </Button>
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                      <div
                        className="overflow-hidden rounded-[28px] border p-6"
                        style={{
                          borderColor: "var(--color-border)",
                          background:
                            "linear-gradient(180deg, var(--color-bg-primary), var(--color-bg-tertiary))",
                        }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div
                            className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-4xl border bg-white text-4xl font-bold shadow-lg"
                            style={{
                              borderColor: "var(--color-primary-light)",
                            }}
                          >
                            {profileImageUrl ? (
                              <img
                                src={profileImageUrl}
                                alt={displayedUserName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              (user?.name || "U").slice(0, 1).toUpperCase()
                            )}
                          </div>

                          <div className="mt-3 w-full">
                            <input
                              ref={quickPhotoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleQuickPhotoChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full rounded-full"
                              onClick={handleQuickPhotoButtonClick}
                              disabled={profilePhotoSaving}
                            >
                              {profilePhotoSaving
                                ? t("common.loading", "Loading...")
                                : t("profile.changePhoto", "Change photo")}
                            </Button>
                          </div>

                          <div className="mt-5 space-y-1">
                            <h3
                              className="text-2xl font-bold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {displayedUserName}
                            </h3>
                            <p
                              className="text-sm"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {displayedUserEmail}
                            </p>
                          </div>

                          <div
                            className="mt-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                            style={{
                              borderColor: "var(--color-border)",
                              color: "var(--color-text-secondary)",
                              background: "var(--color-bg-primary)",
                            }}
                          >
                            {t("profile.accountCreated", "Account created")}:
                            <span className="ml-2 font-medium text-(--color-text-primary)">
                              {displayedCreatedAt ||
                                t("profile.notSet", "Not set")}
                            </span>
                          </div>

                          <div className="mt-6 flex w-full flex-wrap gap-3">
                            <Button
                              className="flex-1 min-w-[150px]"
                              variant="outline"
                              style={{
                                borderColor: "var(--color-primary)",
                                color: "var(--color-primary)",
                                background: "var(--color-bg-primary)",
                              }}
                              onClick={() => updateTabInUrl("bookings")}
                            >
                              {t("profile.viewBookings", "View bookings")}
                            </Button>
                            <Link
                              href="/doctors"
                              className="flex-1 min-w-[150px]"
                            >
                              <Button className="theme-btn-primary w-full">
                                {t("explore.allDoctors", "All Doctors")}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div
                        className="rounded-[28px] border p-6"
                        style={{
                          borderColor: "var(--color-border)",
                          background: "var(--color-bg-primary)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.22em]"
                              style={{ color: "var(--color-primary)" }}
                            >
                              {t("profile.summary", "Profile Summary")}
                            </p>
                            <h3
                              className="mt-1 text-xl font-bold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {t("profile.details", "Account details")}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <div
                            className="rounded-2xl border p-4"
                            style={{
                              borderColor: "var(--color-border)",
                              background: "var(--color-bg-tertiary)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.18em]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {t("profile.name", "Full Name")}
                            </p>
                            <p
                              className="mt-2 wrap-break-word text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {displayedUserName}
                            </p>
                          </div>

                          <div
                            className="rounded-2xl border p-4"
                            style={{
                              borderColor: "var(--color-border)",
                              background: "var(--color-bg-tertiary)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.18em]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {t("profile.email", "Email")}
                            </p>
                            <p
                              className="mt-2 wrap-break-word text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {displayedUserEmail}
                            </p>
                          </div>

                          <div
                            className="rounded-2xl border p-4"
                            style={{
                              borderColor: "var(--color-border)",
                              background: "var(--color-bg-tertiary)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.18em]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {t("profile.phone", "Phone")}
                            </p>
                            <p
                              className="mt-2 wrap-break-word text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {displayedUserPhone}
                            </p>
                          </div>

                          <div
                            className="rounded-2xl border p-4"
                            style={{
                              borderColor: "var(--color-border)",
                              background: "var(--color-bg-tertiary)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.18em]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {t("auth.cityArea", "City / Area")}
                            </p>
                            <p
                              className="mt-2 wrap-break-word text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {displayedCityArea}
                            </p>
                          </div>

                          <div
                            className="rounded-2xl border p-4 md:col-span-2"
                            style={{
                              borderColor: "var(--color-border)",
                              background: "var(--color-bg-tertiary)",
                            }}
                          >
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.18em]"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {t("profile.accountCreated", "Account created")}
                            </p>
                            <p
                              className="mt-2 wrap-break-word text-sm font-semibold"
                              style={{ color: "var(--color-text-primary)" }}
                            >
                              {displayedCreatedAt ||
                                t("profile.notSet", "Not set")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <Dialog
                  open={isProfileDialogOpen}
                  onOpenChange={setIsProfileDialogOpen}
                >
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {t("profile.editProfile", "Edit Profile")}
                      </DialogTitle>
                      <DialogDescription>
                        {t(
                          "profile.editProfileDescription",
                          "Update your personal details and save the changes.",
                        )}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <Input
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        placeholder={t("profile.name", "Name")}
                      />
                      <Input
                        name="email"
                        value={profileForm.email}
                        disabled
                        placeholder={t("profile.email", "Email")}
                      />
                      <Input
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder={t("profile.phone", "Phone")}
                      />
                      <Input
                        name="cityArea"
                        value={profileForm.cityArea}
                        onChange={handleProfileChange}
                        placeholder={t("auth.cityArea", "City / Area")}
                      />

                      <label
                        className="grid gap-2 text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        <span>
                          {t("auth.profileImageLabel", "Profile Image")}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="theme-input h-11 w-full rounded-xl px-3 py-2"
                        />
                      </label>

                      {user?.role === "doctor" ? (
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
                      ) : null}

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsProfileDialogOpen(false)}
                        >
                          {t("common.cancel", "Cancel")}
                        </Button>
                        <Button
                          className="theme-btn-primary rounded-full"
                          disabled={profileSaving}
                          type="submit"
                        >
                          {profileSaving
                            ? t("common.loading", "Loading...")
                            : t("profile.save", "Save Changes")}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="bookings" className="mt-6">
                <section
                  className="rounded-2xl border p-6"
                  style={{
                    background: "var(--color-bg-primary)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("booking.title", "My Booking")}
                  </h3>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {t(
                      "booking.subtitle",
                      "Review and manage all your appointments.",
                    )}
                  </p>

                  <Tabs
                    value={bookingFilterTab}
                    onValueChange={setBookingFilterTab}
                    className="mt-6 w-full"
                  >
                    <TabsList
                      className={
                        "h-auto w-full flex-wrap gap-2 rounded-full p-1 " +
                        (isRTL ? "justify-end" : "justify-start")
                      }
                      style={{ background: "var(--color-bg-tertiary)" }}
                      dir={isRTL ? "rtl" : "ltr"}
                    >
                      {bookingTabItems.map((tabItem) => (
                        <TabsTrigger
                          key={tabItem.value}
                          value={tabItem.value}
                          className="rounded-full data-[state=active]:bg-brand data-[state=active]:text-white"
                        >
                          {tabItem.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>

                  <div className="mt-6">
                    <MyBookingList
                      updateAppointment={refreshData}
                      bookingList={filteredBookings}
                    />
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6">
                <NotificationsTab
                  t={t}
                  isRTL={isRTL}
                  locale={locale}
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onMarkAsRead={handleMarkAsRead}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;
