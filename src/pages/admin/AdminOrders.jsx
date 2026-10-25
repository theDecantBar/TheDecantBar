import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Package,
  Truck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminOrders, updateAdminOrderStatus, resendAdminOrderConfirmation } from "../../services/adminApi";

const STATUS_OPTIONS = [
  "All",
  "Confirmed",
  "In Packaging",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const COURIER_PRESETS = [
  "Delhivery",
  "Blue Dart",
  "DTDC",
  "Shiprocket",
  "India Post",
  "Xpressbees",
  "Shadowfax",
  "Other",
];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Expandable item details per order
  const [expandedOrders, setExpandedOrders] = useState({});

  // Form states for status/courier modal or inline updater
  const [updatingId, setUpdatingId] = useState(null);
  const [updateFeedback, setUpdateFeedback] = useState({});
  const [resendingId, setResendingId] = useState(null);
  const [resendFeedback, setResendFeedback] = useState({});

  const handleResendEmail = async (orderId) => {
    try {
      setResendingId(orderId);
      const res = await resendAdminOrderConfirmation(token, orderId);
      setResendFeedback((prev) => ({ ...prev, [orderId]: res.message || "Email resent successfully!" }));
      loadOrders();
      setTimeout(() => {
        setResendFeedback((prev) => ({ ...prev, [orderId]: "" }));
      }, 5000);
    } catch (err) {
      alert("Failed to resend confirmation email: " + err.message);
    } finally {
      setResendingId(null);
    }
  };

  const loadOrders = useCallback(async () => {
    try {
      setError("");
      const data = await fetchAdminOrders(token, {
        status: selectedStatus,
        search: searchQuery,
      });
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [token, selectedStatus, searchQuery]);

  useEffect(() => {
    let ignore = false;
    async function initLoad() {
      try {
        const data = await fetchAdminOrders(token, {
          status: selectedStatus,
          search: searchQuery,
        });
        if (!ignore) {
          setOrders(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load orders");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initLoad();

    return () => {
      ignore = true;
    };
  }, [token, selectedStatus, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    loadOrders();
  };


  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleUpdateSubmit = async (orderId, newStatus, courierName, trackingNumber) => {
    try {
      setUpdatingId(orderId);
      const res = await updateAdminOrderStatus(token, orderId, {
        orderStatus: newStatus,
        courierName: courierName || null,
        trackingNumber: trackingNumber || null,
      });

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...res.order } : o))
      );

      setUpdateFeedback({ [orderId]: "Status updated successfully!" });
      setTimeout(() => setUpdateFeedback({}), 3000);
    } catch (err) {
      alert(err.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#c6a15b]">
          Dispatch & Fulfillment
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[#f4efe6] mt-1">
          Orders Management
        </h1>
        <p className="text-xs text-[#8e8a82] mt-1">
          Monitor customer purchases, update packaging statuses, and assign courier AWB tracking.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition cursor-pointer border ${
                selectedStatus === status
                  ? "border-[#c6a15b] bg-[#c6a15b] text-[#11110f] font-semibold"
                  : "border-white/10 bg-[#171715] text-[#c5c1b9] hover:border-white/20"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8a82]"
            />
            <input
              type="search"
              placeholder="Search by order #, customer name, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#171715] border border-white/10 pl-11 pr-4 py-3 text-xs text-[#f4efe6] placeholder-[#8e8a82] focus:border-[#c6a15b] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="border border-[#c6a15b] bg-[#c6a15b] px-5 py-3 text-xs uppercase tracking-wider font-semibold text-[#11110f] hover:bg-[#d8c08a] transition cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-3" />
          <p className="text-xs uppercase tracking-wider text-[#8e8a82]">
            Loading customer orders...
          </p>
        </div>
      ) : error ? (
        <div className="border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-300">
          <p>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-white/10 bg-[#171715] p-12 text-center text-[#8e8a82]">
          <Package size={36} strokeWidth={1.2} className="mx-auto text-[#c6a15b] mb-3" />
          <p className="text-sm text-[#f4efe6]">No orders found for this filter.</p>
          <p className="text-xs mt-1">Try switching tabs or resetting your search term.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const isExpanded = !!expandedOrders[order.id];
            return (
              <div
                key={order.id}
                className="border border-white/10 bg-[#171715] transition-all hover:border-white/20"
              >
                {/* Order Summary Bar */}
                <div className="p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-xl text-[#f4efe6]">
                        #{order.order_number}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${
                          order.order_status === "Confirmed"
                            ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                            : order.order_status === "In Packaging"
                            ? "bg-blue-400/10 text-blue-300 border border-blue-400/20"
                            : order.order_status === "Shipped"
                            ? "bg-purple-400/10 text-purple-300 border border-purple-400/20"
                            : order.order_status === "Delivered"
                            ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                            : "bg-red-400/10 text-red-300 border border-red-400/20"
                        }`}
                      >
                        {order.order_status}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-[#8e8a82]">
                        {order.payment_method === "cod" ? "Cash on Delivery" : (order.payment_method || "Online (Razorpay)")}
                      </span>
                    </div>

                    <p className="text-xs text-[#8e8a82]">
                      Ordered on{" "}
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Customer Quick Info & Total */}
                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    <div>
                      <p className="text-[#8e8a82]">Customer</p>
                      <p className="font-semibold text-[#f4efe6]">{order.customer_name}</p>
                    </div>

                    <div>
                      <p className="text-[#8e8a82]">Total Amount</p>
                      <p className="font-display text-xl text-[#c6a15b]">
                        ₹{order.total_amount}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-2 text-xs uppercase tracking-wider text-[#f4efe6] hover:bg-white/10 transition cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          Hide Details <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          View {order.items?.length || 0} Items <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Items & Fulfillment Action */}
                {isExpanded && (
                  <div className="p-6 bg-[#141412] border-t border-white/5 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Customer Address Details */}
                      <div className="border border-white/5 bg-[#171715] p-4 text-xs space-y-2">
                        <p className="uppercase tracking-wider text-[11px] font-semibold text-[#c6a15b] flex items-center gap-1.5">
                          <MapPin size={14} /> Shipping Destination
                        </p>
                        <p className="text-[#f4efe6] font-medium">{order.customer_name}</p>
                        <p className="text-[#c5c1b9] leading-relaxed">
                          {order.shipping_address}
                        </p>
                        <p className="text-[#c5c1b9]">
                          {order.city}, {order.state} - {order.pincode}
                        </p>
                        <div className="pt-2 border-t border-white/5 space-y-1 text-[#8e8a82]">
                          <p className="flex items-center gap-2 text-[#f4efe6]">
                            <Phone size={12} className="text-[#c6a15b]" /> {order.customer_phone}
                          </p>
                          <p className="flex items-center gap-2 text-[#f4efe6]">
                            <Mail size={12} className="text-[#c6a15b]" /> {order.customer_email}
                          </p>
                        </div>
                        {order.order_notes && (
                          <div className="pt-2 text-[11px] text-amber-300/80 italic">
                            Notes: "{order.order_notes}"
                          </div>
                        )}
                      </div>

                      {/* Items Ordered List */}
                      <div className="lg:col-span-2 border border-white/5 bg-[#171715] p-4 text-xs space-y-3">
                        <p className="uppercase tracking-wider text-[11px] font-semibold text-[#c6a15b] flex items-center gap-1.5">
                          <Package size={14} /> Decants In Package ({order.items?.length || 0})
                        </p>

                        <div className="divide-y divide-white/5 max-h-56 overflow-y-auto pr-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-10 w-10 object-contain bg-[#11110f] p-1 border border-white/10"
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-[#11110f] border border-white/10 flex items-center justify-center text-[10px] text-[#8e8a82]">
                                    {item.size_ml}ml
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-[#f4efe6]">{item.name}</p>
                                  <p className="text-[11px] text-[#c6a15b]">
                                    {item.size_ml}ml Atomizer Decant
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-[#f4efe6] font-medium">
                                  {item.quantity} × ₹{item.price}
                                </p>
                                <p className="text-[11px] text-[#8e8a82]">
                                  = ₹{item.quantity * item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex justify-between text-xs font-semibold text-[#f4efe6]">
                          <span>Subtotal + Delivery Fee ({Number(order.shipping_fee) === 0 ? "FREE" : `₹${order.shipping_fee}`})</span>
                          <span className="text-[#c6a15b] font-display text-base">
                            Total: ₹{order.total_amount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Fulfillment Control Card */}
                    <OrderFulfillmentForm
                      order={order}
                      isUpdating={updatingId === order.id}
                      feedback={updateFeedback[order.id]}
                      onSave={handleUpdateSubmit}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Sub-component for editing order status, courier, and AWB
function OrderFulfillmentForm({ order, isUpdating, feedback, onSave }) {
  const [status, setStatus] = useState(order.order_status || "Confirmed");
  const [courier, setCourier] = useState(order.courier_name || "");
  const [tracking, setTracking] = useState(order.tracking_number || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(order.id, status, courier, tracking);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#c6a15b]/30 bg-[#171715] p-5 text-xs space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="uppercase tracking-wider font-semibold text-[#f4efe6] flex items-center gap-2">
          <Truck size={16} className="text-[#c6a15b]" /> Fulfillment & Tracking Status
        </p>
        {feedback && (
          <span className="text-emerald-400 font-semibold animate-pulse">
            {feedback}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Selector */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#8e8a82] mb-1 font-medium">
            Shipment Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
          >
            <option value="Confirmed">Confirmed</option>
            <option value="In Packaging">In Packaging</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Courier Name */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#8e8a82] mb-1 font-medium">
            Courier Partner
          </label>
          <input
            type="text"
            list={`couriers-${order.id}`}
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="e.g. Delhivery / Blue Dart"
            className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
          />
          <datalist id={`couriers-${order.id}`}>
            {COURIER_PRESETS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Tracking AWB */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#8e8a82] mb-1 font-medium">
            AWB Tracking Number
          </label>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. 1423859201"
            className="w-full bg-[#11110f] border border-white/15 px-3 py-2.5 text-xs text-[#f4efe6] focus:border-[#c6a15b] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isUpdating}
          className="border border-[#c6a15b] bg-[#c6a15b] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#11110f] hover:bg-[#d8c08a] transition disabled:opacity-50 cursor-pointer shadow-md"
        >
          {isUpdating ? "Saving Changes..." : "Update Shipment Details"}
        </button>
      </div>
    </form>
  );
}
