import SiteHeader from "../../../components/shared/SiteHeader";
import styles from "../testRecherche.module.css";

export const metadata = { title: "Aretha Franklin — Contenu temporaire" };

export default function TestArtistPage() {
  return <>
    <SiteHeader />
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.type}>Artiste</p>
        <h1>Aretha Franklin</h1>
        <p>Cette page est un contenu temporaire utilisé uniquement pour tester la recherche du site SMQ.</p>
      </div>
    </main>
  </>;
}
