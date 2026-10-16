import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Boxes,
  MessageSquare,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronsRight,
  Bell,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navigationItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { name: "Orders & Shipping", path: "/admin/orders", icon: ShoppingBag },
  { name: "Inventory & Alerts", path: "/admin/inventory", icon: Boxes },
  { name: "Perfume Catalog", path: "/admin/products", icon: Sparkles },
  { name: "Customer Reviews", path: "/admin/reviews", icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#11110f] text-[#f4efe6] flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Collapsible Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#171715] border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${open ? "w-64" : "w-16"
          } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Title / Brand Section */}
        <div className="h-20 flex items-center justify-between px-3.5 border-b border-white/10 shrink-0">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br from-[#c6a15b]/20 to-[#c6a15b]/5 border border-[#c6a15b]/40 flex items-center justify-center text-[#c6a15b] shadow-sm">
              <ShieldCheck size={20} />
            </div>
            {open && (
              <div className="transition-opacity duration-200 opacity-100 min-w-0">
                <span className="block text-xs uppercase tracking-[0.2em] text-[#c6a15b] font-semibold truncate">
                  The Decant Bar
                </span>
                <span className="block text-[11px] text-[#8e8a82] truncate">
                  Admin Control
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-[#8e8a82] hover:text-[#f4efe6]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {open && (
            <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.25em] text-[#8e8a82] font-semibold">
              Operations
            </div>
          )}

          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                title={!open ? item.name : undefined}
                className={({ isActive }) =>
                  `relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${isActive
                    ? "bg-[#c6a15b]/15 text-[#c6a15b] shadow-sm border-l-2 border-[#c6a15b] font-semibold"
                    : "text-[#c5c1b9] hover:bg-white/5 hover:text-[#f4efe6]"
                  }`
                }
              >
                <div className="grid h-full w-12 shrink-0 place-content-center">
                  <Icon className="h-4 w-4" />
                </div>

                {open && (
                  <span className="text-xs font-medium uppercase tracking-wider transition-opacity duration-200 opacity-100 truncate">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Account & Live Store Links */}
          {open && (
            <div className="border-t border-white/10 pt-4 mt-4 space-y-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#8e8a82] font-semibold">
                Storefront
              </div>
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-2 text-xs text-[#8e8a82] hover:text-[#c6a15b] transition rounded hover:bg-white/5"
              >
                <ExternalLink size={14} className="shrink-0" />
                <span className="truncate">Open Live Store</span>
              </Link>
            </div>
          )}
        </div>

        {/* User Info when expanded */}
        {open && (
          <div className="p-3 border-t border-white/10 bg-[#131311] flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-xs font-medium text-[#f4efe6] truncate">
                {user?.fullName || "Admin"}
              </p>
              <p className="text-[10px] text-[#8e8a82] truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-[#8e8a82] hover:text-red-400 hover:bg-white/5 transition rounded cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        {/* Collapsible Toggle Close Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="border-t border-white/10 transition-colors hover:bg-white/5 w-full hidden lg:block cursor-pointer"
        >
          <div className="flex items-center p-3">
            <div className="grid size-10 place-content-center shrink-0">
              <ChevronsRight
                className={`h-4 w-4 transition-transform duration-300 text-[#8e8a82] ${open ? "rotate-180" : ""
                  }`}
              />
            </div>
            {open && (
              <span className="text-xs font-medium text-[#8e8a82] transition-opacity duration-200 opacity-100 uppercase tracking-wider">
                Collapse
              </span>
            )}
          </div>
        </button>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${open ? "lg:pl-64" : "lg:pl-16"
          }`}
      >
        {/* Top Navbar */}
        <header className="h-20 bg-[#141412] border-b border-white/10 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#f4efe6] p-2 hover:bg-white/5 rounded"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8e8a82]">
                Admin Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#c6a15b]/10 text-[#c6a15b] border border-[#c6a15b]/20">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c6a15b] animate-pulse" />
              Live Supabase DB
            </span>

            <Link
              to="/admin/orders"
              title="Recent Orders"
              className="relative p-2 rounded-lg bg-white/5 border border-white/10 text-[#8e8a82] hover:text-[#f4efe6] transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#c6a15b] rounded-full" />
            </Link>

            <Link
              to="/account"
              title="My Account"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#8e8a82] hover:text-[#f4efe6] transition"
            >
              <User className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
