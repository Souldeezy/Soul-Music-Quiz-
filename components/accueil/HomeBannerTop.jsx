"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeBannerTop() {
  const bannerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [is1440, setIs1440] = useState(false);

  useEffect(() => {
    const updateWidth = () => setIs1440(window.innerWidth === 1440);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    const banner = bannerRef.current;
    if (!banner) return () => window.removeEventListener("resize", updateWidth);
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(banner);
    return () => { observer.disconnect(); window.removeEventListener("resize", updateWidth); };
  }, []);

  return (
    <section ref={bannerRef} className={`home-banner home-banner-categories${isVisible ? " is-visible" : ""}${is1440 ? " is-window-1440" : ""}`} aria-labelledby="categories-title">
      <div className="home-banner-sun" aria-hidden="true" />
      <div className="home-banner-birds" aria-hidden="true" />
      <h2 id="categories-title">Catégories</h2>
      <div className="home-banner-icons" aria-hidden="true">
        <i className="fa-solid fa-rss" />
        <i className="fa-solid fa-record-vinyl" />
        <i className="fa-solid fa-music" />
      </div>
    </section>
  );
}
