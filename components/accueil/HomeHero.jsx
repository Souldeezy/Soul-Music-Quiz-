import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-title-block">
        <div className="home-hero-logo" aria-hidden="true" />
        <h1 id="home-title" className="home-hero-title">
          <span className="home-letter home-letter-s">S</span><span className="home-rest home-rest-oul">oul</span>{" "}
          <span className="home-letter home-letter-m">M</span><span className="home-rest home-rest-usic">usic</span>{" "}
          <span className="home-letter home-letter-q">Q</span><span className="home-rest home-rest-uiz">uiz</span>
        </h1>
        <p className="home-hero-details">La Golden Era de la Soul Music</p>
        <Link className="home-hero-cta" href="/quiz">Faire un quiz</Link>
      </div>
    </section>
  );
}
