"use client";

import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/app/_context/LanguageContext";
import { getAdminReports } from "@/app/_utils/Api";
import Loading from "@/app/_components/loading";

const pieColors = ["#4a6fa5", "#27ae60", "#eb5757", "#f2994a"];

export default function AdminReportsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [reports, setReports] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAdminReports();
      setReports(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <Loading />;

  const statusChartData = Object.entries(
    reports?.appointmentsByStatus || {},
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {t("admin.sidebar.reports")}
      </h1>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card-surface rounded-xl p-5">
          <h2
            className="mb-3 font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("admin.reports.appointmentsOverTime")}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reports?.appointmentsPerMonth || []}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4a6fa5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-surface rounded-xl p-5">
          <h2
            className="mb-3 font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("admin.reports.appointmentsByStatus")}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-surface rounded-xl p-5">
          <h2
            className="mb-3 font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("admin.reports.topDoctors")}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reports?.topDoctors || []}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#27ae60" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-surface rounded-xl p-5">
          <h2
            className="mb-3 font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("admin.reports.newPatients")}
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reports?.newPatientsPerMonth || []}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#eb5757"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
