import { useRef, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const videoRef = useRef(null);
  const [revealReady, setRevealReady] = useState(false);

  useEffect(() => {
    // Keep content accessible even if the video cannot load or autoplay.
    const fallbackTimer = window.setTimeout(() => setRevealReady(true), 3000);
    // Ensure muted video autoplays smoothly on mobile Safari / Chrome
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setRevealReady(true);
      });
    }
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  return (
    <section className="signature-story" aria-labelledby="hero-title">
      <div className={`signature-hero${revealReady ? " signature-hero--ready" : ""}`}>
        {/* Background Cinematic Video Layer */}
        <div className="signature-hero__video-wrap" aria-hidden="true">
          <video
            ref={videoRef}
            className="signature-hero__video"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            preload="auto"
            onPlaying={() => setRevealReady(true)}
            onError={() => setRevealReady(true)}
          >
            <source src="/videos/HomeVideo.mp4" type="video/mp4" />
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Cinematic Vignette & Readability Gradient Overlay */}
        <div className="signature-hero__overlay" aria-hidden="true" />

        {/* Hero Content Layer */}
        <div className="signature-hero__inner">
          <div className="signature-hero__copy">
            <p className="signature-hero__eyebrow">The Decant Bar</p>
            <h1 id="hero-title" className="signature-hero__title">
              <span>Your next</span>
              <span>
                <em>signature.</em>
              </span>
            </h1>
            <p className="signature-hero__statement">Discover more. Commit less.</p>
            <p className="signature-hero__description">
              Authentic luxury fragrances. Thoughtfully decanted, so you can find
              the one that feels like you.
            </p>
            <div className="signature-hero__actions">
              <Link to="/products" className="signature-hero__cta">
                <span>Shop collection</span>
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
