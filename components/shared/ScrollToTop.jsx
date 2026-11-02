"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const hasMounted = useRef(false);
  const previousPathnameRef = useRef(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    if (!hasMounted.current) {
      hasMounted.current = true;
      previousPathnameRef.current = pathname;
      return;
    }
    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;
    const returningToArtist = pathname === "/artistes" && new URLSearchParams(window.location.search).has("returnArtist");
    const returningToNewsArticleList = pathname === "/news" && previousPathname?.startsWith("/news/");
    if (returningToNewsArticleList) {
      const restoreFrame = window.requestAnimationFrame(() => {
        document.getElementById("category-soul-food")?.scrollIntoView({ block: "start", behavior: "instant" });
      });
      return () => window.cancelAnimationFrame(restoreFrame);
    }
    if (!window.location.hash && !returningToArtist) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    const hideBeforeNavigation = () => setShowBackToTop(false);
    window.addEventListener("smq:navigation-start", hideBeforeNavigation);
    return () => window.removeEventListener("smq:navigation-start", hideBeforeNavigation);
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setShowBackToTop(window.scrollY > Math.max(320, window.innerHeight * 0.35));
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? "instant" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-to-top${showBackToTop ? " is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      aria-hidden={!showBackToTop}
      tabIndex={showBackToTop ? 0 : -1}
    >
      <svg className="back-to-top-arrow" viewBox="0 0 16 12" aria-hidden="true">
        <path d="M2 10 8 4 14 10" />
      </svg>
      <span>Retour en haut</span>
    </button>
  );
}
