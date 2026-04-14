const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const getBaseUrl = () => {
    const rawBaseUrl = String(process.env.BASE_URL || "").trim();
    if (!rawBaseUrl) return "";
    return rawBaseUrl.replace(/\/$/, "");
};

const normalizeReviewImageUrl = (value) => {
    if (typeof value !== "string") return "";

    const normalizedValue = value.trim();
    if (!normalizedValue) return "";

    const baseUrl = getBaseUrl();

    if (normalizedValue.startsWith("http://") || normalizedValue.startsWith("https://")) {
        try {
            const parsed = new URL(normalizedValue);

            if (LOCAL_HOSTS.has(parsed.hostname)) {
                if (!baseUrl) return "";
                return `${baseUrl}${parsed.pathname}${parsed.search}${parsed.hash}`;
            }

            return normalizedValue;
        } catch {
            return "";
        }
    }

    if (!baseUrl) return "";

    if (normalizedValue.startsWith("/")) {
        return `${baseUrl}${normalizedValue}`;
    }

    if (normalizedValue.startsWith("uploads/")) {
        return `${baseUrl}/${normalizedValue}`;
    }

    return `${baseUrl}/uploads/users/${normalizedValue}`;
};

const normalizeReviewResponse = (reviewDoc) => {
    if (!reviewDoc) return reviewDoc;

    const review = reviewDoc.toObject ? reviewDoc.toObject() : reviewDoc;

    const imageFromUser = normalizeReviewImageUrl(review?.user?.profileImage || "");
    const imageFromReview = normalizeReviewImageUrl(review?.userProfileImage || "");
    const normalizedUserImage = imageFromUser || imageFromReview || "";

    if (review.user && typeof review.user === "object") {
        review.user.profileImage = normalizedUserImage;
    }

    review.userProfileImage = normalizedUserImage;
    return review;
};

const normalizeReviewListResponse = (reviewList) => {
    if (!Array.isArray(reviewList)) return [];
    return reviewList.map((review) => normalizeReviewResponse(review));
};

module.exports = {
    normalizeReviewImageUrl,
    normalizeReviewResponse,
    normalizeReviewListResponse,
};
