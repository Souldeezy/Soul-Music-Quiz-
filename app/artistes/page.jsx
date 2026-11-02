import SiteHeader from "../../components/shared/SiteHeader";
import SiteFooter from "../../components/shared/SiteFooter";
import CTASection from "../../components/shared/CTASection";
import ArtistsHero from "../../components/artistes/ArtistsHero";
import ArtistsCarousel from "../../components/artistes/ArtistsCarousel";
import ArtistsBanner from "../../components/artistes/ArtistsBanner";

export const metadata = {
  title: "Artistes Soul Music",
  description: "Explorez plus de 200 profils d’artistes Soul : biographies, discographies et anecdotes sur les légendes de la Soul Music des années 60, 70 et 80.",
};

export default function ArtistesPage() {
  return <>
    <SiteHeader />
    <main className="artistes-page">
      <ArtistsHero />
      <ArtistsBanner variant="concert" />
      <ArtistsCarousel />
      <ArtistsBanner variant="jeopardy" />
      <CTASection />
    </main>
    <SiteFooter />
  </>;
}
