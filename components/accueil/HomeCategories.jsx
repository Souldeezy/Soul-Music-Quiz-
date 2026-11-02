import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Quizzes",
    image: "/images/quiz/common/hero-menu-quiz.webp",
    alt: "Un casque audio vintage posé sur une table, représentant la catégorie des quiz.",
    href: "/quiz",
    description: <>Testez vos connaissances en Soul Music avec <strong>300 questions</strong> réparties en <strong>6 quiz</strong> et <strong>5 niveaux</strong> de difficulté.</>,
  },
  {
    title: "Artistes",
    image: "/images/artistes/common/hero-artistes.webp",
    alt: "Une platine vinyle jouant un disque, pour la catégorie des artistes de Soul.",
    href: "/artistes",
    description: <>Explorez l’histoire des <strong>légendes</strong> de la Soul telles que <strong>James Brown</strong>, <strong>Aretha Franklin</strong>, et bien d’autres encore…</>,
  },
  {
    title: "News",
    image: "/images/news/hero-concert-soul.webp",
    alt: "Une scène de concert avec des musiciens de Soul, pour la catégorie News.",
    href: "/news",
    description: <>Restez connectés à l’actualité Soul Music avec nos articles sur les <strong>concerts</strong>, <strong>trending</strong>, <strong>samples</strong>, et plus…</>,
  },
];

export default function HomeCategories() {
  return (
    <section className="home-categories" aria-label="Catégories du site">
      <div className="home-categories-grid">
        {categories.map((category) => (
          <Link className="home-category-card" href={category.href} key={category.title}>
            <Image className="home-category-image" src={category.image} alt={category.alt} width={640} height={360} sizes="(max-width: 767px) 88vw, (max-width: 1439px) 29vw, 420px" />
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <span className="home-category-cta">Découvrir</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
