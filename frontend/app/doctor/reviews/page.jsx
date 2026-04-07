"use client";

import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import PageHeader, { EmptyState } from "../_components/DoctorPageComponents";

const SAMPLE_REVIEWS = [
  {
    id: 1,
    patient: "Ahmed Ali",
    rating: 5,
    comment: "Excellent doctor, very professional and caring",
    date: "2026-04-08",
  },
  {
    id: 2,
    patient: "Fatima Hassan",
    rating: 4,
    comment: "Good service, would recommend",
    date: "2026-04-05",
  },
  {
    id: 3,
    patient: "Mohamed Ibrahim",
    rating: 5,
    comment: "Very helpful, solved my problem immediately",
    date: "2026-04-02",
  },
  {
    id: 4,
    patient: "Hana Ahmed",
    rating: 3,
    comment: "Average experience but professional",
    date: "2026-03-28",
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className="h-4 w-4"
        style={{
          color: i < rating ? "#FFB84D" : "var(--color-border)",
          fill: i < rating ? "#FFB84D" : "none",
        }}
      />
    ))}
  </div>
);

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [reviews] = React.useState(SAMPLE_REVIEWS);

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="space-y-6 p-4 md:px-20 md:py-8">
      <PageHeader
        title="Reviews"
        subtitle="Patient feedback and ratings"
        icon={Star}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Average Rating
          </p>
          <p
            className="text-4xl font-bold mt-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {avgRating}
          </p>
          <div className="mt-3">
            <StarRating rating={Math.round(avgRating)} />
          </div>
          <p
            className="text-sm mt-4"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Based on {reviews.length} reviews
          </p>
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            background: "var(--color-bg-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Total Reviews
          </p>
          <p
            className="text-4xl font-bold mt-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {reviews.length}
          </p>
          <p
            className="text-sm mt-4"
            style={{ color: "var(--color-text-secondary)" }}
          >
            From verified patients
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews yet"
          description="Start getting reviews from your patients"
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border p-6"
              style={{
                background: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {review.patient}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {review.date}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p style={{ color: "var(--color-text-primary)" }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
