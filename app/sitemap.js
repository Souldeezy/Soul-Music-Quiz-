import { artistProfiles } from "../components/artistes/artistProfiles";
import { articleProfiles } from "../data/news/articleProfiles";
import { QUIZ_MENU_LINKS } from "../data/quizzes/quizConfig";

const siteUrl = "https://www.soulmusicquiz.com";

export default function sitemap() {
  const staticPaths = ["", "/quiz", "/artistes", "/news", "/mentions-legales"];
  const quizPaths = QUIZ_MENU_LINKS.map(([slug]) => `/quiz/${slug}`);
  const artistPaths = Object.keys(artistProfiles).map((slug) => `/artistes/${slug}`);
  const articlePaths = Object.keys(articleProfiles).map((slug) => `/news/${slug}`);

  return [...staticPaths, ...quizPaths, ...artistPaths, ...articlePaths].map((path) => ({
    url: `${siteUrl}${path}`,
  }));
}
