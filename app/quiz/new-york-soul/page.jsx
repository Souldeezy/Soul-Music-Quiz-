import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import NewYorkSoulPage from "../../../components/quiz/NewYorkSoulPage";
import styles from "../../../styles/quiz/NewYorkSoulPage.module.css";

export const metadata = {
  title: { absolute: "Quiz New York Soul - Testez vos connaissances | Soul Music Quiz" },
  description: "Testez vos connaissances sur la New York Soul avec ce quiz. Aretha Franklin, Donny Hathaway, l'Apollo Theater : êtes-vous un expert du son sophistiqué de la Big Apple ?",
};

// An explicit route isolates New York's bundle and leaves the existing slug route untouched.
export default function NewYorkSoulRoute() {
  return <div className="artist-detail-enter">
    <link rel="preload" as="image" href="/images/quiz/new-york/hero-new-york.webp" fetchPriority="high" />
    <SiteHeader />
    <main className="new-york-soul-page">
      <NewYorkSoulPage />
      {/* This class reuses template geometry, not California content/background. */}
      <CTASection className={`california-soul-cta ${styles.cta}`} />
    </main>
    <SiteFooter />
  </div>;
}
