import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/shared/SiteHeader";
import SiteFooter from "../../../components/shared/SiteFooter";
import CTASection from "../../../components/shared/CTASection";
import ArtistTemplate from "../../../components/artistes/ArtistTemplate";
import ArtistTemplateBanner from "../../../components/artistes/ArtistTemplateBanner";
import { artistSlides } from "../../../components/artistes/artistsData";
import { artistProfiles } from "../../../components/artistes/artistProfiles";
import { artistSlug } from "../../../components/artistes/artistSlug";
import styles from "../../../styles/artistes/ArtistTemplate.module.css";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const profile = artistProfiles[slug];
  if (profile) {
    return {
      title: `${profile.name} : biographie et parcours`,
      description: `Découvrez la fiche de ${profile.name} : informations, parcours, carrière et sélection musicale.`,
    };
  }
  return { title: "Fiche artiste" };
}

export default async function ArtistPage({ params }) {
  const { slug } = await params;
  const artist = artistSlides.find(({ name }) => artistSlug(name) === slug);
  if (!artist) notFound();

  const profile = artistProfiles[slug];
  if (profile) {
    return <div className="artist-detail-enter">
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.artistHero}>
          <ArtistTemplate artist={profile} />
        </div>
        <ArtistTemplateBanner />
        <CTASection className="artist-template-cta" />
      </main>
      <SiteFooter />
    </div>;
  }

  return <div className="artist-detail-enter">
    <SiteHeader />
    <main style={{ minHeight: "65vh", padding: "clamp(100px, 12vw, 180px) 24px", textAlign: "center", background: "#100c0a", color: "#fff" }}>
      <h1 style={{ color: "orangered", fontSize: "clamp(36px, 5vw, 80px)", fontWeight: 400 }}>{artist.name}</h1>
      <p>La fiche de cet artiste est en préparation.</p>
      <Link href="/artistes" style={{ color: "#fff", textDecoration: "underline" }}>Retour à la liste des artistes</Link>
    </main>
    <SiteFooter />
  </div>;
}
