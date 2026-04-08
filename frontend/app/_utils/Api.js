import api from "@/src/api/api";

const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL || "http://localhost:8000";
const AUTH_STORAGE_KEY = "doctor_appointment_auth";

const parseResponseData = (response) => {
  return response?.data?.data ?? response?.data?.user ?? response?.data;
};

const toAbsoluteAssetUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const parsed = new URL(value);
      const isLocalHost =
        parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";

      if (!isLocalHost) return value;

      // Some seeded records store frontend-local absolute URLs.
      // Convert them to a portable path so they resolve on Vercel.
      if (parsed.pathname.startsWith("/assets/")) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      // For backend-hosted local URLs (/uploads...), map to configured backend origin.
      return `${ASSET_BASE_URL}${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return value;
    }
  }
  if (value.startsWith("/")) return `${ASSET_BASE_URL}${value}`;
  return `${ASSET_BASE_URL}/${value}`;
};

const normalizeMedia = (value) => {
  if (!value) return { url: "" };
  if (typeof value === "string") return { url: toAbsoluteAssetUrl(value) };
  if (typeof value === "object" && value.url) {
    return { ...value, url: toAbsoluteAssetUrl(value.url) };
  }
  return { url: "" };
};

const normalizeCategory = (category) => {
  if (!category) return null;
  const doctorsList = Array.isArray(category.doctors) ? category.doctors : [];
  return {
    ...category,
    name_ar: category.name_ar,
    id: category._id || category.id,
    documentId: category._id || category.documentId || category.id,
    icon: normalizeMedia(category.icon),
    doctorsCount: doctorsList.length,
  };
};

const normalizeDoctor = (doctor) => {
  if (!doctor) return null;

  const normalizedCategory =
    doctor.category && typeof doctor.category === "object"
      ? normalizeCategory(doctor.category)
      : doctor.categoryId && typeof doctor.categoryId === "object"
        ? normalizeCategory(doctor.categoryId)
        : null;

  const normalizedCategoryId =
    (typeof doctor.categoryId === "string" && doctor.categoryId) ||
    (typeof doctor.categoryId === "object" &&
      (doctor.categoryId._id || doctor.categoryId.id)) ||
    (typeof doctor.category === "object" &&
      (doctor.category._id || doctor.category.id)) ||
    "";

  return {
    ...doctor,
    name_ar: doctor.name_ar,
    address_ar: doctor.address_ar,
    about_ar: doctor.about_ar,
    id: doctor._id || doctor.id,
    documentId: doctor._id || doctor.documentId || doctor.id,
    image: normalizeMedia(doctor.image),
    categoryId: normalizedCategoryId,
    category: normalizedCategory,
  };
};

const normalizeAppointment = (appointment) => {
  if (!appointment) return null;
  return {
    ...appointment,
    id: appointment._id || appointment.id,
    documentId: appointment._id || appointment.documentId || appointment.id,
    doctor:
      appointment.doctor && typeof appointment.doctor === "object"
        ? normalizeDoctor(appointment.doctor)
        : appointment.doctor,
  };
};

const normalizeReview = (review) => {
  if (!review) return null;

  return {
    ...review,
    id: review._id || review.id,
    documentId: review._id || review.documentId || review.id,
    doctor:
      review.doctor && typeof review.doctor === "object"
        ? normalizeDoctor(review.doctor)
        : review.doctor,
  };
};

const normalizeSchedule = (schedule) => {
  if (!schedule) return null;

  return {
    ...schedule,
    id: schedule._id || schedule.id,
    documentId: schedule._id || schedule.documentId || schedule.id,
    timeSlots: Array.isArray(schedule.timeSlots)
      ? schedule.timeSlots.map((slot) => ({
        ...slot,
        id: slot?._id || slot?.id,
        documentId: slot?._id || slot?.documentId || slot?.id,
      }))
      : [],
  };
};

const normalizeSlot = (slot) => {
  if (!slot) return null;

  return {
    ...slot,
    id: slot._id || slot.id,
    documentId: slot._id || slot.documentId || slot.id,
  };
};

const normalizeNotification = (notification) => {
  if (!notification) return null;

  return {
    ...notification,
    id: notification._id || notification.id,
    documentId: notification._id || notification.documentId || notification.id,
    relatedAppointment:
      notification.relatedAppointment &&
        typeof notification.relatedAppointment === "object"
        ? normalizeAppointment(notification.relatedAppointment)
        : notification.relatedAppointment,
  };
};

const normalizeDoctorDashboard = (dashboard) => {
  if (!dashboard) return null;

  const normalizeDashboardPatient = (patient, index) => {
    if (!patient) return null;

    const normalizedId =
      patient.id ||
      patient._id ||
      patient.documentId ||
      patient.email ||
      `patient-${index}`;

    return {
      ...patient,
      id: normalizedId,
      documentId: normalizedId,
    };
  };

  return {
    ...dashboard,
    doctor:
      dashboard.doctor && typeof dashboard.doctor === "object"
        ? normalizeDoctor(dashboard.doctor)
        : dashboard.doctor,
    recentAppointments: Array.isArray(dashboard.recentAppointments)
      ? dashboard.recentAppointments.map((item) => normalizeAppointment(item))
      : [],
    upcomingAppointments: Array.isArray(dashboard.upcomingAppointments)
      ? dashboard.upcomingAppointments.map((item) => normalizeAppointment(item))
      : [],
    patients: Array.isArray(dashboard.patients)
      ? dashboard.patients
        .map((item, index) => normalizeDashboardPatient(item, index))
        .filter(Boolean)
      : [],
  };
};

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    ...user,
    cityArea: user.cityArea,
    cityArea_ar: user.cityArea_ar,
    id: user._id || user.id,
    documentId: user._id || user.documentId || user.id,
    profileImage: normalizeMedia(user.profileImage),
  };
};

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const createApiError = (error, fallback = "Request failed") => {
  const normalized = new Error(getErrorMessage(error, fallback));
  normalized.statusCode = error?.response?.status;
  normalized.payload = error?.response?.data;
  return normalized;
};

export const persistAuth = (payload) => {
  if (typeof window === "undefined") return null;

  if (!payload) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem("doctor_appointment_token");
    return null;
  }

  const normalizedUser = normalizeUser(payload.user || payload?.data?.user || payload);
  const token = payload.token || payload?.data?.token || payload?.accessToken || "";
  const session = { user: normalizedUser, token };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  if (token) {
    window.localStorage.setItem("doctor_appointment_token", token);
  }

  return session;
};

export const readAuth = () => {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsedValue = JSON.parse(rawValue);
    return {
      ...parsedValue,
      user: normalizeUser(parsedValue?.user),
    };
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem("doctor_appointment_token");
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return persistAuth(parseResponseData(response));
};

export const registerUser = async (payload) => {
  const isMultipart =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const response = await api.post("/auth/register", payload, isMultipart
    ? {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    : undefined);
  return persistAuth(parseResponseData(response));
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");
  return normalizeUser(parseResponseData(response));
};

export const updateCurrentUser = async (payload) => {
  const isMultipart =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const response = await api.patch("/users/me", payload, isMultipart
    ? {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    : undefined);
  return normalizeUser(parseResponseData(response));
};

export const requestPasswordReset = async (payload) => {
  const response = await api.post("/auth/forgot-password", payload);
  return parseResponseData(response);
};

export const verifyResetCode = async (payload) => {
  const response = await api.post("/auth/verify-reset-code", payload);
  return parseResponseData(response);
};

export const resetPassword = async (payload) => {
  const response = await api.post("/auth/reset-password", payload);
  return parseResponseData(response);
};

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    const categories = parseResponseData(response);
    return Array.isArray(categories)
      ? categories.map((item) => normalizeCategory(item))
      : [];
  } catch (error) {
    console.error("Error fetching categories:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`);
    const category = parseResponseData(response);
    return category ? normalizeCategory(category) : null;
  } catch (error) {
    console.error("Error fetching category:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getDoctors = async (params = {}) => {
  try {
    const response = await api.get("/doctors", {
      params,
    });
    const doctors = parseResponseData(response);
    return Array.isArray(doctors) ? doctors.map((item) => normalizeDoctor(item)) : [];
  } catch (error) {
    console.error("Error fetching doctors:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const getClinic = async () => {
  try {
    const response = await api.get("/clinic");
    return parseResponseData(response);
  } catch (error) {
    console.error("Error fetching clinic:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getDoctorsByCategory = async (categoryIdOrName) => {
  try {
    const response = await api.get("/doctors");
    const doctors = Array.isArray(parseResponseData(response))
      ? parseResponseData(response).map((item) => normalizeDoctor(item))
      : [];

    if (!categoryIdOrName) return doctors;

    const requested = String(categoryIdOrName).trim().toLowerCase();

    return doctors.filter((doctor) =>
      String(doctor?.categoryId || "").toLowerCase() === requested ||
      String(doctor?.category?.name || "").toLowerCase().includes(requested)
    );
  } catch (error) {
    console.error(
      "Error fetching doctors by category:",
      getErrorMessage(error, "Unknown error")
    );
    return [];
  }
};

export const getDoctorById = async (documentId) => {
  try {
    const response = await api.get(`/doctors/${documentId}`);
    const doctor = parseResponseData(response);
    return doctor ? normalizeDoctor(doctor) : null;
  } catch (error) {
    console.error("Error fetching doctor details:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getDoctorSchedule = async (doctorId) => {
  try {
    const response = await api.get(`/schedules/doctor/${doctorId}`);
    const schedule = parseResponseData(response);
    return schedule ? normalizeSchedule(schedule) : null;
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode === 404) {
      // Expected for doctors who have not configured their schedule yet.
      return null;
    }

    console.error("Error fetching doctor schedule:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const updateDoctorProfile = async (payload) => {
  try {
    const response = await api.patch(
      "/doctor/profile",
      payload,
      typeof FormData !== "undefined" && payload instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
    );
    return normalizeDoctor(parseResponseData(response)?.doctor || parseResponseData(response));
  } catch (error) {
    console.error("Error updating doctor profile:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getDoctorAppointments = async () => {
  try {
    const response = await api.get("/doctor/bookings");
    const appointments = parseResponseData(response);
    return Array.isArray(appointments)
      ? appointments.map((item) => normalizeAppointment(item))
      : [];
  } catch (error) {
    console.error("Error fetching doctor appointments:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const getDoctorPatients = async () => {
  try {
    const response = await api.get("/doctor/patients");
    const patients = parseResponseData(response);
    return Array.isArray(patients) ? patients : [];
  } catch (error) {
    console.error("Error fetching doctor patients:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const setDoctorSchedule = async (payload) => {
  try {
    const response = await api.post("/schedules", payload);
    return normalizeSchedule(parseResponseData(response));
  } catch (error) {
    console.error("Error saving doctor schedule:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const regenerateDoctorTimeSlots = async () => {
  try {
    const response = await api.post("/schedules/generate-slots");
    return normalizeSchedule(parseResponseData(response));
  } catch (error) {
    console.error("Error generating doctor schedule slots:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getAvailableSlots = async (doctorId, date) => {
  try {
    if (!doctorId || !date) return [];

    const response = await api.get("/slots", {
      params: {
        doctorId,
        date,
      },
    });

    const slots = parseResponseData(response);
    return Array.isArray(slots) ? slots.map((item) => normalizeSlot(item)) : [];
  } catch (error) {
    console.error("Error fetching doctor slots:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const bookAppointment = async (data) => {
  try {
    const payload = data?.data ? data.data : data;
    const response = await api.post("/appointments", payload);
    return normalizeAppointment(parseResponseData(response));
  } catch (error) {
    console.error("Error creating appointment:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const bookAppointmentOrThrow = async (data) => {
  const payload = data?.data ? data.data : data;

  try {
    const response = await api.post("/appointments", payload);
    return normalizeAppointment(parseResponseData(response));
  } catch (error) {
    throw createApiError(error, "Unable to book appointment");
  }
};

export const getAppointmentById = async (documentId) => {
  try {
    const response = await api.get(`/appointments/${documentId}`);
    const appointment = parseResponseData(response);
    return appointment ? normalizeAppointment(appointment) : null;
  } catch (error) {
    console.error("Error fetching appointment:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const myBookingList = async (email) => {
  try {
    const response = await api.get("/appointments");
    const appointments = Array.isArray(parseResponseData(response))
      ? parseResponseData(response).map((item) => normalizeAppointment(item))
      : [];

    // Some backends return doctor as an id instead of a populated object.
    // Enrich appointments here so My Appointments can always render doctor data.
    const doctorCache = new Map();
    const appointmentsWithDoctor = await Promise.all(
      appointments.map(async (appointment) => {
        const doctorRef = appointment?.doctor;
        if (!doctorRef || typeof doctorRef === "object") return appointment;

        const doctorId = String(doctorRef);
        if (!doctorCache.has(doctorId)) {
          doctorCache.set(doctorId, await getDoctorById(doctorId));
        }

        return {
          ...appointment,
          doctor: doctorCache.get(doctorId),
        };
      })
    );

    if (!email) return appointmentsWithDoctor;
    return appointmentsWithDoctor.filter(
      (item) => (item?.email || "").toLowerCase() === String(email).toLowerCase()
    );
  } catch (error) {
    console.error("Error fetching appointments:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const getMyAppointments = async () => {
  try {
    const response = await api.get("/appointments/my");
    const data = parseResponseData(response);
    const appointments = Array.isArray(data)
      ? data.map((item) => normalizeAppointment(item))
      : [];
    return appointments;
  } catch (error) {
    console.error("Error fetching my appointments:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const cancelBooking = async (documentId, reason = "") => {
  try {
    const response = await api.patch(`/appointments/${documentId}/cancel`, { reason });
    return normalizeAppointment(parseResponseData(response));
  } catch (error) {
    console.error("Error canceling booking:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const rescheduleBooking = async (documentId, date, time) => {
  try {
    const response = await api.patch(`/appointments/${documentId}/reschedule`, { date, time });
    return normalizeAppointment(parseResponseData(response));
  } catch (error) {
    console.error("Error rescheduling booking:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const deleteBooking = async (documentId) => {
  try {
    const response = await api.delete(`/appointments/${documentId}`);

    if (response.status === 200 || response.status === 204) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting booking:", getErrorMessage(error, "Unknown error"));
    return false;
  }
};

export const getReviewsByDoctor = async (doctorId) => {
  try {
    const response = await api.get(`/reviews/doctor/${doctorId}`);
    const reviews = parseResponseData(response);

    return Array.isArray(reviews) ? reviews.map((item) => normalizeReview(item)) : [];
  } catch (error) {
    console.error("Error fetching reviews:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const createReview = async (payload) => {
  try {
    const response = await api.post("/reviews", payload);
    return normalizeReview(parseResponseData(response));
  } catch (error) {
    const message = getErrorMessage(error, "Unable to submit review right now.");
    console.error("Error creating review:", message);
    throw new Error(message);
  }
};

export const updateReview = async (reviewId, payload) => {
  try {
    const response = await api.patch(`/reviews/${reviewId}`, payload);
    return normalizeReview(parseResponseData(response));
  } catch (error) {
    console.error("Error updating review:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);

    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.error("Error deleting review:", getErrorMessage(error, "Unknown error"));
    return false;
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    const notifications = parseResponseData(response);
    return Array.isArray(notifications)
      ? notifications.map((item) => normalizeNotification(item))
      : [];
  } catch (error) {
    console.error("Error fetching notifications:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return normalizeNotification(parseResponseData(response));
  } catch (error) {
    console.error("Error marking notification as read:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await api.patch("/notifications/read-all");
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", getErrorMessage(error, "Unknown error"));
    return false;
  }
};

export const getUnreadNotificationCount = async () => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("doctor_appointment_token");
    if (!token) {
      return 0;
    }
  }

  try {
    const response = await api.get("/notifications/unread-count");
    const payload = parseResponseData(response);
    return Number(payload?.count || 0);
  } catch (error) {
    const message = getErrorMessage(error, "Unknown error");
    const normalizedMessage = String(message).toLowerCase();

    if (normalizedMessage.includes("token no longer exists")) {
      clearAuth();
      return 0;
    }

    console.error(
      "Error fetching unread notifications count:",
      message
    );
    return 0;
  }
};

const buildAdminQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return parseResponseData(response);
  } catch (error) {
    console.error("Error fetching admin stats:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getAdminPatients = async () => {
  try {
    const response = await api.get("/admin/patients");
    const data = parseResponseData(response);
    return Array.isArray(data) ? data.map((item) => normalizeUser(item)) : [];
  } catch (error) {
    console.error("Error fetching admin patients:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const getAdminAppointments = async (params = {}) => {
  try {
    const response = await api.get(`/admin/appointments${buildAdminQuery(params)}`);
    const data = parseResponseData(response);
    const appointments = Array.isArray(data)
      ? data.map((item) => normalizeAppointment(item))
      : [];

    return {
      data: appointments,
      pagination: response?.data?.pagination || {
        page: 1,
        limit: params?.limit || 20,
        total: appointments.length,
        pages: 1,
      },
    };
  } catch (error) {
    console.error("Error fetching admin appointments:", getErrorMessage(error, "Unknown error"));
    return { data: [], pagination: { page: 1, limit: 20, total: 0, pages: 1 } };
  }
};

export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await api.patch(`/admin/appointments/${id}/status`, { status });
    return normalizeAppointment(parseResponseData(response));
  } catch (error) {
    console.error("Error updating appointment status:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getAdminReports = async () => {
  try {
    const response = await api.get("/admin/reports");
    return parseResponseData(response);
  } catch (error) {
    console.error("Error fetching admin reports:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const getAdminDoctors = async () => {
  try {
    const response = await api.get("/admin/doctors");
    const doctors = parseResponseData(response);
    return Array.isArray(doctors) ? doctors.map((item) => normalizeDoctor(item)) : [];
  } catch (error) {
    console.error("Error fetching admin doctors:", getErrorMessage(error, "Unknown error"));
    return [];
  }
};

export const createDoctor = async (formData) => {
  try {
    const response = await api.post("/admin/doctors", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeDoctor(parseResponseData(response));
  } catch (error) {
    console.error("Error creating doctor:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const updateDoctor = async (id, formData) => {
  try {
    const response = await api.patch(`/admin/doctors/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeDoctor(parseResponseData(response));
  } catch (error) {
    console.error("Error updating doctor:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await api.delete(`/admin/doctors/${id}`);
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.error("Error deleting doctor:", getErrorMessage(error, "Unknown error"));
    return false;
  }
};

export const getAdminCategories = async () => {
  try {
    const response = await api.get("/admin/categories");
    const categories = parseResponseData(response);
    return Array.isArray(categories)
      ? categories.map((item) => normalizeCategory(item))
      : [];
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to fetch categories");
    console.error("Error fetching admin categories:", errorMsg);
    throw createApiError(error, "Failed to fetch categories");
  }
};

export const createCategory = async (formData) => {
  try {
    const response = await api.post("/admin/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeCategory(parseResponseData(response));
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to create category");
    console.error("Error creating category:", errorMsg);
    throw createApiError(error, "Failed to create category");
  }
};

export const updateCategory = async (id, formData) => {
  try {
    const response = await api.patch(`/admin/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeCategory(parseResponseData(response));
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to update category");
    console.error("Error updating category:", errorMsg);
    throw createApiError(error, "Failed to update category");
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.status === 200 || response.status === 204;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to delete category");
    console.error("Error deleting category:", errorMsg);
    throw createApiError(error, "Failed to delete category");
  }
};

export const getDoctorDashboard = async () => {
  try {
    const response = await api.get("/doctor/dashboard");
    return normalizeDoctorDashboard(parseResponseData(response));
  } catch (error) {
    console.error("Error fetching doctor dashboard:", getErrorMessage(error, "Unknown error"));
    return null;
  }
};

export const updateDoctorAppointmentStatus = async (id, status) => {
  try {
    const response = await api.patch(`/doctor/appointments/${id}/status`, { status });
    return normalizeAppointment(parseResponseData(response));
  } catch (error) {
    console.error(
      "Error updating doctor appointment status:",
      getErrorMessage(error, "Unknown error")
    );
    return null;
  }
};

export const createPaymentIntent = async (appointmentId) => {
  try {
    const response = await api.post("/payments/create-intent", { appointmentId });
    return response?.data?.clientSecret || "";
  } catch (error) {
    console.error("Error creating payment intent:", getErrorMessage(error, "Unknown error"));
    return "";
  }
};

export const confirmPayment = async (payload) => {
  try {
    const response = await api.post("/payments/confirm", payload);
    return response?.data?.success || false;
  } catch (error) {
    console.error("Error confirming payment:", getErrorMessage(error, "Unknown error"));
    return false;
  }
};

