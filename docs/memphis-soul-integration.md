# Intégration Memphis Soul

## Route et fichiers

Route : `/quiz/memphis-soul`.

Ajouts sous `SMQ` :

1. `app/quiz/memphis-soul/page.jsx` : route, métadonnées et préchargement de l’image du hero.
2. `components/quiz/MemphisSoulPage.jsx` : structure California adaptée aux textes et questions Memphis.
3. `components/quiz/MemphisSoulBanner.jsx` : les deux bannières animées Memphis.
4. `styles/quiz/MemphisSoulPage.module.css` : identité du hero et de la CTA.
5. `styles/quiz/MemphisSoulBanner.module.css` : styles vanilla des bannières isolés par CSS Modules.
6. `data/quizzes/memphis-soul.js` : banque de questions vanilla.
7. `scripts/quiz/audit-memphis.cjs` : contrôle navigateur sur le build de production.
8. `docs/memphis-soul-integration.md` : ce compte rendu.

Un seul fichier binaire a été ajouté : `public/svg/quiz/memphis/banner-top-mississippi-duck/mississippi-studio.png` (copie de `SVG/mississipi.png`). Son SHA-256 est identique. Les autres ressources étaient déjà dans `public`, également vérifiées par SHA-256 :

| Original vanilla | Ressource SMQ |
|---|---|
| `PICTURES/memhpis22.webp` | `public/images/quiz/memphis/hero-memphis.webp` |
| `PICTURES/memphiswalls1.webp` | `public/images/quiz/memphis/cta-memphis.webp` |
| `SVG/duck.svg` | `public/svg/quiz/memphis/banner-top-mississippi-duck/mississippi-duck.svg` |
| `SVG/veale street.png` | `public/svg/quiz/memphis/banner-bottom-beale-street/beale-street.png` |

## Provenance et réutilisation

Le hero reprend le H1 « Memphis Soul » et le sous-titre exact « Bienvenue dans le berceau de Soulsvile USA » (orthographe de la source). Le titre de l’intro du quiz et les 50 questions, propositions, bonnes réponses et explications viennent du vanilla Memphis sans réécriture. Il n’y a pas d’image attachée aux questions dans la banque source. Les messages de fin vanilla sont équivalents à ceux du moteur commun.

La structure, les hauteurs, les espacements, les tailles de police et toutes les règles responsive proviennent directement des composants et du CSS California actuels. Le moteur pur `scripts/quiz/californiaSoulQuiz.js`, le Header, la CTA, le Footer, le logo, les dialogues et les bannières de remplacement sont réutilisés sans modifier leurs fichiers. Les références au nom California dans la classe CTA, dans certains noms de classes CSS et dans l’import du moteur désignent cette structure commune ; les noms des autres villes restent présents dans le menu de navigation.

Les bannières Memphis sont isolées. La première garde le studio Mississippi et ses cinq canards ; la seconde garde l’image Beale Street, les onze lettres de l’enseigne et le délai des icônes. Leurs animations se déclenchent et se réinitialisent aux entrées et sorties du viewport comme dans la source. Elles n’apparaissent qu’aux largeurs prévues par la requête commune California : 1440 px et de 1500 à 1536 px. Les autres largeurs ont la même bannière de remplacement que California.

Les scores utilisent `smq:memphis-soul:lastScore` et `smq:memphis-soul:bestScore` afin de ne pas mélanger les parties avec California, Chicago ou Detroit.

## Contrôles

- `npm run build` : réussi ; route Memphis générée statiquement.
- ESLint ciblé sur les quatre nouveaux fichiers JS/JSX : réussi.
- Banque : égalité JSON exacte avec la version vanilla ; cinq niveaux de dix questions ; chaque bonne réponse figure parmi les propositions.
- Tous les chemins d’images des bannières pointent vers des ressources existantes sous `SMQ/public`.
- Audit navigateur de production : dix formats (320×600, 375×600, 768×600, 1024×768, 1280×800, 1366×768, 1440×900, 1536×864, 1920×1080 et 2580×1440), géométrie par rapport à California, sept seuils de bannières, absence de débordement horizontal, dialogues, sélection des réponses, cinq parties complètes en 375 et cinq en 1440, chacune à 9/10 avec chaque explication vérifiée, recommencement et isolation des scores. Aucune erreur applicative. Rapports et captures dans `.next/memphis-audit/`.
- Le navigateur de test restreint a bloqué le kit Font Awesome global. Contrôle hors sandbox avec accès réseau : les icônes de bannière sont chargées et la console ne signale aucune erreur.
- Empreinte agrégée de tous les fichiers Git suivis et des fichiers Detroit protégés avant et après la mission : `2805409999e50bf0fc688aa7fed5f22a9639c758eb2633fb0ef5be4fdeab1646`.

Pour relancer : démarrer le build sur le port indiqué par `SMQ_AUDIT_URL`, définir `SMQ_PLAYWRIGHT` vers Playwright, puis lancer `node scripts/quiz/audit-memphis.cjs`.
