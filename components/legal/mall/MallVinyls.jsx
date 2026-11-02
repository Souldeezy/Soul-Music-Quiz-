"use client";

import { useRef, useState } from "react";

const VINYLS_PER_PAGE = 3;
const VINYLS_SWIPE_THRESHOLD = 80;

const VINYLS = [
  {
    id: 1,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/marvin-gaye-whats-going-on.jpg",
    artist: "Marvin Gaye",
    track: "What's Going On",
    album: "What's Going On",
    year: "1971",
    label: "Tamla",
    link: "https://www.discogs.com/master/66631",
  },
  {
    id: 2,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/stevie-wonder-songs-in-the-key-of-life.jpg",
    artist: "Stevie Wonder",
    track: "Songs in the Key of Life",
    album: "Songs in the Key of Life",
    year: "1976",
    label: "Tamla",
    link: "https://www.discogs.com/master/87440",
  },
  {
    id: 3,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/aretha-franklin-i-never-loved-a-man-the-way-i-love-you.jpg",
    artist: "Aretha Franklin",
    track: "I Never Loved a Man the Way I Love You",
    album: "I Never Loved a Man the Way I Love You",
    year: "1967",
    label: "Atlantic",
    link: "https://www.discogs.com/master/122933",
  },
  {
    id: 4,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/otis-redding-the-dock-of-the-bay.jpg",
    artist: "Otis Redding",
    track: "The Dock Of The Bay",
    album: "The Dock Of The Bay",
    year: "1968",
    label: "Volt",
    link: "https://www.discogs.com/fr/master/118069",
  },
  {
    id: 5,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/al-green-lets-stay-together.jpg",
    artist: "Al Green",
    track: "Let's Stay Together",
    album: "Let's Stay Together",
    year: "1972",
    label: "Hi Records",
    link: "https://www.discogs.com/fr/master/141257",
  },
  {
    id: 6,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/curtis-mayfield-super-fly.jpg",
    artist: "Curtis Mayfield",
    track: "Super Fly",
    album: "Super Fly",
    year: "1972",
    label: "Curtom",
    link: "https://www.discogs.com/fr/master/126717",
  },
  {
    id: 7,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/isaac-hayes-shaft.jpg",
    artist: "Isaac Hayes",
    track: "Shaft",
    album: "Shaft",
    year: "1969",
    label: "Enterprise",
    link: "https://www.discogs.com/fr/master/122050",
  },
  {
    id: 8,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/donny-hathaway-everything-is-everything.jpg",
    artist: "Donny Hathaway",
    track: "Everything Is Everything",
    album: "Everything Is Everything",
    year: "1970",
    label: "ATCO",
    link: "https://www.discogs.com/fr/master/119692",
  },
  {
    id: 9,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/teddy-pendergrass-its-time-for-love.jpg",
    artist: "Teddy Pendergrass",
    track: "It's Time For Love",
    album: "It's Time For Love",
    year: "1978",
    label: "Philadelphia International",
    link: "https://www.discogs.com/fr/master/87700",
  },
  {
    id: 10,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/the-isley-brothers-3-plus-3.jpg",
    artist: "The Isley Brothers",
    track: "3 + 3",
    album: "3 + 3",
    year: "1973",
    label: "T-Neck",
    link: "https://www.discogs.com/fr/master/82584",
  },
  {
    id: 11,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/the-o-jays-ship-ahoy.jpg",
    artist: "The O'Jays",
    track: "Ship Ahoy",
    album: "Ship Ahoy",
    year: "1973",
    label: "Philadelphia International",
    link: "https://www.discogs.com/fr/master/129503",
  },
  {
    id: 12,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/martha-and-the-vandellas-dance-party.jpg",
    artist: "Martha & The Vandellas",
    track: "Dance Party",
    album: "Dance Party",
    year: "1965",
    label: "Gordy",
    link: "https://www.discogs.com/fr/master/193411",
  },
  {
    id: 13,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/wilson-pickett-the-exciting-wilson-pickett.jpg",
    artist: "Wilson Pickett",
    track: "The Exciting Wilson Pickett",
    album: "The Exciting Wilson Pickett",
    year: "1966",
    label: "Atlantic",
    link: "https://www.discogs.com/fr/master/49025",
  },
  {
    id: 14,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/ann-peebles-i-cant-stand-the-rain.jpg",
    artist: "Ann Peebles",
    track: "I Can't Stand The Rain",
    album: "I Can't Stand The Rain",
    year: "1974",
    label: "Hi Records",
    link: "https://www.discogs.com/fr/master/137002",
  },
  {
    id: 15,
    image:
      "/images/legal/banner-bottom-nyc-games/mall/vinyls/sam-and-dave-soul-men.jpg",
    artist: "Sam & Dave",
    track: "Soul Men",
    album: "Soul Men",
    year: "1967",
    label: "Stax",
    link: "https://www.discogs.com/fr/master/49153",
  },
];

const VINYLS_PAGE_COUNT = Math.ceil(
  VINYLS.length / VINYLS_PER_PAGE,
);

const VINYLS_PAGES = Array.from(
  { length: VINYLS_PAGE_COUNT },
  (_, index) => index,
);

export default function MallVinyls() {
  const [currentPage, setCurrentPage] = useState(0);
  const startX = useRef(null);
  const suppressSwipeClick = useRef(false);

  const showPreviousPage = () => {
    setCurrentPage(
      (page) =>
        (page - 1 + VINYLS_PAGE_COUNT) % VINYLS_PAGE_COUNT,
    );
  };

  const showNextPage = () => {
    setCurrentPage(
      (page) => (page + 1) % VINYLS_PAGE_COUNT,
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

    if (delta > VINYLS_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showPreviousPage();
    }

    if (delta < -VINYLS_SWIPE_THRESHOLD) {
      suppressSwipeClick.current = true;
      showNextPage();
    }
  };

  const firstVinylIndex = currentPage * VINYLS_PER_PAGE;

  const currentVinyls = VINYLS.slice(
    firstVinylIndex,
    firstVinylIndex + VINYLS_PER_PAGE,
  );

  return (
    <div id="seq3-vinyls" className="seq3-content">

      {/* CAROUSEL................................................................................................... */}

      <div className="vinyls-carousel-container">
        <button
          type="button"
          className="vinyls-btn-prev"
          onClick={showPreviousPage}
        >
          ‹
          <span className="vinyls-arrow-label">
            Précédent
          </span>
        </button>

        <div
          className="vinyls-carousel"
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
          {currentVinyls.map((vinyl) => (
            <div className="mall-card" key={vinyl.id}>
              <div className="mall-card-cover">
                <img
                  src={vinyl.image}
                  loading="lazy"
                  alt={vinyl.artist}
                />
              </div>

              <div className="mall-card-overlay">
                <h3 className="mall-card-title">
                  {vinyl.artist}
                </h3>

                <p className="mall-card-subtitle">
                  {vinyl.track}
                </p>

                <div className="mall-card-infos">
                  <p className="mall-card-line2">
                    {vinyl.year}
                  </p>

                  <p className="mall-card-line3">
                    {vinyl.label}
                  </p>
                </div>

                <a
                  href={vinyl.link}
                  className="mall-card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir le disque
                </a>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="vinyls-btn-next"
          onClick={showNextPage}
        >
          ›
          <span className="vinyls-arrow-label">
            Suivant
          </span>
        </button>
      </div>

      {/* PAGINATION................................................................................................. */}

      <div className="vinyls-dots">
        {VINYLS_PAGES.map((page) => (
          <button
            type="button"
            key={page}
            className={`vinyls-dot ${
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
