"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { bookAppointment } from "@/app/_utils/Api";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "@/app/_context/LanguageContext";
import Link from "next/link";
import { toast } from "sonner";
import { localizeDoctorField } from "@/app/_utils/localize";
function BookAppointment({ doctor }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t, locale } = useLanguage();
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [phone, setPhone] = useState(user?.phone || "");
  const [notes, setNotes] = useState("");

  const booking = () => {
    if (!isAuthenticated || !user) {
      toast.warning(t("booking.loginRequired"));
      return;
    }

    if (!phone.trim()) {
      toast.warning(t("booking.phoneRequired"));
      return;
    }

    const data = {
      userName: user?.name,
      email: user?.email,
      phone: phone,
      notes: notes,
      date: date,
      time: selectedTime,
      doctor: doctor.documentId,
    };

    bookAppointment(data).then((resp) => {
      if (resp) {
        toast.success(t("booking.bookedSuccess"));
        router.push(`/checkout?appointmentId=${resp.documentId}`);
      } else {
      }
    });
  };
  const pastDay = (day) => {
    return day <= new Date();
  };
  const getTime = () => {
    const timeList = [];

    const formatSlot = (hour, minute) => {
      const slotDate = new Date();
      slotDate.setHours(hour, minute, 0, 0);

      return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(slotDate);
    };

    for (let i = 10; i <= 12; i++) {
      timeList.push({
        time: formatSlot(i, 0),
      });

      timeList.push({
        time: formatSlot(i, 30),
      });
    }

    for (let i = 13; i <= 17; i++) {
      timeList.push({
        time: formatSlot(i, 0),
      });

      timeList.push({
        time: formatSlot(i, 30),
      });
    }

    setTimeSlot(timeList);
  };

  useEffect(() => {
    getTime();
  }, [locale]);

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mt-3 rounded-full text-white"
          style={{ background: "var(--color-accent)" }}
        >
          {t("doctor.bookAppointment")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("doctor.bookAppointment")}
            {doctor?.name
              ? ` - ${localizeDoctorField(doctor, "name", locale)}`
              : ""}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("booking.subtitle")}
          </DialogDescription>
        </DialogHeader>
        {!isAuthenticated ? (
          <div
            className="space-y-4 rounded-xl border border-dashed p-4 text-sm"
            style={{
              borderColor: "var(--color-primary-light)",
              background: "var(--color-primary-50)",
              color: "var(--color-text-primary)",
            }}
          >
            <p>{t("booking.loginMessage")}</p>
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button size="sm">{t("auth.signIn")}</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" variant="outline">
                  {t("auth.register")}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
                style={{ borderColor: "var(--color-border)" }}
                disabled={pastDay}
              />
            </div>
            <div className="mt-5 md:mt-0">
              <div
                className="grid grid-cols-3 gap-3 rounded-lg border p-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                {timeSlot?.map((item, index) => (
                  <h2
                    key={index}
                    onClick={() => setSelectedTime(item.time)}
                    className={`cursor-pointer rounded-full border p-2 text-center ${
                      item.time == selectedTime && ""
                    }   `}
                    style={{
                      borderColor: "var(--color-border)",
                      background:
                        item.time === selectedTime
                          ? "var(--color-secondary-light)"
                          : "transparent",
                      color:
                        item.time === selectedTime
                          ? "var(--color-secondary-dark)"
                          : "var(--color-text-primary)",
                    }}
                  >
                    {item.time}
                  </h2>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3 md:col-span-2">
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("booking.phone")} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("booking.phonePlaceholder")}
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                  required
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t("booking.notes")}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("booking.notesPlaceholder")}
                  maxLength={500}
                  rows={3}
                  className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <Button
            className="text-white"
            style={{ background: "var(--color-accent)" }}
            onClick={() => booking()}
            disabled={!(date && selectedTime && phone.trim())}
          >
            {t("doctor.bookAppointment")}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BookAppointment;
