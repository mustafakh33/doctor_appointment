"use client";

import React from "react";
import { Calendar, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/app/_context/LanguageContext";
import { toast } from "sonner";
import PageHeader, { EmptyState } from "../_components/DoctorPageComponents";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SchedulePage() {
  const { t } = useLanguage();
  const [schedule, setSchedule] = React.useState({
    workingDays: [],
    slots: [],
  });
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(form.startTime.split(":")[0]);
    const end = parseInt(form.endTime.split(":")[0]);
    const duration = form.slotDuration;

    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        slots.push(`${form.day} - ${timeStr}`);
      }
    }
    return slots;
  };

  const handleAddSlot = () => {
    if (!form.startTime || !form.endTime) {
      toast.error("Please select both start and end times");
      return;
    }
    const slots = generateTimeSlots();
    setSchedule((prev) => ({
      ...prev,
      slots: [...new Set([...prev.slots, ...slots])],
    }));
    toast.success("Slots generated successfully");
  };

  const handleSaveSchedule = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Schedule saved successfully");
    } catch (error) {
      toast.error("Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  const previewSlots = generateTimeSlots();

  return (
    <div className="space-y-6 p-4 md:px-20 md:py-8">
      <PageHeader
        title="Schedule"
        subtitle="Manage your working hours"
        icon={Calendar}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-2xl border p-6 space-y-6"
          style={{
            background: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          <div>
            <h3
              className="font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Select Working Days
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {DAYS.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-3 cursor-pointer rounded-lg p-3"
                  style={{
                    background: schedule.workingDays.includes(day)
                      ? "var(--color-primary-50)"
                      : "var(--color-bg-secondary)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={schedule.workingDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {day}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div
            className="pt-4 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3
              className="font-semibold mb-4"
              style={{ color: "var(--color-text-primary)" }}
            >
              Set Working Hours
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-2">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Start Time
                  </span>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    className="h-10 rounded-lg"
                  />
                </label>
                <label className="space-y-2">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    End Time
                  </span>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    className="h-10 rounded-lg"
                  />
                </label>
              </div>
              <label className="space-y-2">
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Slot Duration (minutes)
                </span>
                <select
                  value={form.slotDuration}
                  onChange={(e) =>
                    setForm({ ...form, slotDuration: parseInt(e.target.value) })
                  }
                  className="w-full h-10 rounded-lg px-3 border"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-bg-secondary)",
                  }}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </label>
            </div>
          </div>
          <Button
            onClick={handleAddSlot}
            className="w-full rounded-lg py-2 text-white"
            style={{ background: "var(--color-primary)" }}
          >
            <Plus className="h-4 w-4 mr-2" /> Generate Slots
          </Button>
        </div>
        <div
          className="rounded-2xl border p-6 space-y-4"
          style={{
            background: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Time Slots Preview
          </h3>
          {previewSlots.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No slots generated"
              description="Configure working hours above"
            />
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {previewSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "var(--color-bg-secondary)" }}
                >
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {slot}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: "var(--color-primary-50)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Available
                  </span>
                </div>
              ))}
            </div>
          )}
          <Button
            onClick={handleSaveSchedule}
            disabled={loading || schedule.slots.length === 0}
            className="w-full rounded-lg py-2 text-white mt-4"
            style={{ background: "var(--color-success)" }}
          >
            {loading ? "Saving..." : "Save Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
}
