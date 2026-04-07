"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Compass,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/app/_context/AuthContext";
import { localizeCategory, localizeDoctorField } from "@/app/_utils/localize";
import {
  bookAppointmentOrThrow,
  createReview,
  getAvailableSlots,
  getReviewsByDoctor,
  getDoctorSchedule,
} from "@/app/_utils/Api";
import { useLanguage } from "@/app/_context/LanguageContext";

const getNextDateString = () => {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now.toISOString().slice(0, 10);
};

const getWeekdayKey = (dateString) => {
  const date = new Date(dateString);
  const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return weekDays[date.getDay()];
};

const getNextAvailableDate = (availableDays = [], startDateString) => {
  const allowedDays = Array.isArray(availableDays) ? availableDays : [];
  if (!allowedDays.length) return null;

  const baseDate = startDateString ? new Date(startDateString) : new Date();
  if (Number.isNaN(baseDate.getTime())) return null;

  for (let index = 0; index < 30; index += 1) {
    const current = new Date(baseDate);
    current.setDate(baseDate.getDate() + index);

    const dayKey = getWeekdayKey(current.toISOString().slice(0, 10));
    if (allowedDays.includes(dayKey)) {
      return current.toISOString().slice(0, 10);
    }
  }

  return null;
};

const formatSlotTime = (timeValue) => {
  if (!timeValue || typeof timeValue !== "string") return "--:--";
  const [hoursString, minutesString] = timeValue.split(":");
  const hours = Number(hoursString);
  const minutes = Number(minutesString);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return timeValue;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${normalizedHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const formatReviewDate = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getInitials = (value = "") => {
  const tokens = String(value).trim().split(/\s+/).filter(Boolean);

  if (!tokens.length) return "PT";
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase();
};

const renderStars = (value = 0) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={
        "h-4 w-4 " +
        (index < Math.round(value)
          ? "fill-amber-400 text-amber-400"
          : "text-slate-300")
      }
    />
  ));
};

function DoctorDetailsClient({ doctor, schedule }) {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const doctorId = doctor?._id || doctor?.documentId || doctor?.id;

  const [isBookingPickerOpen, setIsBookingPickerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState(schedule || null);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [selectedDate, setSelectedDate] = useState(getNextDateString());
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");
  const [reviewList, setReviewList] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsForSelectedDate, setSlotsForSelectedDate] = useState([]);

  const doctorAddress =
    localizeDoctorField(doctor, "address", locale) ||
    doctor?.location?.address ||
    doctor?.address ||
    "";

  const mapsQuery = encodeURIComponent(doctorAddress || "Cairo");
  const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  useEffect(() => {
    setPhone(user?.phone || "");
  }, [user?.phone]);

  useEffect(() => {
    let active = true;

    const loadSchedule = async () => {
      if (!doctorId) return;

      const latestSchedule = await getDoctorSchedule(doctorId);

      if (!active) return;

      setScheduleData(
        (previous) => latestSchedule || previous || schedule || null,
      );
    };

    loadSchedule();

    return () => {
      active = false;
    };
  }, [doctorId, schedule]);

  useEffect(() => {
    let active = true;

    const loadDateSlots = async () => {
      if (!doctorId || !selectedDate) return;

      setIsSlotsLoading(true);
      const nextSlots = await getAvailableSlots(doctorId, selectedDate);

      if (!active) return;

      setSlotsForSelectedDate(Array.isArray(nextSlots) ? nextSlots : []);
      setSelectedSlotId("");
      setIsSlotsLoading(false);
    };

    loadDateSlots();

    return () => {
      active = false;
    };
  }, [doctorId, selectedDate]);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      if (!doctorId) {
        if (active) {
          setReviewList([]);
          setIsReviewsLoading(false);
        }
        return;
      }

      setIsReviewsLoading(true);
      setReviewList([]);

      const backendReviews = await getReviewsByDoctor(doctorId);
      if (!active) return;

      setReviewList(Array.isArray(backendReviews) ? backendReviews : []);
      setIsReviewsLoading(false);
    };

    loadReviews();

    return () => {
      active = false;
    };
  }, [doctorId]);

  const sortedReviews = useMemo(() => {
    const list = Array.isArray(reviewList) ? [...reviewList] : [];
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [reviewList]);

  const selectedWeekday = useMemo(
    () => getWeekdayKey(selectedDate),
    [selectedDate],
  );

  const availableDays = useMemo(
    () =>
      Array.isArray(scheduleData?.availableDays)
        ? scheduleData.availableDays
        : [],
    [scheduleData?.availableDays],
  );

  useEffect(() => {
    if (!availableDays.length) return;

    const currentDateKey = getWeekdayKey(selectedDate);
    if (availableDays.includes(currentDateKey)) return;

    const nextDate = getNextAvailableDate(
      availableDays,
      new Date().toISOString().slice(0, 10),
    );
    if (nextDate) {
      setSelectedDate(nextDate);
    }
  }, [availableDays, selectedDate]);

  const isSelectedDateAvailable = availableDays.includes(selectedWeekday);

  const availableSlots = useMemo(
    () => slotsForSelectedDate.filter((slot) => !slot?.isBooked),
    [slotsForSelectedDate],
  );

  const selectedSlot = useMemo(
    () =>
      slotsForSelectedDate.find(
        (slot) => String(slot.documentId) === String(selectedSlotId),
      ) || null,
    [slotsForSelectedDate, selectedSlotId],
  );

  const isAvailableToday = useMemo(() => {
    const todayWeekday = getWeekdayKey(new Date().toISOString().slice(0, 10));
    const hasAnySlot =
      Array.isArray(scheduleData?.timeSlots) &&
      scheduleData.timeSlots.some((slot) => !slot?.isBooked);

    return availableDays.includes(todayWeekday) && hasAnySlot;
  }, [availableDays, scheduleData?.timeSlots]);

  const nextAvailableTime = useMemo(() => {
    const nextSlot = Array.isArray(scheduleData?.timeSlots)
      ? scheduleData.timeSlots.find((slot) => !slot?.isBooked)
      : null;
    return nextSlot?.time
      ? formatSlotTime(nextSlot.time)
      : t("doctor.notAvailable", "Not available");
  }, [scheduleData?.timeSlots, t]);

  const openBookingDialog = () => {
    if (!isAuthenticated || !user) {
      toast.warning("Please log in to book an appointment.");
      router.push("/auth/login");
      return;
    }

    if (!selectedSlot) {
      toast.warning("Please select an available time slot first.");
      return;
    }

    setPhone(user?.phone || "");
    setNotes("");
    setIsConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select an available slot.");
      return;
    }

    if (!phone.trim()) {
      toast.warning("Phone number is required.");
      return;
    }

    setSubmitting(true);

    let appointment = null;
    try {
      appointment = await bookAppointmentOrThrow({
        userName: user?.name,
        email: user?.email,
        phone: phone.trim(),
        notes: notes.trim(),
        date: selectedDate,
        doctor: doctorId,
        slotId: selectedSlot.documentId,
        schedule: scheduleData?.documentId,
      });
    } catch (error) {
      const errorMessage = String(error?.message || "").toLowerCase();

      if (errorMessage.includes("already booked")) {
        toast.error("This slot was just booked. Please select another time.");
      } else if (errorMessage.includes("in the past")) {
        toast.error("This slot has already passed. Please pick a future time.");
      } else {
        toast.error(
          error?.message || "Unable to book this slot. Please try another one.",
        );
      }

      const refreshedSlots = await getAvailableSlots(doctorId, selectedDate);
      setSlotsForSelectedDate(
        Array.isArray(refreshedSlots) ? refreshedSlots : [],
      );
      setSelectedSlotId("");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);

    toast.success("Appointment booked successfully.");
    setIsConfirmOpen(false);
    setSelectedSlotId("");
    router.push("/dashboard?tab=bookings");
    router.refresh();
  };

  const handleCreateReview = async () => {
    if (!isAuthenticated || !user) {
      toast.warning("Please log in to rate this doctor.");
      router.push("/auth/login");
      return;
    }

    if (!doctorId) {
      toast.error("Doctor information is missing.");
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      toast.warning("Please select a rating between 1 and 5 stars.");
      return;
    }

    const alreadyReviewed = sortedReviews.some(
      (review) =>
        String(review?.email || "").toLowerCase() ===
        String(user?.email || "").toLowerCase(),
    );

    if (alreadyReviewed) {
      toast.warning("You have already reviewed this doctor.");
      return;
    }

    setReviewSubmitting(true);

    try {
      const createdReview = await createReview({
        doctor: doctorId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviewList((previous) => [createdReview, ...previous]);
      setReviewRating(0);
      setReviewComment("");
      toast.success("Your review has been submitted.");
    } catch (error) {
      toast.error(error?.message || "Unable to submit review right now.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const consultationPrice = doctor?.appointment_fee
    ? `EGP ${doctor.appointment_fee}`
    : "N/A";

  const reviewCount = sortedReviews.length;
  const averageRating = reviewCount
    ? (
        sortedReviews.reduce(
          (sum, review) => sum + Number(review?.rating || 0),
          0,
        ) / reviewCount
      ).toFixed(1)
    : Number(doctor?.ratingsAverage || 0).toFixed(1);
  const currentDoctorName =
    localizeDoctorField(doctor, "name", locale) || t("nav.doctors", "Doctors");
  const directoryLabel =
    locale === "ar" ? "دليل الأطباء المتخصصين" : "Specialist Doctor Directory";
  const directoryHint =
    locale === "ar"
      ? "استعرض ملف الطبيب، احجز الموعد، وتابع التقييمات بسهولة"
      : "Review doctor profile, book appointments, and explore patient reviews";

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <section
          className="overflow-hidden rounded-2xl border px-4 py-3 md:px-5"
          style={{
            borderColor: "var(--color-border)",
            background:
              "linear-gradient(120deg, var(--color-primary-50), var(--color-secondary-light))",
          }}
        >
          <div className="flex flex-col gap-3">
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  color: "var(--color-primary)",
                  background: "var(--color-bg-primary)",
                }}
              >
                <Compass className="h-3.5 w-3.5" />
                {directoryLabel}
              </div>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {directoryHint}
              </p>
            </div>

            <div
              className="flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-bg-primary)",
              }}
            >
              <Link
                href="/"
                className="font-medium transition hover:opacity-80"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("nav.home", "Home")}
              </Link>

              <ChevronRight
                className="h-4 w-4"
                style={{ color: "var(--color-text-muted)" }}
              />

              <Link
                href="/doctors"
                className="font-medium transition hover:opacity-80"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {t("nav.doctors", "Doctors")}
              </Link>

              <ChevronRight
                className="h-4 w-4"
                style={{ color: "var(--color-text-muted)" }}
              />

              <span
                className="rounded-full px-2 py-0.5 text-xs font-semibold"
                style={{
                  color: "var(--color-primary)",
                  background: "var(--color-primary-light)",
                }}
              >
                {currentDoctorName}
              </span>
            </div>
          </div>
        </section>

        <section
          className="grid gap-6 rounded-2xl border bg-white p-5 md:grid-cols-[260px_1fr] md:p-6"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="overflow-hidden rounded-xl">
            <Image
              src={doctor?.image?.url || "/assets/img/Doctors/default.png"}
              width={520}
              height={520}
              alt={doctor?.name || "Doctor"}
              className="h-full min-h-60 w-full object-cover"
            />
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "var(--color-secondary-light)",
                  color: "var(--color-secondary-dark)",
                }}
              >
                {localizeCategory(doctor?.category, locale) ||
                  t("doctor.specialist")}
              </span>

              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "var(--color-primary-50)",
                  color: "var(--color-primary)",
                }}
              >
                <Clock3 className="h-3.5 w-3.5" />
                {isAvailableToday
                  ? t("doctor.availableToday")
                  : t("doctor.nextAvailable", undefined, {
                      time: nextAvailableTime,
                    })}
              </span>
            </div>

            <h1
              className="text-2xl font-extrabold md:text-3xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {localizeDoctorField(doctor, "name", locale)}
            </h1>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div
                className="rounded-xl border px-3 py-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p style={{ color: "var(--color-text-muted)" }}>
                  {t("doctor.consultation")}
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {consultationPrice}
                </p>
              </div>
              <div
                className="rounded-xl border px-3 py-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <p style={{ color: "var(--color-text-muted)" }}>
                  {t("doctor.experience", "Experience")}
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {doctor?.year_of_experience || 0}{" "}
                  {t("doctor.yearsExp", "Years Experience")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <MapPin className="h-4 w-4" />
                <span>
                  {doctorAddress ||
                    t("doctor.locationNotAvailable", "Location not available")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(doctor?.ratingsAverage)}
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {averageRating} ({reviewCount}{" "}
                  {t("doctor.reviews", "reviews")})
                </span>
              </div>
            </div>

            <p
              className="leading-7"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {localizeDoctorField(doctor, "about", locale) ||
                t("doctor.doctorBioMissing", "Doctor bio is not available.")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                className="h-11 rounded-xl px-5 text-white"
                style={{ background: "var(--color-accent)" }}
                onClick={() => {
                  setIsBookingPickerOpen(true);
                }}
              >
                {t("doctor.appointmentBooking", "Appointment Booking")}
              </Button>
            </div>
          </div>
        </section>

        <section
          className="rounded-2xl border bg-white p-5 md:p-6"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("doctor.location", "Location")}
            </h2>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-semibold"
              style={{
                background: "var(--color-primary-50)",
                color: "var(--color-primary)",
              }}
            >
              <Navigation className="me-2 h-4 w-4" />
              {t("doctor.getDirections", "Get Directions")}
            </a>
          </div>

          <div
            className="mt-4 overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <iframe
              title="Doctor location map"
              src={mapsEmbedUrl}
              width="100%"
              height="240"
              loading="lazy"
              className="w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p
            className="mt-3 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {doctorAddress ||
              t("doctor.addressNotProvided", "Address not provided")}
          </p>
        </section>

        <section
          className="rounded-2xl border bg-white p-5 md:p-6"
          style={{
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {t("doctor.reviews", "reviews")}
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {t("doctor.totalReviews", "{count} total reviews", {
                  count: sortedReviews.length,
                })}
              </p>
            </div>

            <div
              className="rounded-xl border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              {t("doctor.averageRating", "Average rating")}:{" "}
              <strong>{averageRating}</strong>
            </div>
          </div>

          <div
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("doctor.addYourReview", "Add your review")}
            </p>

            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= reviewRating;

                return (
                  <button
                    key={starValue}
                    type="button"
                    className="rounded-md p-1"
                    onClick={() => setReviewRating(starValue)}
                    aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={
                        "h-5 w-5 " +
                        (isActive
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300")
                      }
                    />
                  </button>
                );
              })}
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              placeholder={t(
                "doctor.writeFeedback",
                "Write your feedback (optional)",
              )}
              className="mt-3 w-full rounded-xl border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />

            <Button
              type="button"
              className="mt-3 h-10 rounded-xl text-white"
              style={{ background: "var(--color-accent)" }}
              onClick={handleCreateReview}
              disabled={reviewSubmitting}
            >
              {reviewSubmitting
                ? t("doctor.submitting", "Submitting...")
                : t("doctor.submitReview", "Submit Review")}
            </Button>
          </div>

          {isReviewsLoading ? (
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : sortedReviews.length === 0 ? (
            <div
              className="mt-4 rounded-xl border border-dashed p-5 text-sm"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
              }}
            >
              {t("doctor.noReviewsYet", "No reviews yet.")}
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {sortedReviews.map((review, index) => {
                const reviewerName =
                  locale === "ar"
                    ? review?.user?.name_ar ||
                      review?.userName_ar ||
                      review?.user?.name ||
                      review?.userName ||
                      review?.email ||
                      "Patient"
                    : review?.userName ||
                      review?.user?.name ||
                      review?.email ||
                      "Patient";
                const reviewerImage =
                  review?.user?.profileImage?.url ||
                  review?.user?.profileImage ||
                  review?.userProfileImage ||
                  "";

                return (
                  <article
                    key={`${review?.documentId || review?.id || review?._id || review?.email || "review"}-${review?.createdAt || ""}-${index}`}
                    className="rounded-xl border p-4"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-xs font-bold"
                          style={{
                            background: "var(--color-primary-50)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {reviewerImage ? (
                            <Image
                              src={reviewerImage}
                              alt={reviewerName}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(reviewerName)
                          )}
                        </div>
                        <div>
                          <h3
                            className="font-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {reviewerName}
                          </h3>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {formatReviewDate(review?.createdAt) ||
                              t("doctor.recentReview", "Recent review")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {renderStars(review?.rating)}
                      </div>
                    </div>

                    <p
                      className="mt-3 text-sm leading-6"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {review?.comment ||
                        t("doctor.noWrittenComment", "No written comment.")}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Dialog open={isBookingPickerOpen} onOpenChange={setIsBookingPickerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("doctor.appointmentBooking", "Appointment Booking")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "doctor.appointmentBookingDescription",
                "Choose appointment date and time slot, then continue to confirmation.",
              )}
            </DialogDescription>
          </DialogHeader>

          <div
            className="rounded-xl border p-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            <label
              className="mb-2 block text-xs font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("doctor.appointmentDate", "Appointment Date")}
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="h-11 w-full rounded-lg border px-3 ps-10 text-sm outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                  background: "var(--color-bg-primary)",
                }}
              />
            </div>
          </div>

          <div className="mt-4">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t("doctor.availableTimeSlots", "Available Time Slots")}
            </p>

            {isSlotsLoading ? (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="skeleton h-11 w-full rounded-lg"
                  />
                ))}
              </div>
            ) : !isSelectedDateAvailable ? (
              <div
                className="mt-3 rounded-xl border border-dashed p-4 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {t(
                  "doctor.noClinicHours",
                  "No clinic hours on this date. Try another day.",
                )}
              </div>
            ) : availableSlots.length === 0 ? (
              <div
                className="mt-3 rounded-xl border border-dashed p-4 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {t(
                  "doctor.noAvailableSlots",
                  "No available slots for this date.",
                )}
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableSlots.map((slot) => {
                  const isBooked = Boolean(slot?.isBooked);
                  const isActive =
                    String(slot.documentId) === String(selectedSlotId);
                  return (
                    <button
                      key={slot.documentId}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setSelectedSlotId(String(slot.documentId))}
                      className="h-11 rounded-lg border px-2 text-sm font-semibold transition"
                      style={{
                        borderColor: isActive
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                        color: isBooked
                          ? "var(--color-text-muted)"
                          : isActive
                            ? "var(--color-primary)"
                            : "var(--color-text-primary)",
                        background: isBooked
                          ? "var(--color-bg-secondary)"
                          : isActive
                            ? "var(--color-primary-50)"
                            : "var(--color-bg-primary)",
                        opacity: isBooked ? 0.6 : 1,
                      }}
                    >
                      {formatSlotTime(slot.time)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBookingPickerOpen(false)}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              className="text-white"
              style={{ background: "var(--color-accent)" }}
              onClick={() => {
                if (!selectedSlot) {
                  toast.warning(
                    t(
                      "doctor.selectSlotFirst",
                      "Please select an available time slot first.",
                    ),
                  );
                  return;
                }
                setIsBookingPickerOpen(false);
                openBookingDialog();
              }}
              disabled={!selectedSlot || submitting}
            >
              {t("doctor.continueToConfirm", "Continue to Confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("doctor.confirmAppointment", "Confirm Appointment")}
            </DialogTitle>
            <DialogDescription>
              {t("doctor.selectedSlotOn", "You selected {time} on {date}.", {
                time:
                  formatSlotTime(selectedSlot?.time) ||
                  t("doctor.aSlot", "a slot"),
                date: selectedDate,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {t("doctor.phoneNumber", "Phone Number")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {t("doctor.notesOptional", "Notes (Optional)")}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              className="text-white"
              style={{ background: "var(--color-accent)" }}
              onClick={handleConfirmBooking}
              disabled={submitting}
            >
              {submitting
                ? t("doctor.booking", "Booking...")
                : t("doctor.confirmBooking", "Confirm Booking")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DoctorDetailsClient;
