# Chicago Soul — intégration React/Next.js

Route : `/quiz/chicago-soul`.

## Isolation et réversibilité

L'intégration ajoute uniquement des fichiers. Aucun fichier existant de California Soul, aucune donnée California, aucun composant partagé et aucun style partagé n'ont été modifiés.

La route explicite `app/quiz/chicago-soul/page.jsx` prend la place du placeholder fourni par `app/quiz/[slug]/page.jsx`, sans modifier ce dernier. Elle isole aussi le chargement du JavaScript Chicago. Retirer les fichiers ajoutés rétablit le placeholder précédent ; aucune ressource existante ne doit être supprimée.

## Fichiers créés

- `app/quiz/chicago-soul/page.jsx` : route, métadonnées vanilla, préchargement du fond, Header/CTA/Footer existants.
- `components/quiz/ChicagoSoulPage.jsx` : Hero, menus, contrôleur du quiz, scores, fenêtres de confirmation.
- `components/quiz/ChicagoSoulBanner.jsx` : bannières basket et pizza, observateurs nettoyés au démontage.
- `data/quizzes/chicago-soul.js` : les 50 questions vanilla, réparties sur cinq niveaux, importées à l'identique.
- `styles/quiz/ChicagoSoulPage.module.css` : uniquement le fond Chicago du Hero et du CTA, et le masquage mobile des images de niveau sans source.
- `styles/quiz/ChicagoSoulBanner.module.css` : styles et animations des bannières Chicago, limités au module.
- `scripts/quiz/audit-chicago.cjs` : contrôles navigateur sur le serveur de production.
- `docs/chicago-soul-integration.md` : ce compte rendu.

Fichiers existants modifiés : **aucun**. Ressources copiées : **aucune**, car les fichiers requis existaient déjà avec des empreintes SHA-256 identiques.

## Provenance

Sources consultées dans la version vanilla : uniquement `Menu Quiz/Quiz Chicago Soul/index.html`, `index.css`, `script.js`, et leurs ressources nécessaires.

| Source vanilla | Ressource SMQ réutilisée |
| --- | --- |
| `PICTURES/Chicago By Night.webp` | `public/images/quiz/chicago/hero-chicago.webp` (Hero et CTA) |
| `SVG/basketball2.svg` | `public/svg/quiz/chicago/banner-top-basketball/basketball.svg` |
| `SVG/pizzaslice.svg` | `public/svg/quiz/chicago/banner-bottom-pizza/pizza-slice.svg` |

Le logo et les cinq illustrations de difficulté réutilisent les ressources communes déjà présentes dans `public/images/shared` et `public/svg/quiz/common`. Aucun chemin runtime ne pointe vers le projet vanilla.

Le H1, le sous-titre « Bienvenue dans la scène Soul de la Windy City », l'introduction du quiz, les titres/textes des bannières, les questions, propositions, réponses et explications proviennent de Chicago. La banque vanilla ne contient pas d'images associées aux questions.

Les rebonds et la rotation du ballon conservent leurs durées et trajectoires vanilla. Les huit parts de pizza conservent leurs positions, leur ordre de disparition aléatoire, leurs durées/délais et le message « Open 24/7 ».

## Réutilisation du modèle California

- Import direct, en lecture seule, de `CaliforniaSoulPage.module.css` pour tous les réglages communs et responsive.
- Import du moteur pur `scripts/quiz/californiaSoulQuiz.js` pour mélanger les questions/propositions, évaluer les réponses et produire les messages de résultat (identiques dans le vanilla Chicago).
- `QuizPage.module.css` pour les logos, l'indication de défilement et les bannières de remplacement.
- `SiteHeader`, `CTASection`, `SiteFooter` restent les composants partagés existants.
- La classe `california-soul-cta` ne sert qu'à réutiliser les proportions et règles responsive validées ; un sélecteur local Chicago remplace uniquement son image de fond et son cadrage.
- Les noms `californiaHeroLogo` et `californiaHeroScroll` sont des références structurelles au CSS existant, pas du contenu California. Le lien « Quiz California Soul » dans le menu est conservé volontairement.

Le contrôleur de page est adapté localement depuis California : mutualiser son JSX aurait nécessité de modifier le composant California interdit par la mission. Les styles et le moteur ne sont pas dupliqués ; les bannières et les données restent strictement Chicago.

Les scores Chicago utilisent `smq:chicago-soul:lastScore` et `smq:chicago-soul:bestScore`, pour ne pas écraser les scores de California. Leur lecture utilise un abonnement au stockage compatible avec le rendu serveur.

Les vrais bandeaux apparaissent suivant **exactement** `BANNER_VIEWPORT_QUERY` : largeur de 1440 px, ou de 1500 à 1536 px inclus. Les autres largeurs, y compris 1920 et 2580, utilisent le composant de remplacement et ses valeurs existantes. Aucun nouveau seuil n'est introduit.

## Vérifications

Le script de contrôle compare les dimensions avec California aux formats 320×600, 375×600, 768×600, 1024×768, 1280×800, 1366×768, 1440×900, 1536×864, 1920×1080 et 2580×1440. Il contrôle également les limites exactes d'affichage des bannières, les interactions des niveaux, la sélection orange, les confirmations, les cinq parcours complets sur mobile et desktop, les explications, les scores, le recommencement et l'absence de débordement horizontal.

Exécution : lancer le serveur de production sur le port de test 3100, puis `node scripts/quiz/audit-chicago.cjs`. Le script utilise un Playwright installé (`SMQ_PLAYWRIGHT` permet de préciser son chemin, sans ajouter de dépendance au site). Les captures et le rapport JSON sont générés dans `.next/chicago-audit`, ignoré par Git.

La parité des 50 données avec la banque vanilla est vérifiée intégralement, pas uniquement sur quelques questions. Aucun audit factuel ni correction éditoriale n'a été effectué : certaines incohérences de la source sont préservées, notamment la question novice sur « Oh Happy Day » dont l'explication indique elle-même un autre interprète, et les formulations différentes concernant les fondateurs de Curtom.

Résultats finaux : `npm run build` réussit et produit `/quiz/chicago-soul` comme route statique. Les 10 formats correspondent au gabarit; aucun débordement horizontal n'a été relevé. Les deux bannières, leurs seuils, et les parcours complets des cinq niveaux en 375 px et 1440 px ont réussi (question, réponse, feedback, score 9/10, recommencer, stockage Chicago distinct). Aucune erreur JavaScript applicative n'a été détectée.

Limite de l'environnement d'audit : le navigateur automatisé ne peut pas récupérer le kit Font Awesome distant (`kit.fontawesome.com`), qui est déjà chargé par le layout partagé du site. Il s'agit d'un accès réseau externe refusé pendant le test, pas d'une ressource manquante dans Chicago; les ressources Chicago proviennent toutes de `/public`.
