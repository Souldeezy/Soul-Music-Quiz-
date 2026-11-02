import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import DetroitSoulPage from "../../../components/quiz/DetroitSoulPage";
import styles from "../../../styles/quiz/DetroitSoulPage.module.css";

export const metadata = {
  title: { absolute: "Quiz Detroit Soul - Testez vos connaissances | Soul Music Quiz" },
  description: "Testez vos connaissances sur la Detroit Soul avec ce quiz. The Supremes, Marvin Gaye, The Funk Brothers : êtes-vous incollable sur le son de la Motown ?",
};

// An explicit route isolates Detroit's bundle and leaves the existing slug route untouched.
export default function DetroitSoulRoute() {
  return <div className="artist-detail-enter">
    <link rel="preload" as="image" href="/images/quiz/detroit/hero-detroit.webp" fetchPriority="high" />
    <SiteHeader />
    <main className="detroit-soul-page">
      <DetroitSoulPage />
      {/* This class reuses template geometry, not California content/background. */}
      <CTASection className={`california-soul-cta ${styles.cta}`} />
    </main>
    <SiteFooter />
  </div>;
}
