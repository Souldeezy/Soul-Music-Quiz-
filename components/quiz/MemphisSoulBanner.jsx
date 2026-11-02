"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/quiz/MemphisSoulBanner.module.css";
import quizStyles from "../../styles/quiz/QuizPage.module.css";

const classNames = (...names) => names.map((name) => styles[name]).filter(Boolean).join(" ");

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

    const headingObserver = new IntersectionObserver(([entry]) => {
      heading.classList.toggle(styles.play, entry.isIntersecting);
      icons.classList.toggle(styles.play, entry.isIntersecting);
    }, { threshold: 0.45 });
    const sceneObserver = new IntersectionObserver(([entry]) => {
      banner.classList.toggle(styles["is-visible"], entry.isIntersecting);
    }, { threshold: 0.4 });

    headingObserver.observe(banner);
    sceneObserver.observe(banner);
    return () => {
      headingObserver.disconnect();
      sceneObserver.disconnect();
    };
  }, []);

  return <div ref={bannerRef} className={classNames("section-banner", "banner-legal")}>
    <h2>{bottom ? "SoulMusicQuiz" : "Memphis Soul"}</h2>
    {bottom ? <>
      <div className={styles["effet-beale-street"]} aria-hidden="true" />
      <div className={styles["beale-street-sign"]} aria-hidden="true">
        {[
          ["letter-b", "B"], ["letter-e3", "E"], ["letter-a", "A"], ["letter-l", "L"], ["letter-e4", "E"],
          ["letter-s", "S"], ["letter-t1", "T"], ["letter-r", "R"], ["letter-e1", "E"], ["letter-e2", "E"], ["letter-t2", "T"],
        ].map(([className, letter]) => <span key={className} className={classNames("letter", className)}>{letter}</span>)}
      </div>
    </> : <>
      <div className={styles["effet-mississipi-studio"]} aria-hidden="true" />
      {Array.from({ length: 5 }, (_, index) => <div key={index} className={classNames("effet-duck", `effet-duck-${index + 1}`)} aria-hidden="true" />)}
    </>}
    <div className={classNames("banner-bar", ...(bottom ? ["banner-beale-none"] : []))} aria-hidden="true">
      <i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" />
    </div>
  </div>;
}

export default function MemphisSoulBanner({ bottom = false }) {
  const enabled = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
  return enabled ? <DesktopBanner bottom={bottom} /> : <div className={quizStyles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
