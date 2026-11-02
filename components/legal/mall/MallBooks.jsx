"use client";

import { useRef, useState } from "react";

const BOOKS_PER_PAGE = 3;
const BOOKS_SWIPE_THRESHOLD = 80;

const BOOKS = [
  {
    id: 1,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/peter-guralnick-sweet-soul-music.jpg",
    artist: "Peter Guralnick",
    track: "Sweet Soul Music",
    year: "1999",
    label: "Back Bay Books",
    link:
      "https://www.amazon.com/s?k=Sweet+Soul+Music+Peter+Guralnick",
  },
  {
    id: 2,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/dave-marsh-the-heart-of-rock-and-soul.webp",
    artist: "Dave Marsh",
    track: "The Heart of Rock & Soul",
    year: "1989",
    label: "Da Capo Press",
    link:
      "https://www.amazon.com/s?k=The+Heart+of+Rock+and+Soul+Dave+Marsh",
  },
  {
    id: 3,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/motown-the-sound-of-young-america.webp",
    artist: "Adam White",
    track: "Motown: The Sound of Young America",
    year: "2019",
    label: "Thames & Hudson",
    link:
      "https://www.amazon.com/s?k=Motown+The+Sound+of+Young+America",
  },
  {
    id: 4,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/soul-survivor.webp",
    artist: "Al Green",
    track: "Soul Survivor",
    year: "2000",
    label: "HarperCollins",
    link:
      "https://www.amazon.com/s?k=Soul+Survivor+Al+Green",
  },
  {
    id: 5,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/divided-soul.webp",
    artist: "David Ritz",
    track: "Divided Soul",
    year: "2014",
    label: "Da Capo Press",
    link:
      "https://www.amazon.com/s?k=Divided+Soul+David+Ritz",
  },
  {
    id: 6,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/david-ritz-respect.jpg",
    artist: "David Ritz",
    track: "Respect",
    year: "2014",
    label: "Little Brown",
    link:
      "https://www.amazon.com/s?k=Respect+Aretha+Franklin+David+Ritz",
  },
  {
    id: 7,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/mercy-mercy-me.jpg",
    artist: "Michael Eric Dyson",
    track: "Mercy, Mercy Me",
    year: "2004",
    label: "Basic Civitas",
    link:
      "https://www.amazon.com/s?k=Mercy+Mercy+Me+Michael+Eric+Dyson",
  },
  {
    id: 8,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/the-death-of-rhythm-and-blues.jpg",
    artist: "Nelson George",
    track: "The Story of Black Music",
    year: "1988",
    label: "Penguin",
    link:
      "https://www.amazon.com/s?k=People+Get+Ready+Nelson+George",
  },
  {
    id: 9,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/rj-smith-the-one.webp",
    artist: "RJ Smith",
    track: "The Life and Music of James Brown",
    year: "2012",
    label: "Gotham Books",
    link:
      "https://www.amazon.com/s?k=The+One+RJ+Smith",
  },
  {
    id: 10,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/ready-for-a-brand-new-beat.webp",
    artist: "Mark Kurlansky",
    track: "Ready for a Brand New Beat",
    year: "2013",
    label: "Riverhead Books",
    link:
      "https://www.amazon.com/s?k=Ready+for+a+Brand+New+Beat",
  },
  {
    id: 11,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/the-funk-era.jpg",
    artist: "Tony Bolden",
    track: "The Funk Era and Beyond",
    year: "2008",
    label: "Praeger",
    link:
      "https://www.amazon.com/s?k=The+Funk+Era+and+Beyond",
  },
  {
    id: 12,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/stax-soulsville-u-s-a.webp",
    artist: "Rob Bowman",
    track: "Soulsville U.S.A.",
    year: "1997",
    label: "Schirmer Books",
    link:
      "https://www.amazon.com/s?k=Soulsville+USA+Rob+Bowman",
  },
  {
    id: 13,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/nelson-george-the-motown-story.webp",
    artist: "Nelson George",
    track: "Where Did Our Love Go",
    year: "1985",
    label: "University of Illinois Press",
    link:
      "https://www.amazon.com/s?k=Where+Did+Our+Love+Go+Nelson+George",
  },
  {
    id: 14,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/dancing-in-the-street.jpg",
    artist: "Suzanne E. Smith",
    track: "Dancing in the Street",
    year: "1999",
    label: "Harvard University Press",
    link:
      "https://www.amazon.com/s?k=Dancing+in+the+Street+Suzanne+Smith",
  },
  {
    id: 15,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/books/peter-guralnick-american-soul.webp",
    artist: "Peter Guralnick",
    track: "American Soul",
    year: "2020",
    label: "Little Brown",
    link:
      "https://www.amazon.com/s?k=American+Soul+Peter+Guralnick",
  },
];

const BOOKS_PAGE_COUNT = Math.ceil(
  BOOKS.length / BOOKS_PER_PAGE,
);

const BOOKS_PAGES = Array.from(
  { length: BOOKS_PAGE_COUNT },
  (_, index) => index,
);

export default function MallBooks() {
  const [currentPage, setCurrentPage] = useState(0);
  const startX = useRef(null);
  const suppressSwipeClick = useRef(false);

  const showPreviousPage = () => {
    setCurrentPage(
      (page) => (page - 1 + BOOKS_PAGE_COUNT) % BOOKS_PAGE_COUNT,
    );
  };

  const showNextPage = () => {
    setCurrentPage(
      (page) => (page + 1) % BOOKS_PAGE_COUNT,
    );
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX.current = { id: event.pointerId, x: event.clientX };
    suppressSwipeClick.current = false;
  };

  const handlePointerUp = (event) => {
    if (!startX.current || startX.current.id !== event.pointerId) return;
    const delta = event.clientX - startX.current.x;
    startX.current = null;

    if (delta > BOOKS_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showPreviousPage();
    }

    if (delta < -BOOKS_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showNextPage();
    }
  };

  const firstBookIndex = currentPage * BOOKS_PER_PAGE;

  const currentBooks = BOOKS.slice(
    firstBookIndex,
    firstBookIndex + BOOKS_PER_PAGE,
  );

  return (
    <div id="seq3-books" className="seq3-content">
      {/* CAROUSEL................................................................................................... */}

      <div className="books-carousel-container">
        <button
          type="button"
          className="books-btn-prev"
          onClick={showPreviousPage}
        >
          ‹
          <span className="books-arrow-label">
            Précédent
          </span>
        </button>

        <div
          className="books-carousel"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { startX.current = null; }}
          onClickCapture={(event) => {
            if (!suppressSwipeClick.current || event.detail === 0) return;
            event.preventDefault();
            event.stopPropagation();
            suppressSwipeClick.current = false;
          }}
        >
          {currentBooks.map((book) => (
            <div className="mall-card" key={book.id}>
              <div className="mall-card-cover">
                <img
                  src={book.image}
                  loading="lazy"
                  alt={book.artist}
                />
              </div>

              <div className="mall-card-overlay">
                <h3 className="mall-card-title">
                  {book.artist}
                </h3>

                <p className="mall-card-subtitle">
                  {book.track}
                </p>

                <div className="mall-card-infos">
                  <p className="mall-card-line2">
                    {book.year}
                  </p>

                  <p className="mall-card-line3">
                    {book.label}
                  </p>
                </div>

                <a
                  href={book.link}
                  className="mall-card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir le livre
                </a>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="books-btn-next"
          onClick={showNextPage}
        >
          ›
          <span className="books-arrow-label">
            Suivant
          </span>
        </button>
      </div>

      {/* PAGINATION................................................................................................. */}

      <div className="books-dots">
        {BOOKS_PAGES.map((page) => (
          <button
            type="button"
            key={page}
            className={`books-dot ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => setCurrentPage(page)}
            aria-label={`Afficher la page ${page + 1}`}
            aria-current={currentPage === page ? "true" : undefined}
          ></button>
        ))}
      </div>
    </div>
  );
}
