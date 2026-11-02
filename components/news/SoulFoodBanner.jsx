"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/news/SoulFoodArticle.module.css";

function subscribe(callback) {
  const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(BANNER_VIEWPORT_QUERY).matches;
const getServerSnapshot = () => false;

function NewspaperBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const papers = [...banner.querySelectorAll(`.${styles.paper}`)];
    const ghosts = [...banner.querySelectorAll(`.${styles.ghostPaper}`)];
    const heading = banner.querySelector("h2");
    const icons = banner.querySelector(`.${styles.bannerBar}`);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = new Set();
    let frame = 0;
    let started = false;

    const later = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
    };

    const runCycle = () => {
      ghosts.forEach((paper) => {
        paper.style.display = "block";
        paper.style.transition = "none";
        paper.style.top = "65%";
      });
      frame = requestAnimationFrame(() => {
        ghosts[0]?.getBoundingClientRect();
        papers.forEach((paper) => {
          paper.style.transition = "top 1500ms linear";
          paper.style.top = "-185%";
        });
        ghosts.forEach((paper) => {
          paper.style.transition = "top 1500ms linear";
          paper.style.top = "-60%";
        });
      });
      later(() => {
        papers.forEach((paper) => {
          paper.style.transition = "none";
          paper.style.top = "65%";
        });
        later(() => {
          papers.forEach((paper) => { paper.style.top = "-60%"; });
          ghosts.forEach((paper) => { paper.style.display = "none"; });
        }, 50);
        later(runCycle, 5000);
      }, 1550);
    };

    const observer = new IntersectionObserver(([entry]) => {
      heading.classList.toggle(styles.play, entry.isIntersecting);
      icons.classList.toggle(styles.play, entry.isIntersecting);
      if (entry.isIntersecting && !started && !reducedMotion) {
        started = true;
        later(runCycle, 2000);
      }
    }, { threshold: 0.2 });
    observer.observe(banner);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
    };
  }, []);

  return <div ref={bannerRef} className={styles.banner}>
    <h2>SoulMusicQuiz</h2>
    <div className={styles.papers} aria-hidden="true">
      {Array.from({ length: 15 }, (_, index) => <div key={`paper-${index}`} className={`${styles.paper} ${styles[`paper${index + 1}`]}`} />)}
      {Array.from({ length: 15 }, (_, index) => <div key={`ghost-${index}`} className={`${styles.ghostPaper} ${styles[`paper${index + 1}`]}`} />)}
    </div>
    <div className={styles.bannerBar} aria-hidden="true">
      <i className="fa-solid fa-rss" />
      <i className="fa-solid fa-record-vinyl" />
      <i className="fa-solid fa-music" />
    </div>
  </div>;
}

export default function SoulFoodBanner() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled
    ? <NewspaperBanner />
    : <div className="site-banner-placeholder"><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
