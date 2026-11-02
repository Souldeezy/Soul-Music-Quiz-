"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/quiz/NewOrleansSoulBanner.module.css";
import quizStyles from "../../styles/quiz/QuizPage.module.css";

const classes = (...names) => names.map((name) => styles[name]).filter(Boolean).join(" ");

function subscribeViewport(callback) {
  const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const getViewport = () => window.matchMedia(BANNER_VIEWPORT_QUERY).matches;
const getServerViewport = () => false;

function DesktopBanner({ bottom }) {
  const bannerRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const heading = banner.querySelector("h2");
    const icons = banner.querySelector(`.${styles["banner-bar"]}`);
    const observer = new IntersectionObserver(([entry]) => {
      banner.classList.toggle(styles["is-visible"], entry.isIntersecting);
      heading.classList.toggle(styles.play, entry.isIntersecting);
      icons.classList.toggle(styles.play, entry.isIntersecting);
    }, { threshold: 0.45 });
    observer.observe(banner);
    return () => observer.disconnect();
  }, []);

  return <div ref={bannerRef} className={classes("section-banner", "banner-legal", ...(bottom ? [] : ["ban-treme"]))}>
    <h2>{bottom ? "SoulMusicQuiz" : "New Orleans Soul"}</h2>
    {bottom ? <>
      <div className={styles["effet-bayou"]} aria-hidden="true" />
      <div className={styles["croco-eyes"]} aria-hidden="true" />
    </> : <div className={styles["effet-treme-1"]} aria-hidden="true" />}
    <div className={styles["banner-bar"]} aria-hidden="true">
      <i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" />
    </div>
  </div>;
}

export default function NewOrleansSoulBanner({ bottom = false }) {
  const enabled = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
  return enabled ? <DesktopBanner bottom={bottom} /> : <div className={quizStyles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
