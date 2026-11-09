"use client";

import { useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Home,
  ShoppingBag,
  Info,
  MessageCircle,
  CircleHelp,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const defaultItems: NavigationItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Shop", icon: ShoppingBag, href: "/products" },
  { label: "About", icon: Info, href: "/about" },
  { label: "Contact", icon: MessageCircle, href: "/contact" },
  { label: "Help", icon: CircleHelp, href: "/faq" },
];

const MotionLink = motion.create(Link);

type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  activeIndex?: number;
  stickyBottom?: boolean;
  items?: NavigationItem[];
  onNavigate?: (
    item: NavigationItem,
    event: MouseEvent<HTMLAnchorElement>
  ) => void;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  activeIndex,
  stickyBottom = false,
  items = defaultItems,
  onNavigate,
}: BottomNavBarProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const reduceMotion = useReducedMotion();
  const selected = activeIndex ?? selectedIndex;

  return (
    <motion.nav
      initial={reduceMotion ? false : { scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      aria-label="Main navigation"
      className={cn(
        "flex h-11 w-fit max-w-[calc(100vw-24px)] items-center justify-around gap-0.5 sm:gap-1 rounded-full border border-border bg-card/95 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md sm:max-w-full",
        stickyBottom &&
          "fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto",
        className
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        const active = selected === index;

        return (
          <MotionLink
            key={item.href}
            to={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            title={item.label}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            onClick={(event) => {
              setSelectedIndex(index);
              onNavigate?.(item, event);
            }}
            className={cn(
              "group relative flex h-9 min-w-[48px] sm:min-w-[52px] lg:min-w-[54px] flex-col items-center justify-center rounded-full px-2 sm:px-2.5 py-0.5 text-center transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a15b]",
              active
                ? "bg-[#c6a15b]/15 text-[#d8c08a] shadow-[inset_0_0_8px_rgba(198,161,91,0.12)]"
                : "text-muted-foreground hover:bg-muted/70 hover:text-[#f4efe6]"
            )}
          >
            {/* Icon */}
            <span className="flex h-4 w-4 items-center justify-center">
              <Icon
                size={15}
                strokeWidth={active ? 2 : 1.7}
                aria-hidden="true"
                className={cn(
                  "shrink-0 transition-transform duration-300 group-hover:scale-105",
                  active
                    ? "text-[#c6a15b] drop-shadow-[0_0_6px_rgba(198,161,91,0.45)]"
                    : "text-[#8e8a82] group-hover:text-[#f4efe6]"
                )}
              />
            </span>

            {/* Label below Icon */}
            <span
              className={cn(
                "mt-0.5 select-none whitespace-nowrap text-[9px] sm:text-[9.5px] leading-tight tracking-tight transition-colors duration-300",
                active
                  ? "font-semibold text-[#d8c08a]"
                  : "font-normal text-[#8e8a82] group-hover:text-[#f4efe6]"
              )}
            >
              {item.label}
            </span>
          </MotionLink>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
