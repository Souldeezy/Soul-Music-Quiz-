"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QUIZ_MENU_LINKS } from "../../data/quizzes/quizConfig";
import styles from "../../styles/quiz/CaliforniaSoulPage.module.css";

export default function QuizMenu() {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeMenuOnScroll = () => setOpen(false);
    window.addEventListener("scroll", closeMenuOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeMenuOnScroll);
  }, []);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeMenuOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, []);

  return (
    <div
      ref={menuRef}
      className={styles.menuHamburgerContainer}
      onMouseEnter={() => {
        if (window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)").matches) setOpen(true);
      }}
      onMouseLeave={() => {
        if (window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)").matches) setOpen(false);
      }}
    >
      <button type="button" className={`${styles.hamburgerTrigger} ${open ? styles.hamburgerTriggerOpen : ""}`} onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <i className="fa-solid fa-bars" aria-hidden="true" />
        <span>Menu Quizzes</span>
      </button>
      <div className={`${styles.hamburgerLinks} ${open ? styles.hamburgerLinksOpen : ""}`}>
        {QUIZ_MENU_LINKS.map(([slug, label]) => <Link key={slug} href={`/quiz/${slug}`} prefetch={false} className={styles.menuReturn}>Quiz {label}</Link>)}
        <Link href="/quiz" prefetch={false} className={styles.menuReturn}>Retour à la page Quiz</Link>
      </div>
    </div>
  );
}
