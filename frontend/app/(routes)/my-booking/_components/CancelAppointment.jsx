"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/app/_context/LanguageContext";
import { cancelBooking } from "@/app/_utils/Api";

function CancelAppointment({ appointment, onCanceled }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await cancelBooking(appointment.documentId, reason);

    if (result) {
      toast.success(t("booking.cancelled"));
      await onCanceled();
    }

    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setReason("");
    }, 800);
  };

  if (appointment?.status === "canceled") return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          {t("booking.cancel")}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("booking.confirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("booking.cancelConfirm")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("booking.cancelReasonPlaceholder")}
          maxLength={300}
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("common.cancel")}
          </AlertDialogCancel>

          <AlertDialogAction onClick={handleCancel} disabled={loading}>
            {loading ? t("common.loading") : t("common.next")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CancelAppointment;
