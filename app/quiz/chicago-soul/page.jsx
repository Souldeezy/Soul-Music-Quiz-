import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import ChicagoSoulPage from "../../../components/quiz/ChicagoSoulPage";
import styles from "../../../styles/quiz/ChicagoSoulPage.module.css";

export const metadata = {
  title: { absolute: "Quiz Chicago Soul - Testez vos connaissances | Soul Music Quiz" },
  description: "Testez vos connaissances sur la Chicago Soul avec ce quiz de 10 questions. Curtis Mayfield, The Chi-Lites, Gene Chandler : êtes-vous incollable sur le son soul de Chicago ?",
};

// An explicit route isolates Chicago's bundle and leaves the existing slug route untouched.
export default function ChicagoSoulRoute() {
  return <div className="artist-detail-enter">
    <link rel="preload" as="image" href="/images/quiz/chicago/hero-chicago.webp" fetchPriority="high" />
    <SiteHeader />
    <main className="chicago-soul-page">
      <ChicagoSoulPage />
      {/* This class reuses template geometry, not California content/background. */}
      <CTASection className={`california-soul-cta ${styles.cta}`} />
    </main>
    <SiteFooter />
  </div>;
}
