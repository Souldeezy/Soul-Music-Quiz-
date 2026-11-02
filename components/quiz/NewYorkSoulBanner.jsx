"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { BANNER_FALLBACK_MESSAGE, BANNER_VIEWPORT_QUERY } from "../shared/bannerFallbackMessage";
import { mountNewYorkFoodGame } from "../../scripts/quiz/newYorkSoulFoodGame";
import quizStyles from "../../styles/quiz/QuizPage.module.css";
import "../../styles/quiz/NewYorkSoulBanner.css";

const numbered = (name, first, last) => Array.from({ length: last - first + 1 }, (_, index) => `effet-${name}-${first + index}`);
const FOOD_DECOR_CLASSES = [
  "effet-deck-self", ...numbered("bag-paid", 1, 8), "effet-vitrine-self-1",
  ...numbered("fried-chicken", 1, 4), ...numbered("shrimp", 1, 2), ...numbered("shrimp-stew", 1, 2),
  ...numbered("shrimp-fritters", 1, 2), ...numbered("mac-cheese", 1, 2), "effet-vitrine-self-2",
  ...numbered("drink-soul", 1, 4), ...numbered("drink-funk", 1, 4),
  ...numbered("lemonade", 1, 4), ...numbered("beer", 1, 4), ...numbered("oj", 1, 4), ...numbered("cranberries", 1, 4),
  "effet-vitrine-self-3", ...numbered("milk-shake", 1, 3), ...numbered("banana-pudding", 1, 2),
  ...numbered("pumpkin-pie", 1, 2), ...numbered("sweet-potato-pie", 1, 2), ...numbered("waffle", 1, 2),
  ...numbered("peach-cobbler", 1, 2), "effet-vitrine-self-4",
  ...numbered("package-bag", 1, 6), ...numbered("menu-bag", 1, 6), ...numbered("package-bag", 7, 12),
  "effet-vitrine-self-5", ...numbered("package-bag", 13, 18),
];

function subscribeViewport(callback) {
  const query = window.matchMedia(BANNER_VIEWPORT_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getViewport = () => window.matchMedia(BANNER_VIEWPORT_QUERY).matches;
const getServerViewport = () => false;

function BannerIcons() {
  return <div className="banner-bar" aria-hidden="true">
    <i className="fa-solid fa-rss" /><i className="fa-solid fa-record-vinyl" /><i className="fa-solid fa-music" />
  </div>;
}

function DesktopBanner({ bottom }) {
  const bannerRef = useRef(null);
  useEffect(() => {
    const banner = bannerRef.current;
    if (bottom) return mountNewYorkFoodGame(banner);
    const heading = banner.querySelector("h2");
    const icons = banner.querySelector(".banner-bar");
    const headingObserver = new IntersectionObserver(([entry]) => {
      heading?.classList.toggle("play", entry.isIntersecting);
      icons?.classList.toggle("play", entry.isIntersecting);
    }, { threshold: 0.45 });
    headingObserver.observe(banner);
    const video = banner.querySelector("video");
    const checkLoop = () => { if (video.currentTime >= 8) video.currentTime = 0; };
    video.addEventListener("timeupdate", checkLoop);
    const videoObserver = new IntersectionObserver(([entry]) => {
      banner.classList.toggle("is-visible", entry.isIntersecting);
      if (entry.isIntersecting) {
        video.currentTime = 0;
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold: 0.1 });
    videoObserver.observe(banner);
    return () => { headingObserver.disconnect(); videoObserver.disconnect(); video.removeEventListener("timeupdate", checkLoop); video.pause(); };
  }, [bottom]);

  return bottom ? <div ref={bannerRef} id="food-banner" className="section-banner banner-legal">
    {FOOD_DECOR_CLASSES.map((className) => <div key={className} className={className} aria-hidden="true" />)}
    <div id="food-tooltip" role="status" aria-live="polite" />
    <div id="action-menu">
      <p>Argent restant: <span id="money-left">50$</span></p>
      <button type="button" className="action-button" id="valider-btn">Valider votre panier</button>
      <button type="button" className="action-button">Quitter le restaurant</button>
      <p className="rules-game">2 aliments du même type <strong>MAX</strong> / 8 aliments <strong>MAX</strong></p>
    </div>
    <div id="welcome-screen">
      <p id="welcome-text">Welcome to Connie&apos;s Soul Food Restaurant !</p>
      <a href="#food-banner" id="enter-button">Entrer</a>
      <div className="effet-logo-welcome" aria-hidden="true" />
    </div>
  </div> : <div ref={bannerRef} id="metro-banner" className="section-banner banner-legal">
    <h2>New York Soul</h2>
    <video className="banner-video-bg" autoPlay loop muted playsInline preload="none" aria-hidden="true">
      <source src="/videos/new-york-night.mp4" type="video/mp4" />
    </video>
    <BannerIcons />
  </div>;
}

export default function NewYorkSoulBanner({ bottom = false }) {
  const enabled = useSyncExternalStore(subscribeViewport, getViewport, getServerViewport);
  return enabled ? <DesktopBanner bottom={bottom} /> : <div className={quizStyles.placeholder}><p>{BANNER_FALLBACK_MESSAGE}</p></div>;
}
