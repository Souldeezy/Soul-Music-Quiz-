"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { artistSlides } from "./artistsData";
import { artistSlug } from "./artistSlug";
import styles from "../../styles/artistes/ArtistesPage.module.css";

const LETTERS = "#abcdefghijklmnopqrstuvwxyz".split("");
const artistInitial = (name) => (/^\d/.test(name.trim()) ? "#" : name.trim().charAt(0).toLowerCase());
const letterTarget = (letter) => {
  const normalized = letter.toLowerCase();
  return artistSlides.find((artist) => artist.id && (normalized === "#" ? artistInitial(artist.name) === "#" : artistInitial(artist.name) >= normalized))?.id;
};

export default function ArtistsCarousel() {
  const trackRef = useRef(null);
  const transitionRef = useRef(false);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const timersRef = useRef([]);
  const router = useRouter();
  const pathname = usePathname();
  const [revealedIndex, setRevealedIndex] = useState(null);
  const [leavingArtist, setLeavingArtist] = useState(null);
  const togglePortrait = (index) => setRevealedIndex((current) => current === index ? null : index);
  const handlePortraitClick = (event, index, href) => {
    if (index === 0 && window.matchMedia("(max-width: 1439.98px)").matches) {
      openArtist(event, index, href, true);
      return;
    }
    togglePortrait(index);
  };

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
  }, []);

  useLayoutEffect(() => {
    if (pathname !== "/artistes") return;
    const requestedArtist = new URLSearchParams(window.location.search).get("returnArtist");
    if (!requestedArtist) return;

    const index = artistSlides.findIndex((artist) => artistSlug(artist.name) === requestedArtist);
    const track = trackRef.current;
    if (index < 0 || !track) return;

    let restoreFrame;
    let attempts = 0;
    const restoreArtist = () => {
      if (!track.clientWidth && attempts++ < 4) {
        restoreFrame = window.requestAnimationFrame(restoreArtist);
        return;
      }
      if (!track.clientWidth) return;
      setRevealedIndex(index);
      track.scrollTo({ left: index * track.clientWidth, behavior: "instant" });
      document.getElementById("artists-index")?.scrollIntoView({ block: "start", behavior: "instant" });
      window.history.replaceState(window.history.state, "", "/artistes#artists-index");
    };
    restoreFrame = window.requestAnimationFrame(restoreArtist);
    return () => window.cancelAnimationFrame(restoreFrame);
  }, [pathname]);

  const goToSlide = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const boundedIndex = Math.max(0, Math.min(index, artistSlides.length - 1));
    const destination = boundedIndex * track.clientWidth;
    if (transitionRef.current) return;
    const fadeDuration = 300;
    transitionRef.current = true;
    track.classList.add(styles["is-fading"]);
    timersRef.current.push(setTimeout(() => {
      track.scrollTo({ left: destination, behavior: "instant" });
      timersRef.current.push(setTimeout(() => track.classList.remove(styles["is-fading"]), 40));
      timersRef.current.push(setTimeout(() => { transitionRef.current = false; }, fadeDuration + 100));
    }, fadeDuration));
  };

  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const currentIndex = Math.round(track.scrollLeft / track.clientWidth);
    const nextIndex = (currentIndex + direction + artistSlides.length) % artistSlides.length;
    goToSlide(nextIndex);
  };

  const startDrag = (event) => {
    suppressClickRef.current = false;
    if ((event.pointerType && event.pointerType !== "mouse") || (event.button !== undefined && event.button !== 0) || dragRef.current) return;
    dragRef.current = { pointerId: event.pointerId ?? null, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false };
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)) return;
    const track = event.currentTarget;
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      suppressClickRef.current = true;
      if (drag.pointerId !== null && track.setPointerCapture) track.setPointerCapture(drag.pointerId);
      track.classList.add(styles["is-dragging"]);
    }
    event.preventDefault();
    track.scrollLeft = drag.startScroll - distance;
  };

  const stopDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)) return;
    const track = event.currentTarget;
    dragRef.current = null;
    const nextIndex = track.clientWidth ? Math.max(0, Math.min(artistSlides.length - 1, Math.round(track.scrollLeft / track.clientWidth))) : 0;
    track.classList.remove(styles["is-dragging"]);
    if (drag.pointerId !== null && track.hasPointerCapture?.(drag.pointerId)) track.releasePointerCapture(drag.pointerId);
    if (drag.moved && track.clientWidth) {
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "smooth" });
    }
  };

  const suppressDraggedClick = (event) => {
    if (suppressClickRef.current && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const goToLetter = (event, id) => {
    event.preventDefault();
    const index = artistSlides.findIndex((artist) => artist.id === id);
    if (index >= 0) goToSlide(index);
  };

  const openArtist = (event, index, href, fromMedallion = false) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try {
      const returnUrl = `/artistes?returnArtist=${artistSlug(artistSlides[index].name)}`;
      window.history.replaceState(window.history.state, "", returnUrl);
    } catch {
      // Navigation still works if the current history entry cannot be normalized.
    }
    setRevealedIndex(index);
    if (fromMedallion) {
      setLeavingArtist(artistSlides[index].name);
    }
    timersRef.current.push(setTimeout(() => router.push(href), fromMedallion ? 380 : 230));
  };

  return <section id="artists-index" className={styles["quiz-carousel-section"]} aria-label="Index des artistes Soul">
    <nav className={styles["section-index"]} aria-label="Parcourir les artistes par lettre">
      <ul id={styles["index-artistes-1"]}>
        {LETTERS.map((letter) => {
          const id = letterTarget(letter);
          return <li key={letter}><a href={id ? `#${id}` : "#"} aria-disabled={!id} onClick={(event) => goToLetter(event, id)}>{letter}</a></li>;
        })}
      </ul>
    </nav>
    <div className={styles["carousel-container"]} aria-label="Sélection d’artistes">
      <button type="button" className={`${styles["about-arrow"]} ${styles.prev}`} onClick={() => move(-1)} aria-label="Artiste précédent">‹<span className={styles["arrow-label"]}>Précédent</span></button>
      <div className={styles["carousel-track-wrapper"]}>
        <div ref={trackRef} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onMouseDown={startDrag} onMouseMove={moveDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag} onClickCapture={suppressDraggedClick} onDragStart={(event) => event.preventDefault()} className={styles["carousel-track"]}>
          {artistSlides.map((artist, index) => {
            const href = `/artistes/${artistSlug(artist.name)}`;
            const image = "/images/shared/logo-smq.webp";
            return <div key={`${artist.name}-${index}`} id={artist.id || undefined} className={`${styles["carousel-slide"]} ${index === 0 ? styles["portrait-slide"] : ""}`}>
              <button type="button" className={`${styles["portrait-medallion"]} ${revealedIndex === index ? styles.revealed : ""}`} aria-label={`Voir la fiche de ${artist.name}`} onClick={(event) => openArtist(event, index, href, true)}><img src={image} alt="" loading={index === 0 ? "eager" : "lazy"} /></button>
              <Link href={href} className={`${styles["portrait-medallion-desktop"]} ${revealedIndex === index ? styles.revealed : ""}`} aria-label={`Voir la fiche de ${artist.name}`} onClick={(event) => openArtist(event, index, href, true)}><img src={image} alt="" loading={index === 0 ? "eager" : "lazy"} /></Link>
              <div className={styles["slide-content"]}><div className={styles["text-wrapper"]}><h2>{index === 0 ? <><button type="button" className={styles["portrait-name"]} aria-pressed={revealedIndex === index} onClick={(event) => handlePortraitClick(event, index, href)}>{artist.name}</button><span className={styles["portrait-name-mobile"]}>{artist.name}</span></> : <span className={styles["portrait-name-mobile"]}>{artist.name}</span>}<Link href={href} className={styles["portrait-name-desktop"]} onClick={(event) => openArtist(event, index, href)}>{artist.name}</Link></h2></div></div>
            </div>;
          })}
        </div>
      </div>
      <button type="button" className={`${styles["about-arrow"]} ${styles.next}`} onClick={() => move(1)} aria-label="Artiste suivant">›<span className={styles["arrow-label"]}>Suivant</span></button>
    </div>
    {leavingArtist && typeof document !== "undefined" && createPortal(<div className={styles["artist-page-exit"]} role="status" aria-label={`Ouverture de la fiche de ${leavingArtist}`} />, document.body)}
  </section>;
}
