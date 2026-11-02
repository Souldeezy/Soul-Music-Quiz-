import Link from "next/link";
import Image from "next/image";
import CTASection from "../shared/CTASection";
import SoulFoodBanner from "./SoulFoodBanner";
import styles from "../../styles/news/SoulFoodArticle.module.css";

const vinylDiscNames = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven"];
const vinylDiscClasses = vinylDiscNames.map((name) => [styles.vinylDisc, styles[`vinylDisc${name}`]].join(" "));

function ArticleText({ content }) {
  if (typeof content === "string") return content;
  return <>
    {content.before}
    <a className={styles.textLink} href={content.href} target="_blank" rel="noopener noreferrer">
      {content.anchor}
    </a>
    {content.after}
  </>;
}

function ArticleParagraphs({ paragraphs, className }) {
  return paragraphs.map((paragraph, index) => (
    <p className={className} key={`${index}-${typeof paragraph === "string" ? paragraph.slice(0, 12) : paragraph.anchor}`}>
      <ArticleText content={paragraph} />
    </p>
  ));
}

function ArticleFigure({ photo, secondary = false, mobileOnly = false, hero = false }) {
  const className = [
    secondary ? styles.secondaryPicture : styles.mainPicture,
    mobileOnly ? styles.mobilePicture : "",
    hero ? styles.heroPicture : "",
  ].filter(Boolean).join(" ");
  const sizes = hero
    ? "(max-width: 375px) calc(100vw - 28px), (max-width: 767px) calc(100vw - 40px), (max-width: 1439px) 84vw, 76vw"
    : secondary
      ? "(max-width: 375px) calc(100vw - 28px), (max-width: 767px) calc(100vw - 40px), 42vw"
      : "(max-width: 767px) calc(100vw - 28px), 76vw";

  return <figure className={className} data-photo={photo.src}>
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width || 1920}
      height={photo.height || 1280}
      sizes={sizes}
      quality={75}
      loading={secondary ? "lazy" : "eager"}
      fetchPriority={hero ? "high" : "auto"}
    />
    <figcaption>
      {photo.caption}
      {photo.credit && <> {" "}(<a className={styles.photoCredit} href={photo.credit.href} target="_blank" rel="noopener noreferrer">{photo.credit.label}</a>)</>}
    </figcaption>
  </figure>;
}

function ArticleBlock({ block, article }) {
  if (block.type === "heading") return <h2>{block.text}</h2>;
  if (block.type === "paragraphs") {
    return <ArticleParagraphs paragraphs={block.items} className={styles.paragraph} />;
  }
  if (block.type === "figure") {
    return <ArticleFigure photo={article.photos[block.photo]} secondary mobileOnly={block.mobileOnly} />;
  }
  if (block.type === "figurePair") {
    if (block.photos.length >= 3) {
      const stackedPhotos = block.photos.slice(0, -1);
      const tallPhoto = block.photos[block.photos.length - 1];

      return <div className={styles.picturePair}>
        <div className={styles.pictureStack}>
          {stackedPhotos.map((photoId, index) => (
            <ArticleFigure key={`${photoId}-${index}`} photo={article.photos[photoId]} secondary />
          ))}
        </div>
        <ArticleFigure photo={article.photos[tallPhoto]} secondary />
      </div>;
    }

    return <div className={styles.picturePair}>
      {block.photos.map((photoId, index) => <ArticleFigure key={`${photoId}-${index}`} photo={article.photos[photoId]} secondary />)}
    </div>;
  }
  return null;
}

export default function NewsArticleTemplate({ article }) {
  return <main className={styles.page}>
    <article className={styles.article}>
      <div className={styles.vinylDecorations} aria-hidden="true">
        {vinylDiscNames.map((name, index) => <span key={name} className={vinylDiscClasses[index]} />)}
      </div>
      <div className={styles.wrapper}>
        <header className={styles.articleHeader}>
          <h1>{article.title}</h1>
          <div className={styles.headerContent}>
            <div className={styles.tags}>
              <Link href="/news" className={styles.tag}>News</Link>
              <Link href={article.category.href} className={styles.tag}>{article.category.label}</Link>
            </div>
            <p className={styles.byline}>Édité par <strong>{article.author}</strong> <span className={styles.updatedDate}>Mis à jour le {article.updatedLabel}</span></p>
          </div>
        </header>

        <ArticleFigure photo={article.photos.hero} hero />
        <p className={styles.introOutro}><ArticleText content={article.intro} /></p>
        {article.blocks.map((block, index) => <ArticleBlock key={`${block.type}-${index}`} block={block} article={article} />)}
        <p className={styles.introOutro}><ArticleText content={article.outro} /></p>
      </div>
      <Link href={article.returnHref} className={styles.articleReturnLink}>
        Retour au Menu Articles
      </Link>
    </article>
    <SoulFoodBanner />
    <CTASection />
  </main>;
}
