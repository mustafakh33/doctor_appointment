"use client";

import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";

import { rescheduleBooking } from "@/app/_utils/Api";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/_context/LanguageContext";

function RescheduleDialog({ appointment, onReschedule }) {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date(appointment?.date || new Date()));
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const timeSlots = useMemo(() => {
    const list = [];

    const formatSlot = (hour, minute) => {
      const slotDate = new Date();
      slotDate.setHours(hour, minute, 0, 0);

      return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(slotDate);
    };

    for (let i = 10; i <= 12; i += 1) {
      list.push(formatSlot(i, 0));
      list.push(formatSlot(i, 30));
    }

    for (let i = 13; i <= 17; i += 1) {
      list.push(formatSlot(i, 0));
      list.push(formatSlot(i, 30));
    }

    return list;
  }, [locale]);

  const disablePastDays = (day) =>
    day < new Date(new Date().setHours(0, 0, 0, 0));

  const handleConfirm = async () => {
    if (!date || !selectedTime) return;

    setLoading(true);
    const result = await rescheduleBooking(
      appointment?.documentId,
      date,
      selectedTime,
    );

    if (result) {
      toast.success(t("booking.rescheduleSuccess"));
      await onReschedule();
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarClock className="h-4 w-4" />
          {t("booking.reschedule")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("booking.reschedule")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
              disabled={disablePastDays}
            />
          </div>

          <div>
            <div
              className="grid grid-cols-3 gap-2 rounded-lg border p-3"
              style={{ borderColor: "var(--color-border)" }}
            >
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className="cursor-pointer rounded-full border p-2 text-center text-xs font-medium"
                  style={{
                    borderColor: "var(--color-border)",
                    background:
                      time === selectedTime
                        ? "var(--color-secondary-light)"
                        : "transparent",
                    color:
                      time === selectedTime
                        ? "var(--color-secondary-dark)"
                        : "var(--color-text-primary)",
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          className="text-white"
          style={{ background: "var(--color-accent)" }}
          onClick={handleConfirm}
          disabled={!date || !selectedTime || loading}
        >
          {loading ? t("common.loading") : t("booking.reschedule")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default RescheduleDialog;
