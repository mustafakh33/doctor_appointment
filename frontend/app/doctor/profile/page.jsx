"use client";

import React, { useState } from "react";
import { User, Upload } from "lucide-react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { toast } from "sonner";
import PageHeader from "../_components/DoctorPageComponents";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState({
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    price: "150",
    location: "Cairo, Egypt",
    bio: "Experienced cardiologist with 10+ years of practice",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.specialty || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }
    setProfile(formData);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setFormData(profile);
    setImagePreview(null);
    setIsEditing(false);
  };

  const SPECIALTIES = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "General Medicine",
  ];

  return (
    <div className="space-y-6 p-4 md:px-20 md:py-8">
      <PageHeader
        title="Profile"
        subtitle="Manage your professional information"
        icon={User}
      />

      <div
        className="rounded-2xl border p-6 md:p-8"
        style={{
          background: "var(--color-bg-primary)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Profile Header with Image */}
        <div
          className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 pb-8 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-28 w-28 rounded-full border-4 flex items-center justify-center"
              style={{
                borderColor: "var(--color-primary)",
                background: "var(--color-bg-secondary)",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User
                  className="h-12 w-12"
                  style={{ color: "var(--color-primary)" }}
                />
              )}
            </div>
            {isEditing && (
              <label className="relative cursor-pointer">
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                  style={{
                    background: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <p
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Name
            </p>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              />
            ) : (
              <p
                className="mt-1 text-2xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {profile.name}
              </p>
            )}

            <p
              className="text-sm mt-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Specialty
            </p>
            {isEditing ? (
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 rounded-lg border bg-transparent outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            ) : (
              <p
                className="mt-1 font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {profile.specialty}
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Appointment Price (EGP)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-2 w-full px-4 py-3 rounded-lg border bg-transparent outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="150"
              />
            ) : (
              <p
                className="mt-2 text-lg font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                EGP {profile.price}
              </p>
            )}
          </div>

          <div>
            <label
              className="text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-2 w-full px-4 py-3 rounded-lg border bg-transparent outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="Cairo, Egypt"
              />
            ) : (
              <p
                className="mt-2 text-base"
                style={{ color: "var(--color-text-primary)" }}
              >
                {profile.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Bio / About
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="mt-2 w-full px-4 py-3 rounded-lg border bg-transparent outline-none resize-none"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
              rows="4"
              placeholder="Tell patients about your experience and expertise..."
            />
          ) : (
            <p
              className="mt-2 text-base leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setFormData(profile);
              }}
              className="px-6 py-2 rounded-lg font-semibold border transition-colors"
              style={{
                background: "var(--color-primary)",
                borderColor: "var(--color-primary)",
                color: "white",
              }}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg font-semibold border transition-colors"
                style={{
                  background: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                  color: "white",
                }}
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg font-semibold border transition-colors"
                style={{
                  background: "transparent",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
