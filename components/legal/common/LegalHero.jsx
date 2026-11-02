"use client";

import { useEffect, useRef } from "react";

export default function LegalHero() {
  const heroRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const description = descriptionRef.current;

    if (!hero || !description) return;

    const title = hero.querySelector("h1");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      title?.classList.add("is-visible");
      return;
    }

    const titleObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        title?.classList.add("is-visible");
        titleObserver.disconnect();
      },
      { threshold: 0.4 },
    );

    titleObserver.observe(hero);

    return () => {
      titleObserver.disconnect();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero-legal">
      <div className="hero-content">
        <a
          href="../index.html"
          className="hero-logo-container"
          aria-label="Retour à l’accueil"
        ></a>

        <h1>Mentions Légales</h1>
      </div>

      <p ref={descriptionRef} className="hero-description">
        Informations légales, confidentialité, cookies et conditions
        d’utilisation de Soul Music Quiz.
      </p>

      <div className="legal-hero-scroll-down" aria-hidden="true">
        <i className="fa-solid fa-chevron-down"></i>
        <p>Faire défiler pour voir les infos</p>
        <i className="fa-solid fa-chevron-down"></i>
      </div>

      <div className="legal-logo-wrapper" aria-hidden="true">
        <div className="legal-logo-spin"></div>
      </div>
    </section>
  );
}
