import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import NewOrleansSoulPage from "../../../components/quiz/NewOrleansSoulPage";
import styles from "../../../styles/quiz/NewOrleansSoulPage.module.css";

export const metadata = {
  title: { absolute: "Quiz New Orleans Soul - Testez vos connaissances | Soul Music Quiz" },
  description: "Testez vos connaissances sur la New Orleans Soul avec ce quiz. The Meters, Allen Toussaint, Dr. John : maîtrisez-vous le funk syncopé du Crescent City ?",
};

// An explicit route isolates New Orleans's bundle and leaves the existing slug route untouched.
export default function NewOrleansSoulRoute() {
  return <div className="artist-detail-enter">
    <link rel="preload" as="image" href="/images/quiz/new-orleans/hero-new-orleans.webp" fetchPriority="high" />
    <SiteHeader />
    <main className="new-orleans-soul-page">
      <NewOrleansSoulPage />
      {/* This class reuses template geometry, not California content/background. */}
      <CTASection className={`california-soul-cta ${styles.cta}`} />
    </main>
    <SiteFooter />
  </div>;
}
