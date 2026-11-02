"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeaderSearch from "./HeaderSearch";

const HEADER_SCROLL_LIMIT = 60;

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const header = document.querySelector(".site-header");

    if (!header) return;

    let lastScrollY = window.scrollY;

    const closeOpenMenu = () => {
      setIsMenuOpen(false);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY !== lastScrollY) {
        setIsMenuOpen(false);
      }

      const shouldHideHeader =
        currentScrollY > lastScrollY &&
        currentScrollY > HEADER_SCROLL_LIMIT;

      const isAtTop = currentScrollY <= 0;

      header.classList.toggle(
        "is-blurred",
        currentScrollY > HEADER_SCROLL_LIMIT,
      );

      header.classList.toggle(
        "is-hidden",
        shouldHideHeader,
      );

      if (isAtTop) {
        header.classList.remove("is-blurred", "is-hidden");
        setIsMenuOpen(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("scroll", closeOpenMenu, true);
    window.addEventListener("wheel", closeOpenMenu, { passive: true });
    window.addEventListener("touchmove", closeOpenMenu, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", closeOpenMenu, true);
      window.removeEventListener("wheel", closeOpenMenu);
      window.removeEventListener("touchmove", closeOpenMenu);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <header ref={headerRef} className="site-header">

      {/* NAVIGATION................................................................................................. */}

      <nav className="main-nav">
        <Link href="/" className="logo-nav" aria-label="Accueil" onClick={() => setIsMenuOpen(false)} />

        <button
          ref={menuButtonRef}
          type="button"
          className="mobile-menu-toggle"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul id="main-menu" className={isMenuOpen ? "is-open" : ""}>
          <li className="header-search-item">
            <HeaderSearch mobile onNavigate={() => setIsMenuOpen(false)} />
          </li>
          <li>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
          </li>

          <li>
            <Link href="/quiz" onClick={() => setIsMenuOpen(false)}>Quiz</Link>
          </li>

          <li>
            <Link href="/artistes" onClick={() => setIsMenuOpen(false)}>
              Artistes
            </Link>
          </li>

          <li>
            <Link href="/news" onClick={() => setIsMenuOpen(false)}>News</Link>
          </li>

          <li>
            <Link href="/#about-anchor" onClick={() => setIsMenuOpen(false)}>
              À Propos
            </Link>
          </li>
        </ul>

        <HeaderSearch />
      </nav>
    </header>
  );
}
