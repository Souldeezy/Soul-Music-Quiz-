"use client";

import { useEffect, useRef, useState } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/quiz/QuizPage.module.css";


function CityBanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const bannerObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    bannerObserver.observe(root);
    const lights = [...root.querySelectorAll(`.${styles["street-light"]}`)];
    const timers = lights.map((light, index) => window.setTimeout(() => light.classList.add(styles.on), 1800 + index * 700));
    return () => { bannerObserver.disconnect(); timers.forEach(window.clearTimeout); };
  }, []);
  return <div ref={ref} className={`${styles["section-banner"]} ${styles["banner-categories"]}${visible ? ` ${styles["is-visible"]}` : ""}`}>
    <h2>Menu Quiz</h2><div className={styles["car-effect"]} />
    {[1, 2, 3, 4, 5, 6].map((n) => <div key={n} className={`${styles[`bloc-light-${n}`]} ${styles["street-light"]}`}><div className={styles["street-light-1"]} /><div className={styles["street-light-2"]} /></div>)}
    {[1, 2, 3, 4, 5].map((n) => <div key={n} className={`${styles["city-effect"]} ${styles[`building-${n}`]}`} />)}
    <div className={styles["banner-bar"]}><i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" /></div>
  </div>;
}

function DinerBanner() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const bannerObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    bannerObserver.observe(root);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add(styles.play);
    }), { threshold: 0.4 });
    root.querySelectorAll(`.${styles["ceiling-fan-brightness-effect"]}, .${styles["ceiling-fan-brightness-effect-2"]}, .${styles["tse-content"]}`).forEach((el) => observer.observe(el));
    return () => { bannerObserver.disconnect(); observer.disconnect(); };
  }, []);
  const effects = ["stove-effect", "casserolle-effect", "marmite-effect", "table-food-effect", "table-food-2-effect", "table-food-3-effect", "table-room-effect", "pie-effect", "chair-effect-1", "chair-effect-2", "chair-effect-3", "chair-effect-4", "chair-effect-5", "cactus-effect", "chicken-effect", "lemonade-effect", "lemonade-2-effect", "burger-meal-effect", "french-fries-effect", "signboard-effect", "cooking-mama-effect", "ceiling-fan-effect", "ceiling-lamp-effect", "ceiling-fan-brightness-effect", "ceiling-lamp-effect-2", "ceiling-fan-brightness-effect-2"];
  return <div ref={ref} className={`${styles["section-banner"]} ${styles["banner-legal"]}${visible ? ` ${styles["is-visible"]}` : ""}`}>
    <h2>SoulMusicQuiz</h2>{effects.map((name) => <div key={name} className={styles[name]} />)}
    <div className={styles["sign-container"]}><div className={styles["text-signboard-title"]}>janice&apos;s</div><p className={styles["tse-content"]}>Soul Food Open 24/7</p></div>
    <div className={styles["banner-bar"]}><i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" /></div>
  </div>;
}

export default function QuizBanner({ variant }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia(BANNER_VIEWPORT_QUERY);
    const update = () => setEnabled(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);
  if (!enabled) return <div className={styles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
  return variant === "city" ? <CityBanner /> : <DinerBanner />;
}
