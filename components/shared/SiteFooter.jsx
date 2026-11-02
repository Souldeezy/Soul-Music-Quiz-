import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* INTRODUCTION............................................................................................... */}

      <div className="footer-top">
        <p className="footer-title">
          <strong>Soul Music Quiz</strong>
        </p>

      </div>

      {/* LINKS...................................................................................................... */}

      <div className="footer-center">
        <div className="footer-column">
          <h3>Navigation</h3>

          <Link href="/">Accueil</Link>
          <Link href="/quiz">Quiz</Link>
          <Link href="/artistes">Artistes</Link>
          <Link href="/news">News</Link>
        </div>

        <div className="footer-column">
          <h3>Mentions Légales</h3>

          <Link href="/mentions-legales">
            Mentions Légales
          </Link>

          <Link href="/mentions-legales#site-contact">
            Contact
          </Link>
        </div>

      </div>

      {/* COPYRIGHT.................................................................................................. */}

      <div className="footer-bottom">
        <p>
          © 2026 <strong>SoulMusicQuiz</strong>. Édité avec passion
          par <strong>Deezy</strong>. Propulsé par{" "}
          <strong>Netlify</strong>.
        </p>
      </div>
    </footer>
  );
}
