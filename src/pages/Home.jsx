import { motion, useReducedMotion } from "motion/react";
import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import FeaturedDecants from "../components/home/FeaturedDecants";
import CategoryBanners from "../components/home/CategoryBanners";
import DecantGuide from "../components/home/DecantGuide";
import Testimonials from "../components/home/Testimonials";


function Reveal({ children }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#11110f] text-[#f4efe6]">
      <Hero />
      
      <CategoryBanners />
      <Reveal><FeaturedDecants /></Reveal>
      <Reveal><DecantGuide /></Reveal>
      <Reveal><Testimonials /></Reveal>
      
    </div>
  );
}
