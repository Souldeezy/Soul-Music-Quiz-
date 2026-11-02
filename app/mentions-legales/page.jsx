import SiteHeader from "../../components/shared/SiteHeader";
import BannerEffect from "../../components/shared/BannerEffect";
import CTASection from "../../components/shared/CTASection";
import SiteFooter from "../../components/shared/SiteFooter";
import LegalHero from "../../components/legal/common/LegalHero";
import LegalBannerTop from "../../components/legal/common/LegalBannerTop";
import LegalContent from "../../components/legal/common/LegalContent";
import LegalBannerBottom from "../../components/legal/common/LegalBannerBottom";
import "../../styles/legal/common/legal.css";
import "../../styles/legal/common/legalHero.css";
import "../../styles/legal/common/legalContent.css";
import "../../styles/legal/common/gameEntryModal.css";
import "../../styles/legal/games/destinationHub.css";
import "../../styles/legal/games/destination.css";
import "../../styles/legal/games/destinationContent.css";
import "../../styles/legal/games/employeeGame.css";
import "../../styles/legal/games/coney.css";
import "../../styles/legal/games/coneyLobby.css";
import "../../styles/legal/games/coneyDartsGame.css";
import "../../styles/legal/games/coneyMemoryGame.css";
import "../../styles/legal/games/coneyTetrisGame.css";
import "../../styles/legal/games/coneyMazeGame.css";
import "../../styles/legal/games/mall.css";
import "../../styles/legal/games/mallLobby.css";
import "../../styles/legal/games/mallVinyls.css";
import "../../styles/legal/games/mallCard.css";
import "../../styles/legal/games/mallBooks.css";
import "../../styles/legal/games/mallAudio.css";
import "../../styles/legal/games/mallFashion.css";
import "../../styles/legal/games/casino.css";
import "../../styles/legal/games/casinoLobby.css";
import "../../styles/legal/games/casinoVideoPoker.css";
import "../../styles/legal/games/casinoSlotMachine.css";
import "../../styles/legal/games/casinoLuckyWheel.css";
import "../../styles/legal/games/casinoDice.css";

export const metadata = {
  title: { absolute: "Mentions légales | Soul Music Quiz" },
  description: "Mentions légales, confidentialité, cookies et conditions d’utilisation de Soul Music Quiz.",
};

export default function LegalPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <LegalHero />
        <BannerEffect />
        <LegalBannerTop />
        <LegalContent />
        <LegalBannerBottom />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
