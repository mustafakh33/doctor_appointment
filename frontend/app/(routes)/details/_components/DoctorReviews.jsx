"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createReview, getReviewsByDoctor } from "@/app/_utils/Api";
import { useAuth } from "@/app/_context/AuthContext";
import { useLanguage } from "@/app/_context/LanguageContext";
import { toast } from "sonner";

const starValues = [1, 2, 3, 4, 5];

const renderStars = (value = 0) => {
  return starValues.map((star) => (
    <Star
      key={star}
      className={`h-4 w-4 ${star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
    />
  ));
};

function DoctorReviews({ doctor }) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const summary = useMemo(() => {
    const total = reviews.length;
    const average =
      total === 0
        ? doctor?.ratingsAverage || 0
        : reviews.reduce(
            (accumulator, item) => accumulator + (item?.rating || 0),
            0,
          ) / total;

    return { total, average };
  }, [doctor?.ratingsAverage, reviews]);

  const loadReviews = async () => {
    setLoading(true);
    const data = await getReviewsByDoctor(doctor?.documentId);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    if (doctor?.documentId) {
      loadReviews();
    }
  }, [doctor?.documentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      toast.warning(t("reviews.loginToReview"));
      return;
    }

    if (!comment.trim()) {
      toast.error(t("common.required"));
      return;
    }

    setSubmitting(true);

    try {
      await createReview({
        userName:
          user?.name || user?.email?.split("@")[0] || t("reviews.guest"),
        email: user?.email,
        doctor: doctor?.documentId,
        rating: Number(rating),
        comment: comment.trim(),
      });

      toast.success(t("reviews.submitted"));
      setComment("");
      setRating(5);
      await loadReviews();
    } catch (error) {
      toast.error(error?.message || t("reviews.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="space-y-6 rounded-2xl border p-5"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-surface-1)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3
            className="text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("reviews.title")}
          </h3>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {summary.total} {t("doctor.reviews")}
          </p>
        </div>

        <div
          className="flex items-center gap-2 rounded-full px-4 py-2"
          style={{ background: "var(--color-bg-secondary)" }}
        >
          <div className="flex items-center gap-1">
            {renderStars(summary.average)}
          </div>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {summary.average ? summary.average.toFixed(1) : "0.0"}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl p-4"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {starValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="rounded-full px-3 py-1 text-sm"
              style={{
                background: "var(--color-surface-2)",
                color: "var(--color-text-primary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span className="inline-flex items-center gap-1">
                <Star
                  className={`h-4 w-4 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                />
                {value}
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          placeholder={
            isAuthenticated
              ? t("reviews.commentPlaceholder")
              : t("reviews.loginToReview")
          }
          disabled={!isAuthenticated}
          className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface-1)",
            color: "var(--color-text-primary)",
          }}
        />

        <div className="flex items-center justify-between gap-3">
          {!isAuthenticated ? (
            <Link
              href="/auth/login"
              className="text-sm font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              {t("reviews.loginToReview")}
            </Link>
          ) : (
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("reviews.thankYou")}
            </p>
          )}

          <Button type="submit" disabled={submitting || !isAuthenticated}>
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("reviews.submitting")}
              </span>
            ) : (
              t("reviews.submitReview")
            )}
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="rounded-xl border border-dashed p-6 text-center text-sm"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <p className="font-semibold">{t("emptyState.noReviewsTitle")}</p>
          <p className="mt-2">{t("emptyState.noReviewsText")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review.documentId}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {review?.userName ||
                      review?.email ||
                      t("reviews.anonymous")}
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {review?.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : t("reviews.recently")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review?.rating)}
                </div>
              </div>
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {review?.comment || t("reviews.noComment")}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorReviews;
