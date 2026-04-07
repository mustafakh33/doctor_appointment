"use client";

import React from "react";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/app/_context/LanguageContext";
import PageHeader, { EmptyState } from "../_components/DoctorPageComponents";

const SAMPLE_PATIENTS = [
  {
    id: 1,
    name: "Ahmed Ali",
    phone: "01012345678",
    lastVisit: "2026-04-08",
    visits: 5,
  },
  {
    id: 2,
    name: "Fatima Hassan",
    phone: "01123456789",
    lastVisit: "2026-04-05",
    visits: 3,
  },
  {
    id: 3,
    name: "Mohamed Ibrahim",
    phone: "01234567890",
    lastVisit: "2026-04-02",
    visits: 8,
  },
  {
    id: 4,
    name: "Hana Ahmed",
    phone: "01345678901",
    lastVisit: "2026-03-28",
    visits: 2,
  },
];

export default function PatientsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = React.useState("");
  const [patients, setPatients] = React.useState(SAMPLE_PATIENTS);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  );

  return (
    <div className="space-y-6 p-4 md:px-20 md:py-8">
      <PageHeader
        title="Patients"
        subtitle="View and manage your patients"
        icon={Users}
      />

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: "var(--color-text-muted)" }}
        />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description="No patients match your search"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="rounded-2xl border p-6"
              style={{
                background: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {patient.name}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {patient.phone}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "var(--color-primary-50)",
                    color: "var(--color-primary)",
                  }}
                >
                  {patient.visits} visits
                </span>
              </div>
              <div
                className="pt-4 border-t space-y-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Last Visit
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-primary)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {patient.lastVisit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
