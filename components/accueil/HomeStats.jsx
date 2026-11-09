"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  ["Beaucoup de travail de recherche, une vraie encyclopédie Soul !", "Bertrand D."],
  ["Super documenté, top !", "Sarah M."],
  ["Super site avec beaucoup de références !", "Sohé K."],
  ["Bluffé par la richesse des infos !", "Bruno D."],
  ["Bien le site !", "Maurane B."],
  ["Canon, bravo !", "Kokot K."],
  ["Trop cool ! Le rendu est propre", "Jorma L."],
  ["Les quizzes et les articles proposés sont ludiques et intéressants.", "Florian H."],
  ["Le site est stylé ! Goût et élégance, voilà ma synthèse !", "Guillem R."],
  ["C'est cool, c'est carré !", "Adrien L."],
  ["Super beau site et magnifique sur ordi !", "Greg S."],
  ["Bien franchement, propre ! Bravo Deezy !", "Kader M."],
  ["Super site", "Sebastien M."],
  ["Super site avec un thème très sympa !", "Marie D."],
  ["Propre et vachement étoffé !", "Kevin B."],
  ["Beau design, les articles sont top !", "Jet P."],
  ["Fluide et complet, une référence des quizzes Soul", "Jerome M."],
  ["Très ergonomique et plein de perles à découvrir parmi les animations", "Max C."],
];

const reviewsPerPage = 3;
const pages = Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, index) =>
  reviews.slice(index * reviewsPerPage, (index + 1) * reviewsPerPage),
);

const pageLeft = (track, index) => track.children[index].offsetLeft - track.children[0].offsetLeft;

export default function HomeStats() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const currentRef = useRef(0);
  const targetRef = useRef(null);
  const dragRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const observer = new ResizeObserver(() => {
      targetRef.current = null;
      track.scrollTo({ left: pageLeft(track, currentRef.current), behavior: "instant" });
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const activate = (index) => {
    currentRef.current = index;
    setCurrent(index);
  };

  const show = (index) => {
    const next = (index + pages.length) % pages.length;
    const track = trackRef.current;
    activate(next);
    if (!track) return;
    targetRef.current = next;
    track.scrollTo({
      left: pageLeft(track, next),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  const syncScroll = (event) => {
    const track = event.currentTarget;
    if (!track.clientWidth) return;
    if (targetRef.current !== null) {
      if (Math.abs(track.scrollLeft - pageLeft(track, targetRef.current)) <= 1) targetRef.current = null;
      else return;
    }
    activate(Math.max(0, Math.min(pages.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
  };

  const startDrag = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
    targetRef.current = null;
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add("is-dragging");
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.left - distance;
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const track = event.currentTarget;
    dragRef.current = null;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (drag.moved && track.clientWidth) show(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <section ref={sectionRef} className={`home-stats${isInView ? " is-in-view" : ""}`} aria-label="Avis">
      <div className="home-stats-image" aria-hidden="true" />
      <div className="home-stats-overlay" aria-hidden="true" />
      <div className="home-stats-content">
        <div className="home-reviews">
          <button className="home-reviews-arrow prev" type="button" onClick={() => show(currentRef.current - 1)} aria-label="Avis précédents"><span aria-hidden="true">‹</span></button>
          <div
            ref={trackRef}
            className="home-reviews-track"
            onScroll={syncScroll}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(event) => event.preventDefault()}
          >
            {pages.map((page, pageIndex) => (
              <div className="home-reviews-page" key={pageIndex} aria-hidden={pageIndex !== current} inert={pageIndex !== current}>
                {page.map(([quote, source]) => (
                  <figure className="home-review" key={source}>
                    <blockquote>« {quote} »</blockquote>
                    <figcaption>{source}</figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
          <button className="home-reviews-arrow next" type="button" onClick={() => show(currentRef.current + 1)} aria-label="Avis suivants"><span aria-hidden="true">›</span></button>
        </div>
      </div>
    </section>
  );
}
