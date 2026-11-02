"use client";

import { useEffect, useRef } from "react";
import styles from "../../styles/news/NewsPage.module.css";

const EFFECTS = [
  "flower-pot-effect",
  "platine2-effect",
  "peigne-afro-effect",
  "newspaper1-effect",
  "money-dollar-effect",
  "shoes-effect",
];

export default function NewsHero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const title = hero.querySelector("h1");
    const objects = EFFECTS.map((name) => hero.querySelector(`.${styles[name]}`)).filter(Boolean);

    const reset = () => objects.forEach((object) => {
      object.classList.remove(styles["is-falling"], styles["is-falling-newspaper"]);
      object.style.animationDelay = "0s";
      object.style.animationDuration = "0s";
      object.style.opacity = "0";
    });

    const play = () => {
      if (window.matchMedia("(max-width: 767.98px)").matches) return;
      reset();
      let delay = 0;
      [...objects].sort(() => Math.random() - 0.5).forEach((object) => {
        const newspaper = object.classList.contains(styles["newspaper1-effect"]);
        object.style.setProperty("--rot", `${Math.random() * 360 - 180}deg`);
        object.style.setProperty("--scale", `${Math.random() * 0.4 + 0.4}`);
        object.style.setProperty("--drift", `${Math.random() * 200 - 100}px`);
        object.style.animationDelay = `${delay}s`;
        object.style.animationDuration = `${newspaper ? 20 : 9.5}s`;
        object.classList.add(styles[newspaper ? "is-falling-newspaper" : "is-falling"]);
        delay += Math.random() * 0.7 + 0.3;
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      title?.classList.add(styles["is-visible"]);
      play();
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(hero);
    return () => { observer.disconnect(); reset(); };
  }, []);

  return <section ref={heroRef} className={styles["hero-menu-quiz"]}>
    {EFFECTS.map((name) => <div key={name} className={styles[name]} />)}
    <div className={styles["logo-wrapper"]}><div className={styles["logo-spin"]} /></div>
    <h1>News<span className="sr-only"> : Menu de sélection des News</span></h1>
    <p className={styles["texte-hero"]}>Consultez nos articles dédiés à la culture Soul</p>
    <div className={styles["hero-scroll-down"]}>
      <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      <p>Faire défiler pour voir les News</p>
      <i className="fa-solid fa-chevron-down" aria-hidden="true" />
    </div>
  </section>;
}
