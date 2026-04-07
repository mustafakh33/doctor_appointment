export const localizeValue = (value, localizedValue, locale) => {
  if (locale === "ar") {
    return localizedValue || value || "";
  }

  return value || localizedValue || "";
};

export const localizeCategory = (category, locale) => {
  if (!category) return "";
  return localizeValue(category?.name, category?.name_ar, locale);
};

export const localizeDoctorField = (doctor, field, locale) => {
  if (!doctor) return "";

  const localizedField = `${field}_ar`;
  return localizeValue(doctor?.[field], doctor?.[localizedField], locale);
};