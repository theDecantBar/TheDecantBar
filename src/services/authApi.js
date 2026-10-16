const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Safely parse HTTP response and handle non-JSON (e.g. HTML 404/500/proxy errors)
 * to avoid "Unexpected token '<', '<!DOCTYPE' is not valid JSON" errors in the browser.
 */
async function handleApiResponse(response, defaultErrorMsg = "Request failed.") {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    // Non-JSON response (e.g. HTML 404/502/500 or plain text)
    await response.text().catch(() => "");
    if (!response.ok) {
      throw new Error(
        `Server returned ${response.status} (${response.statusText || "Error"}). Please verify that the backend API server is running.`
      );
    }
    throw new Error("Unexpected non-JSON response from server.");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || defaultErrorMsg;
    throw new Error(errorMsg);
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  return handleApiResponse(response, "Failed to log in.");
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return handleApiResponse(response, "Failed to create account.");
}

export async function getProfile(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse(response, "Failed to retrieve profile.");
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

  return handleApiResponse(response, "Failed to update profile.");
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

  return handleApiResponse(response, "Failed to change password.");
}

export async function createRazorpayOrderApi(payload, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/orders/create-razorpay-order`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  return handleApiResponse(response, "Failed to initiate online payment.");
}

export async function verifyPaymentAndPlaceOrder(orderData, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderData),
  });

  return handleApiResponse(response, "Failed to confirm payment and place order.");
}

export const placeOrder = verifyPaymentAndPlaceOrder;

export async function fetchMyOrders(token) {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleApiResponse(response, "Failed to load order history.");
}

export async function sendSignupOtpApi(email) {
  const response = await fetch(`${API_BASE_URL}/auth/send-signup-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleApiResponse(response, "Failed to send verification code.");
}

export async function verifySignupOtpApi(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-signup-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(response, "Failed to verify registration code.");
}

export async function sendForgotPasswordOtpApi(email) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleApiResponse(response, "Failed to send reset code.");
}

export async function resetPasswordOtpApi(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleApiResponse(response, "Failed to reset password.");
}
