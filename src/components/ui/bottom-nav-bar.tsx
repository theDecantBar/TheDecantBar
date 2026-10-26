"use client";

import { useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Home, ShoppingBag, Info, MessageCircle, CircleHelp, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type NavigationItem = { label: string; icon: LucideIcon; href: string };
const defaultItems: NavigationItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Shop", icon: ShoppingBag, href: "/products" },
  { label: "About", icon: Info, href: "/about" },
  { label: "Contact", icon: MessageCircle, href: "/contact" },
  { label: "FAQ", icon: CircleHelp, href: "/faq" },
];
const MotionLink = motion.create(Link);
type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  activeIndex?: number;
  stickyBottom?: boolean;
  items?: NavigationItem[];
  onNavigate?: (item: NavigationItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

export function BottomNavBar({ className, defaultIndex = 0, activeIndex, stickyBottom = false, items = defaultItems, onNavigate }: BottomNavBarProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const reduceMotion = useReducedMotion();
  const selected = activeIndex ?? selectedIndex;
  return <motion.nav initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} aria-label="Main navigation"
    className={cn("flex h-[52px] w-fit max-w-full items-center gap-0.5 rounded-full border border-border bg-card/90 p-1.5 shadow-xl backdrop-blur-md sm:gap-1", stickyBottom && "fixed inset-x-0 bottom-[max(16px,env(safe-area-inset-bottom))] z-40 mx-auto", className)}>
    {items.map((item, index) => {
      const Icon = item.icon;
      const active = selected === index;
      return <MotionLink key={item.href} to={item.href} aria-label={item.label} aria-current={active ? "page" : undefined} title={item.label}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        onClick={event => { setSelectedIndex(index); onNavigate?.(item, event); }}
        className={cn("relative flex h-10 min-w-11 shrink-0 items-center justify-center rounded-full px-2.5 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a15b]", active ? "bg-[#c6a15b]/15 text-[#d8c08a]" : "text-muted-foreground hover:bg-muted hover:text-[#f4efe6]")}>
        <Icon size={22} strokeWidth={1.7} aria-hidden="true" className="shrink-0" />
        <motion.span initial={false} animate={{ width: active ? 72 : 0, opacity: active ? 1 : 0, marginLeft: active ? 8 : 0 }} transition={reduceMotion ? { duration: 0 } : { width: { type: "spring", stiffness: 350, damping: 32 }, opacity: { duration: 0.19 }, marginLeft: { duration: 0.19 } }}
          className="flex max-w-[56px] items-center overflow-hidden sm:max-w-[72px]" aria-hidden="true">
          <span className="select-none truncate whitespace-nowrap text-xs font-medium leading-[1.9]">{item.label}</span>
        </motion.span>
      </MotionLink>;
    })}
  </motion.nav>;
}
export default BottomNavBar;
