"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import quizStyles from "../../styles/quiz/QuizPage.module.css";
import styles from "../../styles/quiz/ChicagoSoulBanner.module.css";

function subscribe(callback) {
  const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getSnapshot = () => window.matchMedia(BANNER_VIEWPORT_QUERY).matches;
const getServerSnapshot = () => false;

function DesktopBanner({ bottom }) {
  const bannerRef = useRef(null);
  const pizzaRef = useRef(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const observers = [];
    const titles = new IntersectionObserver(([entry]) => {
      banner.classList.toggle(styles.play, entry.isIntersecting);
    }, { threshold: 0.45 });
    titles.observe(banner);
    observers.push(titles);

    if (!bottom) {
      // Vanilla basketball starts once at 10% visibility and keeps bouncing.
      const ball = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        banner.classList.add(styles["is-active"]);
        ball.disconnect();
      }, { threshold: 0.1 });
      ball.observe(banner);
      observers.push(ball);
    } else {
      const container = pizzaRef.current;
      const slices = Array.from(container.querySelectorAll(`.${styles["pizza-slice"]}`));
      const pizza = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          let delay = 0;
          // Preserve vanilla's randomized order, duration and cumulative delay.
          [...slices].sort(() => Math.random() - 0.5).forEach((slice) => {
            slice.style.setProperty("--slice-duration", `${0.2 + Math.random() * 0.3}s`);
            slice.style.setProperty("--slice-delay", `${delay}s`);
            delay += 0.3 + Math.random() * 0.1;
          });
        }
        container.classList.toggle(styles["is-active"], entry.isIntersecting);
      }, { threshold: 0.5 });
      pizza.observe(container);
      observers.push(pizza);
    }
    return () => observers.forEach((observer) => observer.disconnect());
  }, [bottom]);

  return <div ref={bannerRef} className={styles["banner-legal"]}>
    <h2>{bottom ? "SoulMusicQuiz" : "Chicago Soul"}</h2>
    {bottom ? <div ref={pizzaRef} className={styles["pizza-container"]}>
      <div className={styles["cont-sold-out"]}>
        <p>SoulMusicQuiz</p>
        <div className={styles["sold-out-message"]}>Open 24/7</div>
      </div>
      {Array.from({ length: 8 }, (_, index) => <div
        key={index}
        aria-hidden="true"
        className={`${styles["pizza-slice"]} ${styles[`pizza-slice-${index + 1}`]} ${index % 2 ? styles.fleeDown : styles.fleeUp}`}
      />)}
    </div> : <div className={styles["effet-basket-ball-1"]} aria-hidden="true" />}
    <div className={styles["banner-bar"]} aria-hidden="true">
      <i className="fa-solid fa-rss" />
      <i className="fa-solid fa-record-vinyl" />
      <i className="fa-solid fa-music" />
    </div>
  </div>;
}

export default function ChicagoSoulBanner({ bottom = false }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled
    ? <DesktopBanner bottom={bottom} />
    : <div className={quizStyles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
