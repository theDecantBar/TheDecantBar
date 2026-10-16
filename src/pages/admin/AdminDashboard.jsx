import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchAdminStats } from "../../services/adminApi";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function loadStats() {
      try {
        const data = await fetchAdminStats(token);
        if (!ignore) {
          setStats(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load admin stats");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (token) {
      loadStats();
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c6a15b] border-t-transparent mb-3" />
        <p className="text-xs uppercase tracking-wider text-[#8e8a82]">
          Loading store analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-300">
        <p>{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats?.revenue || 0).toLocaleString("en-IN")}`,
      change: "+18% from last month",
      icon: IndianRupee,
      iconBg: "bg-[#c6a15b]/10 text-[#c6a15b]",
      trend: "up",
    },
    {
      title: "Customer Orders",
      value: stats?.totalOrders || 0,
      change: `${stats?.deliveredOrders || 0} delivered so far`,
      icon: ShoppingBag,
      iconBg: "bg-blue-500/10 text-blue-400",
      trend: "up",
    },
    {
      title: "Awaiting Dispatch",
      value: (stats?.confirmedOrders || 0) + (stats?.packagingOrders || 0),
      change: `${stats?.packagingOrders || 0} in sterile packaging`,
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400",
      trend: "up",
    },
    {
      title: "Catalog Stock",
      value: `${stats?.totalProducts || 0} Fragrances`,
      change: `${stats?.lowStockCount || 0} low-stock decants`,
      icon: Package,
      iconBg: stats?.lowStockCount > 0 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display text-[#f4efe6]">
            Store Dashboard
          </h1>
          <p className="text-xs text-[#8e8a82] mt-1">
            Real-time performance, inventory alerts, and dispatch queue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 border border-white/15 bg-[#171715] px-4 py-2.5 text-xs uppercase tracking-wider font-medium text-[#f4efe6] hover:bg-white/5 transition rounded-md"
          >
            <Sparkles size={14} className="text-[#c6a15b]" /> Manage Perfumes
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 border border-[#c6a15b] bg-[#c6a15b] px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#11110f] hover:bg-[#d8c08a] transition rounded-md shadow-md"
          >
            <Package size={14} /> Full Orders Queue
          </Link>
        </div>
      </div>

      {/* 4 KPI Stats Grid (styled like dashboard component) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-xl border border-white/10 bg-[#171715] shadow-sm hover:border-[#c6a15b]/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${card.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-xs text-[#8e8a82] uppercase tracking-wider mb-1">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold font-display text-[#f4efe6]">
                  {card.value}
                </p>
                <p className="text-xs text-emerald-400/90 mt-1.5 flex items-center gap-1 font-medium">
                  {card.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid: 2/3 Recent Orders + 1/3 Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders Activity Feed */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-[#171715] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-semibold text-[#f4efe6]">Recent Order Activity</h3>
                <p className="text-xs text-[#8e8a82]">Direct purchases placed by customers</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs text-[#c6a15b] hover:underline uppercase tracking-wider font-semibold inline-flex items-center gap-1"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {stats?.recentOrders?.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8e8a82]">
                No recent orders found.
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentOrders?.map((ord) => (
                  <div
                    key={ord.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-white/5 bg-[#141412] hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="p-2.5 rounded-lg bg-[#c6a15b]/10 text-[#c6a15b] shrink-0">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#f4efe6] truncate">
                          #{ord.order_number} · {ord.customer_name}
                        </p>
                        <p className="text-[11px] text-[#8e8a82] truncate">
                          {ord.items_count} decant item(s) · {ord.payment_method === "cod" ? "COD" : "Online UPI"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                      <span className="font-semibold text-[#c6a15b] font-display text-sm">
                        ₹{ord.total_amount}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${ord.order_status === "Confirmed"
                            ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                            : ord.order_status === "In Packaging"
                              ? "bg-blue-400/10 text-blue-300 border border-blue-400/20"
                              : ord.order_status === "Shipped"
                                ? "bg-purple-400/10 text-purple-300 border border-purple-400/20"
                                : ord.order_status === "Delivered"
                                  ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20"
                                  : "bg-red-400/10 text-red-300 border border-red-400/20"
                          }`}
                      >
                        {ord.order_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Fulfillment Quick Stats & Breakdown */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#171715] p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#f4efe6] mb-4">
              Fulfillment Pipeline
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#8e8a82]">Delivered Orders</span>
                  <span className="font-semibold text-emerald-400">{stats?.deliveredOrders || 0}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{
                      width: `${stats?.totalOrders
                          ? Math.round(((stats?.deliveredOrders || 0) / stats.totalOrders) * 100)
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#8e8a82]">In Transit (Shipped)</span>
                  <span className="font-semibold text-purple-400">{stats?.shippedOrders || 0}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${stats?.totalOrders
                          ? Math.round(((stats?.shippedOrders || 0) / stats.totalOrders) * 100)
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[#8e8a82]">Pending Packaging</span>
                  <span className="font-semibold text-amber-400">
                    {(stats?.confirmedOrders || 0) + (stats?.packagingOrders || 0)}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${stats?.totalOrders
                          ? Math.round(
                            (((stats?.confirmedOrders || 0) + (stats?.packagingOrders || 0)) /
                              stats.totalOrders) *
                            100
                          )
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#171715] p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#f4efe6] mb-3">
              Inventory Health
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-white/5">
                <span className="text-[#c5c1b9]">Low Stock Variants</span>
                <span className={`font-semibold ${stats?.lowStockCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                  {stats?.lowStockCount || 0} decants
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-white/5">
                <span className="text-[#c5c1b9]">Out of Stock</span>
                <span className="font-semibold text-rose-400">
                  {stats?.outOfStockCount || 0} variants
                </span>
              </div>
              <Link
                to="/admin/inventory"
                className="mt-2 block text-center py-2 px-3 border border-[#c6a15b]/40 text-[#c6a15b] hover:bg-[#c6a15b] hover:text-[#11110f] transition rounded text-xs uppercase tracking-wider font-medium"
              >
                Open Inventory & Alert Hub →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
