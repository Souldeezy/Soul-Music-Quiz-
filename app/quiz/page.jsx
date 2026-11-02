import SiteHeader from "../../components/shared/SiteHeader";
import SiteFooter from "../../components/shared/SiteFooter";
import CTASection from "../../components/shared/CTASection";
import QuizHero from "../../components/quiz/QuizHero";
import QuizCarousel from "../../components/quiz/QuizCarousel";
import QuizBanner from "../../components/quiz/QuizBanner";

export const metadata = {
  title: "Quiz Soul Music | Soul Music Quiz",
  description: "Choisissez votre quiz Soul Music : California, Chicago, Detroit, Memphis, New Orleans ou New York Soul.",
};

export default function QuizPage() {
  return <><SiteHeader /><main className="quiz-page"><QuizHero /><QuizBanner variant="city" /><QuizCarousel /><QuizBanner variant="diner" /><CTASection /></main><SiteFooter /></>;
}
