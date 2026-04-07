const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            minlength: [2, "Category name must be at least 2 characters long"],
        },
        name_en: {
            type: String,
            trim: true,
        },
        name_ar: {
            type: String,
            required: [true, "Arabic category name is required"],
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        doctors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Doctor",
            },
        ],
    },
    {
        timestamps: true,
    }
);

categorySchema.pre("validate", function () {
    if (!this.name && this.name_en) {
        this.name = this.name_en;
    }

    if (!this.name_en && this.name) {
        this.name_en = this.name;
    }

    if (!this.icon && this.image) {
        this.icon = this.image;
    }

    if (!this.image && this.icon) {
        this.image = this.icon;
    }
});

const setIconUrl = (doc) => {
    if (!doc) return;

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) return;

    if (doc.icon && !String(doc.icon).startsWith("http")) {
        doc.icon = `${baseUrl}/uploads/categories/${doc.icon}`;
    }

    if (doc.image && !String(doc.image).startsWith("http")) {
        doc.image = `${baseUrl}/uploads/categories/${doc.image}`;
    }
};

categorySchema.post("init", (doc) => {
    setIconUrl(doc);
});

categorySchema.post("save", (doc) => {
    setIconUrl(doc);
});

module.exports = mongoose.model("Category", categorySchema);