import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const formatDateTime = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function NotificationsTab({
  t,
  isRTL,
  locale,
  notifications,
  unreadCount,
  onMarkAllAsRead,
  onMarkAsRead,
}) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{
        background: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {t("notifications.title", "Notifications")}
          </h3>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t(
              "notifications.subtitle",
              "Track your latest updates and booking alerts.",
            )}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          {t("notifications.markAllAsRead")}
        </Button>
      </div>

      {notifications.length === 0 ? (
        <p
          className="mt-6 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {t("notifications.noNotifications")}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((item) => {
            const title = isRTL ? item.titleAr || item.title : item.title;
            const message = isRTL
              ? item.messageAr || item.message
              : item.message;

            return (
              <article
                key={item.id}
                className="rounded-xl border p-4"
                style={{
                  borderColor: item.isRead
                    ? "var(--color-border)"
                    : "var(--color-primary-light)",
                  background: item.isRead
                    ? "transparent"
                    : "var(--color-primary-50)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {title}
                    </p>

                    <p
                      className="mt-1 text-sm"
                      style={{
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {message}
                    </p>

                    <p
                      className="mt-2 text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formatDateTime(item.createdAt, locale)}
                    </p>
                  </div>

                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      color: item.isRead
                        ? "var(--color-text-secondary)"
                        : "var(--color-primary)",
                      background: item.isRead
                        ? "var(--color-bg-tertiary)"
                        : "var(--color-primary-light)",
                    }}
                  >
                    <Bell className="h-4 w-4" />
                  </span>
                </div>

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={() => onMarkAsRead(item.id)}
                    className="mt-3 text-sm font-medium"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {t("notifications.markAsRead")}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default NotificationsTab;
