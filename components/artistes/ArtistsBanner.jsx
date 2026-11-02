"use client";

import { useEffect, useRef, useState } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/artistes/ArtistesPage.module.css";

function BannerTitle({ children }) {
  return <><h2>{children}</h2><div className={styles["banner-bar"]}>
    <i className="fa-solid fa-rss" aria-hidden="true" />
    <i className="fa-solid fa-record-vinyl" aria-hidden="true" />
    <i className="fa-solid fa-music" aria-hidden="true" />
  </div></>;
}

function useBannerVisibility(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      root.querySelector("h2")?.classList.toggle(styles.play, entry.isIntersecting);
      root.querySelector(`.${styles["banner-bar"]}`)?.classList.toggle(styles.play, entry.isIntersecting);
    }, { threshold: 0.45 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref]);
}

function ConcertBanner() {
  const ref = useRef(null);
  useBannerVisibility(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const notes = [...root.querySelectorAll(`.${styles["music-croche"]}`)];
    const timers = new Map();
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const note = entry.target;
      if (entry.isIntersecting) {
        if (timers.has(note)) return;
        const start = window.setTimeout(() => {
          note.classList.add(styles["is-blinking"]);
          const stop = window.setTimeout(() => {
            note.classList.remove(styles["is-blinking"]);
            timers.delete(note);
          }, 5000);
          timers.set(note, [stop]);
        }, Math.random() * 1000);
        timers.set(note, [start]);
      } else {
        (timers.get(note) || []).forEach(window.clearTimeout);
        timers.delete(note);
        note.classList.remove(styles["is-blinking"]);
      }
    }), { threshold: 0.3 });
    notes.forEach((note) => observer.observe(note));
    return () => { observer.disconnect(); timers.forEach((ids) => ids.forEach(window.clearTimeout)); };
  }, []);

  return <div ref={ref} className={`${styles["section-banner"]} ${styles["banner-categories"]}`}>
    <BannerTitle>Menu Artistes</BannerTitle>
    <div className={styles["estrade-effect"]} />
    <div className={styles["drums-effect"]} />
    <div className={styles["logo-drums-effect"]} />
    {Array.from({ length: 7 }, (_, i) => <div key={i} className={`${styles["music-croche"]} ${styles[`effect-${i + 1}`]}`} />)}
    <div className={styles["singstress-effect"]} />
    <div className={styles["projo1-effect"]} /><div className={styles["projo2-effect"]} />
    <div className={styles["beam-effect-1"]} /><div className={styles["beam-effect-2"]} />
    <div className={styles["crowd-effect"]}>
      {Array.from({ length: 9 }, (_, i) => <div key={i} className={styles[`face-${i + 1}`]} />)}
    </div>
  </div>;
}

const TV_LETTERS = "SOULMUSICQUIZ";

function JeopardyBanner() {
  const ref = useRef(null);
  useBannerVisibility(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const tvs = [...root.querySelectorAll(`.${styles["tv-effect"]}`)];
    const letters = [...root.querySelectorAll(`.${styles["tv-letter"]}`)];
    let timeouts = [];
    let glitchInterval;
    const clear = () => {
      timeouts.forEach(window.clearTimeout);
      timeouts = [];
      window.clearInterval(glitchInterval);
      glitchInterval = undefined;
      tvs.forEach((tv) => tv.classList.remove(styles["tv-on"], styles["tv-glitch"]));
      letters.forEach((letter) => letter.classList.remove(styles["letter-on"], styles["letter-glitch"]));
    };
    const observer = new IntersectionObserver(([entry]) => {
      clear();
      if (!entry.isIntersecting) return;
      tvs.forEach((tv, index) => {
        timeouts.push(window.setTimeout(() => {
          tv.classList.add(styles["tv-on"]);
          letters[index]?.classList.add(styles["letter-on"]);
        }, index * 250));
      });
      glitchInterval = window.setInterval(() => {
        const activeLetters = letters.filter((el) => el.classList.contains(styles["letter-on"]));
        const activeTvs = tvs.filter((el) => el.classList.contains(styles["tv-on"]));
        const useLetter = Math.random() < 0.5 && activeLetters.length;
        const options = useLetter ? activeLetters : activeTvs;
        if (!options.length) return;
        const el = options[Math.floor(Math.random() * options.length)];
        const effect = useLetter ? styles["letter-glitch"] : styles["tv-glitch"];
        el.classList.add(effect);
        timeouts.push(window.setTimeout(() => el.classList.remove(effect), 1000));
      }, 5000);
    }, { threshold: 0.4 });
    observer.observe(root);
    return () => { observer.disconnect(); clear(); };
  }, []);

  return <div ref={ref} className={`${styles["section-banner"]} ${styles["banner-legal"]}`}>
    <BannerTitle>SoulMusicQuiz</BannerTitle>
    <div className={styles["lady-jeopardy"]} />
    {Array.from({ length: 18 }, (_, i) => <div key={i} className={`${styles["tv-effect"]} ${styles[`tv-effect-${i + 1}`]}`} />)}
    {Array.from({ length: 18 }, (_, i) => <div key={i} className={`${styles["tv-letter"]} ${styles[`letter-effect-${i + 1}`]}`}>{TV_LETTERS[i] || ""}</div>)}
    <BannerTitle>À Propos</BannerTitle>
  </div>;
}

export default function ArtistsBanner({ variant }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  if (!enabled) return <div className={`site-banner-placeholder ${styles["artists-banner-placeholder"]}`}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
  return variant === "concert" ? <ConcertBanner /> : <JeopardyBanner />;
}
