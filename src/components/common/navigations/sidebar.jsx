import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  PresentationChartBarIcon as DashboardSolid,
  ShoppingBagIcon as ProductsSolid,
  UsersIcon as CustomersSolid,
  ClipboardDocumentListIcon as OrdersSolid,
  NewspaperIcon as NewsletterSolid,
  UserGroupIcon as RepsSolid,
  LifebuoyIcon as SupportSolid,
} from "@heroicons/react/24/solid";
import {
  PresentationChartBarIcon as DashboardOutline,
  ShoppingBagIcon as ProductsOutline,
  UsersIcon as CustomersOutline,
  ClipboardDocumentListIcon as OrdersOutline,
  NewspaperIcon as NewsletterOutline,
  UserGroupIcon as RepsOutline,
  LifebuoyIcon as SupportOutline,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { adminApi, useLogoutAdminMutation } from "../../../services/api";
import { clearUser } from "../../../redux/user";
import { setNotifications } from "../../../redux/notificationSlice";

const DRIVER_ICON =
  "https://res.cloudinary.com/phantom1245/image/upload/v1734295978/uploads/tabler_steering-wheel-filled_r41mmd.png";

const ICON = "h-5 w-5 shrink-0";

const menuItems = [
  { label: "Dashboard", path: "/", icon: DashboardOutline, activeIcon: DashboardSolid },
  { label: "Products", path: "/products", icon: ProductsOutline, activeIcon: ProductsSolid },
  { label: "Customers", path: "/customer", icon: CustomersOutline, activeIcon: CustomersSolid },
  { label: "Orders", path: "/order", icon: OrdersOutline, activeIcon: OrdersSolid },
  { label: "Newsletter", path: "/newsletter", icon: NewsletterOutline, activeIcon: NewsletterSolid },
  { label: "Market Rep", path: "/distributors", icon: RepsOutline, activeIcon: RepsSolid },
  { label: "Driver", path: "/driver", image: DRIVER_ICON },
  { label: "Support", path: "/support-message", icon: SupportOutline, activeIcon: SupportSolid },
];

function NavButton({ item, expanded, active, onClick }) {
  const Icon = active ? item.activeIcon : item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      title={expanded ? undefined : item.label}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-11 w-full items-center rounded-lg text-sm font-medium
        transition-colors duration-200 outline-none
        focus-visible:ring-2 focus-visible:ring-white/70
        ${
          active
            ? "bg-white/15 text-white"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
    >
      {/* Active indicator */}
      <span
        className={`absolute -left-2 top-2.5 h-6 w-1 rounded-r-full bg-white transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Fixed-width icon column so icons never shift when the bar expands */}
      <span className="flex h-11 w-11 shrink-0 items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className={`${ICON} ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
          />
        ) : (
          <Icon className={ICON} />
        )}
      </span>

      <span
        className={`whitespace-nowrap transition-opacity duration-200 ${
          expanded ? "opacity-100 delay-100" : "opacity-0"
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoutAdmin, { isLoading: loggingOut }] = useLogoutAdminMutation();

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      // The httpOnly cookie can only be removed by the server.
      await logoutAdmin().unwrap();
    } catch (err) {
      if (err?.status !== 401) {
        console.error("Logout request failed:", err);
        toast.error(
          err?.data?.message || "Could not reach the server to log out."
        );
      }
    } finally {
      dispatch(clearUser());
      dispatch(setNotifications([]));
      dispatch(adminApi.util.resetApiState());
      navigate("/sign-in", { replace: true });
    }
  };

  return (
    <aside
      className={`sticky top-0 left-0 z-30 flex h-screen flex-col bg-mainGreen shadow-xl
        transition-[width] duration-300 ease-in-out ${isExpanded ? "w-60" : "w-[72px]"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocus={() => setIsExpanded(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsExpanded(false);
      }}
    >
      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 overflow-y-auto overflow-x-hidden px-3 pt-6"
      >
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavButton
                item={item}
                expanded={isExpanded}
                active={isActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout, pinned to the bottom */}
      <div className="border-t border-white/15 px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          title={isExpanded ? undefined : "Log out"}
          aria-label="Log out"
          className="group flex h-11 w-full items-center rounded-lg text-sm font-medium text-white/70
            transition-colors duration-200 outline-none hover:bg-red-500/20 hover:text-white
            focus-visible:ring-2 focus-visible:ring-white/70
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center">
            <ArrowRightOnRectangleIcon className={ICON} />
          </span>
          <span
            className={`whitespace-nowrap transition-opacity duration-200 ${
              isExpanded ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </span>
        </button>
      </div>
    </aside>
  );
}