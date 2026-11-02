import SiteHeader from "../components/shared/SiteHeader";
import SiteFooter from "../components/shared/SiteFooter";
import HomeHero from "../components/accueil/HomeHero";
import HomeBannerTop from "../components/accueil/HomeBannerTop";
import HomeCategories from "../components/accueil/HomeCategories";
import HomeStats from "../components/accueil/HomeStats";
import HomeBannerBottom from "../components/accueil/HomeBannerBottom";
import HomeAbout from "../components/accueil/HomeAbout";
import "../styles/accueil/homeHero.css";
import "../styles/accueil/homeBanners.css";
import "../styles/accueil/homeCategories.css";
import "../styles/accueil/homeStats.css";
import "../styles/accueil/homeAbout.css";
export const metadata = {
  title: { absolute: "Soul Music Quiz : la référence des amateurs de Soul Music" },
  description: "Testez vos connaissances sur la Golden Era de la Soul Music à travers des quiz, des artistes et des articles dédiés à ses légendes.",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HomeHero />
        <HomeBannerTop />
        <HomeCategories />
        <HomeStats />
        <HomeBannerBottom />
        <HomeAbout />
      </main>
      <SiteFooter />
    </>
  );
}
