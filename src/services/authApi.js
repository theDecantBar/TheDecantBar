const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to log in.");
  }
  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create account.");
  }
  return data;
}

export async function getProfile(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to retrieve profile.");
  }
  return data;
}

export async function updateProfile(profileData, token) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile.");
  }
  return data;
}

export async function changePassword(passwordData, token) {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to change password.");
  }
  return data;
}

export async function placeOrder(orderData, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to place order.");
  }
  return data;
}

export async function fetchMyOrders(token) {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load order history.");
  }
  return data;
}
