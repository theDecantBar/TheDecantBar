import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  User,
  KeyRound,
  LogOut,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Truck,
  ArrowRight
} from "lucide-react";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import { fetchMyOrders, updateProfile, changePassword } from "../services/authApi";

export default function Account() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState("orders"); // "orders", "profile", "security"
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Sync profile form when user object updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  // Load orders when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      setLoadingOrders(true);
      fetchMyOrders(token)
        .then((data) => {
          setOrders(data || []);
          setOrdersError("");
        })
        .catch((err) => {
          setOrdersError(err.message || "Failed to load order history.");
        })
        .finally(() => {
          setLoadingOrders(false);
        });
    }
  }, [isAuthenticated, token]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess("");
    setProfileError("");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setUpdatingProfile(true);

    try {
      const res = await updateProfile(profileForm, token);
      updateUser(res.user);
      setProfileSuccess("Your profile details have been saved successfully.");
    } catch (err) {
      setProfileError(err.message || "Could not update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordSuccess("");
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccess("");
    setPasswordError("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setUpdatingPassword(true);

    try {
      await changePassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      );
      setPasswordSuccess("Your password has been updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Guard for guest users
  if (!isLoading && !isAuthenticated) {
    return (
      <Container className="py-24 sm:py-32">
        <div className="mx-auto max-w-md text-center border border-white/10 bg-[#171715] p-8 sm:p-12 shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#11110f] text-[#c6a15b]">
            <User size={28} strokeWidth={1.5} />
          </div>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#c6a15b]">
            Client Portal
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-[#f4efe6]">
            Sign In Required
          </h1>
          <p className="mt-4 text-xs text-[#8e8a82]">
            Please sign in to view your orders, saved delivery addresses, and account credentials.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#11110f] hover:bg-[#d8c08a] transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-white/15 bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#f4efe6] hover:border-white/30 hover:bg-white/5 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 sm:py-20">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#c6a15b]">
            Client Portal
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-5xl text-[#f4efe6]">
            Welcome, {user?.fullName || "Member"}
          </h1>
          <p className="mt-2 text-xs text-[#8e8a82]">
            {user?.email} · Member of The Decant Bar
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 self-start md:self-auto border border-white/15 bg-transparent px-4 py-2.5 text-xs uppercase tracking-wider text-[#c5c1b9] hover:border-red-400/50 hover:text-red-300 hover:bg-red-950/20 transition cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Account Layout: Sidebar Tabs + Content */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-3">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition cursor-pointer border text-left whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6]"
                  : "border-white/10 bg-[#171715] text-[#8e8a82] hover:text-[#f4efe6] hover:border-white/20"
              }`}
            >
              <Package size={16} className={activeTab === "orders" ? "text-[#c6a15b]" : "text-[#8e8a82]"} />
              <span>Order History</span>
              {orders.length > 0 && (
                <span className="ml-auto hidden lg:inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-[#f4efe6]">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition cursor-pointer border text-left whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6]"
                  : "border-white/10 bg-[#171715] text-[#8e8a82] hover:text-[#f4efe6] hover:border-white/20"
              }`}
            >
              <User size={16} className={activeTab === "profile" ? "text-[#c6a15b]" : "text-[#8e8a82]"} />
              <span>Profile & Address</span>
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition cursor-pointer border text-left whitespace-nowrap ${
                activeTab === "security"
                  ? "border-[#c6a15b] bg-[#c6a15b]/10 text-[#f4efe6]"
                  : "border-white/10 bg-[#171715] text-[#8e8a82] hover:text-[#f4efe6] hover:border-white/20"
              }`}
            >
              <KeyRound size={16} className={activeTab === "security" ? "text-[#c6a15b]" : "text-[#8e8a82]"} />
              <span>Password & Security</span>
            </button>
          </nav>
        </aside>

        {/* Tab Content Panels */}
        <main className="lg:col-span-9">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="border border-white/10 bg-[#171715] p-6 sm:p-8">
                <h2 className="font-display text-2xl text-[#f4efe6]">
                  Your Order History
                </h2>
                <p className="mt-1 text-xs text-[#8e8a82]">
                  Track the status and packaging details of your authentic decants.
                </p>

                {ordersError && (
                  <div className="mt-4 flex items-center gap-2 border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-200">
                    <AlertCircle size={15} />
                    <span>{ordersError}</span>
                  </div>
                )}

                {loadingOrders ? (
                  <div className="py-16 text-center text-xs text-[#8e8a82]">
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center">
                    <ShoppingBag size={36} strokeWidth={1.2} className="mx-auto mb-3 text-[#8e8a82]" />
                    <p className="font-display text-xl text-[#f4efe6]">No Orders Placed Yet</p>
                    <p className="mt-2 text-xs text-[#8e8a82]">
                      When you order decants, your tracking details and purchase summaries will appear here.
                    </p>
                    <Link
                      to="/products"
                      className="mt-6 inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#11110f] hover:bg-[#d8c08a] transition"
                    >
                      Browse Fragrances <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-white/10 bg-[#141412] p-5 sm:p-6 transition hover:border-[#c6a15b]/40"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-display text-lg text-[#f4efe6]">
                                #{order.order_number}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded bg-[#c6a15b]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#c6a15b]">
                                {order.order_status || "Confirmed"}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[#8e8a82]">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(order.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span>·</span>
                              <span className="uppercase">{order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-[#8e8a82] uppercase tracking-wider block">Total Amount</span>
                            <span className="font-display text-xl text-[#c6a15b]">
                              ₹{order.total_amount}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="py-4 divide-y divide-white/5 space-y-3">
                          {Array.isArray(order.items) &&
                            order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="pt-3 first:pt-0 flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-10 shrink-0 border border-white/10 bg-[#1c1c18] flex items-center justify-center p-1">
                                    {item.image_url ? (
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <span className="text-[8px] text-[#c6a15b]">Decant</span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-[#f4efe6]">
                                      {item.name}
                                    </p>
                                    <p className="text-[11px] text-[#8e8a82]">
                                      {item.size_ml}ml Decant × {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-[#f4efe6]">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                        </div>

                        {/* Delivery Destination info */}
                        <div className="mt-3 border-t border-white/10 pt-3 flex items-start gap-2 text-[11px] text-[#8e8a82]">
                          <MapPin size={13} className="text-[#c6a15b] shrink-0 mt-0.5" />
                          <span>
                            Delivering to: <strong className="text-[#f4efe6]">{order.customer_name}</strong> · {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESS */}
          {activeTab === "profile" && (
            <div className="border border-white/10 bg-[#171715] p-6 sm:p-8">
              <h2 className="font-display text-2xl text-[#f4efe6]">
                Profile & Delivery Preferences
              </h2>
              <p className="mt-1 text-xs text-[#8e8a82]">
                These details will automatically pre-fill your checkout for seamless one-click ordering.
              </p>

              {profileSuccess && (
                <div className="mt-4 flex items-center gap-2 border border-green-500/30 bg-green-950/20 p-3.5 text-xs text-green-200">
                  <CheckCircle size={16} className="text-green-400 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              {profileError && (
                <div className="mt-4 flex items-center gap-2 border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-red-200">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full border border-white/10 bg-[#11110f]/50 px-4 py-3 text-xs text-[#8e8a82] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Default Shipping Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                    placeholder="e.g. 402, Signature Heights, MG Road"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileForm.city}
                      onChange={handleProfileChange}
                      placeholder="e.g. Mumbai"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={profileForm.state}
                      onChange={handleProfileChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={profileForm.pincode}
                      onChange={handleProfileChange}
                      placeholder="400001"
                      className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer"
                  >
                    {updatingProfile ? "Saving Details..." : "Save Preferences"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PASSWORD & SECURITY */}
          {activeTab === "security" && (
            <div className="border border-white/10 bg-[#171715] p-6 sm:p-8 max-w-xl">
              <h2 className="font-display text-2xl text-[#f4efe6]">
                Change Password
              </h2>
              <p className="mt-1 text-xs text-[#8e8a82]">
                Ensure your luxury client account remains secure with a strong password.
              </p>

              {passwordSuccess && (
                <div className="mt-4 flex items-center gap-2 border border-green-500/30 bg-green-950/20 p-3.5 text-xs text-green-200">
                  <CheckCircle size={16} className="text-green-400 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="mt-4 flex items-center gap-2 border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-red-200">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    New Password (Min 6 Characters)
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#c5c1b9] mb-1.5 font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full border border-white/15 bg-[#11110f] px-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] transition focus:border-[#c6a15b] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer"
                  >
                    {updatingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
