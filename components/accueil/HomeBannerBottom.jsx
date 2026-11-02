"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeBannerBottom() {
  const bannerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={bannerRef} className={`home-banner home-banner-about${isVisible ? " is-visible" : ""}`} aria-labelledby="about-banner-title">
      <div className="home-banner-moon" aria-hidden="true" />
      {Array.from({ length: 7 }, (_, index) => (
        <span className={`home-banner-star star-${index + 1}`} aria-hidden="true" key={index} />
      ))}
      <h2 id="about-banner-title">À Propos</h2>
      <div className="home-banner-icons" aria-hidden="true">
        <i className="fa-solid fa-rss" />
        <i className="fa-solid fa-record-vinyl" />
        <i className="fa-solid fa-music" />
      </div>
    </section>
  );
}
