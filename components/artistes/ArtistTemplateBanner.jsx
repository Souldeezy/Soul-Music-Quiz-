"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/artistes/ArtistTemplate.module.css";

const subscribe = (callback) => {
  const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const getSnapshot = () => window.matchMedia(BANNER_VIEWPORT_QUERY).matches;
const getServerSnapshot = () => false;
const noteFallFrames = [
  { offset: 0, bottom: "23%", opacity: 0.2 },
  { offset: 0.92, bottom: "-87%", opacity: 0.2 },
  { offset: 1, bottom: "-97%", opacity: 0 },
];

function RainyCityBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;
    const man = banner.querySelector(`.${styles.manUmbrella}`);
    const woman = banner.querySelector(`.${styles.womanUmbrella}`);
    const rainGrid = banner.querySelector(`.${styles.rainGrid}`);
    const rainColumns = banner.querySelectorAll(`.${styles.rainColumn}`);
    const heading = banner.querySelector("h2");
    const icons = banner.querySelector(`.${styles.bannerBar}`);
    const timers = new Set();
    const rainAnimations = [];
    let womanFadeAnimation;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let started = false;

    const later = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
    };

    const startRain = () => {
      rainColumns.forEach((column) => {
        // Comme dans la vanilla : une vitesse et un décalage propres à chaque colonne.
        const speed = Number((Math.random() * 1.2 + 0.8).toFixed(2));
        const columnDelay = Number((Math.random() * 2).toFixed(2));
        column.querySelectorAll(`.${styles.rainNote}`).forEach((note, row) => {
          const delay = Number((columnDelay + row * speed).toFixed(2));
          rainAnimations.push(note.animate(noteFallFrames, {
            duration: speed * 1000,
            delay: delay * 1000,
            iterations: Infinity,
            easing: "linear",
          }));
        });
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      if (reducedMotion) {
        heading.classList.add(styles.play);
        icons.classList.add(styles.play);
        return;
      }
      later(() => {
        startRain();
        man.classList.add(styles.play);
        later(() => banner.classList.add(styles.scrolling), 5000);
        later(() => {
          heading.classList.add(styles.play);
          icons.classList.add(styles.play);
        }, 93000);
        later(() => {
          womanFadeAnimation = woman.animate([
            { opacity: 0.9 },
            { opacity: 0 },
          ], {
            duration: 60000,
            easing: "linear",
            fill: "forwards",
          });
          later(() => {
            rainGrid.classList.add(styles.rainStopping);
            later(() => rainAnimations.forEach((animation) => animation.cancel()), 20000);
          }, 60000);
        }, 95500);
      }, 2000);
    }, { threshold: .2 });

    observer.observe(banner);
    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
      rainAnimations.forEach((animation) => animation.cancel());
      womanFadeAnimation?.cancel();
    };
  }, []);

  return <div ref={bannerRef} className={styles.banner}>
    <h2>SoulMusicQuiz</h2>
    <div className={styles.manUmbrella} aria-hidden="true" />
    <div className={styles.womanUmbrella} aria-hidden="true" />
    <div className={styles.rainGrid} aria-hidden="true">
      {Array.from({ length: 70 }, (_, column) => <div className={styles.rainColumn} key={column}>
        {Array.from({ length: 15 }, (_, row) => <div className={styles.rainNote} key={row} />)}
      </div>)}
    </div>
    <div className={styles.bannerBar} aria-hidden="true">
      <i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" />
    </div>
  </div>;
}

export default function ArtistTemplateBanner() {
  const animatedViewport = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return animatedViewport
    ? <RainyCityBanner />
    : <div className="site-banner-placeholder"><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
