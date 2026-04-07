"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Loading from "@/app/_components/loading";
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  confirmPayment,
  createPaymentIntent,
  getAppointmentById,
} from "@/app/_utils/Api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_missing_key",
);

function CheckoutForm({ appointment, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (result.error) {
      toast.error(t("payment.failed"));
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      await confirmPayment({
        appointmentId: appointment.documentId,
        paymentIntentId: result.paymentIntent.id,
        amountPaid:
          result.paymentIntent.amount_received ||
          appointment?.doctor?.appointment_fee ||
          0,
      });
      toast.success(t("payment.success"));
      router.push("/dashboard?tab=bookings");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4 rounded-3xl border p-6"
      style={{
        background: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="rounded-2xl border p-4"
        style={{
          background: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("payment.summary")}
        </h2>
        <div
          className="mt-3 space-y-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <p>
            <strong>{t("doctor.name")}:</strong>{" "}
            {appointment?.doctor?.name || "-"}
          </p>
          <p>
            <strong>{t("payment.amount")}:</strong>{" "}
            {appointment?.doctor?.appointment_fee || 0} {t("payment.currency")}
          </p>
          <p>
            <strong>{t("booking.dateTime")}:</strong> {appointment?.date} -{" "}
            {appointment?.time}
          </p>
          <p>
            <strong>{t("payment.status")}:</strong>{" "}
            {t(`payment.${appointment?.paymentStatus || "unpaid"}`)}
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border p-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="text-white"
          style={{ background: "var(--color-primary)" }}
        >
          {loading ? t("payment.processing") : t("payment.payNow")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard?tab=bookings")}
        >
          {t("payment.skip")}
        </Button>
      </div>
    </form>
  );
}

function CheckoutPage() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [appointment, setAppointment] = React.useState(null);
  const [clientSecret, setClientSecret] = React.useState("");

  React.useEffect(() => {
    const loadCheckout = async () => {
      if (!appointmentId) {
        setLoading(false);
        return;
      }

      const [appointmentData, secret] = await Promise.all([
        getAppointmentById(appointmentId),
        createPaymentIntent(appointmentId),
      ]);

      setAppointment(appointmentData);
      setClientSecret(secret);
      setLoading(false);
    };

    loadCheckout();
  }, [appointmentId]);

  return (
    <ProtectedRoute>
      <div className="page-shell md:px-20">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("payment.title")}
        </h1>

        {loading ? (
          <div className="mt-8">
            <Loading />
          </div>
        ) : !appointmentId || !appointment ? (
          <div
            className="mt-8 rounded-2xl border p-6"
            style={{
              background: "var(--color-bg-primary)",
              borderColor: "var(--color-border)",
            }}
          >
            <p style={{ color: "var(--color-text-primary)" }}>
              Appointment not found.
            </p>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              appointment={appointment}
              clientSecret={clientSecret}
            />
          </Elements>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default CheckoutPage;
