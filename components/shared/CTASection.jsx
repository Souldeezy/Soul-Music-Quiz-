"use client";

import { useEffect, useRef } from "react";

const CTA_LINKS = [
  {
    href: "/quiz",
    label: "Explorer les Quizzes",
  },
  {
    href: "/artistes",
    label: "Découvrir les Artistes",
  },
  {
    href: "/news",
    label: "Lire les News Soul",
  },
];

export default function CTASection({ className = "" }) {
  const descriptionRef = useRef(null);

  useEffect(() => {
    const description = descriptionRef.current;

    if (!description) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      description.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        description.classList.toggle("is-visible", entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(description);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`next-step-section ${className}`.trim()}>

      {/* NAVIGATION................................................................................................. */}

      <div className="cta-container">
        <h2>Poursuivez votre exploration</h2>

        <ul>
          {CTA_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="cta-nav"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* DESCRIPTION................................................................................................ */}

      <div ref={descriptionRef} className="cta-para-right">
        SoulMusicQuiz est un site dédié à la culture Soul US des
        années <em>60’s 70’s</em> et <em>80’s</em>. Explorez une
        section <strong>Quiz</strong> avec des thèmes variés, cinq
        niveaux de difficulté et dix questions par quiz, soit déjà
        plus de 300 questions disponibles.

        <div className="ligne-separation-para"></div>

        Découvrez également une section <strong>Artistes</strong>,
        regroupant biographies, liens et ressources autour de figures
        majeures comme d’artistes plus confidentiels, avec plus de
        200 profils référencés. Enfin, la section{" "}
        <strong>News</strong> propose des articles autour de
        l’actualité Soul : albums, concerts, samples, food et
        lifestyle.
      </div>
    </section>
  );
}
