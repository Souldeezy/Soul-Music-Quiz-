import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import NewsArticleTemplate from "../../../components/news/NewsArticleTemplate";
import { articleProfiles } from "../../../data/news/articleProfiles";

const testArticleSlug = "soul-food-chicken-waffles-test";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = articleProfiles[slug];
  if (article) return { title: article.metaTitle, description: article.description };
  if (slug === testArticleSlug) return {
    title: "Soul Food : poulet et gaufres (test)",
    description: "Page de test non publiée.",
    robots: { index: false, follow: false },
  };
  return { title: "Article introuvable" };
}

export default async function NewsArticlePage({ params }) {
  const { slug } = await params;
  const article = articleProfiles[slug];

  if (article) {
    return <div className="artist-detail-enter">
      <SiteHeader />
      <NewsArticleTemplate article={article} />
      <SiteFooter />
    </div>;
  }

  if (slug !== testArticleSlug) notFound();

  return <div className="artist-detail-enter">
    <SiteHeader />
    <main style={{ minHeight: "65vh", padding: "clamp(100px, 12vw, 180px) 24px", textAlign: "center", background: "#100c0a", color: "#fff" }}>
      <h1 style={{ color: "orangered", fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400 }}>Soul Food</h1>
      <p>La page de cet article est en préparation.</p>
      <Link href="/news" style={{ color: "#fff", textDecoration: "underline" }}>Retour aux articles</Link>
    </main>
    <SiteFooter />
  </div>;
}
