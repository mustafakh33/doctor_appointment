const mongoose = require("mongoose");

const daySchema = {
    open: { type: String, default: "09:00" },
    close: { type: String, default: "17:00" },
    isOpen: { type: Boolean, default: true },
};

const clinicSchema = new mongoose.Schema(
    {
        name: { type: String, default: "Shifaa Clinic" },
        nameAr: { type: String, default: "عيادة شفاء" },
        address: { type: String, default: "123 Medical Center St, Health City" },
        addressAr: { type: String, default: "123 شارع المركز الطبي، مدينة الصحة" },
        phone: { type: String, default: "+20 (100) 123-4567" },
        email: { type: String, default: "support@shifaa.com" },
        whatsapp: { type: String, default: "+201001234567" },
        workingHours: {
            saturday: {
                type: daySchema,
                default: () => ({ open: "09:00", close: "17:00", isOpen: true }),
            },
            sunday: {
                type: daySchema,
                default: () => ({ open: "09:00", close: "17:00", isOpen: true }),
            },
            monday: {
                type: daySchema,
                default: () => ({ open: "08:00", close: "20:00", isOpen: true }),
            },
            tuesday: {
                type: daySchema,
                default: () => ({ open: "08:00", close: "20:00", isOpen: true }),
            },
            wednesday: {
                type: daySchema,
                default: () => ({ open: "08:00", close: "20:00", isOpen: true }),
            },
            thursday: {
                type: daySchema,
                default: () => ({ open: "08:00", close: "20:00", isOpen: true }),
            },
            friday: {
                type: daySchema,
                default: () => ({ open: "00:00", close: "00:00", isOpen: false }),
            },
        },
        location: {
            lat: { type: Number, default: 30.0444 },
            lng: { type: Number, default: 31.2357 },
            googleMapsUrl: {
                type: String,
                default:
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123!2d31.2357!3d30.0444",
            },
        },
        socialLinks: {
            facebook: { type: String, default: "" },
            instagram: { type: String, default: "" },
            whatsapp: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Clinic", clinicSchema);
