const API_BASE_URL = "/api/reviews";

/**
 * Fetch all public verified reviews from PostgreSQL database
 */
export async function fetchAllReviews() {
  try {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      throw new Error("Failed to load reviews from server");
    }
    const data = await res.json();
    return data.reviews || [];
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
}

/**
 * Submit a new verified review to the database
 */
export async function submitReview(reviewData, token) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to submit review");
  }

  return data.review;
}

/**
 * Update an existing review (author only)
 */
export async function editReview(id, reviewData, token) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update review");
  }

  return data.review;
}

/**
 * Delete a review (author only)
 */
export async function removeReview(id, token) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete review");
  }

  return true;
}
