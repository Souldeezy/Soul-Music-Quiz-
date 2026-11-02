"use client";

import { useEffect, useRef } from "react";
import { heroArtists } from "./artistsData";
import styles from "../../styles/artistes/ArtistesPage.module.css";

export default function ArtistsHero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const title = titleRef.current;
    const list = listRef.current;
    if (!hero || !title || !list) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        document.fonts.ready.then(() => {
          title.classList.add(styles["is-visible"]);
          observer.disconnect();
        });
      }
    }, { threshold: 0.5 });
    observer.observe(hero);

    const items = Array.from(list.children);
    const heroBounds = hero.getBoundingClientRect();
    const titleBounds = title.getBoundingClientRect();
    const visibleItems = items.filter((item) => {
      const bounds = item.getBoundingClientRect();
      const overlapsTitle = bounds.left < titleBounds.right && bounds.right > titleBounds.left && bounds.top < titleBounds.bottom && bounds.bottom > titleBounds.top;
      return !overlapsTitle && bounds.bottom > Math.max(0, heroBounds.top) && bounds.top < Math.min(window.innerHeight, heroBounds.bottom) && bounds.right > heroBounds.left && bounds.left < heroBounds.right;
    });
    const candidates = visibleItems.length ? visibleItems : items;
    const featuredArtist = candidates[Math.floor(Math.random() * candidates.length)];
    featuredArtist?.classList.add(styles["featured-artist"]);
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.forEach((item, index) => {
      item.style.animationDelay = `${3 + index * (6 / items.length)}s`;
    });
    document.fonts.ready.then(() => {
      hero.classList.add(styles["is-ready"]);
    });
    return () => {
      observer.disconnect();
      featuredArtist?.classList.remove(styles["featured-artist"]);
      hero.classList.remove(styles["is-ready"]);
    };
  }, []);

  return <section ref={heroRef} className={styles["hero-menu-quiz"]}>
    <ul ref={listRef} className={styles["soul-artists"]} aria-hidden="true">
      {heroArtists.map((name, index) => <li key={`${name}-${index}`} className={styles[`artist-title-${index % 2 + 1}`]}>{name}</li>)}
    </ul>
    <div className={styles["logo-wrapper"]}><div className={styles["logo-spin"]} /></div>
    <h1 ref={titleRef}>Artistes<span className="sr-only"> : Menu de sélection des Artistes</span></h1>
    <p className={styles["texte-hero"]}>Consultez nos articles dédiés aux légendes de la Soul Music</p>
    <div className={styles["hero-scroll-down"]}>
      <i className="fa-solid fa-chevron-down" aria-hidden="true" />
      <p>Faire défiler pour voir les Artistes</p>
      <i className="fa-solid fa-chevron-down" aria-hidden="true" />
    </div>
  </section>;
}
