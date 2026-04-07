"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  createDoctor,
  deleteDoctor,
  getAdminCategories,
  getAdminDoctors,
  updateDoctor,
} from "@/app/_utils/Api";
import Loading from "@/app/_components/loading";

const defaultForm = {
  name: "",
  name_ar: "",
  address: "",
  address_ar: "",
  about: "",
  about_ar: "",
  phone: "",
  category: "",
  year_of_experience: "",
  appointment_fee: "",
  image: null,
};

export default function AdminDoctorsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(defaultForm);
  const [doctors, setDoctors] = React.useState([]);
  const [categories, setCategories] = React.useState([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    const [doctorsData, categoriesData] = await Promise.all([
      getAdminDoctors(),
      getAdminCategories(),
    ]);
    setDoctors(doctorsData);
    setCategories(categoriesData);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    const result = editing
      ? await updateDoctor(editing.id, formData)
      : await createDoctor(formData);

    if (!result) return;

    setOpen(false);
    setEditing(null);
    setForm(defaultForm);
    await load();
  };

  const onDelete = async (id) => {
    const success = await deleteDoctor(id);
    if (!success) return;
    toast.success(t("admin.doctors.deleted"));
    await load();
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("admin.sidebar.doctors")}
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm(defaultForm);
            setOpen(true);
          }}
        >
          {t("admin.doctors.addDoctor")}
        </Button>
      </div>

      <div className="card-surface overflow-x-auto rounded-xl p-3">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <th className="px-2 py-2 text-left">Image</th>
              <th className="px-2 py-2 text-left">{t("admin.table.name")}</th>
              <th className="px-2 py-2 text-left">
                {t("admin.sidebar.categories")}
              </th>
              <th className="px-2 py-2 text-left">{t("admin.table.phone")}</th>
              <th className="px-2 py-2 text-left">
                {t("doctor.yearOfExperience")}
              </th>
              <th className="px-2 py-2 text-left">{t("doctor.fee")}</th>
              <th className="px-2 py-2 text-left">
                {t("admin.stats.avgRating")}
              </th>
              <th className="px-2 py-2 text-left">
                {t("admin.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-2 py-4 text-center"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {t("admin.table.noData")}
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr
                  key={doctor.id}
                  className="border-b"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <td className="px-2 py-3">
                    {doctor?.image?.url ? (
                      <Image
                        src={doctor.image.url}
                        alt={doctor.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div
                        className="h-[50px] w-[50px] rounded-md"
                        style={{ background: "var(--color-bg-tertiary)" }}
                      />
                    )}
                  </td>
                  <td className="px-2 py-3">{doctor.name}</td>
                  <td className="px-2 py-3">{doctor?.category?.name || "-"}</td>
                  <td className="px-2 py-3">{doctor.phone}</td>
                  <td className="px-2 py-3">{doctor.year_of_experience}</td>
                  <td className="px-2 py-3">{doctor.appointment_fee}</td>
                  <td className="px-2 py-3">{doctor.ratingsAverage || 0}</td>
                  <td className="px-2 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditing(doctor);
                          setForm({
                            name: doctor.name || "",
                            name_ar: doctor.name_ar || "",
                            address: doctor.address || "",
                            address_ar: doctor.address_ar || "",
                            about: doctor.about || "",
                            about_ar: doctor.about_ar || "",
                            phone: doctor.phone || "",
                            category:
                              doctor?.category?.id || doctor?.category || "",
                            year_of_experience: String(
                              doctor.year_of_experience || "",
                            ),
                            appointment_fee: String(
                              doctor.appointment_fee || "",
                            ),
                            image: null,
                          });
                          setOpen(true);
                        }}
                      >
                        {t("common.edit")}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            {t("common.delete")}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("admin.doctors.deleteConfirm")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {doctor.name}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {t("common.cancel")}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(doctor.id)}
                            >
                              {t("common.delete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? t("admin.doctors.editDoctor")
                : t("admin.doctors.addDoctor")}
            </DialogTitle>
            <DialogDescription>{t("admin.sidebar.doctors")}</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
            <input
              required
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Name (EN)"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              value={form.name_ar}
              onChange={(e) => onChange("name_ar", e.target.value)}
              placeholder="Name (AR)"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              required
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Address (EN)"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              value={form.address_ar}
              onChange={(e) => onChange("address_ar", e.target.value)}
              placeholder="Address (AR)"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <textarea
              required
              value={form.about}
              onChange={(e) => onChange("about", e.target.value)}
              placeholder="About (EN)"
              className="rounded-md border px-3 py-2 md:col-span-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <textarea
              value={form.about_ar}
              onChange={(e) => onChange("about_ar", e.target.value)}
              placeholder="About (AR)"
              className="rounded-md border px-3 py-2 md:col-span-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              required
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="Phone"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <select
              required
              value={form.category}
              onChange={(e) => onChange("category", e.target.value)}
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              min="0"
              value={form.year_of_experience}
              onChange={(e) => onChange("year_of_experience", e.target.value)}
              placeholder="Experience (years)"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              required
              type="number"
              min="0"
              value={form.appointment_fee}
              onChange={(e) => onChange("appointment_fee", e.target.value)}
              placeholder="Fee"
              className="rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onChange("image", e.target.files?.[0] || null)}
              className="rounded-md border px-3 py-2 md:col-span-2"
              style={{ borderColor: "var(--color-border)" }}
            />

            <DialogFooter className="md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("common.save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
