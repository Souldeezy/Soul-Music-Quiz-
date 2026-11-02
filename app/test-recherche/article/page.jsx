import SiteHeader from "../../../components/shared/SiteHeader";
import styles from "../testRecherche.module.css";

export const metadata = { title: "Soul Food : les plats emblématiques de la cuisine Afro Américaine traditionelle — Contenu temporaire" };

export default function TestArticlePage() {
  return <>
    <SiteHeader />
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.type}>Article</p>
        <h1>Soul Food : les plats emblématiques de la cuisine Afro Américaine traditionelle</h1>
        <p>Cette page est un contenu temporaire utilisé uniquement pour tester la recherche du site SMQ.</p>
      </div>
    </main>
  </>;
}
