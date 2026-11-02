import Link from "next/link";
import styles from "../../styles/quiz/CaliforniaSoulCTA.module.css";

export default function CaliforniaSoulCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.linksColumn}>
        <h2>Poursuivez votre exploration</h2>
        <ul>
          <li><Link href="/quiz">Explorer les Quizzes</Link></li>
          <li><Link href="/artistes">Découvrir les Artistes</Link></li>
          <li><Link href="/news">Lire les News Soul</Link></li>
        </ul>
      </div>

      <div className={styles.description}>
        <p>
          SoulMusicQuiz est un site dédié à la culture Soul US des années <em>60&apos;s 70&apos;s</em> et <em>80&apos;s</em>.
          Explorez une section <strong>Quiz</strong> avec des thèmes variés, cinq niveaux de difficulté et dix
          questions par quiz, soit déjà plus de 300 questions disponibles.
        </p>
        <div className={styles.separator} />
        <p>
          Découvrez également une section <strong>Artistes</strong>, regroupant biographies, liens et ressources
          autour de figures majeures comme d’artistes plus confidentiels, avec plus de 200 profils référencés.
          Enfin, la section <strong>News</strong> propose des articles autour de l’actualité Soul : albums,
          concerts, samples, food et lifestyle.
        </p>
      </div>
    </section>
  );
}
