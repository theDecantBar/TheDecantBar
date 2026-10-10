import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col bg-[#11110f] text-[#f4efe6]">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
