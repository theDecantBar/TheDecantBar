import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import "./Hero.css";

const droplets = Array.from({ length: 65 }, (_, i) => ({
  x: 25 + (i * 37) % 290, y: 100 + Math.sin(i * 9.7) * (12 + (i * 13) % 85),
  r: i % 9 === 0 ? 1.6 : 0.6, delay: `${(i % 13) * -0.17}s`,
}));

export default function Hero() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.0001 });
  const titleOpacity = useTransform(progress, [0, 0.14, 0.5], [1, 1, 0]);
  const firstLineX = useTransform(progress, [0.12, 0.52], ["0vw", "-34vw"]);
  const secondLineX = useTransform(progress, [0.12, 0.52], ["0vw", "34vw"]);
  const descriptionOpacity = useTransform(progress, [0.27, 0.56], [0, 1]);
  const descriptionY = useTransform(progress, [0.27, 0.56], [22, 0]);
  const descriptionVisibility = useTransform(progress, value => value > 0.27 ? "visible" : "hidden");
  const actionsOpacity = useTransform(progress, [0.35, 0.6], [0, 1]);
  const actionsY = useTransform(progress, [0.35, 0.6], [22, 0]);
  const actionsVisibility = useTransform(progress, value => value > 0.35 ? "visible" : "hidden");
  const decantY = useTransform(progress, [0.19, 0.64], [350, 0]);
  const decantX = useTransform(progress, [0.19, 0.64], [65, 0]);
  const decantScale = useTransform(progress, [0.19, 0.64], [0.75, 1]);
  const decantOpacity = useTransform(progress, [0.19, 0.34], [0, 1]);
  const decantRotate = useTransform(progress, [0.19, 0.64], [10, 0]);
  const sprayOpacity = useTransform(progress, [0.66, 0.77, 0.92, 1], [0, 0.9, 0.7, 0.1]);
  const sprayScale = useTransform(progress, [0.66, 0.88], [0.15, 1]);
  const pumpY = useTransform(progress, [0.65, 0.72, 0.78], [0, 4, 0]);
  const smokeOpacity = useTransform(progress, [0, 0.45, 0.82, 1], [0.55, 0.7, 0.85, 0.6]);
  const smokeY = useTransform(progress, [0, 1], [25, -40]);
  const smokeScale = useTransform(progress, [0, 1], [1, 1.15]);

  return (
    <section ref={sectionRef} className={`signature-story ${reduceMotion ? "signature-story--reduced" : ""}`} aria-labelledby="hero-title">
      <div className="signature-hero">
        <div className="signature-hero__art" aria-hidden="true">
          <img className="signature-hero__background" src="/images/hero/hero-bg.webp" alt="" fetchPriority="high" />
          <div className="signature-hero__aura" />
          <motion.div className="signature-hero__smoke" style={reduceMotion ? { opacity: 0.35 } : { opacity: smokeOpacity, y: smokeY, scale: smokeScale }}>
            <img className="signature-hero__smoke-layer signature-hero__smoke-layer--near" src="/images/hero/hero-smoke-gold.webp" alt="" />
            <img className="signature-hero__smoke-layer signature-hero__smoke-layer--far" src="/images/hero/hero-smoke-gold.webp" alt="" />
          </motion.div>
          <motion.img className="signature-hero__flacon" src="/images/hero/hero-main-bottle.png" alt=""
            initial={reduceMotion ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="signature-hero__decant" style={reduceMotion ? undefined : { x: decantX, y: decantY, opacity: decantOpacity, rotate: decantRotate, scale: decantScale }}>
            <img src="/images/hero/hero-decant-bottle.png" alt="" />
            <motion.span className="signature-hero__pump" style={reduceMotion ? undefined : { y: pumpY }} />
          </motion.div>
          <motion.div className="signature-hero__spray" style={reduceMotion ? { opacity: 0.4 } : { opacity: sprayOpacity, scaleX: sprayScale }}>
            <svg viewBox="0 0 340 200" fill="none">
              <defs><radialGradient id="mist-gold" cx="0%" cy="50%" r="100%"><stop stopColor="#fff3d4" stopOpacity=".55"/><stop offset="1" stopColor="#d9ac62" stopOpacity="0"/></radialGradient></defs>
              <path d="M0 100 L330 5 Q380 100 330 195 Z" fill="url(#mist-gold)" opacity="0.22" style={{ filter: "blur(9px)" }} />
              {droplets.map((drop, i) => <circle key={i} cx={drop.x} cy={drop.y} r={drop.r} fill="#ffe5af" className="signature-hero__droplet" style={{ animationDelay: drop.delay }} />)}
            </svg>
          </motion.div>
        </div>
        <div className="signature-hero__shade" aria-hidden="true" />
        <div className="signature-hero__inner">
          <div className="signature-hero__copy">
            <motion.div className="signature-hero__chapter signature-hero__intro" style={reduceMotion ? undefined : { opacity: titleOpacity }}>
              <p className="signature-hero__eyebrow">The Decant Bar</p>
              <h1 id="hero-title" className="signature-hero__title"><motion.span style={reduceMotion ? undefined : { x: firstLineX }}>Every <em>legend.</em></motion.span><motion.span style={reduceMotion ? undefined : { x: secondLineX }}>Your size.</motion.span></h1>
            </motion.div>
            <motion.div className="signature-hero__chapter signature-hero__discovery" style={reduceMotion ? undefined : { opacity: descriptionOpacity, y: descriptionY, visibility: descriptionVisibility }}>
              <h2 className="signature-hero__statement">Great perfume shouldn’t cost a full bottle<br />to discover.</h2>
              <p className="signature-hero__description">Authentic luxury, niche, and oriental fragrances, decanted into sizes made to try, travel and love.</p>
              <motion.div className="signature-hero__actions" style={reduceMotion ? undefined : { opacity: actionsOpacity, y: actionsY, visibility: actionsVisibility }}>
                <Link to="/products" className="signature-hero__cta"><span>Shop the collection</span><ArrowUpRight size={17} strokeWidth={1.5} /></Link>
                <span className="signature-hero__sizes">2 ml <i /> 5 ml <i /> 10 ml</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <a href="#discover" className="signature-hero__scroll"><span>{reduceMotion ? "Discover your signature" : "Scroll to discover"}</span><ArrowDown size={14} /></a>
        <p className="signature-hero__caption">The art of discovery. By the drop.</p>
        <motion.div className="signature-hero__progress" aria-hidden="true" style={{ scaleX: reduceMotion ? 1 : progress }} />
      </div>
    </section>
  );
}
