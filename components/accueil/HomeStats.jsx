"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  ["Une des meilleures références de la Soul Music", "Guillem R.", 4, true],
  ["Enfin un site français dédié aux amateurs de Soul", "Florian H.", 4, false],
  ["Un site bien conçu, qui ravira les amateurs comme les Soul Heads", "Mohamed A.", 5, false],
];

function Stars({ full, half }) {
  const rating = half ? full + 0.5 : full;
  return (
    <div className="home-stars" role="img" aria-label={`${rating} étoiles sur 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const className = index < full
          ? "fa-solid fa-star"
          : half && index === full
            ? "fa-solid fa-star-half-stroke"
            : "fa-regular fa-star";
        return <i className={className} aria-hidden="true" key={index} />;
      })}
    </div>
  );
}

export default function HomeStats() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`home-stats${isInView ? " is-in-view" : ""}`} aria-label="Avis">
      <div className="home-stats-image" aria-hidden="true" />
      <div className="home-stats-overlay" aria-hidden="true" />
      <div className="home-stats-content">
        <div className="home-reviews">
          {reviews.map(([quote, source, full, half]) => (
            <figure className="home-review" key={source}>
              <blockquote>« {quote} »</blockquote>
              <figcaption>{source}</figcaption>
              <Stars full={full} half={half} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
