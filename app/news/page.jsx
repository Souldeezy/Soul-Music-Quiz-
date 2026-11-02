import SiteHeader from "../../components/shared/SiteHeader";
import SiteFooter from "../../components/shared/SiteFooter";
import CTASection from "../../components/shared/CTASection";
import NewsHero from "../../components/news/NewsHero";
import NewsCarousel from "../../components/news/NewsCarousel";
import NewsBanner from "../../components/news/NewsBanner";

export const metadata = {
  title: "Menu News – Toute l’actualité Soul Music",
  description: "Articles, actualités et culture Soul Music : albums, concerts, Soul Food, samples et lifestyle.",
};

export default function NewsPage() {
  return <>
    <SiteHeader />
    <main className="news-page">
      <NewsHero />
      <NewsBanner variant="money" />
      <NewsCarousel />
      <NewsBanner variant="bar" />
      <CTASection />
    </main>
    <SiteFooter />
  </>;
}
