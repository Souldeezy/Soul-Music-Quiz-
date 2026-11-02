import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import CaliforniaSoulPage from "../../../components/quiz/CaliforniaSoulPage";

const quizzes = new Map([
  ["california-soul", "California Soul"],
  ["chicago-soul", "Chicago Soul"],
  ["detroit-soul", "Detroit Soul"],
  ["memphis-soul", "Memphis Soul"],
  ["new-orleans-soul", "New Orleans Soul"],
  ["new-york-soul", "New York Soul"],
]);

export default async function QuizTestPage({ params }) {
  const { slug } = await params;
  const title = quizzes.get(slug);
  if (!title) notFound();

  if (slug === "california-soul") {
    return <div className="artist-detail-enter">
      <link
        rel="preload"
        as="image"
        href="/images/quiz/california-soul/hero-california-soul.webp"
        fetchPriority="high"
      />
      <SiteHeader />
      <main className="california-soul-page">
        <CaliforniaSoulPage />
        <CTASection className="california-soul-cta" />
      </main>
      <SiteFooter />
    </div>;
  }

  return <div className="artist-detail-enter">
    <SiteHeader />
    <main style={{ minHeight: "65vh", padding: "clamp(100px, 12vw, 180px) 24px", textAlign: "center", background: "#100c0a", color: "#fff" }}>
      <h1 style={{ color: "orangered", fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400 }}>{title}</h1>
      <p>La page de ce quiz est en préparation.</p>
      <Link href="/quiz" style={{ color: "#fff", textDecoration: "underline" }}>Retour aux quizzes</Link>
    </main>
    <SiteFooter />
  </div>;
}
