import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="signature-story" aria-labelledby="hero-title">
      <div className="signature-hero">
        <div className="signature-hero__art" aria-hidden="true">
          <div className="signature-hero__aura" />
          <div className="signature-hero__smoke">
            <img
              className="signature-hero__smoke-layer signature-hero__smoke-layer--near"
              src="/images/hero/hero-smoke-gold.webp"
              alt=""
            />
            <img
              className="signature-hero__smoke-layer signature-hero__smoke-layer--far"
              src="/images/hero/hero-smoke-gold.webp"
              alt=""
            />
          </div>
          <div className="signature-hero__products">
            <img
              className="signature-hero__background"
              src="/images/hero/hero-scene-1.webp"
              alt=""
              fetchPriority="high"
            />
            <div className="signature-hero__contact signature-hero__contact--decant" />
            <div className="signature-hero__decant-slot">
              <div className="signature-hero__decant">
                <img src="/images/hero/hero-decant-bottle.png" alt="" />
                <span className="signature-hero__pump" />
              </div>
            </div>
          </div>
        </div>
        <div className="signature-hero__shade" aria-hidden="true" />
        <div className="signature-hero__inner">
          <div className="signature-hero__copy">
            <p className="signature-hero__eyebrow">The Decant Bar</p>
            <h1 id="hero-title" className="signature-hero__title">
              <span>Your next</span>
              <span><em>signature.</em></span>
            </h1>
            <p className="signature-hero__statement">Discover more. Commit less.</p>
            <p className="signature-hero__description">
              Authentic luxury fragrances. Thoughtfully decanted, so you can find the one that feels like you.
            </p>
            <div className="signature-hero__actions">
              <Link to="/products" className="signature-hero__cta">
                <span>Shop collection</span>
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </Link>
              <span className="signature-hero__sizes">2 ml <i /> 5 ml <i /> 10 ml</span>
            </div>
          </div>
        </div>
        <a href="#discover" className="signature-hero__scroll">
          <span>Discover collection</span>
          <ArrowUpRight size={14} />
        </a>
        <p className="signature-hero__caption">The art of discovery. By the drop.</p>
      </div>
    </section>
  );
}
