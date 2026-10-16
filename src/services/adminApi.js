// The Decant Bar - Admin API Client Service

const getHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function fetchAdminStats(token) {
  const res = await fetch("/api/admin/stats", {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to load admin stats");
  }
  return res.json();
}

export async function fetchAdminOrders(token, { status = "All", search = "" } = {}) {
  const params = new URLSearchParams();
  if (status && status !== "All") params.append("status", status);
  if (search) params.append("search", search);

  const res = await fetch(`/api/admin/orders?${params.toString()}`, {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to load orders");
  }
  return res.json();
}

export async function updateAdminOrderStatus(token, orderId, updateData) {
  const res = await fetch(`/api/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update order");
  }
  return res.json();
}

export async function fetchAdminProducts(token) {
  const res = await fetch("/api/admin/products", {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to load products");
  }
  return res.json();
}

export async function createAdminProduct(token, productData) {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create fragrance");
  }
  return res.json();
}

export async function updateAdminProduct(token, productId, productData) {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update fragrance");
  }
  return res.json();
}

export async function deleteAdminProduct(token, productId) {
  const res = await fetch(`/api/admin/products/${productId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete fragrance");
  }
  return res.json();
}

export async function fetchAdminReviews(token) {
  const res = await fetch("/api/admin/reviews", {
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to load reviews");
  }
  return res.json();
}

export async function deleteAdminReview(token, reviewId) {
  const res = await fetch(`/api/admin/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete review");
  }
  return res.json();
}

export async function updateAdminVariantStock(token, variantId, { stock, active }) {
  const res = await fetch(`/api/admin/variants/${variantId}/stock`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify({ stock, active }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update stock quantity");
  }
  return res.json();
}

