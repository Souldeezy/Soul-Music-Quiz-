"use client";

import { useEffect, useRef, useState } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import styles from "../../styles/news/NewsPage.module.css";

const BILL_CLASSES = [
  "money-bill-effect-1", "money-bill-effect-2", "money-bill-effect-3", "money-bill-effect-4", "money-bill-effect-5",
  "money-bill-effect-1b", "money-bill-effect-2b", "money-bill-effect-3b", "money-bill-effect-4b", "money-bill-effect-5b", "money-bill-effect-6b",
  "money-bill-effect-1c", "money-bill-effect-4c", "money-bill-effect-5c", "money-bill-effect-6c",
];

function BannerHeading({ title }) {
  return <><h2>{title}</h2><div className={styles["banner-bar"]}>
    <i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" />
  </div></>;
}

function useBanner(ref, variant) {
  useEffect(() => {
    const banner = ref.current;
    if (!banner) return;
    const observer = new IntersectionObserver(([entry]) => {
      banner.querySelector("h2")?.classList.toggle(styles.play, entry.isIntersecting);
      banner.querySelector(`.${styles["banner-bar"]}`)?.classList.toggle(styles.play, entry.isIntersecting);
      banner.classList.toggle(styles[variant === "money" ? "play-dollaz" : "is-active"], entry.isIntersecting);
      if (variant === "bar") {
        banner.querySelector(`.${styles["bar-desk-ad-effect"]}`)?.classList.toggle(styles["is-moving"], entry.isIntersecting);
      }
      if (variant === "money" && entry.isIntersecting) {
        [...banner.querySelectorAll('[class*="dollaz-container-"] > div')].forEach((bill, index) => {
          bill.style.setProperty("--fall-delay", `${index * 0.065}s`);
          bill.style.setProperty("--fall-duration", "0.4s");
        });
      }
    }, { threshold: 0.45 });
    observer.observe(banner);
    return () => observer.disconnect();
  }, [ref, variant]);
}

function MoneyBanner() {
  const ref = useRef(null);
  useBanner(ref, "money");
  return <div ref={ref} className={`${styles["section-banner"]} ${styles["banner-categories"]}`}>
    <BannerHeading title="Menu News" />
    {Array.from({ length: 6 }, (_, container) => <div key={container} className={`${styles["dollaz-container"]} ${styles[`dollaz-container-${container + 1}`]}`}>
      {BILL_CLASSES.map((name) => <div key={name} className={styles[name]} />)}
    </div>)}
  </div>;
}

function BarBanner() {
  const ref = useRef(null);
  useBanner(ref, "bar");
  const repeated = (prefix, count) => Array.from({ length: count }, (_, i) => <div key={`${prefix}-${i}`} className={styles[`${prefix}-${i + 1}`]} />);
  return <div ref={ref} className={`${styles["section-banner"]} ${styles["banner-legal"]}`}>
    <div className={styles["drink-cocktail-effect"]} /><div className={styles["hennessy-effect"]} /><div className={styles["beer-effect"]} />
    {repeated("customer-beer-effect", 9)}{repeated("money-desk-bar-effect", 9)}
    <div className={styles["dancing-woman-effect"]} /><div className={styles["customer-bar-effect-1"]} /><div className={styles["customer-bar-effect-2"]} />
    <div className={styles["cigar-customer-bar-effect"]} /><div className={styles["smoke-cigar-customer-bar-effect"]} />
    <div className={styles["ashtray-bar-effect"]} /><div className={styles["waiter-bar-effect-2"]} /><div className={styles["bar-desk-effect"]} />
    <div className={styles["bar-desk-ad-effect"]}>soulmusicquiz</div><div className={styles["bar-board-effect"]}>BAR</div>
    {repeated("bar-chair-effect", 8)}{repeated("bar-bottles-effect", 14)}
    <BannerHeading title="SoulMusicQuiz" />
  </div>;
}

export default function NewsBanner({ variant }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  if (!enabled) return <div className={`site-banner-placeholder ${styles["news-banner-placeholder"]}`}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
  return variant === "money" ? <MoneyBanner /> : <BarBanner />;
}
