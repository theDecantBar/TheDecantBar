const API_BASE_URL = "/api/reviews";
async function request(path = "", { token, method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method, cache: "no-store", headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Unable to connect. Please try again.");
  return data;
}
export async function fetchAllReviews() { return (await request()).reviews || []; }
export async function fetchManageableReviewIds(token) { return (await request("/manageable", { token })).ids || []; }
export async function submitReview(body, token) { return (await request("", { token, method: "POST", body })).review; }
export async function editReview(id, body, token) { return (await request(`/${id}`, { token, method: "PUT", body })).review; }
export async function removeReview(id, token) { await request(`/${id}`, { token, method: "DELETE" }); return true; }
