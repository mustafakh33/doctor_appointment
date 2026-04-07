"use client";

import React from "react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { getAdminPatients } from "@/app/_utils/Api";
import Loading from "@/app/_components/loading";

export default function AdminPatientsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [patients, setPatients] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAdminPatients();
      setPatients(data);
      setLoading(false);
    };

    load();
  }, []);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter((item) =>
      `${item?.name || ""} ${item?.email || ""}`.toLowerCase().includes(term),
    );
  }, [patients, search]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("admin.sidebar.patients")}
      </h1>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t("admin.patients.searchPlaceholder")}
        className="w-full rounded-lg border px-3 py-2 outline-none"
        style={{ borderColor: "var(--color-border)", background: "white" }}
      />

      <div className="card-surface overflow-x-auto rounded-xl p-3">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <th className="px-2 py-2 text-left">{t("admin.table.name")}</th>
              <th className="px-2 py-2 text-left">{t("admin.table.email")}</th>
              <th className="px-2 py-2 text-left">{t("admin.table.phone")}</th>
              <th className="px-2 py-2 text-left">
                {t("admin.patients.joinDate")}
              </th>
              <th className="px-2 py-2 text-left">
                {t("admin.patients.appointmentsCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-2 py-4 text-center"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("admin.table.noData")}
                </td>
              </tr>
            ) : (
              filtered.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="px-2 py-3">{patient.name}</td>
                  <td className="px-2 py-3">{patient.email}</td>
                  <td className="px-2 py-3">{patient.phone || "-"}</td>
                  <td className="px-2 py-3">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-3">
                    {patient.appointmentsCount || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
