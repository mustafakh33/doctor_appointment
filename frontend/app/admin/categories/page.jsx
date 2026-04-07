"use client";

import React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/app/_context/LanguageContext";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "@/app/_utils/Api";
import Loading from "@/app/_components/loading";

const defaultForm = { name: "", name_ar: "", icon: null };

export default function AdminCategoriesPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(defaultForm);
  const [categories, setCategories] = React.useState([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      toast.error(
        t("admin.categories.errorFetching") || "Failed to fetch categories",
      );
      console.error("Error loading categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  React.useEffect(() => {
    load();
  }, [load]);

  const submit = async (event) => {
    event.preventDefault();

    // Validate form
    if (!form.name.trim() || !form.name_ar.trim()) {
      toast.error(
        t("admin.categories.nameRequired") ||
          "Please enter both English and Arabic names",
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("name_ar", form.name_ar);
    if (form.icon) formData.append("icon", form.icon);

    try {
      const result = editing
        ? await updateCategory(editing.id, formData)
        : await createCategory(formData);

      if (!result) {
        toast.error(
          editing
            ? t("admin.categories.errorUpdating") || "Failed to update category"
            : t("admin.categories.errorCreating") ||
                "Failed to create category",
        );
        return;
      }

      toast.success(
        editing
          ? t("admin.categories.updated") || "Category updated successfully"
          : t("admin.categories.created") || "Category created successfully",
      );

      setOpen(false);
      setEditing(null);
      setForm(defaultForm);
      await load();
    } catch (error) {
      toast.error(
        error?.message ||
          (editing
            ? t("admin.categories.errorUpdating") || "Failed to update category"
            : t("admin.categories.errorCreating") ||
              "Failed to create category"),
      );
      console.error("Error submitting category:", error);
    }
  };

  const onDelete = async (id) => {
    try {
      const success = await deleteCategory(id);
      if (!success) {
        toast.error(
          t("admin.categories.errorDeleting") || "Failed to delete category",
        );
        return;
      }
      toast.success(
        t("admin.categories.deleted") || "Category deleted successfully",
      );
      await load();
    } catch (error) {
      toast.error(
        error?.message ||
          t("admin.categories.errorDeleting") ||
          "Failed to delete category",
      );
      console.error("Error deleting category:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {t("admin.sidebar.categories")}
        </h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm(defaultForm);
            setOpen(true);
          }}
        >
          {t("admin.categories.addCategory")}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.length === 0 ? (
          <p style={{ color: "var(--color-text-secondary)" }}>
            {t("admin.table.noData")}
          </p>
        ) : (
          categories.map((item) => (
            <div key={item.id} className="card-surface rounded-xl p-4">
              <div className="flex items-center gap-3">
                {item?.icon?.url ? (
                  <Image
                    src={item.icon.url}
                    alt={item.name}
                    width={52}
                    height={52}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div
                    className="h-[52px] w-[52px] rounded-md"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  />
                )}
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {(item?.doctors || []).length} {t("admin.sidebar.doctors")}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(item);
                    setForm({
                      name: item.name || "",
                      name_ar: item.name_ar || "",
                      icon: null,
                    });
                    setOpen(true);
                  }}
                >
                  {t("common.edit")}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">{t("common.delete")}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("admin.categories.deleteConfirm")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {item.name}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("common.cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)}>
                        {t("common.delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? t("admin.categories.editCategory")
                : t("admin.categories.addCategory")}
            </DialogTitle>
            <DialogDescription>
              {t("admin.sidebar.categories")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Department Name (EN)"
              className="w-full rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              required
              value={form.name_ar}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name_ar: event.target.value }))
              }
              placeholder="اسم القسم (AR)"
              className="w-full rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  icon: event.target.files?.[0] || null,
                }))
              }
              className="w-full rounded-md border px-3 py-2"
              style={{ borderColor: "var(--color-border)" }}
            />
            <DialogFooter>
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
