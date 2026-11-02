"use client";

import { useEffect, useRef, useState } from "react";

const slides = [
  <>Mon histoire avec <strong>Soul Music Quiz</strong> commence par le hip-hop. J’écoutais <em>DJ Premier</em>, <em>J&nbsp;Dilla</em>, <em>Kev Brown</em>, <em>The Alchemist,</em> <em>Madlib</em>, <em>Pete Rock</em> et bien d’autres. Leurs productions m’ont donné envie de comprendre ce qui se cache derrière un beat : le choix d’un sample, le groove, les arrangements. J’ai eu envie de produire à mon tour, d’abord pour le plaisir et pour apprendre.</>,
  <>Au milieu des années 2000, je fais mes premiers beats avec les moyens du bord : un vieil ordinateur, <a href="https://www.image-line.com/" target="_blank" rel="noopener noreferrer">FL Studio</a>, Cool Edit Pro… et Paint pour créer les pochettes. Je passais des heures à écouter et à chercher de nouveaux sons sur Internet, tout en apprenant à l’oreille. Le travail de <strong>9th Wonder</strong>, notamment avec Little Brother, m’a marqué et a nourri ma façon de produire et d’écouter.</>,
  <>À force de fouiller les disques, je découvre la Soul des années 60, 70 et 80. <strong>Marvin Gaye</strong>, <strong>Aretha Franklin</strong> et <strong>Curtis Mayfield</strong> deviennent des repères, puis je tombe sur des artistes moins connus comme <strong>Black Ivory</strong>, <strong>Minnie Riperton</strong>, <strong>The Sylvers</strong> et <strong>The Eight Minutes</strong>.<br /><br />Le French funk me fait le même effet : <strong>Cortex</strong>, <strong>Édition Spéciale</strong>, <strong>Alain Goraguer</strong>… Autant de découvertes qui m’ont montré à quel point ces musiques se répondent d’une époque et d’un pays à l’autre.</>,
  <>J’ai lancé <strong>Soul Music Quiz</strong> en 2026 pour réunir ce que j’aime partager : des artistes à découvrir, des histoires à lire et des quiz pour tester sa mémoire musicale.<br /><br />J’espère que le site donnera envie de creuser un peu plus, que vous connaissiez déjà la Soul ou que vous la découvriez. Merci d’être là. Bonne exploration, et surtout bonne écoute !</>,
];

export default function HomeAbout() {
  const trackRef = useRef(null);
  const currentRef = useRef(0);
  const targetRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [current, setCurrent] = useState(0);

  const activate = (index) => {
    currentRef.current = index;
    setCurrent(index);
  };

  const show = (index) => {
    const next = (index + slides.length) % slides.length;
    const track = trackRef.current;
    activate(next);
    if (!track) return;
    targetRef.current = next;
    track.scrollTo({
      left: next * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  const syncScroll = (event) => {
    const track = event.currentTarget;
    if (!track.clientWidth) return;
    // Arrow/dot navigation keeps its destination highlighted throughout the scroll.
    if (targetRef.current !== null) {
      if (Math.abs(track.scrollLeft - targetRef.current * track.clientWidth) <= 1) targetRef.current = null;
      else return;
    }
    activate(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
  };

  const startDrag = (event) => {
    if (dragRef.current) return;
    targetRef.current = null;
    suppressClickRef.current = false;
    // Touch scrolling stays native, including vertical page scrolling and zoom.
    if ((event.pointerId !== undefined && event.pointerType !== "mouse") || event.button !== 0) return;
    dragRef.current = { id: event.pointerId ?? null, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== (event.pointerId ?? null)) return;
    const track = event.currentTarget;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      suppressClickRef.current = true;
      if (drag.id !== null) track.setPointerCapture(event.pointerId);
      track.classList.add("is-dragging");
    }
    event.preventDefault();
    track.scrollLeft = drag.left - distance;
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== (event.pointerId ?? null)) return;
    const track = event.currentTarget;
    dragRef.current = null;
    const next = track.clientWidth ? Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth))) : currentRef.current;
    track.classList.remove("is-dragging");
    if (drag.id !== null && track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (drag.moved) show(next);
  };

  useEffect(() => {
    const track = trackRef.current;
    const observer = new ResizeObserver(() => {
      targetRef.current = null;
      track.scrollTo({ left: currentRef.current * track.clientWidth, behavior: "instant" });
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-about" id="about-anchor" aria-labelledby="about-title">
      <h2 id="about-title" className="sr-only">À propos de Soul Music Quiz</h2>
      <div className="home-about-carousel" aria-live="polite">
        <div
          ref={trackRef}
          className="home-about-slides"
          onScroll={syncScroll}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onMouseDown={startDrag}
          onMouseMove={moveDrag}
          onMouseUp={endDrag}
          onMouseLeave={() => {
            if (dragRef.current?.id === null) {
              dragRef.current = null;
              trackRef.current?.classList.remove("is-dragging");
            }
          }}
          onPointerLeave={() => { if (!dragRef.current?.moved) dragRef.current = null; }}
          onDragStart={(event) => event.preventDefault()}
          onWheel={() => { targetRef.current = null; }}
          onClickCapture={(event) => {
            if (suppressClickRef.current && event.detail !== 0) {
              event.preventDefault();
              event.stopPropagation();
              suppressClickRef.current = false;
            }
          }}
        >
          {slides.map((slide, index) => (
            <div className="home-about-slide" key={index} aria-hidden={index !== current} inert={index !== current}>
              <p>{slide}</p>
            </div>
          ))}
        </div>
        <button className="home-about-arrow prev" type="button" onClick={() => show(current - 1)} aria-label="Afficher le texte précédent">‹<span>Précédent</span></button>
        <button className="home-about-arrow next" type="button" onClick={() => show(current + 1)} aria-label="Afficher le texte suivant">›<span>Suivant</span></button>
        <div className="home-about-dots" aria-label="Choisir un texte">
          {slides.map((_, index) => (
            <button className={index === current ? "is-active" : ""} type="button" onClick={() => show(index)} aria-label={`Texte ${index + 1} sur ${slides.length}`} aria-current={index === current ? "true" : undefined} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
