"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { articleIndex } from "../../data/news/articleIndex";
import styles from "../../styles/news/NewsPage.module.css";

const articleTemplates = [
  ...articleIndex.map((article) => ({
    href: `/news/${article.slug}`,
    image: article.listingImage,
    alt: article.listingAlt,
    title: article.cardTitle,
    author: article.author,
    date: article.publishedLabel,
    dateTime: article.publishedAt,
    isPublished: true,
  })),
  {
    href: "/news/soul-food-chicken-waffles-test",
    image: "/images/news/soul-food-chicken-waffles.webp",
    alt: "Poulet et gaufres, second article de test Soul Food",
    title: "Soul Food : les plats emblématiques de la cuisine Afro Américaine traditionnelle (test)",
    author: "Deezy",
    date: "18 septembre 2026",
    dateTime: "2026-09-18",
  },
  {
    href: "/news/soul-food-chicken-waffles-test?article=3",
    image: "/images/news/soul-food-chicken-waffles.webp",
    alt: "Poulet et gaufres, troisième article de test Soul Food",
    title: "Soul Food : les plats emblématiques de la cuisine Afro Américaine traditionnelle (test 2)",
    author: "Deezy",
    date: "20 septembre 2026",
    dateTime: "2026-09-20",
  },
];

const articleTemplate = articleTemplates[0];
const ARTICLE_INDEX_PAGE_SIZE = 6;
const CAROUSEL_RETURN_STATE_KEY = "smq-news-carousel-return-state";
const categories = [
  {
    id: "soul-food",
    label: "Soul Food",
    titles: [
      "Chicken & Waffles : pourquoi ce duo sucré-salé est devenu un grand classique de la Soul Food américaine",
      "Hoppin’ John : le plat du Nouvel An au cœur de la Soul Food du Sud",
      "Mac and cheese : les secrets d’un plat incontournable de la Soul Food",
      "Cornbread : le pain de maïs emblématique de la Soul Food du Sud",
      "La sweet potato pie, une douceur bien ancrée dans les traditions afro-américaines",
      "Gumbo, jambalaya, po’boy : la cuisine de Louisiane entre héritages et métissages",
    ],
  },
  {
    id: "clothing",
    label: "Clothing",
    titles: [
      "Du dimanche à la scène : comment le style Soul a traversé les générations",
      "Black Is Beautiful : afro, dashiki et affirmation d’un style noir",
      "Le Zoot Suit : quand le vêtement devient un manifeste",
      "James Brown, du costume à la cape : les métamorphoses d’un showman",
      "Soul Train et la mode : les tenues qui ont fait danser toute l’Amérique",
      "Les pochettes de disques comme vitrines de la mode Soul",
    ],
  },
  {
    id: "concerts",
    label: "Concerts",
    titles: [
      "Wattstax : une journée de musique et de mémoire pour la communauté afro-américaine",
      "Quand James Brown transformait chaque concert en marathon musical",
      "Aretha Franklin : les concerts de la Queen of Soul",
      "Live at the Apollo : l’énergie d’une salle devenue mythique",
      "De Detroit à Memphis : les salles qui ont accueilli la Soul",
      "Le Fillmore West, haut lieu des concerts Soul et Funk à San Francisco",
    ],
  },
  {
    id: "samples",
    label: "Samples",
    titles: [
      "Soul Underground : les harmonies oubliées des Sylvers et de leurs contemporains",
      "De la Soul à J Dilla : quand un sample Soul devient un nouveau classique",
      "L’Amen Break et les autres boucles qui ont façonné le hip-hop",
      "À la recherche du sample : remonter d’un beat à son disque d’origine",
      "Isaac Hayes et Curtis Mayfield : deux façons d’orchestrer la Soul",
      "Sampler un vinyle : crate digging, chops et travail de production",
    ],
  },
  {
    id: "culture-soul",
    label: "Culture Soul",
    titles: [
      "La Soul Music, miroir des espoirs et des luttes d’une époque",
      "Gospel, Rhythm and Blues : les racines de la musique Soul",
      "Motown et Stax : deux labels, deux sons, une même révolution musicale",
      "La Soul dans les années 1960 : musique, droits civiques et changement social",
      "Memphis, Detroit, Philadelphie : trois villes au cœur de l’histoire Soul",
      "Le Chitlin’ Circuit : les routes de la Soul dans l’Amérique ségréguée",
    ],
  },
].map((category) => ({
  ...category,
  articles: Array.from({ length: category.titles.length }, (_, index) => {
    const publishedArticle = articleIndex.find((article) => article.title === category.titles[index] || article.cardTitle === category.titles[index]);
    return {
      article: {
        ...articleTemplate,
        ...(publishedArticle ? {
          href: `/news/${publishedArticle.slug}`,
          image: publishedArticle.listingImage,
          alt: publishedArticle.listingAlt,
          title: publishedArticle.cardTitle,
          author: publishedArticle.author,
          date: publishedArticle.publishedLabel,
          dateTime: publishedArticle.publishedAt,
        } : {}),
        id: `${category.id}-${index + 1}`,
        title: publishedArticle?.cardTitle || category.titles[index],
        isPublished: Boolean(publishedArticle),
        categoryLabel: category.label,
      },
      publicationDate: publishedArticle?.publishedAt || null,
      sourceOrder: index,
    };
  })
    .sort((first, second) => {
      if (first.publicationDate && second.publicationDate) {
        return first.publicationDate.localeCompare(second.publicationDate) || first.sourceOrder - second.sourceOrder;
      }
      if (first.publicationDate) return -1;
      if (second.publicationDate) return 1;
      return first.sourceOrder - second.sourceOrder;
    })
    .map(({ article }) => article),
}));

export default function NewsCarousel() {
  const trackRef = useRef(null);
  const categorySectionRef = useRef(null);
  const categoryFadeTimerRef = useRef(null);
  const categorySwipeRef = useRef(null);
  const transitionRef = useRef(false);
  const pendingRestoreRef = useRef(null);
  const timersRef = useRef([]);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const previousCategoryIndexRef = useRef(activeCategoryIndex);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCarouselReady, setIsCarouselReady] = useState(false);
  const [isCarouselTransitioning, setIsCarouselTransitioning] = useState(false);
  const [isCategoryPanelInView, setIsCategoryPanelInView] = useState(false);
  const [leavingArticle, setLeavingArticle] = useState(false);
  const articles = isDesktop || isCompact ? categories[activeCategoryIndex].articles : articleTemplates;
  const visibleIndexStart = isDesktop ? Math.floor(activeIndex / ARTICLE_INDEX_PAGE_SIZE) * ARTICLE_INDEX_PAGE_SIZE : 0;
  const visibleIndexArticles = articles.slice(visibleIndexStart, visibleIndexStart + ARTICLE_INDEX_PAGE_SIZE);

  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
    window.clearTimeout(categoryFadeTimerRef.current);
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const compactQuery = window.matchMedia("(max-width: 1279.98px)");
    const syncDesktopMode = () => {
      setIsDesktop(desktopQuery.matches);
      setIsCompact(compactQuery.matches);
    };
    syncDesktopMode();
    desktopQuery.addEventListener("change", syncDesktopMode);
    compactQuery.addEventListener("change", syncDesktopMode);
    return () => {
      desktopQuery.removeEventListener("change", syncDesktopMode);
      compactQuery.removeEventListener("change", syncDesktopMode);
    };
  }, []);

  useEffect(() => {
    const section = categorySectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      const fallbackFrame = window.requestAnimationFrame(() => setIsCategoryPanelInView(true));
      return () => window.cancelAnimationFrame(fallbackFrame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsCategoryPanelInView(entry.isIntersecting);
    }, { threshold: 0.01 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (previousCategoryIndexRef.current === activeCategoryIndex) return;
    previousCategoryIndexRef.current = activeCategoryIndex;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    transitionRef.current = false;
    setIsCarouselTransitioning(false);
    const pendingRestore = pendingRestoreRef.current;
    if (pendingRestore?.categoryIndex === activeCategoryIndex) {
      pendingRestoreRef.current = null;
      setActiveIndex(pendingRestore.articleIndex);
      track.scrollTo({ left: track.clientWidth * pendingRestore.articleIndex, behavior: "instant" });
      const readyFrame = window.requestAnimationFrame(() => setIsCarouselReady(true));
      return () => window.cancelAnimationFrame(readyFrame);
    }
    track.scrollTo({ left: 0, behavior: "instant" });
    setActiveIndex(0);
  }, [activeCategoryIndex]);

  useLayoutEffect(() => {
    let savedState;
    try {
      savedState = JSON.parse(window.sessionStorage.getItem(CAROUSEL_RETURN_STATE_KEY) || "null");
    } catch {
      savedState = null;
      try {
        window.sessionStorage.removeItem(CAROUSEL_RETURN_STATE_KEY);
      } catch {}
    }
    const categoryIndex = categories.findIndex((category) => category.id === savedState?.categoryId);
    const articleIndex = Number(savedState?.articleIndex);
    const validState = categoryIndex >= 0
      && Number.isInteger(articleIndex)
      && articleIndex >= 0
      && articleIndex < categories[categoryIndex].articles.length;

    const restoreFrame = window.requestAnimationFrame(() => {
      if (!validState) {
        try {
          window.sessionStorage.removeItem(CAROUSEL_RETURN_STATE_KEY);
        } catch {}
        setIsCarouselReady(true);
        return;
      }
      if (categoryIndex === 0) {
        setActiveIndex(articleIndex);
        const track = trackRef.current;
        if (track) track.scrollTo({ left: track.clientWidth * articleIndex, behavior: "instant" });
        categorySectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
        try {
          window.sessionStorage.removeItem(CAROUSEL_RETURN_STATE_KEY);
        } catch {}
        setIsCarouselReady(true);
        return;
      }
      pendingRestoreRef.current = { categoryIndex, articleIndex };
      setActiveCategoryIndex(categoryIndex);
      categorySectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      try {
        window.sessionStorage.removeItem(CAROUSEL_RETURN_STATE_KEY);
      } catch {}
    });
    return () => window.cancelAnimationFrame(restoreFrame);
  }, []);

  const selectCategory = (index) => {
    const nextIndex = (index + categories.length) % categories.length;
    if (nextIndex === activeCategoryIndex) return;
    const track = trackRef.current;
    if (track) {
      window.clearTimeout(categoryFadeTimerRef.current);
      track.classList.add(styles["is-fading"]);
      categoryFadeTimerRef.current = window.setTimeout(() => {
        track.classList.remove(styles["is-fading"]);
      }, 340);
    }
    setActiveCategoryIndex(nextIndex);
  };

  const categoryLabel = categories[activeCategoryIndex].label;

  const startCategorySwipe = (event) => {
    if (!isCompact || event.touches.length !== 1) return;
    const touch = event.touches[0];
    categorySwipeRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const endCategorySwipe = (event) => {
    const start = categorySwipeRef.current;
    categorySwipeRef.current = null;
    if (!isCompact || !start || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    selectCategory(activeCategoryIndex + (deltaX < 0 ? 1 : -1));
  };

  const syncArticleSwipe = (event) => {
    if (transitionRef.current) return;
    const track = event.currentTarget;
    if (track.clientWidth) setActiveIndex(Math.max(0, Math.min(articles.length - 1, Math.round(track.scrollLeft / track.clientWidth))));
  };

  const settleArticleSwipe = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.max(0, Math.min(articles.length - 1, index));
    setActiveIndex(nextIndex);
    track.scrollTo({ left: track.clientWidth * nextIndex, behavior: "smooth" });
  };

  const startArticleDrag = (event) => {
    suppressClickRef.current = false;
    if ((event.pointerType && event.pointerType !== "mouse") || (event.button !== undefined && event.button !== 0) || dragRef.current) return;
    dragRef.current = { pointerId: event.pointerId ?? null, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false };
  };

  const moveArticleDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)) return;
    const track = event.currentTarget;
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) < 5) return;
    if (!drag.moved) {
      drag.moved = true;
      suppressClickRef.current = true;
      if (drag.pointerId !== null && track.setPointerCapture) track.setPointerCapture(drag.pointerId);
      track.classList.add(styles["is-dragging"]);
    }
    event.preventDefault();
    track.scrollLeft = drag.startScroll - distance;
  };

  const stopArticleDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || (drag.pointerId !== null && event.pointerId !== undefined && drag.pointerId !== event.pointerId)) return;
    const track = event.currentTarget;
    dragRef.current = null;
    const nextIndex = track.clientWidth ? Math.max(0, Math.min(articles.length - 1, Math.round(track.scrollLeft / track.clientWidth))) : activeIndex;
    track.classList.remove(styles["is-dragging"]);
    if (drag.pointerId !== null && track.hasPointerCapture?.(drag.pointerId)) track.releasePointerCapture(drag.pointerId);
    if (drag.moved) settleArticleSwipe(nextIndex);
  };

  const goToSlide = (index) => {
    const track = trackRef.current;
    if (!track || transitionRef.current || index === activeIndex) return;
    const nextIndex = (index + articles.length) % articles.length;
    const fadeDuration = 300;
    transitionRef.current = true;
    setIsCarouselTransitioning(true);
    setActiveIndex(nextIndex);
    track.classList.add(styles["is-fading"]);
    timersRef.current.push(window.setTimeout(() => {
      track.scrollTo({ left: nextIndex * track.clientWidth, behavior: "instant" });
      timersRef.current.push(window.setTimeout(() => {
        track.classList.remove(styles["is-fading"]);
        setIsCarouselTransitioning(false);
        transitionRef.current = false;
      }, 40));
    }, fadeDuration));
  };

  const openArticle = (event, href, articleIndex) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try {
      window.sessionStorage.setItem(CAROUSEL_RETURN_STATE_KEY, JSON.stringify({
        categoryId: categories[activeCategoryIndex].id,
        articleIndex,
      }));
    } catch {}
    setActiveIndex(articleIndex);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: track.clientWidth * articleIndex, behavior: "instant" });
    setLeavingArticle(true);
    timersRef.current.push(window.setTimeout(() => router.push(href), 380));
  };

  const selectArticleFromIndex = (index) => {
    const track = trackRef.current;
    if (!track) return;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    transitionRef.current = false;
    setIsCarouselTransitioning(false);
    track.classList.remove(styles["is-fading"]);
    goToSlide(index);
  };

  return <section ref={categorySectionRef} id="category-soul-food" className={styles["quiz-carousel-section"]}>
    <div
      className={`${styles["category-carousel"]} ${isCategoryPanelInView ? styles["category-panel-visible"] : ""}`}
      aria-hidden={!isCategoryPanelInView}
      inert={!isCategoryPanelInView}
      style={{ "--category-letter-count": Array.from(categoryLabel).length }}
      onTouchStart={startCategorySwipe}
      onTouchEnd={endCategorySwipe}
      onTouchCancel={() => { categorySwipeRef.current = null; }}
    >
      <button type="button" className={`${styles["category-arrow"]} ${styles.prev}`} onClick={() => selectCategory(activeCategoryIndex - 1)} aria-label={`Catégorie précédente : ${categories[(activeCategoryIndex - 1 + categories.length) % categories.length].label}`}>
        <span aria-hidden="true">‹</span>
      </button>
      <h2 className={styles["category-title"]} aria-label={categoryLabel} aria-live="polite">{Array.from(categoryLabel).map((character, index) => <span key={`${activeCategoryIndex}-${index}`} className={styles["category-letter"]} aria-hidden="true" style={{ "--letter-index": index }}>{character === " " ? "\u00a0" : character}</span>)}</h2>
      <button type="button" className={`${styles["category-arrow"]} ${styles.next}`} onClick={() => selectCategory(activeCategoryIndex + 1)} aria-label={`Catégorie suivante : ${categories[(activeCategoryIndex + 1) % categories.length].label}`}>
        <span aria-hidden="true">›</span>
      </button>
    </div>
    <div className={styles["news-carousel-layout"]}>
      <div className={`${styles["carousel-container"]} ${isCarouselReady ? "" : styles["is-restoring"]} ${isCarouselTransitioning ? styles["is-transitioning"] : ""}`} aria-label="Sélection d’articles">
        <div className={styles["carousel-track-wrapper"]}>
          <div ref={trackRef} onScroll={syncArticleSwipe} onPointerDown={startArticleDrag} onPointerMove={moveArticleDrag} onPointerUp={stopArticleDrag} onPointerCancel={stopArticleDrag} onLostPointerCapture={stopArticleDrag} onMouseDown={startArticleDrag} onMouseMove={moveArticleDrag} onMouseUp={stopArticleDrag} onMouseLeave={stopArticleDrag} onClickCapture={(event) => { if (suppressClickRef.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); suppressClickRef.current = false; } }} onDragStart={(event) => event.preventDefault()} className={styles["carousel-track"]}>
            {articles.map((article, index) => <Link id={`article-${index + 1}`} key={article.id || article.href} href={article.href} className={styles["carousel-slide"]} onClick={(event) => openArticle(event, article.href, index)}>
              <img
                src={article.image}
                alt={article.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
              />
              {isDesktop && <span className={styles["article-category-tag"]}>{article.categoryLabel}</span>}
              <div className={styles["article-meta"]}>
                <span><span className={styles["meta-label"]}>Par </span><strong className={styles["meta-author"]}>{article.author}</strong></span>
                <span><span className={styles["meta-label"]}>Publié le </span><time dateTime={article.dateTime}>{article.date}</time></span>
              </div>
              <div className={styles["slide-content"]}><div className={styles["text-wrapper"]}>
                <p>{article.title}</p>
              </div></div>
            </Link>)}
          </div>
        </div>
        <button type="button" className={`${styles["about-arrow"]} ${styles.prev}`} onClick={() => goToSlide(activeIndex - 1)} aria-label="Article précédent"><span className={styles["arrow-icon"]} aria-hidden="true">‹</span><span className={styles["arrow-label"]}>Précédent</span></button>
        <button type="button" className={`${styles["about-arrow"]} ${styles.next}`} onClick={() => goToSlide(activeIndex + 1)} aria-label="Article suivant"><span className={styles["arrow-icon"]} aria-hidden="true">›</span><span className={styles["arrow-label"]}>Suivant</span></button>
        <div className={styles["about-dots"]} aria-label="Choisir un article">
          {articles.map((article, index) => <button type="button" key={article.id || article.href} className={`${styles.dot} ${index === activeIndex ? styles.active : ""}`} onClick={() => goToSlide(index)} aria-label={`Afficher l’article ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} />)}
        </div>
        <div className={styles["article-counter"]} aria-live="polite" aria-atomic="true">
          <strong>{activeIndex + 1}</strong><span> / {articles.length}</span>
        </div>
      </div>
      <nav id="news-index" className={`${styles["article-index"]} ${isCarouselReady ? "" : styles["is-restoring"]}`} aria-label="Index des articles">
        <button type="button" className={`${styles["article-index-arrow"]} ${styles.prev}`} onClick={() => selectArticleFromIndex(activeIndex - 1)} aria-label="Afficher l’article précédent">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14 12 9 19 14" /></svg>
        </button>
        <div className={styles["article-index-track"]}>
          {visibleIndexArticles.map((article, visibleIndex) => {
            const index = visibleIndexStart + visibleIndex;
            return <a key={article.id || article.href} href={`#article-${index + 1}`} className={index === activeIndex ? styles.active : ""} aria-current={index === activeIndex ? "true" : undefined} onClick={(event) => {
              event.preventDefault();
              selectArticleFromIndex(index);
            }}>{article.title}</a>;
          })}
        </div>
        <button type="button" className={`${styles["article-index-arrow"]} ${styles.next}`} onClick={() => selectArticleFromIndex(activeIndex + 1)} aria-label="Afficher l’article suivant">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10 12 15 19 10" /></svg>
        </button>
      </nav>
    </div>
    {leavingArticle && typeof document !== "undefined" && createPortal(<div className={styles["news-page-exit"]} role="status" aria-label="Ouverture de l’article" />, document.body)}
  </section>;
}
