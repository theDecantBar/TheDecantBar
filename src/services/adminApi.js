const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchAdminStats(token) {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard metrics.");
  }
  return data;
}

export async function fetchAdminOrders(params = {}, token) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const url = `${API_BASE_URL}/admin/orders${query.toString() ? `?${query.toString()}` : ""}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders.");
  }
  return data;
}

export async function updateOrderStatusApi(orderId, status, token) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status.");
  }
  return data;
}

export async function fetchAdminCustomers(token) {
  const response = await fetch(`${API_BASE_URL}/admin/customers`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch customer list.");
  }
  return data;
}
