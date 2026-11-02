import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import MemphisSoulPage from "../../../components/quiz/MemphisSoulPage";
import styles from "../../../styles/quiz/MemphisSoulPage.module.css";

export const metadata = {
  title: { absolute: "Quiz Memphis Soul - Testez vos connaissances | Soul Music Quiz" },
  description: "Testez vos connaissances sur la Memphis Soul avec ce quiz. Otis Redding, Al Green, Stax Records : êtes-vous un expert du son brut et authentique de Soulsville ?",
};

// An explicit route isolates Memphis's bundle and leaves the existing slug route untouched.
export default function MemphisSoulRoute() {
  return <div className="artist-detail-enter">
    <link rel="preload" as="image" href="/images/quiz/memphis/hero-memphis.webp" fetchPriority="high" />
    <SiteHeader />
    <main className="memphis-soul-page">
      <MemphisSoulPage />
      {/* This class reuses template geometry, not California content/background. */}
      <CTASection className={`california-soul-cta ${styles.cta}`} />
    </main>
    <SiteFooter />
  </div>;
}
