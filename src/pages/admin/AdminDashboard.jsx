import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Sparkles,
  Package,
  Search,
  CheckCircle,
  Clock,
  Truck,
  CheckCheck,
  XCircle,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink
} from "lucide-react";
import Container from "../../components/ui/Container";
import { useAuth } from "../../context/AuthContext";
import {
  fetchAdminStats,
  fetchAdminOrders,
  updateOrderStatusApi,
  fetchAdminCustomers,
} from "../../services/adminApi";

const STATUS_COLORS = {
  Confirmed: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  Processing: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  Shipped: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  Delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function AdminDashboard() {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState("overview"); // "overview", "orders", "customers"
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Orders Filter State
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState({ text: "", type: "" });

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await fetchAdminStats(token);
      setStats(data);
    } catch (err) {
      console.error("Stats load failed:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await fetchAdminOrders(
        { status: selectedStatus, search: searchTerm },
        token
      );
      setOrders(data);
    } catch (err) {
      console.error("Orders load failed:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const data = await fetchAdminCustomers(token);
      setCustomers(data);
    } catch (err) {
      console.error("Customers load failed:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  useEffect(() => {
    if (token && (activeTab === "orders" || activeTab === "overview")) {
      loadOrders();
    }
  }, [token, selectedStatus, activeTab]);

  useEffect(() => {
    if (token && activeTab === "customers") {
      loadCustomers();
    }
  }, [token, activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdatingId(orderId);
      await updateOrderStatusApi(orderId, newStatus, token);
      
      // Update local state immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );

      setFeedbackMessage({
        text: `Order #${orders.find((o) => o.id === orderId)?.order_number || orderId} status changed to ${newStatus}.`,
        type: "success",
      });

      // Refresh stats in background
      loadStats();
    } catch (err) {
      setFeedbackMessage({
        text: err.message || "Failed to update order status.",
        type: "error",
      });
    } finally {
      setStatusUpdatingId(null);
      setTimeout(() => setFeedbackMessage({ text: "", type: "" }), 4000);
    }
  };

  return (
    <Container className="py-10 sm:py-16">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-[#c6a15b] animate-pulse" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c6a15b]">
              Administrative Portal
            </p>
          </div>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl text-[#f4efe6]">
            The Decant Bar Control Panel
          </h1>
          <p className="mt-1 text-xs text-[#8e8a82]">
            Signed in as <strong className="text-[#f4efe6]">{user?.email}</strong> (Administrator)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadStats();
              if (activeTab === "orders") loadOrders();
              if (activeTab === "customers") loadCustomers();
            }}
            className="inline-flex items-center gap-2 border border-white/15 bg-[#171715] px-4 py-2.5 text-xs uppercase tracking-wider text-[#c5c1b9] hover:text-[#f4efe6] hover:border-[#c6a15b] transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>

          <Link
            to="/account"
            className="inline-flex items-center gap-2 border border-[#c6a15b]/40 bg-[#c6a15b]/10 px-4 py-2.5 text-xs uppercase tracking-wider text-[#c6a15b] hover:bg-[#c6a15b]/20 transition"
          >
            <span>My Client Account</span>
          </Link>
        </div>
      </div>

      {/* Global feedback message toast */}
      {feedbackMessage.text && (
        <div
          className={`mt-6 flex items-center gap-3 border p-4 text-xs ${
            feedbackMessage.type === "success"
              ? "border-green-500/30 bg-green-950/20 text-green-200"
              : "border-red-500/30 bg-red-950/20 text-red-200"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle size={16} className="text-green-400 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-400 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mt-8 flex gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] font-semibold"
              : "border-white/10 bg-[#171715] text-[#8e8a82] hover:text-[#f4efe6]"
          }`}
        >
          <TrendingUp size={15} />
          <span>Overview & Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 border px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] font-semibold"
              : "border-white/10 bg-[#171715] text-[#8e8a82] hover:text-[#f4efe6]"
          }`}
        >
          <ShoppingBag size={15} />
          <span>All Orders</span>
          {stats?.totalOrders > 0 && (
            <span className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] ${
              activeTab === "orders" ? "bg-[#11110f] text-[#c6a15b]" : "bg-white/10 text-[#f4efe6]"
            }`}>
              {stats.totalOrders}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("customers")}
          className={`flex items-center gap-2 border px-5 py-2.5 text-xs uppercase tracking-wider font-medium transition cursor-pointer whitespace-nowrap ${
            activeTab === "customers"
              ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] font-semibold"
              : "border-white/10 bg-[#171715] text-[#8e8a82] hover:text-[#f4efe6]"
          }`}
        >
          <Users size={15} />
          <span>Registered Customers</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === "overview" && (
        <div className="mt-8 space-y-10">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Total Revenue */}
            <div className="border border-white/10 bg-[#171715] p-6 shadow-xl">
              <div className="flex items-center justify-between text-[#8e8a82]">
                <span className="text-[11px] uppercase tracking-wider font-medium">Total Revenue</span>
                <TrendingUp size={18} className="text-[#c6a15b]" />
              </div>
              <p className="mt-4 font-display text-3xl sm:text-4xl text-[#c6a15b]">
                {loadingStats ? "..." : `₹${stats?.totalRevenue?.toLocaleString("en-IN") || 0}`}
              </p>
              <p className="mt-2 text-[11px] text-[#8e8a82]">
                Aggregate across all customer orders
              </p>
            </div>

            {/* 2. Total Orders */}
            <div className="border border-white/10 bg-[#171715] p-6 shadow-xl">
              <div className="flex items-center justify-between text-[#8e8a82]">
                <span className="text-[11px] uppercase tracking-wider font-medium">Orders Placed</span>
                <ShoppingBag size={18} className="text-[#c6a15b]" />
              </div>
              <p className="mt-4 font-display text-3xl sm:text-4xl text-[#f4efe6]">
                {loadingStats ? "..." : stats?.totalOrders || 0}
              </p>
              <p className="mt-2 text-[11px] text-[#8e8a82]">
                {stats?.statusCounts?.confirmed || 0} pending processing
              </p>
            </div>

            {/* 3. Customers */}
            <div className="border border-white/10 bg-[#171715] p-6 shadow-xl">
              <div className="flex items-center justify-between text-[#8e8a82]">
                <span className="text-[11px] uppercase tracking-wider font-medium">Registered Clients</span>
                <Users size={18} className="text-[#c6a15b]" />
              </div>
              <p className="mt-4 font-display text-3xl sm:text-4xl text-[#f4efe6]">
                {loadingStats ? "..." : stats?.totalUsers || 0}
              </p>
              <p className="mt-2 text-[11px] text-[#8e8a82]">
                Verified member client accounts
              </p>
            </div>

            {/* 4. Fragrance Catalog */}
            <div className="border border-white/10 bg-[#171715] p-6 shadow-xl">
              <div className="flex items-center justify-between text-[#8e8a82]">
                <span className="text-[11px] uppercase tracking-wider font-medium">Fragrance Catalog</span>
                <Sparkles size={18} className="text-[#c6a15b]" />
              </div>
              <p className="mt-4 font-display text-3xl sm:text-4xl text-[#f4efe6]">
                {loadingStats ? "..." : stats?.totalProducts || 0}
              </p>
              <p className="mt-2 text-[11px] text-[#8e8a82]">
                Available authentic decants
              </p>
            </div>
          </div>

          {/* Status Breakdown Pills */}
          <div className="border border-white/10 bg-[#171715] p-6">
            <h2 className="font-display text-xl text-[#f4efe6] mb-4">
              Order Fulfillment Breakdown
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="border border-white/10 bg-[#121210] p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#8e8a82] block">Confirmed</span>
                <span className="mt-1 font-display text-2xl text-amber-400 block">
                  {stats?.statusCounts?.confirmed || 0}
                </span>
              </div>
              <div className="border border-white/10 bg-[#121210] p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#8e8a82] block">Processing</span>
                <span className="mt-1 font-display text-2xl text-blue-400 block">
                  {stats?.statusCounts?.processing || 0}
                </span>
              </div>
              <div className="border border-white/10 bg-[#121210] p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#8e8a82] block">Shipped</span>
                <span className="mt-1 font-display text-2xl text-purple-400 block">
                  {stats?.statusCounts?.shipped || 0}
                </span>
              </div>
              <div className="border border-white/10 bg-[#121210] p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#8e8a82] block">Delivered</span>
                <span className="mt-1 font-display text-2xl text-emerald-400 block">
                  {stats?.statusCounts?.delivered || 0}
                </span>
              </div>
              <div className="border border-white/10 bg-[#121210] p-4 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#8e8a82] block">Cancelled</span>
                <span className="mt-1 font-display text-2xl text-red-400 block">
                  {stats?.statusCounts?.cancelled || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick link to Orders */}
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl text-[#f4efe6]">Recent Activity</h2>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-xs text-[#c6a15b] hover:underline uppercase tracking-wider font-semibold cursor-pointer"
            >
              View All Orders →
            </button>
          </div>

          {/* Recent Orders Table */}
          <div className="border border-white/10 bg-[#171715] overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-[#131311] text-[11px] uppercase tracking-wider text-[#8e8a82]">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-medium text-[#f4efe6]">#{order.order_number}</td>
                    <td className="p-4 text-[#c5c1b9]">{order.customer_name}</td>
                    <td className="p-4 text-[#8e8a82]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td className="p-4 font-display text-sm text-[#c6a15b]">₹{order.total_amount}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                          STATUS_COLORS[order.order_status] || "text-gray-400 bg-gray-400/10 border-gray-400/20"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setActiveTab("orders");
                          setSearchTerm(order.order_number);
                        }}
                        className="text-[11px] text-[#c6a15b] hover:underline uppercase tracking-wider cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="mt-8 space-y-6">
          {/* Controls: Search and Status Filters */}
          <div className="border border-white/10 bg-[#171715] p-5 sm:p-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order #, customer name, email, phone, city..."
                  className="w-full border border-white/15 bg-[#11110f] pl-10 pr-4 py-2.5 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
                />
                <Search size={15} className="absolute left-3.5 top-3 text-[#8e8a82]" />
              </div>
              <button
                type="submit"
                className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#11110f] hover:bg-[#d8c08a] transition cursor-pointer"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    loadOrders();
                  }}
                  className="border border-white/15 bg-transparent px-4 py-2.5 text-xs uppercase tracking-wider text-[#8e8a82] hover:text-[#f4efe6] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Status Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2">
              {["All", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`border px-3.5 py-1.5 text-xs uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                    selectedStatus === status
                      ? "border-[#c6a15b] bg-[#c6a15b]/15 text-[#c6a15b] font-medium"
                      : "border-white/10 bg-[#121210] text-[#8e8a82] hover:text-[#f4efe6]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loadingOrders ? (
            <div className="py-16 text-center text-xs text-[#8e8a82]">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-white/10 bg-[#171715] py-16 text-center">
              <ShoppingBag size={32} className="mx-auto mb-3 text-[#8e8a82]" />
              <p className="font-display text-xl text-[#f4efe6]">No Orders Found</p>
              <p className="mt-1 text-xs text-[#8e8a82]">
                No orders match your filter criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-white/10 bg-[#171715] p-5 sm:p-6 transition hover:border-white/20"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-xl text-[#f4efe6]">
                          #{order.order_number}
                        </span>
                        <span
                          className={`inline-block border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                            STATUS_COLORS[order.order_status] || "text-gray-400 bg-gray-400/10 border-gray-400/20"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[#8e8a82]">
                        <Clock size={12} />
                        <span>
                          {new Date(order.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span>·</span>
                        <span className="uppercase text-[#c6a15b]">
                          {order.payment_method === "cod" ? "Cash on Delivery" : "Online UPI / Card"}
                        </span>
                      </div>
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] uppercase tracking-wider text-[#8e8a82]">
                        Update Status:
                      </span>
                      <select
                        value={order.order_status}
                        disabled={statusUpdatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="border border-[#c6a15b]/40 bg-[#11110f] px-3 py-1.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information Grid */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 border-b border-white/10 pb-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block mb-1">
                        Customer
                      </span>
                      <p className="font-medium text-[#f4efe6]">{order.customer_name}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[#c5c1b9]">
                        <Mail size={12} className="text-[#c6a15b]" />
                        <span>{order.customer_email}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[#c5c1b9]">
                        <Phone size={12} className="text-[#c6a15b]" />
                        <span>{order.customer_phone}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block mb-1">
                        Shipping Address
                      </span>
                      <div className="flex items-start gap-1.5 text-[#c5c1b9]">
                        <MapPin size={13} className="text-[#c6a15b] shrink-0 mt-0.5" />
                        <span>
                          {order.shipping_address}, {order.city}, {order.state} - {order.pincode}
                        </span>
                      </div>
                      {order.order_notes && (
                        <p className="mt-2 text-[11px] text-[#8e8a82] italic">
                          Notes: "{order.order_notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="mt-4 space-y-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8a82] block">
                      Fragrances Ordered ({Array.isArray(order.items) ? order.items.length : 0})
                    </span>
                    <div className="divide-y divide-white/5">
                      {Array.isArray(order.items) &&
                        order.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-9 shrink-0 border border-white/10 bg-[#11110f] flex items-center justify-center p-0.5">
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
                                <p className="font-medium text-[#f4efe6]">{item.name}</p>
                                <p className="text-[11px] text-[#8e8a82]">
                                  {item.size_ml}ml Decant × {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-medium text-[#f4efe6]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Order Footer Totals */}
                  <div className="mt-4 border-t border-white/10 pt-3 flex justify-between items-center text-xs">
                    <span className="text-[#8e8a82]">
                      Subtotal: ₹{order.subtotal} | Insured Shipping: ₹{order.shipping_fee}
                    </span>
                    <div className="text-right">
                      <span className="text-[11px] text-[#8e8a82] mr-2">Total:</span>
                      <span className="font-display text-xl text-[#c6a15b]">
                        ₹{order.total_amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGISTERED CUSTOMERS */}
      {activeTab === "customers" && (
        <div className="mt-8">
          {loadingCustomers ? (
            <div className="py-16 text-center text-xs text-[#8e8a82]">
              Loading registered customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="border border-white/10 bg-[#171715] py-16 text-center text-xs text-[#8e8a82]">
              No registered customers yet.
            </div>
          ) : (
            <div className="border border-white/10 bg-[#171715] overflow-x-auto shadow-2xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-[#131311] text-[11px] uppercase tracking-wider text-[#8e8a82]">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Orders Placed</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <span className="font-medium text-[#f4efe6] block">{c.full_name}</span>
                        {c.is_admin && (
                          <span className="mt-0.5 inline-block text-[9px] uppercase tracking-wider text-[#c6a15b] font-semibold">
                            Admin
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-[#c5c1b9] block">{c.email}</span>
                        <span className="text-[11px] text-[#8e8a82] block">{c.phone || "—"}</span>
                      </td>
                      <td className="p-4 text-[#8e8a82]">
                        {c.city ? `${c.city}, ${c.state || ""}` : "—"}
                      </td>
                      <td className="p-4 font-medium text-[#f4efe6]">
                        {c.orders_count}
                      </td>
                      <td className="p-4 font-display text-sm text-[#c6a15b]">
                        ₹{Number(c.total_spent || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-4 text-[#8e8a82]">
                        {new Date(c.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
