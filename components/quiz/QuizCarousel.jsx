"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import styles from "../../styles/quiz/QuizPage.module.css";

const quizzes = [
  ["California Soul", "Plongez dans le son décontracté et ensoleillé de la West Coast.", "/images/quiz/california-soul/hero-california-soul.webp", "Scène de rue californienne", "/quiz/california-soul"],
  ["Chicago Soul", "Découvrez le son orchestral et sophistiqué de la Windy City.", "/images/quiz/chicago/hero-chicago.webp", "Théâtre de Chicago la nuit", "/quiz/chicago-soul"],
  ["Detroit Soul", "Redécouvrez la magie de la Motown à Hitsville U.S.A.", "/images/quiz/detroit/hero-detroit.webp", "Le panneau Hitsville U.S.A.", "/quiz/detroit-soul"],
  ["Memphis Soul", "Le son brut et puissant de Stax Records et de l’âme du Sud.", "/images/quiz/memphis/hero-memphis.webp", "Rue Beale à Memphis", "/quiz/memphis-soul"],
  ["New Orleans Soul", "Le rythme festif et syncopé du Big Easy.", "/images/quiz/new-orleans/hero-new-orleans.webp", "Soul Food de la Nouvelle-Orléans", "/quiz/new-orleans-soul"],
  ["New York Soul", "Entre élégance, groove urbain et avant-garde.", "/images/quiz/new-york/hero-new-york.webp", "La Statue de la Liberté", "/quiz/new-york-soul"],
];

export default function QuizCarousel() {
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [current, setCurrent] = useState(0);
  const [leavingQuiz, setLeavingQuiz] = useState(false);
  const router = useRouter();
  const goTo = (index) => {
    const next = (index + quizzes.length) % quizzes.length;
    setCurrent(next);
    trackRef.current?.scrollTo({ left: trackRef.current.clientWidth * next, behavior: "auto" });
  };
  const syncSwipe = (event) => {
    const track = event.currentTarget;
    if (track.clientWidth) setCurrent(Math.max(0, Math.min(quizzes.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
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
    const next = track.clientWidth ? Math.max(0, Math.min(quizzes.length - 1, Math.round(track.scrollLeft / track.clientWidth))) : current;
    track.classList.remove(styles["is-dragging"]);
    if (drag.pointerId !== null && track.hasPointerCapture?.(drag.pointerId)) track.releasePointerCapture(drag.pointerId);
    if (drag.moved) goTo(next);
  };

  const openQuiz = (event, href) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.dispatchEvent(new Event("smq:navigation-start"));
    setLeavingQuiz(true);
    window.setTimeout(() => router.push(href), 380);
  };

  return <section className={styles["quiz-carousel-section"]}><div className={styles["carousel-container"]} aria-label="Sélection de Quiz"><div className={styles["carousel-track-wrapper"]}><div ref={trackRef} onScroll={syncSwipe} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onMouseDown={startDrag} onMouseMove={moveDrag} onMouseUp={stopDrag} onMouseLeave={stopDrag} onClickCapture={(event) => { if (suppressClickRef.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); suppressClickRef.current = false; } }} onDragStart={(event) => event.preventDefault()} className={styles["carousel-track"]}>{quizzes.map(([title, text, src, alt, href]) => <a href={href} className={styles["carousel-slide"]} key={title} onClick={(event) => openQuiz(event, href)}><Image src={src} alt={alt} fill sizes="800px" /><div className={styles["slide-content"]}><div className={styles["text-wrapper"]}><h2 className={title === "New Orleans Soul" ? styles["single-line-title"] : undefined}>{title}</h2><p>{text}</p></div></div></a>)}</div></div><button className={`${styles["about-arrow"]} ${styles.prev}`} onClick={() => goTo(current - 1)} aria-label="Quiz précédent">‹<span className={styles["arrow-label"]}>Précédent</span></button><button className={`${styles["about-arrow"]} ${styles.next}`} onClick={() => goTo(current + 1)} aria-label="Quiz suivant">›<span className={styles["arrow-label"]}>Suivant</span></button><div className={styles["about-dots"]}>{quizzes.map(([title], index) => <button key={title} className={`${styles.dot} ${index === current ? styles.active : ""}`} onClick={() => goTo(index)} aria-label={`Afficher ${title}`} aria-current={index === current ? "true" : undefined}><span aria-hidden="true" /></button>)}</div></div>{leavingQuiz && typeof document !== "undefined" && createPortal(<div className={styles["quiz-page-exit"]} role="status" aria-label="Ouverture du quiz" />, document.body)}</section>;
}
