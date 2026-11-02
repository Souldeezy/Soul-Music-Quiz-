// Contenu éditorial des pages News. Ajouter une entrée par slug ;
// le composant NewsArticleTemplate conserve la structure et la présentation communes.
import { remainingArticleProfiles } from "./remainingArticles.js";

const baseArticleProfiles = {
  "soul-food-chicken-waffles": {
    slug: "soul-food-chicken-waffles",
    title: "Chicken & Waffles : un duo emblématique de la Soul Food",
    metaTitle: "Chicken & Waffles : histoire et recette Soul Food | SMQ",
    cardTitle: "Chicken & Waffles : l’histoire d’un duo devenu un classique de la Soul Food",
    description: "Poulet frit, gaufre chaude : retour sur l’histoire des Chicken & Waffles et quelques conseils pour les préparer chez soi.",
    category: { label: "Soul Food", href: "/news#category-soul-food" },
    author: "Deezy",
    publishedAt: "2026-09-12",
    publishedLabel: "12 septembre 2026",
    updatedLabel: "15 octobre 2026",
    returnHref: "/news#category-soul-food",
    listingImage: "/images/news/articles/soul-food/soul-food-chicken-waffles/chicken-waffles-hero-v2.webp",
    listingAlt: "Chicken & Waffles, poulet frit et gaufres inspirés de la Soul Food",
    photos: {
      hero: {
        src: "/images/news/articles/soul-food/soul-food-chicken-waffles/chicken-waffles-hero-v2.webp",
        alt: "Poulet frit servi avec une gaufre",
        caption: "Poulet frit et gaufre réunis dans un classique de la Soul Food.",
        width: 1280,
        height: 1920,
      },
      leftTop: {
        src: "/images/news/articles/soul-food/soul-food-chicken-waffles/chicken-waffles-left-top.webp",
        alt: "Préparation de la pâte à gaufres maison",
        caption: "Confection de la pâte à gaufres maison.",
        width: 640,
        height: 427,
      },
      leftBottom: {
        src: "/images/news/articles/soul-food/soul-food-chicken-waffles/chicken-waffles-left-bottom.webp",
        alt: "Morceaux de poulet frit égouttés sur une grille",
        caption: "Le poulet frit repose sur une grille pour rester croustillant.",
        width: 3336,
        height: 5000,
      },
      rightTall: {
        src: "/images/news/articles/soul-food/soul-food-chicken-waffles/chicken-waffles-right-tall.webp",
        alt: "Poulet frit et gaufres nappés de sirop d’érable",
        caption: "Poulet frit et gaufres nappés de sirop d’érable, au cœur du duo Chicken & Waffles.",
        width: 1440,
        height: 2160,
      },
    },
    intro: {
      before: "Du poulet frit, une gaufre chaude, parfois un peu de miel ou de sirop : les Chicken & Waffles, c’est un mélange qui peut surprendre la première fois. Pourtant, le croustillant du poulet et le moelleux de la gaufre vont très bien ensemble. On les retrouve aujourd’hui sur beaucoup de cartes américaines, mais ce plat raconte aussi une histoire liée à la Soul Food et aux cuisines afro-américaines. Pour comprendre d’où vient cet héritage, on peut commencer par ",
      anchor: "l’histoire de la Soul Food aux États-Unis",
      href: "https://www.lemonde.fr/m-styles/article/2021/05/26/la-soul-food-l-heritage-culinaire-des-afro-americains-irrigue-paris_6081450_4497319.html",
      after: ".",
    },
    blocks: [
      { type: "heading", text: "L’histoire des Chicken & Waffles dans la Soul Food" },
      { type: "paragraphs", items: [
        { before: "La Soul Food ne correspond pas à une seule recette ni à une cuisine uniforme. Elle s’est construite au fil du temps, surtout dans le Sud des États-Unis, avec des ingrédients locaux, des savoir-faire africains et des influences venues d’autres traditions. Son histoire est aussi inséparable de l’esclavage et des conditions imposées aux personnes afro-américaines. Malgré cela, les familles ont transmis leurs gestes et adapté les plats aux ingrédients disponibles. Le poulet frit fait partie de cette histoire, comme le raconte aussi ", anchor: "Le Monde à propos du poulet frit, emblème de la Soul Food", href: "https://www.lemonde.fr/le-monde-passe-a-table/article/2023/03/12/passion-poulet-frit-cette-nourriture-de-l-ame-venue-des-etats-unis_6165168_6082232.html", after: "." },
        "Maïs, riz, haricots, patates douces et légumes-feuilles reviennent souvent, mais leur préparation change d’une région à l’autre. Une recette familiale du Mississippi ne sera pas forcément celle qu’on sert à La Nouvelle-Orléans ou à Chicago. C’est justement ce qui rend la Soul Food difficile à enfermer dans une liste de plats.",
        "Au XXᵉ siècle, la Grande Migration a conduit de nombreuses familles du Sud vers les grandes villes du Nord et de l’Ouest. Elles ont emporté leurs habitudes culinaires et les ont fait évoluer dans leurs nouveaux quartiers. Les restaurants sont devenus des lieux où retrouver ces saveurs, mais aussi les faire découvrir à d’autres.",
        "Le terme « Soul Food » s’est popularisé dans les années 1960, dans un contexte où la culture noire américaine affirmait sa place. Depuis, cette cuisine continue de bouger. Les recettes se transmettent, changent selon les familles et s’invitent dans des restaurants contemporains. Les Chicken & Waffles sont l’un des plats qui ont voyagé avec cette histoire.",
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Wells Supper Club : le succès des Chicken & Waffles à Harlem" },
      { type: "paragraphs", items: [
        "Dans une assiette, le principe est simple : du poulet frit avec une gaufre, parfois accompagné de beurre, de miel ou de sirop. Le contraste entre le salé et le sucré plaît, mais chacun ajuste la garniture à son goût. Certains préfèrent une sauce relevée ; d’autres gardent la gaufre presque nature.",
        { before: "Le plat est souvent associé à Harlem et au Wells Supper Club, restaurant réputé pour accueillir des musiciens et des noctambules. On y servait des Chicken & Waffles à ceux qui voulaient manger après les concerts ou les clubs. Le lieu a contribué à faire connaître cette association, sans qu’on puisse lui attribuer avec certitude son invention. Son histoire est racontée dans ce retour sur le ", anchor: "Wells Supper Club et les Chicken & Waffles à Harlem", href: "https://www.pbs.org/food/stories/history-chicken-and-waffles", after: "." },
        "Avec le temps, le duo a dépassé les restaurants de Harlem. On le trouve aujourd’hui dans des diners, des brunchs et des adresses spécialisées, avec des versions qui varient selon les cuisiniers. L’idée reste la même : réunir deux plats familiers dans une assiette généreuse.",
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Réussir des Chicken & Waffles à la maison" },
      { type: "paragraphs", items: [
        "Pour les préparer à la maison, commencez par assaisonner le poulet. Une marinade au babeurre est souvent utilisée pour parfumer la viande ; paprika, poivre, ail ou piment donnent ensuite le caractère de la panure. Laissez le poulet mariner au frais, puis préparez la pâte à gaufres pendant ce temps.",
        "La panure doit bien accrocher, sans devenir trop épaisse. Faites cuire les morceaux jusqu’à ce qu’ils soient dorés et cuits à cœur, puis posez-les sur une grille : ils resteront plus croustillants que dans une assiette où la vapeur s’accumule. La taille des morceaux change le temps de cuisson, alors mieux vaut vérifier plutôt que se fier uniquement à la minuterie.",
        "Pour les gaufres, mélangez la pâte juste assez pour incorporer les ingrédients. Si elle est trop travaillée, le résultat risque d’être dense. Faites chauffer le gaufrier à l’avance et gardez les gaufres cuites sur une grille, sans les empiler. Elles resteront ainsi moelleuses à l’intérieur et dorées à l’extérieur.",
        "Servez le tout dès que c’est prêt. Beurre, miel, sirop ou sauce piquante : choisissez l’accompagnement selon vos envies, sans recouvrir complètement le goût du poulet et de la gaufre. Une salade ou quelques fruits peuvent aussi apporter un peu de fraîcheur à l’assiette.",
        "Au fond, il n’y a pas une seule bonne façon de faire les Chicken & Waffles. Gardez le contraste entre poulet croustillant et gaufre tendre, puis adaptez les épices et la garniture. C’est un plat généreux, facile à partager et qui laisse de la place aux variantes.",
      ] },
    ],
    outro: "Des cuisines familiales du Sud aux tables de Harlem, les Chicken & Waffles ont parcouru bien du chemin. Aujourd’hui, on les prépare de mille façons, mais le plaisir reste le même : une gaufre moelleuse, du poulet bien croustillant et une garniture à choisir selon ses goûts. Ce plat n’a pas besoin d’une recette figée : on peut changer les épices, la cuisson ou l’accompagnement tout en gardant le contraste qui fait son charme. Et si l’histoire du duo est liée à des lieux et à des habitudes bien précis, sa popularité tient aussi à cette liberté — chacun peut l’adapter à sa table.",
  },
  "soul-food-hoppin-john": {
    slug: "soul-food-hoppin-john",
    title: "Hoppin’ John : le plat du Nouvel An au cœur de la Soul Food du Sud",
    metaTitle: "Hoppin’ John : histoire d’un plat de Soul Food du Sud | SMQ",
    cardTitle: "Hoppin’ John : riz, black-eyed peas et tradition du Nouvel An",
    description: "Riz, black-eyed peas et parfois porc fumé : découvrez l’histoire du Hoppin’ John, plat du Lowcountry associé au Nouvel An et à la Soul Food.",
    category: { label: "Soul Food", href: "/news#category-soul-food" },
    author: "Deezy",
    publishedAt: "2026-10-23",
    publishedLabel: "23 octobre 2026",
    updatedLabel: "23 octobre 2026",
    returnHref: "/news#category-soul-food",
    listingImage: "/images/news/articles/soul-food/soul-food-hoppin-john/soul-food-hoppin-john-hero.webp",
    listingAlt: "Bol de Hoppin’ John parmi plusieurs spécialités du Sud des États-Unis",
    photos: {
      hero: {
        src: "/images/news/articles/soul-food/soul-food-hoppin-john/soul-food-hoppin-john-hero.webp",
        alt: "Bol de Hoppin’ John servi avec d’autres plats inspirés de la cuisine du Sud américain",
        caption: "Un bol de Hoppin’ John au milieu d’autres spécialités du Sud américain.",
        width: 2560,
        height: 3840,
      },
      leftTop: {
        src: "/images/news/articles/soul-food/soul-food-hoppin-john/soul-food-hoppin-john-left-top.webp",
        alt: "Riz et pois servis ensemble dans une assiette",
        caption: "Riz et black-eyed peas : la base traditionnelle du Hoppin’ John.",
        width: 4608,
        height: 3072,
      },
      leftBottom: {
        src: "/images/news/articles/soul-food/soul-food-hoppin-john/soul-food-hoppin-john-left-bottom.webp",
        alt: "Feuilles vertes de collard greens avant préparation",
        caption: "Les feuilles de collard greens, souvent servies en accompagnement.",
        width: 7360,
        height: 4912,
      },
      rightTall: {
        src: "/images/news/articles/soul-food/soul-food-hoppin-john/soul-food-hoppin-john-right-tall.webp",
        alt: "Gros plan sur des black-eyed peas secs",
        caption: "Les black-eyed peas, très utilisés dans les versions actuelles du plat.",
        width: 2304,
        height: 4096,
      },
    },
    intro: {
      before: "Au Nouvel An, dans le Lowcountry de Caroline du Sud, on sert souvent du Hoppin’ John : du riz, des pois fondants et parfois du porc fumé. La recette varie d’une famille à l’autre, mais elle reste liée aux cuisines afro-américaines du Sud et à la Soul Food. Voici comment ce plat est devenu un classique des tables du 1er janvier. Les ",
      anchor: "variantes du Hoppin’ John en Caroline du Sud",
      href: "https://www.scencyclopedia.org/sce/entries/hoppin-john/",
      after: " racontent cette évolution.",
    },
    blocks: [
      { type: "heading", text: "Les origines du Hoppin’ John dans le Lowcountry" },
      { type: "paragraphs", items: [
        "Le Hoppin’ John vient du Lowcountry, la région côtière de Caroline du Sud autour de Charleston. Le riz y occupe une place ancienne, et son histoire est inséparable du travail forcé des Africains réduits en esclavage, qui ont apporté des savoir-faire agricoles essentiels. Parler de cette cuisine, c’est aussi rappeler les conditions violentes dans lesquelles ces traditions se sont développées.",
        { before: "Les recettes du Lowcountry portent la marque de savoir-faire africains et afro-américains, transmis puis adaptés au fil du temps. Il est difficile de désigner une origine unique au Hoppin’ John. Les black-eyed peas, eux aussi, ont une histoire qui relie plusieurs continents, racontée dans cet aperçu de leur ", anchor: "parcours entre l’Afrique et les Amériques", href: "https://africarenewal.un.org/fr/magazine/doliques-oeil-noir-un-gout-dafrique-aux-ameriques", after: "." },
        "Une recette appelée « Hopping John » apparaît dans *The Carolina House-wife*, publié en 1847 : elle associe riz, pois rouges et bacon. D’autres versions utilisent des pois de champ ou des black-eyed peas. Quant au nom du plat, son origine reste discutée — et les recettes n’ont jamais été tout à fait les mêmes partout.",
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Le Hoppin’ John : riz, pois et variantes régionales" },
      { type: "paragraphs", items: [
        "La base ne change pas : du riz et des pois. Les black-eyed peas sont aujourd’hui les plus souvent associés au plat, mais d’anciennes recettes de Caroline du Sud parlent aussi de pois rouges ou de pois de champ. Le choix dépend des habitudes familiales et de ce qu’on a sous la main.",
        "On ajoute parfois du porc salé, du bacon ou du jambon fumé, avec de l’oignon et du poivron. Il existe aussi des versions sans viande. Certaines recettes font cuire le riz dans le bouillon des pois ; d’autres le servent à part. Les deux méthodes fonctionnent, à condition de ne pas transformer le riz en bouillie.",
        "Les pois doivent être tendres, mais garder leur forme. Si le riz cuit séparément, on maîtrise plus facilement sa texture ; dans une marmite unique, il faut surveiller le liquide et le temps de cuisson. Un peu de céleri ou de poivre peut relever le tout, mais la recette n’a pas besoin d’une longue liste d’ingrédients.",
        { before: "À côté, on sert souvent des collard greens, longuement mijotés, ou du cornbread. Le riz, les pois et les légumes verts font un repas complet, avec des textures qui se répondent. Ces plats accompagnent parfois le Hoppin’ John au Nouvel An, une tradition évoquée dans cette présentation des ", anchor: "plats afro-américains du Nouvel An", href: "https://nmaahc.si.edu/events/freedoms-eve-traditional-dishes-bring-new-year", after: "." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Hoppin’ John et porte-bonheur du Nouvel An" },
      { type: "paragraphs", items: [
        "La coutume veut que le Hoppin’ John porte chance lorsqu’on le mange le 1er janvier. Les pois rappelleraient des pièces, les légumes verts des billets et le cornbread l’or. Ces symboles se transmettent avec des variantes, mais leur origine exacte est difficile à établir et toutes les familles ne les suivent pas.",
        "Le repas réunit souvent Hoppin’ John, collard greens et cornbread. Au-delà des croyances autour de la prospérité, c’est aussi un moment pour se retrouver et ressortir une recette de famille. La tradition garde son sens sans qu’il soit nécessaire d’en faire une règle.",
        "Il reste ensuite à faire son assiette comme on l’aime : plus ou moins de bouillon, pois rouges ou black-eyed peas, avec ou sans porc fumé. Riz et pois restent au centre ; les accompagnements, eux, changent selon les maisons.",
      ] },
    ],
    outro: "Un plat de riz et de pois, une tradition du Nouvel An, et autant de recettes que de familles : le Hoppin’ John garde une place particulière dans la cuisine du Lowcountry. Avec des collard greens ou un morceau de cornbread, il se partage simplement, sans recette figée. On peut le préparer avec les pois disponibles, ajuster le bouillon et choisir ou non d’y ajouter du porc fumé. Ce qui compte, c’est surtout le plat posé au centre de la table et le rituel qui l’accompagne au début de l’année. Les restes se réchauffent facilement le lendemain ; certains les font même revenir à la poêle pour obtenir un fond légèrement croustillant. Là encore, chaque maison a son petit truc. C’est aussi une bonne façon d’utiliser les restes de riz et de pois sans perdre leur caractère.",
  },
  "soul-food-mac-n-cheese": {
    slug: "soul-food-mac-n-cheese",
    title: "Mac and Cheese : les secrets d’un plat incontournable de la Soul Food",
    metaTitle: "Mac and Cheese : histoire et héritage Soul Food | SMQ",
    cardTitle: "Mac and Cheese : un classique américain au cœur de la Soul Food",
    description: "De James Hemings aux tables familiales afro-américaines, découvrez l’histoire du mac and cheese, ses variantes et les secrets d’un gratin généreux.",
    category: { label: "Soul Food", href: "/news#category-soul-food" },
    author: "Deezy",
    publishedAt: "2026-10-23",
    publishedLabel: "23 octobre 2026",
    updatedLabel: "23 octobre 2026",
    returnHref: "/news#category-soul-food",
    listingImage: "/images/news/articles/soul-food/soul-food-mac-n-cheese/soul-food-mac-n-cheese-hero.webp",
    listingAlt: "Mac and cheese crémeux servi dans un plat avec une cuillère",
    photos: {
      hero: {
        src: "/images/news/articles/soul-food/soul-food-mac-n-cheese/soul-food-mac-n-cheese-hero.webp",
        alt: "Mac and cheese crémeux dans une assiette blanche, prêt à être dégusté",
        caption: "Un mac and cheese crémeux servi bien chaud.",
        width: 3024,
        height: 4032,
      },
      leftTop: {
        src: "/images/news/articles/soul-food/soul-food-mac-n-cheese/soul-food-mac-n-cheese-left-top.webp",
        alt: "Macaroni au fromage dans un bol sombre, avec une sauce brillante",
        caption: "Crémeux, gratiné ou relevé : le mac and cheese se prête à bien des variantes.",
        width: 5464,
        height: 8192,
      },
      leftBottom: {
        src: "/images/news/articles/soul-food/soul-food-mac-n-cheese/soul-food-mac-n-cheese-left-bottom.webp",
        alt: "Macaroni au fromage gratiné dans un grand plat de cuisson",
        caption: "Le gratin sort du four avec une surface dorée et croustillante.",
        width: 3149,
        height: 3799,
      },
      rightTall: {
        src: "/images/news/articles/soul-food/soul-food-mac-n-cheese/soul-food-mac-n-cheese-right-tall.webp",
        alt: "Plat de mac and cheese servi avec d’autres accompagnements",
        caption: "Le mac and cheese prend place au milieu d’un repas complet.",
        width: 4000,
        height: 6000,
      },
    },
    intro: {
      before: "Crémeux à la casserole ou couvert d’une croûte dorée, le mac and cheese n’a pas une seule recette. Aux États-Unis, il passe des repas de famille aux grandes tablées de Soul Food, parfois fait maison, parfois tout droit sorti d’une boîte. Et son histoire ne se résume pas à un inventeur : ",
      anchor: "l’histoire du mac and cheese américain",
      href: "https://www.courrierinternational.com/article/le-courrier-des-recettes-le-mac-and-cheese-facile-et-reconfortant",
      after: " mêle plusieurs récits et ne se résume pas à un seul inventeur.",
    },
    blocks: [
      { type: "heading", text: "Les origines du Mac and Cheese avant la Soul Food" },
      { type: "paragraphs", items: [
        "Pâtes et fromage sont réunis dans des recettes européennes bien avant que le mac and cheese devienne un classique américain. Impossible, donc, d’en attribuer l’invention à une seule personne. Au fil du temps, on passe des pâtes assemblées en couches aux sauces crémeuses, puis aux versions gratinées au four.",
        { before: "Thomas Jefferson a contribué à faire connaître les macaronis après ses voyages en Europe. Mais l’histoire ne s’arrête pas à lui : James Hemings, cuisinier afro-américain qu’il a réduit en esclavage, s’est formé à Paris et a travaillé dans ses cuisines. Son ", anchor: "parcours de cuisinier formé en France", href: "https://www.monticello.org/jameshemings/", after: " rappelle le rôle qu’on oublie souvent lorsqu’on raconte l’arrivée de ce plat aux États-Unis." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Le Mac and Cheese sur les tables de fête" },
      { type: "paragraphs", items: [
        { before: "Dans les cuisines afro-américaines, les macaronis au fromage ont trouvé leur place dans les repas de fête et les grandes tablées. Chaque famille a ses habitudes : sauce bien lisse, plusieurs fromages ou dessus gratiné. Pour une version au four, on peut aussi s’inspirer de ce ", anchor: "gratin de macaronis au fromage", href: "https://www.routard.com/fr/mag/dossier/a/recette-du-gratin-de-macaronis-mac-and-cheese", after: "." },
        "Au XXᵉ siècle, les versions en boîte ont rendu le plat rapide et peu coûteux. Elles sont devenues un classique à part entière, sans faire disparaître les recettes maison. Selon la table, le mac and cheese sera crémeux, gratiné ou préparé en quelques minutes — et chacun a souvent son préféré.",
        "Le mac and cheese n’est pas toute la Soul Food, bien sûr. Mais il se retrouve à côté des légumes verts, du cornbread, du riz ou des haricots dans de nombreux repas. Son histoire mêle adaptation, cuisine du quotidien et recettes qu’on ressort pour les grandes occasions.",
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Un Mac and Cheese crémeux et bien gratiné" },
      { type: "paragraphs", items: [
        "Pour une version simple, il faut des pâtes courtes et une sauce au fromage. Les macaronis en coude accrochent bien la sauce, mais d’autres formes font l’affaire. Si le plat doit passer au four, arrêtez la cuisson des pâtes un peu avant qu’elles soient tendres : elles continueront à cuire dans le gratin.",
        "La sauce peut partir d’un roux au beurre et à la farine, auquel on ajoute du lait puis du fromage râpé. Le cheddar donne du goût ; un fromage plus doux permet de l’équilibrer. Ajoutez le fromage progressivement, à feu modéré, et évitez de faire bouillir la sauce : elle restera plus lisse.",
        "Pour le dessus, un peu de chapelure ou de fromage supplémentaire suffit à obtenir une croûte dorée. Gardez un œil sur le four : le but est de gratiner la surface sans sécher le milieu. Servez le plat seul ou avec des légumes verts, selon le menu.",
      ] },
    ],
    outro: "Le mac and cheese a changé de forme au fil du temps : en boîte pour un repas rapide, crémeux à la casserole ou bien gratiné pour une grande tablée. Sa recette reste facile à adapter, et c’est sans doute ce qui lui a permis de garder sa place dans les cuisines familiales et la Soul Food. On peut changer le fromage, cuire les pâtes un peu moins longtemps avant de les passer au four, ajouter une pointe de moutarde ou laisser la croûte faire tout le travail. Chaque choix modifie le résultat : une sauce plus fluide enrobe mieux les pâtes, tandis qu’un gratin bien doré apporte une texture qui contraste avec le cœur fondant. Il existe des versions très riches pour les grandes occasions et d’autres plus simples pour accompagner un repas de semaine. Rien n’oblige non plus à suivre une liste d’ingrédients au gramme près ; les recettes de famille se règlent souvent au goût, à l’œil et selon ce qu’il y a dans le placard. C’est un plat accueillant, qui se prépare facilement en quantité et supporte bien les variations. À chacun de décider s’il préfère la casserole crémeuse, le dessus croustillant ou un peu des deux. Pour le réchauffer sans le dessécher, ajoutez un trait de lait et couvrez le plat quelques minutes. La sauce retrouve du liant, et le fromage peut dorer à nouveau en fin de cuisson. Un passage sous le gril, juste avant de servir, redonne du croustillant au dessus.",
  },
  "soul-food-cornbread": {
    slug: "soul-food-cornbread",
    title: "Cornbread : le pain de maïs emblématique de la Soul Food du Sud",
    metaTitle: "Cornbread : le pain de maïs de la Soul Food | SMQ",
    cardTitle: "Cornbread : le pain de maïs emblématique de la Soul Food du Sud",
    description: "Pain de maïs servi avec les plats du Sud, le cornbread existe en versions moelleuses ou croustillantes. Découvrez ses usages et ses variantes dans la Soul Food.",
    category: { label: "Soul Food", href: "/news#category-soul-food" },
    author: "Deezy",
    publishedAt: "2026-10-26",
    publishedLabel: "26 octobre 2026",
    updatedLabel: "26 octobre 2026",
    returnHref: "/news#category-soul-food",
    listingImage: "/images/news/articles/soul-food/soul-food-cornbread/soul-food-cornbread-hero.webp",
    listingAlt: "Carrés de cornbread dorés, pain de maïs du Sud des États-Unis",
    photos: {
      hero: {
        src: "/images/news/articles/soul-food/soul-food-cornbread/soul-food-cornbread-hero.webp",
        alt: "Carrés de pain de maïs dorés, servis en accompagnement",
        caption: "Le cornbread, un pain de maïs simple à partager à table.",
        width: 2200,
        height: 2200,
      },
      leftTop: {
        src: "/images/news/articles/soul-food/soul-food-cornbread/soul-food-cornbread-left-top.webp",
        alt: "Petits pains de maïs individuels tout juste cuits",
        caption: "En portions individuelles, le pain de maïs forme une croûte bien dorée.",
        width: 1600,
        height: 898,
      },
      leftBottom: {
        src: "/images/news/articles/soul-food/soul-food-cornbread/soul-food-cornbread-left-bottom.webp",
        alt: "Pâte jaune au maïs versée dans un plat avant cuisson",
        caption: "La pâte au maïs est prête à passer au four.",
        width: 1600,
        height: 1067,
      },
      rightTall: {
        src: "/images/news/articles/soul-food/soul-food-cornbread/soul-food-cornbread-right-tall.webp",
        alt: "Épis de maïs frais, ingrédient au cœur du cornbread",
        caption: "Le maïs, ingrédient central de ce pain emblématique du Sud.",
        width: 1500,
        height: 2000,
      },
    },
    intro: {
      before: "Un carré doré, encore tiède, posé à côté d’un plat mijoté : le cornbread accompagne souvent les repas du Sud des États-Unis. Il peut être friable ou moelleux, peu sucré ou légèrement doux, cuit au four ou à la poêle. Pour vous lancer, voici une ",
      anchor: "recette de cornbread, le pain de maïs américain",
      href: "https://www.radiofrance.fr/franceinter/la-recette-du-pain-de-mais-cornbread-4139539",
      after: " est un bon point de départ. Derrière cette préparation familière se trouve aussi une histoire de produits locaux, de transmissions et de cuisines afro-américaines.",
    },
    blocks: [
      { type: "heading", text: "Le Cornbread et les traditions du pain de maïs du Sud" },
      { type: "paragraphs", items: [
        "La base, c’est de la farine ou de la semoule de maïs, parfois mélangée à du blé. Après, tout dépend de la mouture et de la recette : certains cornbreads sont denses et peu sucrés, d’autres plus souples grâce au babeurre ou à l’œuf. Ce pain fait partie des accompagnements familiers de la Soul Food.",
        { before: "Le maïs était déjà cultivé et cuisiné sur le continent américain bien avant la colonisation européenne. Dans le Sud, il est devenu un ingrédient pratique et polyvalent. Les cuisiniers afro-américains ont adapté les recettes aux produits disponibles et aux habitudes locales. On retrouve cette histoire dans ", anchor: "les traditions afro-américaines autour du pain de maïs", href: "https://www.persee.fr/doc/polaf_0244-7827_1984_num_15_1_3720", after: "." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Du Cornbread moelleux aux galettes croustillantes" },
      { type: "paragraphs", items: [
        { before: "Le cornbread peut sortir du four en grand plat, puis être découpé en carrés. Le hot water cornbread, lui, se façonne en petites galettes avec de la semoule et de l’eau chaude avant d’être frit. Certaines recettes cuisent aussi dans une poêle en fonte. Ces versions sont décrites dans ce récit consacré au ", anchor: "cornbread du Sud des États-Unis", href: "https://www.courrierinternational.com/article/recettes-dailleurs-le-cornbread-embleme-du-sud-des-etats-unis", after: "." },
        "Un peu de babeurre donne de l’acidité et du moelleux ; la levure aide la pâte à lever. Il vaut mieux ne pas trop la mélanger, sous peine d’obtenir un pain compact. Le sucre divise : certaines familles n’en mettent presque pas, d’autres en ajoutent une petite quantité. On trouve aussi des versions avec jalapeños, maïs ou fromage.",
        "Le moule change lui aussi le résultat. Dans une poêle en fonte bien chaude, les bords prennent une croûte brune ; dans un plat, la mie reste plus uniforme. Petites galettes, carrés ou parts épaisses : chacun a sa façon de le servir.",
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Servir le Cornbread avec un repas de Soul Food" },
      { type: "paragraphs", items: [
        "À table, le cornbread accompagne bien les haricots, les légumes verts, les plats de riz et le gumbo. Sa mie récupère le jus et tempère les sauces épicées. Encore tiède, il se mange aussi avec du beurre, un filet de miel ou un peu de mélasse.",
        "Pour une pâte maison, mélangez farine de maïs, un peu de farine de blé, sel et levure, puis ajoutez lait ribot, œuf et matière grasse. Arrêtez dès que la pâte est homogène. Versez-la dans un moule chaud et légèrement huilé, puis laissez cuire jusqu’à ce que le dessus soit pris et bien doré.",
        "Vous le préférez friable ? Augmentez la part de farine de maïs. Pour une mie plus tendre, le babeurre aide. Et si vous aimez les bords croustillants, faites cuire la pâte en petites portions. Les recettes de cornbread se prêtent bien à ces ajustements.",
      ] },
    ],
    outro: "Au four ou à la poêle, en grands carrés ou en petites galettes, le cornbread change selon les cuisines et les habitudes. Il n’a pas besoin d’être compliqué : un peu de maïs, une croûte dorée et une place à côté du plat principal suffisent souvent. On peut le servir chaud, avec du beurre, ou le laisser refroidir avant de le couper. Une pâte plus épaisse donne une mie compacte ; une préparation plus légère se rapproche d’un gâteau salé. Le babeurre apporte du moelleux et une légère acidité, tandis qu’une cuisson à la poêle donne une croûte marquée. Certaines familles aiment leur pain de maïs peu sucré, d’autres ajoutent une touche de miel ou de sucre. Ces différences racontent des habitudes régionales autant que des préférences personnelles. Le cornbread accompagne volontiers les plats mijotés, les haricots et les légumes verts, mais il se suffit aussi à lui-même quand il sort encore tiède du four. C’est une recette modeste, facile à reprendre et à faire évoluer sans perdre ce qui la rend reconnaissable : le goût du maïs et une texture qui absorbe bien les sauces. Pour éviter qu’il ne s’émiette trop, laissez-le reposer quelques minutes après la cuisson avant de le couper. Les morceaux se tiennent mieux et gardent leur cœur tendre. Une poêle en fonte bien chaude aide à obtenir une croûte encore plus dorée. Servez-le chaud, coupé en parts, pendant que le beurre fond encore.",
  },
  "soul-food-sweet-potato-pie": {
    slug: "soul-food-sweet-potato-pie",
    title: "La Sweet Potato Pie, une douceur bien ancrée dans les traditions afro-américaines",
    metaTitle: "Sweet Potato Pie : tarte à la patate douce et Soul Food | SMQ",
    cardTitle: "La Sweet Potato Pie, une douceur bien ancrée dans les traditions afro-américaines",
    description: "Patate douce rôtie, épices et pâte croustillante : découvrez la sweet potato pie, dessert familial associé aux tables afro-américaines et aux fêtes du Sud.",
    category: { label: "Soul Food", href: "/news#category-soul-food" },
    author: "Deezy",
    publishedAt: "2026-10-26",
    publishedLabel: "26 octobre 2026",
    updatedLabel: "26 octobre 2026",
    returnHref: "/news#category-soul-food",
    listingImage: "/images/news/articles/soul-food/soul-food-sweet-potatoe-pie/soul-food-sweet-potatoe-pie-hero.webp",
    listingAlt: "Tarte américaine à la patate douce, dorée et prête à être partagée",
    photos: {
      hero: {
        src: "/images/news/articles/soul-food/soul-food-sweet-potatoe-pie/soul-food-sweet-potatoe-pie-hero.webp",
        alt: "Sweet potato pie entière, avec une garniture dorée dans sa pâte",
        caption: "La sweet potato pie, tarte à la patate douce servie lors des repas de fête.",
        width: 1650,
        height: 2200,
      },
      leftTop: {
        src: "/images/news/articles/soul-food/soul-food-sweet-potatoe-pie/soul-food-sweet-potatoe-pie-left-top.webp",
        alt: "Patates douces fraîchement récoltées, encore couvertes de terre",
        caption: "La patate douce donne à la tarte sa douceur naturelle et sa couleur dorée.",
        width: 1600,
        height: 900,
      },
      leftBottom: {
        src: "/images/news/articles/soul-food/soul-food-sweet-potatoe-pie/soul-food-sweet-potatoe-pie-left-bottom.webp",
        alt: "Patates douces déterrées après la récolte",
        caption: "Après la récolte, les patates douces sont prêtes à être cuisinées.",
        width: 1067,
        height: 1600,
      },
      rightTall: {
        src: "/images/news/articles/soul-food/soul-food-sweet-potatoe-pie/soul-food-sweet-potatoe-pie-right-tall.webp",
        alt: "Part de tarte à la patate douce à la garniture lisse et dorée",
        caption: "Une part de sweet potato pie révèle sa garniture douce et épicée.",
        width: 1334,
        height: 2000,
      },
    },
    intro: {
      before: "À la sortie du four, la sweet potato pie a une garniture douce, souvent parfumée à la cannelle ou à la muscade, dans une pâte dorée. On la retrouve sur les tables de fête et les repas de famille afro-américains, notamment autour de Kwanzaa. Le Smithsonian revient sur la place de ce dessert dans les ",
      anchor: "sweet potato pie",
      href: "https://folklife.si.edu/magazine/foodways-holidays-kwanzaa-sweet-potato-pie",
      after: " a sa place parmi les desserts de fête. Les recettes et les souvenirs changent d’une famille à l’autre.",
    },
    blocks: [
      { type: "heading", text: "La Sweet Potato Pie et la tradition des tartes familiales" },
      { type: "paragraphs", items: [
        "La patate douce est cultivée dans les Amériques depuis bien avant l’arrivée des Européens. Dans le Sud, elle est devenue un ingrédient courant, préparé de nombreuses façons dans les cuisines afro-américaines. Les tubercules occupent aussi une place importante dans plusieurs traditions africaines, mais patate douce et igname ne désignent pas la même plante.",
        { before: "La sweet potato pie s’inscrit dans la grande famille des tartes maison, avec une recette qui change selon les ingrédients et les habitudes de chaque foyer. À Thanksgiving, elle se retrouve souvent face à la tarte au potiron : ce choix a sa propre ", anchor: "histoire dans le Sud des États-Unis", href: "https://www.gpb.org/news/2023/11/22/pumpkin-or-sweet-potato-pie-theres-rich-history-behind-both", after: "." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Sweet Potato Pie : une garniture parfumée, des recettes différentes" },
      { type: "paragraphs", items: [
        { before: "On fait cuire les patates douces, on les réduit en purée, puis on les mélange avec beurre, lait, œufs et sucre. Cannelle, muscade ou vanille donnent le parfum, à doser comme on préfère. La purée est ensuite versée dans une pâte à tarte. La patate douce apparaît dans de nombreuses ", anchor: "cuisines familiales du Sud", href: "https://www.georgiaencyclopedia.org/articles/arts-culture/foodways-overview/", after: "." },
        "Une purée fine donne une garniture lisse ; écrasée plus grossièrement, elle garde un côté rustique. La cuisson au four concentre le goût de la patate douce. Laissez la tarte refroidir avant de la couper, sinon la garniture risque de ne pas se tenir. Elle se sert froide ou légèrement tiède, parfois avec un peu de crème.",
        "On la compare souvent à la tarte au potiron, mais les deux n’ont ni le même goût ni la même texture. Plus ou moins de cannelle, une pointe de muscade, davantage de sucre : chaque recette prend la couleur de la maison qui la prépare.",
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "La Sweet Potato Pie, un dessert de fête entre recettes et souvenirs" },
      { type: "paragraphs", items: [
        "On la prépare souvent pour Thanksgiving, les fêtes de fin d’année ou les repas de famille. Il y a tout un petit rituel : cuire les patates douces, assaisonner la purée, foncer le moule et attendre que la tarte refroidisse. Certaines recettes sont écrites dans un carnet ; d’autres se transmettent à l’oral, avec des mesures du genre « un peu plus de muscade ».",
        "La cuisine a aussi soutenu concrètement les mobilisations pour les droits civiques. En Alabama, Georgia Gilmore et les cuisinières de son réseau vendaient leurs plats pour financer le boycott des bus de Montgomery. Les repas et les recettes ont ainsi participé à la vie collective, bien au-delà de la table.",
        "Aujourd’hui, la tarte se prépare pour une grande tablée ou juste pour le week-end. Certaines recettes sont très épicées, d’autres laissent toute la place à la patate douce. Pas de formule obligatoire : le plus souvent, c’est une recette qu’on adapte et qu’on partage.",
      ] },
    ],
    outro: "La sweet potato pie a sa place dans les repas de fête, mais rien n’empêche d’en préparer une quand l’envie vient. Pâte dorée, purée parfumée et recette adaptée à la maison : c’est souvent ainsi qu’un dessert devient une tradition familiale. Certains la préfèrent dense et très épicée, d’autres plus légère, avec une garniture presque crémeuse. La bonne version est souvent celle dont on se souvient — celle préparée à plusieurs, apportée chez des proches ou refaite chaque année sans mesurer tout à fait les ingrédients. Au-delà du dessert, elle porte ainsi une mémoire de cuisine et de partage. La préparation peut se faire la veille, ce qui laisse le temps aux épices de se mêler et facilite le découpage. Au moment de servir, un peu de crème fouettée suffit, mais la tarte se défend très bien seule. On peut aussi jouer sur la texture en passant la purée au tamis ou en la laissant légèrement rustique. Si la garniture paraît trop humide, une cuisson douce et un temps de repos plus long l’aideront à se tenir. Ces détails ne changent pas l’esprit de la recette : ils permettent surtout de trouver l’équilibre qui plaît à la famille. Certaines tables la servent en dessert, d’autres en font un incontournable de Thanksgiving ou de Kwanzaa. À chaque fois, la même tarte prend un sens un peu différent selon les souvenirs qui l’accompagnent.",
  },
  "soul-food-gumbo-jambalaya-po-boy": {
    slug: "soul-food-gumbo-jambalaya-po-boy",
    title: "Gumbo, Jambalaya, Po’boy : la cuisine de Louisiane entre héritages et métissages",
    metaTitle: "Gumbo, Jambalaya et Po’boy : cuisine de Louisiane | SMQ",
    cardTitle: "Gumbo, Jambalaya, Po’boy : la cuisine de Louisiane entre héritages et métissages",
    description: "Gumbo mijoté, jambalaya au riz et po’boy en sandwich : trois spécialités de Louisiane racontent des traditions créoles, cadiennes et afro-américaines.",
    category: { label: "Soul Food", href: "/news#category-soul-food" },
    author: "Deezy",
    publishedAt: "2026-10-26",
    publishedLabel: "26 octobre 2026",
    updatedLabel: "26 octobre 2026",
    returnHref: "/news#category-soul-food",
    listingImage: "/images/news/articles/soul-food/soul-food-jumbalaya/soul-food-jumbalaya-hero.webp",
    listingAlt: "Po’boy aux crevettes garni de sauce et de salade dans un pain",
    photos: {
      hero: {
        src: "/images/news/articles/soul-food/soul-food-jumbalaya/soul-food-jumbalaya-hero.webp",
        alt: "Po’boy garni de crevettes, de sauce et de salade dans un pain",
        caption: "Un po’boy aux crevettes, généreusement garni dans un pain moelleux.",
        width: 1467,
        height: 2200,
      },
      leftTop: {
        src: "/images/news/articles/soul-food/soul-food-jumbalaya/soul-food-jumbalaya-left-top.webp",
        alt: "Jambalaya de riz longuement cuit avec légumes et assaisonnement",
        caption: "Le jambalaya réunit riz, légumes et assaisonnement dans une même marmite.",
        width: 1600,
        height: 1045,
      },
      leftBottom: {
        src: "/images/news/articles/soul-food/soul-food-jumbalaya/soul-food-jumbalaya-left-bottom.webp",
        alt: "Préparation louisianaise mijotée, composée de riz et de viande hachée",
        caption: "Le jambalaya se décline selon les viandes, les épices et les traditions familiales.",
        width: 1067,
        height: 1600,
      },
      rightTall: {
        src: "/images/news/articles/soul-food/soul-food-jumbalaya/soul-food-jumbalaya-right-tall.webp",
        alt: "Bol de gumbo louisianais avec saucisse et morceaux de viande dans un bouillon",
        caption: "Un gumbo fumant, garni de saucisse et servi dans un bol.",
        width: 1333,
        height: 2000,
      },
    },
    intro: {
      before: "Un bol de gumbo, une marmite de jambalaya ou un po’boy bien garni : en Louisiane, ces trois plats n’ont ni la même texture ni la même façon de se préparer. Ils portent des traditions créoles, cadiennes, afro-américaines et autochtones, façonnées au fil du temps. Pour comprendre ce mélange, il faut aussi regarder ",
      anchor: "l’histoire afro-américaine de la Louisiane",
      href: "https://www.arte.tv/fr/videos/119582-020-A/voyage-en-cuisine/",
      after: ". Voyons ce qui distingue ces trois plats et ce qu’on retrouve dans chacun.",
    },
    blocks: [
      { type: "heading", text: "Le Gumbo, un ragoût de Louisiane aux héritages multiples" },
      { type: "paragraphs", items: [
        { before: "Le gumbo est un ragoût servi avec du riz. Selon la recette, on y met fruits de mer, poulet ou saucisse ; pour épaissir le bouillon, certains cuisiniers utilisent un roux foncé, d’autres du gombo ou du filé, une poudre de sassafras. On retrouve ces variantes dans ", anchor: "les cuisines du sud de la Louisiane", href: "https://www.persee.fr/doc/rfea_0397-7870_1986_num_27_1_1224", after: "." },
        "Le roux rappelle des techniques françaises, le filé des savoir-faire autochtones, et le gombo est associé à des racines ouest-africaines. Au fil des migrations et des rencontres, ces ingrédients ont pris place dans des cuisines créoles et cadiennes. Il n’y a pas une seule origine, ni une recette qui fasse l’unanimité.",
        "Le gumbo change d’une marmite à l’autre. On ajuste le bouillon, les garnitures et les épices ; certains le préfèrent épais, d’autres plus léger. C’est aussi ce qui fait vivre le plat.",
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Jambalaya et Gumbo : deux façons de cuisiner le riz" },
      { type: "paragraphs", items: [
        "Le jambalaya cuit dans sa marmite avec le riz, les légumes et les garnitures : saucisse, viande ou fruits de mer, selon les envies. Le riz absorbe le bouillon pendant la cuisson. Dans le gumbo, le bouillon reste au premier plan et le riz est généralement servi à part. Deux plats proches par leurs ingrédients, mais bien différents dans l’assiette.",
        { before: "Entre cuisine créole de La Nouvelle-Orléans et traditions cadiennes du sud de l’État, les recettes changent. La tomate apparaît dans certaines versions, pas dans toutes ; oignon, céleri et poivron forment souvent la base aromatique appelée « sainte trinité ». Pour le sandwich, les ", anchor: "garnitures du po’boy louisianais", href: "https://www.pbs.org/tasteofla/bb_cajundict.html", after: " vont, elles aussi, du rôti de bœuf aux crevettes frites." },
        "Ces différences ne sont pas des règles strictes. Dans les deux plats, les ingrédients varient selon les familles et les régions. Le mieux est de les goûter l’un après l’autre pour comprendre ce que change la cuisson du riz.",
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Le Po’boy, autre classique de la cuisine louisianaise" },
      { type: "paragraphs", items: [
        "Le po’boy se sert dans un long pain croustillant, garni de crevettes frites, d’huîtres, de rôti de bœuf ou d’autres préparations. « Dressed », il arrive avec laitue, tomate et mayonnaise. La garniture dépend surtout de l’adresse et de ce qu’on a envie de manger.",
        "On associe souvent le sandwich aux travailleurs de La Nouvelle-Orléans, mais les récits sur son invention et l’origine de son nom divergent. La légende est sympathique, l’histoire est moins simple. Ce qui ne change pas : un pain généreux, une garniture abondante et un repas qu’on mange avec les mains.",
        "Gumbo, jambalaya et po’boy montrent trois visages de la cuisine louisianaise : le ragoût, le plat de riz et le sandwich. Ils se retrouvent sur les mêmes tables, mais chacun garde sa façon bien à lui de rassasier.",
      ] },
    ],
    outro: "Un gumbo à la cuillère, un jambalaya partagé au milieu de la table ou un po’boy mangé sur le pouce : ces plats racontent chacun une partie de la Louisiane. Leurs recettes changent, et c’est très bien comme ça. Pour les découvrir, mieux vaut les goûter séparément et demander comment ils sont préparés dans l’adresse où l’on s’arrête : une marmite peut être plus ou moins épicée, un jambalaya plus sec ou plus moelleux, un po’boy garni de crevettes ou de rôti. Ces différences ne sont pas des écarts à corriger, elles font partie de la cuisine louisianaise. Trois noms, trois façons de cuisiner et autant de variantes à table. En cuisine, on peut commencer par goûter le bouillon avant d’ajouter du sel, surtout si la saucisse ou le jambon est déjà bien assaisonné. Pour un jambalaya, surveillez le riz en fin de cuisson : remuez peu et laissez-le absorber le liquide sans le transformer en purée. Quant au po’boy, le pain compte autant que la garniture ; il doit tenir le sandwich sans masquer ce qu’il y a dedans. Ces quelques gestes n’imposent pas de recette « authentique » unique. Ils aident plutôt à comprendre pourquoi deux versions du même plat peuvent être différentes et toutes deux très bonnes. La cuisine de Louisiane se raconte aussi par ces choix concrets, transmis et modifiés au fil des générations. La prochaine fois, demandez la recette maison : c’est souvent là que les variantes les plus intéressantes apparaissent.",
  },
  "clothing-sunday-soul": {
    slug: "clothing-sunday-soul",
    title: "Du dimanche à la scène : comment le style Soul a traversé les générations",
    metaTitle: "Sunday Best et style Soul : la mode noire américaine | SMQ",
    cardTitle: "Du dimanche à la scène : comment le style Soul a traversé les générations",
    description: "Du costume du dimanche aux tenues de scène, le style Soul s’est construit entre élégance, famille et musique.",
    category: { label: "Clothing", href: "/news#category-clothing" },
    author: "Deezy",
    publishedAt: "2026-10-27",
    publishedLabel: "27 octobre 2026",
    updatedLabel: "27 octobre 2026",
    returnHref: "/news#category-clothing",
    listingImage: "/images/news/articles/clothing/clothing-sunday-soul/clothing-sunday-soul-hero.webp",
    listingAlt: "Chorale en tenue coordonnée lors d’un rassemblement religieux",
    photos: {
      hero: { src: "/images/news/articles/clothing/clothing-sunday-soul/clothing-sunday-soul-hero.webp", alt: "Jeunes choristes réunis en tenue de cérémonie", caption: "Une chorale réunie pour chanter : le vêtement fait aussi partie du moment partagé.", width: 5873, height: 4000 },
      leftTop: { src: "/images/news/articles/clothing/clothing-sunday-soul/clothing-sunday-soul-left-top.webp", alt: "Des fidèles chantent et lèvent les mains pendant un service", caption: "Dans l’assemblée, les habits du dimanche accompagnent le chant et la célébration.", width: 6000, height: 4000 },
      leftBottom: { src: "/images/news/articles/clothing/clothing-sunday-soul/clothing-sunday-soul-left-bottom.webp", alt: "Quatre hommes en vêtements élégants devant un bâtiment", caption: "Costumes, chemises et chapeau : une tenue soignée pour une journée spéciale.", width: 5045, height: 4036 },
      rightTall: { src: "/images/news/articles/clothing/clothing-sunday-soul/clothing-sunday-soul-right-tall.webp", alt: "Une famille pose sur le perron de sa maison au début du XXe siècle", caption: "Une photographie de famille où les vêtements du quotidien racontent aussi une époque.", width: 3746, height: 4720 },
    },
    intro: {
      before: "Un costume repassé, une robe gardée pour les grandes occasions, un chapeau choisi avec soin : le « Sunday Best », le plus bel habit du dimanche, parle autant de style que de présence. Dans les communautés noires américaines, l’église a longtemps été un lieu de rassemblement où l’on venait aussi affirmer sa dignité et sa personnalité. Cette tradition ne s’est pas arrêtée au seuil de l’église : elle a nourri la mode, les portraits de famille et les tenues de scène. L’exposition ",
      anchor: "Sunday Best consacrée au style noir et à son histoire",
      href: "https://ago.ca/exhibitions/sunday-best-power-glory-black-style",
      after: " en montre plusieurs expressions, du vêtement du dimanche à la création contemporaine.",
    },
    blocks: [
      { type: "heading", text: "Le Sunday Best, un pilier du style Soul" },
      { type: "paragraphs", items: [
        "« Sunday Best », c’est le plus bel habit qu’on garde pour le dimanche ou une grande occasion. Ça peut être un costume, une robe, un chapeau ou des chaussures soigneusement cirées ; il n’y a pas de tenue obligatoire. On s’habille parce que le moment compte, mais aussi parce qu’on aime se sentir élégant.",
        "Après l’esclavage, choisir comment se présenter en public avait aussi un poids particulier pour les personnes noires américaines. L’élégance pouvait répondre à des normes imposées, mais elle était également une façon de reprendre la maîtrise de son image et d’affirmer sa créativité. Ces deux dimensions ont coexisté, sans que chaque tenue porte forcément le même message.",
        { before: "Le dimanche, on se retrouvait à l’église, on posait en famille et on remarquait les détails des vêtements. Qui avait cousu cette robe ? À qui appartenait le chapeau ? Ces pièces gardent une mémoire très personnelle. Les collections du ", anchor: "Black Fashion Museum au Smithsonian", href: "https://nmaahc.si.edu/explore/collection/black-fashion-museum", after: " montrent la variété de ces styles et des créateurs qui les ont imaginés." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Du vestiaire familial à la scène Soul" },
      { type: "paragraphs", items: [
        "Sur scène, les chanteurs ont repris les codes du costume habillé : veste bien coupée, tissu brillant, couleur qui accroche les projecteurs. Les vêtements devaient rester élégants tout en permettant de danser. Ils faisaient partie du numéro, au même titre que la voix et l’orchestre.",
        "Il n’y avait pourtant pas d’uniforme Soul. Certains groupes choisissaient des tenues coordonnées ; d’autres préféraient le costume de soirée ou des vêtements plus libres. James Brown, lui, a fait du costume puis de la cape un rendez-vous attendu de ses concerts.",
        { before: "Les pochettes de disques et les émissions ont ensuite fait voyager ces looks bien au-delà des salles. James Brown a notamment utilisé les costumes et les ", anchor: "capes colorées dans son spectacle", href: "https://jamesbrown.com/pages/the-legacy", after: " pour donner encore plus de relief à sa présence sur scène." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Le style Soul, un héritage vestimentaire toujours vivant" },
      { type: "paragraphs", items: [
        "Les coupes et les références ont changé au fil des générations. Le dimanche, dans la rue ou sur scène, on emprunte à plusieurs univers sans qu’un seul look puisse résumer le style Soul.",
        "Les photos donnent des indices — une veste, une coiffure, une façon de poser — mais elles ne racontent pas tout. Les familles avaient leurs propres habitudes, et les mêmes vêtements pouvaient avoir des significations différentes selon les personnes.",
        "Du Sunday Best au costume de scène, le point commun est peut-être le plaisir de choisir son allure. Puis la musique commence, et le vêtement se met à bouger avec elle.",
      ] },
    ],
    outro: "Le Sunday Best et les costumes de scène n’étaient pas le même vestiaire, mais tous deux laissaient une place au choix et à la personnalité. C’est cette diversité qui fait encore vivre le style Soul.",
  },
  "clothing-black-is-beautiful": {
    slug: "clothing-black-is-beautiful",
    title: "Black Is Beautiful : afro, Dashiki et affirmation d’un style noir",
    metaTitle: "Black Is Beautiful : afro, Dashiki et mode noire | SMQ",
    cardTitle: "Black Is Beautiful : afro, Dashiki et affirmation d’un style noir",
    description: "Afro, dashiki et fierté noire : comment le mouvement Black Is Beautiful a fait de l’apparence une affirmation personnelle et culturelle.",
    category: { label: "Clothing", href: "/news#category-clothing" },
    author: "Deezy",
    publishedAt: "2026-10-27",
    publishedLabel: "27 octobre 2026",
    updatedLabel: "27 octobre 2026",
    returnHref: "/news#category-clothing",
    listingImage: "/images/news/articles/clothing/clothing-black-is-beautiful/clothing-black-is-beautiful-hero.webp",
    listingAlt: "Portrait en noir et blanc mettant en valeur une coiffure afro naturelle",
    photos: {
      hero: { src: "/images/news/articles/clothing/clothing-black-is-beautiful/clothing-black-is-beautiful-hero.webp", alt: "Portrait rapproché d’une personne portant une coiffure afro naturelle", caption: "La coiffure afro devient une affirmation visible de beauté et d’identité.", width: 4044, height: 4044 },
      leftTop: { src: "/images/news/articles/clothing/clothing-black-is-beautiful/clothing-black-is-beautiful-left-top.webp", alt: "Portrait d’une femme portant un vêtement imprimé d’inspiration africaine", caption: "Une tunique imprimée aux couleurs vives, portée avec assurance.", width: 3744, height: 4680 },
      leftBottom: { src: "/images/news/articles/clothing/clothing-black-is-beautiful/clothing-black-is-beautiful-left-bottom.webp", alt: "Portrait d’une femme aux cheveux afro et en tenue claire", caption: "La coiffure naturelle et le regard occupent le premier plan.", width: 3648, height: 5472 },
      rightTall: { src: "/images/news/articles/clothing/clothing-black-is-beautiful/clothing-black-is-beautiful-right-tall.webp", alt: "Un homme porte une tunique rouge à motifs géométriques", caption: "Une tenue contemporaine qui reprend des motifs et des couleurs panafricaines.", width: 4231, height: 6346 },
    },
    intro: {
      before: "Un afro assumé, un peigne sculpté en poing levé, un dashiki coloré : au tournant des années 1960 et 1970, les vêtements et les coiffures deviennent des signes visibles de fierté noire. « Black Is Beautiful » ne désigne pas une mode uniforme, mais une affirmation plus large : les traits, les cheveux et les cultures noires méritent d’être célébrés. Le ",
      anchor: "récit du mouvement Black Is Beautiful au Smithsonian",
      href: "https://nmaahc.si.edu/explore/stories/black-beautiful-emergence-black-culture-and-identity-60s-and-70s",
      after: " replace ces choix esthétiques dans leur contexte politique et culturel.",
    },
    blocks: [
      { type: "heading", text: "Black Is Beautiful et la fierté des cheveux naturels" },
      { type: "paragraphs", items: [
        "Pendant longtemps, les standards dominants ont présenté les cheveux lissés comme la norme. Porter ses cheveux naturels, parfois en afro, venait bousculer cette idée. Pour certains, c’était un choix politique ; pour d’autres, une question de goût ou de confort. Souvent, les raisons se mélangeaient.",
        "Le peigne afro, parfois orné d’un poing levé associé au Black Power, est devenu l’un des symboles de cette période. Mais l’afro n’était pas un uniforme militant : femmes et hommes le portaient de différentes façons, pour des raisons qui leur appartenaient.",
        { before: "Artistes, écrivains et militants ont aussi utilisé leur image pour prendre la parole. Le Smithsonian raconte cette période et la place des cheveux naturels dans le mouvement ", anchor: "Black Is Beautiful", href: "https://nmaahc.si.edu/explore/stories/black-beautiful-emergence-black-culture-and-identity-60s-and-70s", after: ". Une coiffure peut porter un message, mais elle ne résume jamais toute une personne." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Le Dashiki au cœur de Black Is Beautiful" },
      { type: "paragraphs", items: [
        "Le dashiki est une tunique ample, souvent décorée de motifs colorés, dont les formes rappellent des vêtements d’Afrique de l’Ouest. Aux États-Unis, il devient plus visible à la fin des années 1960. Certains le portent pour affirmer une fierté panafricaine ; d’autres aiment simplement sa coupe et ses couleurs.",
        "Il n’existe pas un seul dashiki : les tissus et les formes varient. Et il vaut mieux éviter de mettre toutes les références africaines dans le même panier ; chaque motif et chaque vêtement a sa propre histoire.",
        { before: "Une pièce conservée au National Museum of American History donne un aperçu concret de cette histoire : ce ", anchor: "dashiki cousu et porté en 1970", href: "https://americanhistory.si.edu/collections/object/nmah_373625", after: " a été créé par une jeune Américaine et porté par des hommes comme par des femmes." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Black Is Beautiful, une esthétique toujours actuelle" },
      { type: "paragraphs", items: [
        "Les coiffures naturelles, les bijoux et les imprimés associés à cette période continuent de revenir dans la mode et la musique. Ils sont parfois repris presque tels quels, parfois réinventés ; leur sens n’est pas forcément resté le même.",
        "Parler d’un « look noir » au singulier serait passer à côté de cette diversité. Afro, dashiki, costume ou vêtements du quotidien : chaque choix dépend d’une personne, d’un lieu et d’une époque.",
        "Black Is Beautiful n’imposait pas une garde-robe. Le mouvement rappelait plutôt que chacun devait pouvoir définir sa propre beauté, sans se conformer aux standards dominants.",
      ] },
    ],
    outro: "L’afro et le dashiki sont deux images fortes de Black Is Beautiful, mais le mouvement allait bien au-delà des vêtements. Il défendait une idée simple et toujours actuelle : chacun doit pouvoir choisir comment exprimer sa beauté.",
  },
  "clothing-zoot-suit": {
    slug: "clothing-zoot-suit",
    title: "Le Zoot Suit : quand le vêtement devient un manifeste",
    metaTitle: "Zoot Suit : histoire d’un costume devenu symbole | SMQ",
    cardTitle: "Le Zoot Suit : quand le vêtement devient un manifeste",
    description: "Veste longue, pantalon ample : le Zoot Suit a marqué les scènes jazz et les tensions raciales des années 1940.",
    category: { label: "Clothing", href: "/news#category-clothing" },
    author: "Deezy",
    publishedAt: "2026-10-27",
    publishedLabel: "27 octobre 2026",
    updatedLabel: "27 octobre 2026",
    returnHref: "/news#category-clothing",
    listingImage: "/images/news/articles/clothing/clothing-zoot-suit/clothing-zoot-suit-hero.webp",
    listingAlt: "Jeunes hommes portant des costumes amples de style zoot suit dans les années 1940",
    photos: {
      hero: { src: "/images/news/articles/clothing/clothing-zoot-suit/clothing-zoot-suit-hero.webp", alt: "Des hommes observent des costumes zoot dans une boutique pendant la Seconde Guerre mondiale", caption: "À Washington, un vendeur présente des zoot suits en pleine période de rationnement.", width: 2000, height: 1301 },
      leftTop: { src: "/images/news/articles/clothing/clothing-zoot-suit/clothing-zoot-suit-left-top.webp", alt: "Cab Calloway portant un costume zoot à larges revers", caption: "Cab Calloway, l’une des figures de scène associées au style zoot.", width: 1511, height: 1600 },
      leftBottom: { src: "/images/news/articles/clothing/clothing-zoot-suit/clothing-zoot-suit-left-bottom.webp", alt: "Un participant porte un zoot suit lors d’une cérémonie à Union City", caption: "Un zoot suit porté lors d’une cérémonie à Union City.", width: 1200, height: 1600, credit: { label: "Photo : Luigi Novi, CC BY 3.0", href: "https://commons.wikimedia.org/wiki/File:5.22.10ZootSuitByLuigiNovi1.jpg" } },
      rightTall: { src: "/images/news/articles/clothing/clothing-zoot-suit/clothing-zoot-suit-right-tall.webp", alt: "Trois hommes portent des variantes de costumes zoot dans les années 1940", caption: "Trois silhouettes zoot, entre veste longue, épaules marquées et pantalon ample.", width: 1206, height: 1600 },
    },
    intro: {
      before: "Une veste longue, des épaules larges et un pantalon ample : le Zoot Suit attirait l’œil. Dans les années 1930 et 1940, des jeunes hommes noirs, mexicains-américains et philippins le portent dans la rue et sur les pistes de danse. Puis, en pleine guerre, cette silhouette devient un sujet politique. Le Smithsonian revient sur le style ",
      anchor: "Zoot Suit au temps du rationnement",
      href: "https://www.si.edu/sidedoor/high-art-low-ride?page=0",
      after: ".",
    },
    blocks: [
      { type: "heading", text: "Le Zoot Suit : une silhouette ample et marquée" },
      { type: "paragraphs", items: [
        "On reconnaît le Zoot Suit à sa veste longue, ses épaules marquées et son pantalon taille haute resserré aux chevilles. Une chaîne de montre ou un chapeau complète parfois la silhouette. C’est un costume fait pour se voir — et pour bouger.",
        "Il circule dans les salles de danse et les scènes jazz. Cab Calloway en est l’une des figures les plus connues, mais le style ne lui appartient pas : des jeunes Noirs de Harlem, des pachucos mexicains-américains et des jeunes Philippins l’adoptent, chacun à sa façon.",
        { before: "Le Zoot Suit passe d’un groupe à l’autre sans devenir pour autant un uniforme. L’historienne Kathy Peiss retrace cette histoire dans un ouvrage conservé par les ", anchor: "archives du Smithsonian consacrées au Zoot Suit", href: "https://www.si.edu/object/siris_sil_963092", after: "." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Le Zoot Suit face aux tensions de 1943" },
      { type: "paragraphs", items: [
        "En 1943, alors que le tissu est rationné, la presse reproche au Zoot Suit d’en utiliser trop. Mais la critique du vêtement se mêle vite aux préjugés racistes et aux tensions entre jeunes civils et militaires à Los Angeles. En juin, des militaires et des civils s’en prennent à des jeunes latinos et à d’autres personnes portant ces costumes : ce sont les émeutes des Zoot Suits.",
        "Ce n’était pas une simple dispute sur la laine. Des jeunes sont frappés et dépouillés dans la rue ; des Mexicains-Américains sont aussi arrêtés. Le costume sert de cible visible, mais les violences révèlent surtout le racisme et le traitement inégal des communautés concernées.",
        { before: "Le récit des ", anchor: "émeutes du Zoot Suit à Los Angeles", href: "https://www.pbs.org/wgbh/americanexperience/features/zoot-rise-riots/", after: " permet de replacer les faits dans ce contexte, loin de la seule querelle de mode." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Quand la mode et la musique réinterprètent le Zoot Suit" },
      { type: "paragraphs", items: [
        "Après la guerre, la silhouette continue d’apparaître au cinéma, au théâtre, dans la musique et les fêtes. On la reprend parfois pour son allure vintage, parfois pour rappeler les discriminations et les tensions auxquelles elle a été associée. Les versions actuelles s’inspirent de la coupe sans toujours la reproduire à l’identique.",
        "Tout le monde ne portait pas le Zoot Suit pour les mêmes raisons. Pour les uns, c’était un costume de danse ; pour les autres, un signe d’appartenance ou une manière de prendre sa place. Son sens dépendait du lieu, de l’époque et de la personne qui le portait.",
        "Une veste longue et un pantalon ample suffisaient à rendre cette silhouette reconnaissable. Le Zoot Suit a traversé les décennies parce qu’il ne passait pas inaperçu — ni dans la rue, ni dans les histoires qu’on raconte encore à son sujet.",
      ] },
    ],
    outro: "Le Zoot Suit est à la fois un costume de scène et un vêtement de rue. Son histoire rappelle qu’une silhouette peut être admirée, imitée, mais aussi transformée en prétexte pour discriminer ceux qui la portent.",
  },
  "clothing-james-brown-cape": {
    slug: "clothing-james-brown-cape",
    title: "James Brown, du costume à la cape : les métamorphoses d’un showman",
    metaTitle: "James Brown : costumes, cape et style de scène | SMQ",
    cardTitle: "James Brown, du costume à la cape : les métamorphoses d’un showman",
    description: "Des costumes de scène à la cape de Danny Ray, James Brown a fait du vêtement un rendez-vous de ses concerts.",
    category: { label: "Clothing", href: "/news#category-clothing" },
    author: "Deezy",
    publishedAt: "2026-10-27",
    publishedLabel: "27 octobre 2026",
    updatedLabel: "27 octobre 2026",
    returnHref: "/news#category-clothing",
    listingImage: "/images/news/articles/clothing/clothing-james-brown-cape/clothing-james-brown-cape-left-bottom.webp",
    listingAlt: "James Brown en pleine performance, entouré de ses musiciens et de ses danseuses",
    photos: {
      hero: { src: "/images/news/articles/clothing/clothing-james-brown-cape/clothing-james-brown-cape-left-bottom.webp", alt: "James Brown se produit devant un public", caption: "James Brown en pleine performance, entouré de ses musiciens et de ses danseuses.", width: 3447, height: 2296, credit: { label: "Photo : Robbie Drexhage, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:James_Brown_in_Concert.jpg" } },
      leftTop: { src: "/images/news/articles/clothing/clothing-james-brown-cape/clothing-james-brown-cape-left-top-clemson.webp", alt: "James Brown photographié lors d’un événement à Clemson en 1964", caption: "James Brown à Clemson en 1964, au début de sa carrière scénique.", width: 668, height: 549, credit: { label: "Photo : Domaine public", href: "https://commons.wikimedia.org/wiki/File:James_Brown_at_Clemson_(Taps_1964)_1.png" } },
      leftBottom: { src: "/images/news/articles/clothing/clothing-james-brown-cape/clothing-james-brown-cape-hero-tulane.webp", alt: "James Brown se produit au Tulane Stadium en 1970", caption: "James Brown sur scène au Tulane Stadium, en octobre 1970.", width: 2165, height: 1714, credit: { label: "Photo : Domaine public", href: "https://commons.wikimedia.org/wiki/File:James_Brown_at_Tulane_Stadium_24_October_1970.jpg" } },
      rightTall: { src: "/images/news/articles/clothing/clothing-james-brown-cape/clothing-james-brown-cape-right-tall.webp", alt: "Portrait de James Brown en costume", caption: "James Brown en costume, avant que la cape ne devienne un signe de son show.", width: 600, height: 908, credit: { label: "Photo : Ranko Tomic, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:JamesBrown.jpg" } },
    },
    intro: {
      before: "James Brown courait, glissait, s’agenouillait, repartait. Ses costumes devaient suivre le mouvement et rester visibles sous les projecteurs. Et puis il y avait la cape, apportée par Danny Ray au moment où le chanteur semblait épuisé. Le Smithsonian conserve l’une de ces ",
      anchor: "cape ayant appartenu à James Brown",
      href: "https://collections.si.edu/search/record/ark:/65665/fd5721514649f7146e69a4cd1fda3ea23fa",
      after: ". Dans son spectacle, le vêtement n’était pas un détail : il participait au récit du concert.",
    },
    blocks: [
      { type: "heading", text: "James Brown : le costume au service du mouvement" },
      { type: "paragraphs", items: [
        "Au début, James Brown apparaît souvent en costume, bien coupé et prêt pour les jeux de jambes. Mais il bouge trop pour rester dans une silhouette sage : il glisse, tourne, s’agenouille, repart. Les vêtements doivent suivre, sans le gêner.",
        "Avec le temps, les couleurs et les détails brillants prennent plus de place. Le contraste est frappant : l’orchestre reste réglé au millimètre, tandis que Brown semble tout donner physiquement. Son costume fait partie de cette présence.",
        { before: "Le spectacle évolue avec la musique : sur son site officiel, on retrouve les ", anchor: "capes colorées portées pendant les concerts de James Brown", href: "https://jamesbrown.com/pages/the-legacy", after: ". Elles sont devenues l’un des signes distinctifs de ses performances." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "James Brown et la cape, point culminant du show" },
      { type: "paragraphs", items: [
        "Le public attendait souvent ce moment pendant « Please, Please, Please ». Brown s’agenouille, l’air épuisé. Danny Ray, son « cape man », pose alors une cape sur ses épaules et l’accompagne vers les coulisses. Mais Brown revient au micro et relance le morceau. Le geste recommence ; la salle sait qu’il fait partie du spectacle.",
        "La séquence aurait commencé avec une serviette ou un vêtement posé sur ses épaules après une performance intense. Peu à peu, elle devient un vrai rituel de scène : Brown feint l’épuisement, reçoit la cape, puis repart. Le public connaît les étapes et attend le retour.",
        { before: "Le récit du ", anchor: "Washington Post consacré à Danny Ray, le « cape man »", href: "https://www.washingtonpost.com/local/obituaries/danny-ray-dead/2021/02/13/e7ec23e2-6e1a-11eb-9f80-3d7646ce1bc0_story.html", after: " décrit comment cette séquence est devenue l’un des gestes les plus attendus des concerts de Brown." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "La cape de James Brown, mémoire de la Soul" },
      { type: "paragraphs", items: [
        "La cape est aujourd’hui conservée dans des collections muséales. Elle rappelle un numéro qui reposait sur toute une équipe : Brown, Danny Ray, les musiciens et le public qui en connaissait le déroulé.",
        "On pense souvent à la cape avant le reste, mais les costumes, les chaussures et les couleurs comptaient eux aussi. Brown soignait son allure de scène jusque dans les détails.",
        "Chez lui, le vêtement suivait la musique et soulignait les gestes. La cape semblait annoncer la fin du show ; elle signalait en fait que Brown allait repartir.",
      ] },
    ],
    outro: "Le costume, la cape, le retour au micro : tout faisait partie du concert de James Brown. Le public connaissait le rituel, mais attendait quand même le moment où il allait se relever et repartir.",
  },
  "clothing-soul-train-fashion": {
    slug: "clothing-soul-train-fashion",
    title: "Soul Train et la mode : les tenues qui ont fait danser toute l’Amérique",
    metaTitle: "Soul Train : danse, mode et style des années 1970 | SMQ",
    cardTitle: "Soul Train et la mode : les tenues qui ont fait danser toute l’Amérique",
    description: "Sur le plateau de Soul Train, les danseurs venaient avec leurs pas, leurs vêtements et leur propre idée du style.",
    category: { label: "Clothing", href: "/news#category-clothing" },
    author: "Deezy",
    publishedAt: "2026-10-27",
    publishedLabel: "27 octobre 2026",
    updatedLabel: "27 octobre 2026",
    returnHref: "/news#category-clothing",
    listingImage: "/images/news/articles/clothing/clothing-soul-train-fashion/clothing-soul-train-fashion-hero.webp",
    listingAlt: "Deux danseurs sur le plateau de l’émission Soul Train",
    photos: {
      hero: { src: "/images/news/articles/clothing/clothing-soul-train-fashion/clothing-soul-train-fashion-hero.webp", alt: "Deux danseurs avancent sur le plateau de Soul Train", caption: "Sur Soul Train, les danseurs occupaient la piste autant que les artistes invités.", width: 2579, height: 3845, credit: { label: "Photo : Marilynn K. Yee / Los Angeles Times, CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Jocelyn_Banks_and_Fred_Camble_on_Soul_Train.jpg" } },
      leftTop: { src: "/images/news/articles/clothing/clothing-soul-train-fashion/clothing-soul-train-fashion-left-top.webp", alt: "Adam Blackstone aux Soul Train Awards en 2019", caption: "Adam Blackstone aux Soul Train Awards, bien après les premières saisons de l’émission.", width: 4032, height: 3024, credit: { label: "Photo : Troynalls, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Adam_Blackstone_Soul_Train.jpg" } },
      leftBottom: { src: "/images/news/articles/clothing/clothing-soul-train-fashion/clothing-soul-train-fashion-left-bottom-new.webp", alt: "The Staple Singers lors du tournage de Soul Train en 1974", caption: "The Staple Singers pendant l’enregistrement d’un épisode de Soul Train en 1974.", width: 606, height: 824, credit: { label: "Photo : Billboard — Domaine public", href: "https://commons.wikimedia.org/wiki/File:Staple_Singers_on_Soul_Train.jpg" } },
      rightTall: { src: "/images/news/articles/clothing/clothing-soul-train-fashion/clothing-soul-train-fashion-right-tall.webp", alt: "Un couple élégant dans une rue de Chicago en 1975", caption: "Un couple habillé pour sortir à Chicago en 1975.", width: 1525, height: 2304, credit: { label: "Photo : Perry Riddle / EPA, fonds Documerica", href: "https://commons.wikimedia.org/wiki/File:Well_dressed_couple,_Michigan_Avenue,_Chicago,_July_1975.jpg" } },
    },
    intro: {
      before: "Sur Soul Train, les danseurs ne restaient pas au fond du plateau : ils occupaient la piste, traversaient la Soul Train Line et venaient avec leur propre style. Pantalons évasés, chemises imprimées, robes fluides ou tissus brillants — les looks changeaient autant que les pas. Le Smithsonian conserve même une tenue portée dans l’émission et montre ",
      anchor: "la place des vêtements dans le show",
      href: "https://nmaahc.si.edu/object/nmaahc_2020.41.3ab",
      after: ".",
    },
    blocks: [
      { type: "heading", text: "Soul Train Line : la piste de danse comme vitrine des styles" },
      { type: "paragraphs", items: [
        "Lancée en 1971, l’émission mêlait artistes invités et danseurs amateurs. La Soul Train Line est vite devenue son passage obligé : deux rangées se font face, puis chacun traverse en dansant. En quelques secondes, on voit un pas, une attitude et toute une tenue.",
        "Les danseurs ne portaient pas tous des vêtements choisis par des stylistes. Beaucoup venaient avec leurs propres trouvailles : ensembles coordonnés, pièces cousues, accessoires parfois inattendus. C’est aussi pour ça que les images de l’émission restent si vivantes.",
        { before: "Cheryl Song a porté sur le plateau une tenue conçue par Tamechi Briggs. Le National Museum of African American History and Culture en conserve une photo : la ", anchor: "tenue Soul Train en lamé et à franges", href: "https://nmaahc.si.edu/object/nmaahc_2020.41.3ab", after: " montre combien le vêtement comptait dans le spectacle." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Soul Train : pattes d’éléphant, couleurs et liberté de mouvement" },
      { type: "paragraphs", items: [
        "Les pantalons évasés, les cols larges, les combinaisons et les imprimés prennent une autre allure sous les projecteurs. Une frange suit le mouvement, une manche ample accentue un geste ; la caméra ne rate aucun détail.",
        "Il n’y a pourtant pas une formule vestimentaire Soul Train. Les danseurs mélangent vêtements du commerce, pièces cousues et accessoires personnels. Certains coordonnent leurs tenues, d’autres font tout à leur manière. La piste ressemble plus à une sortie entre amis qu’à un défilé préparé.",
        { before: "Questlove revient sur cette rencontre entre musique, mouvement et vêtements dans son livre consacré à l’émission. Son aperçu sur ", anchor: "la musique, la danse et le style de Soul Train", href: "https://www.si.edu/object/soul-train-music-dance-and-style-generation-questlove:siris_sil_1060666", after: " rappelle que ces images racontent aussi une génération." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Soul Train : une archive vivante de la culture afro-américaine" },
      { type: "paragraphs", items: [
        "L’émission a duré plusieurs décennies ; les coiffures et les coupes changent avec les modes. Les silhouettes des années 1970 laissent ensuite place à d’autres styles, du disco au hip-hop. Chaque époque a ses danseurs et ses détails.",
        "Soul Train a rendu visibles des looks déjà portés dans les communautés noires, sans les avoir inventés ni pouvoir résumer toute la mode afro-américaine. Son plateau a simplement offert à ces danseurs un espace pour apparaître tels qu’ils étaient.",
        "Aujourd’hui, on regarde autant les vêtements que les pas : une jupe qui tourne, un pantalon qui suit le rythme, un costume qui accroche la lumière. Sur Soul Train, le style faisait partie de la danse.",
      ] },
    ],
    outro: "Sur Soul Train, les tenues n’étaient pas seulement là pour la caméra. Les danseurs les avaient choisies, puis les faisaient vivre sur la piste. C’est aussi ce qui rend ces images si agréables à revoir.",
  },
  "clothing-album-covers-fashion": {
    slug: "clothing-album-covers-fashion",
    title: "Les pochettes de disques comme vitrines de la mode Soul",
    metaTitle: "Pochettes Soul : mode, image et identité musicale | SMQ",
    cardTitle: "Les pochettes de disques comme vitrines de la mode Soul",
    description: "Sur une pochette Soul, costume, coiffure et regard racontent déjà quelque chose de la musique qu’on va entendre.",
    category: { label: "Clothing", href: "/news#category-clothing" },
    author: "Deezy",
    publishedAt: "2026-10-27",
    publishedLabel: "27 octobre 2026",
    updatedLabel: "27 octobre 2026",
    returnHref: "/news#category-clothing",
    listingImage: "/images/news/articles/clothing/clothing-album-covers-fashion/clothing-album-covers-fashion-hero.webp",
    listingAlt: "Bacs de disques vinyles dans une boutique",
    photos: {
      hero: { src: "/images/news/articles/clothing/clothing-album-covers-fashion/clothing-album-covers-fashion-hero.webp", alt: "Des pochettes de disques rangées dans un bac de magasin", caption: "Dans un bac de disquaire, chaque pochette promet aussi une image et un univers.", width: 4288, height: 2848 },
      leftTop: { src: "/images/news/articles/clothing/clothing-album-covers-fashion/clothing-album-covers-fashion-left-top.webp", alt: "Un bac de vinyles consulté dans une boutique", caption: "Le format vinyle donne à la photographie une vraie place dans la découverte d’un album.", width: 5400, height: 3328 },
      leftBottom: { src: "/images/news/articles/clothing/clothing-album-covers-fashion/clothing-album-covers-fashion-left-bottom.webp", alt: "Une pile de vieux disques vinyles", caption: "Les pochettes usées gardent les traces de leur circulation et de leur écoute.", width: 3203, height: 1766 },
      rightTall: { src: "/images/news/articles/clothing/clothing-album-covers-fashion/clothing-album-covers-fashion-right-tall.webp", alt: "Une pochette de disque vinyle tenue devant un mur", caption: "La pochette transforme le disque en objet visuel que l’on garde et expose.", width: 1118, height: 1000, credit: { label: "Photo : J.P. Lon, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:LP_Sleeve.jpg" } },
    },
    intro: {
      before: "Avant de lancer le disque, on regardait sa pochette. Un costume, une coiffure, une couleur ou une pose donnaient déjà une idée de l’univers de l’artiste. Dans la Soul, ces images ont parfois autant marqué les esprits que les chansons. Le Smithsonian raconte comment les pochettes imaginées par Mingering Mike ont pris leur place dans ",
      anchor: "l’histoire de l’art américain et de la musique Soul",
      href: "https://americanart.si.edu/exhibitions/mingering-mike",
      after: ".",
    },
    blocks: [
      { type: "heading", text: "Artworks : les pochettes donnent le ton avant l’écoute" },
      { type: "paragraphs", items: [
        "Une pochette donne le ton avant même qu’on écoute. Portrait serré, costume brillant, pose détendue : chaque choix suggère une facette différente de l’artiste. La tenue compte, mais aussi la lumière, les couleurs et la typographie.",
        "L’image est souvent le résultat d’un travail collectif entre artiste, photographe, styliste, label et directeur artistique. Certaines pochettes fabriquent un personnage ; d’autres cherchent à montrer le musicien tel qu’il est. Dans les deux cas, elles gardent la trace d’une époque.",
        { before: "Mingering Mike, musicien imaginaire de Washington, dessinait lui-même ses pochettes et les disques qu’elles annonçaient. Le Smithsonian raconte cette démarche dans son dossier ", anchor: "Soul Superstars, pochettes et art américain", href: "https://americanart.si.edu/education/learning/soul-superstars-album-covers-and-american-art", after: ". Ses créations montrent qu’une couverture peut devenir une œuvre à part entière." },
      ] },
      { type: "figure", photo: "leftTop", mobileOnly: true },
      { type: "heading", text: "Mode Soul : costumes, coiffures et personnages sur les pochettes" },
      { type: "paragraphs", items: [
        "Costume du soir, col ouvert, afro, tresses ou veste de scène : les pochettes des années 1960 et 1970 ne proposent pas un seul look Soul. Certaines cherchent le glamour, d’autres la proximité ou l’affirmation culturelle. Il arrive que tout cela se retrouve sur la même couverture.",
        "La tenue répond parfois au titre ou à l’ambiance du disque. Un portrait sobre n’envoie pas le même signal qu’un décor chargé et un costume éclatant. Et avec le vinyle, on pouvait regarder l’image de près, lire les crédits et remarquer les détails que la vignette sur écran ne montre plus.",
        { before: "Les vêtements portés par les artistes s’inscrivent dans une histoire plus large de la mode noire américaine, du quotidien à la scène. Les collections du ", anchor: "Black Fashion Museum au NMAAHC", href: "https://nmaahc.si.edu/explore/collection/black-fashion-museum", after: " en donnent un aperçu." },
      ] },
      { type: "figure", photo: "leftBottom", mobileOnly: true },
      { type: "figurePair", photos: ["leftTop", "leftBottom", "rightTall"] },
      { type: "heading", text: "Les pochettes de disques comme objets de mode" },
      { type: "paragraphs", items: [
        "Certaines pochettes finissent au mur, dans une collection ou dans un clip. Une image pensée pour accompagner un disque peut devenir le souvenir le plus immédiat d’un artiste ou d’une époque.",
        "Mais une couverture reste une image construite. Elle peut mettre en avant un personnage, une idée de beauté ou une stratégie du label. On peut aussi se demander qui a choisi le décor, la tenue et la façon de photographier l’artiste.",
        "Sur les plateformes, l’image tient dans un petit carré. Le vinyle lui rend sa taille : on distingue les tissus, les bijoux et les expressions. C’est parfois là qu’on remarque enfin les détails qu’on avait manqués en écoutant le disque.",
      ] },
    ],
    outro: "Une pochette Soul, c’est une image qu’on associe à un disque, parfois pour toujours. Elle garde les vêtements et les codes d’une époque, mais aussi les choix de l’artiste et de ceux qui ont fabriqué son univers visuel.",
  },
};

const clothingEditorialAdditions = {
  "clothing-sunday-soul": {
    intro: " Le dimanche, cette tenue pouvait aussi être celle qu’on réservait à un moment important : une visite à l’église, un repas en famille ou une sortie après l’office. Les choix variaient selon les générations, les villes et les moyens de chacun. Il ne s’agit donc pas d’un uniforme, mais d’un ensemble de pratiques et de souvenirs qui ont évolué.",
    sections: ["Une tenue du dimanche se prépare parfois dès la veille : costume repassé, chaussures cirées, robe choisie avec soin. Cette attention n’est pas forcément synonyme de luxe. Elle peut tenir à une coupe bien ajustée, à un tissu conservé longtemps ou à un accessoire transmis dans la famille. Le vêtement raconte alors une relation au temps et au soin, autant qu’une envie d’être élégant.", "En regardant les photographies, évitons de prendre une silhouette pour une règle générale. Les habitudes changent d’un quartier à l’autre, et les personnes composent avec leur budget, leur âge et leur style. Certains associent un costume classique à une touche vive ; d’autres préfèrent une robe simple et un chapeau remarquable. C’est cette diversité qui rend l’histoire vestimentaire intéressante.", "La mode de scène a parfois repris des détails du vestiaire du dimanche : vestes coordonnées, chaussures brillantes, silhouettes impeccables. Mais la scène transforme ces éléments avec les projecteurs et le mouvement. Une tenue pensée pour être vue de loin ne répond pas tout à fait aux mêmes besoins qu’un vêtement porté dans la vie quotidienne."],
    outro: "Ces vêtements n’appartiennent pas à une époque révolue : ils continuent d’inspirer les tenues de cérémonie et les looks de scène. Les observer sans les réduire à une image unique permet de mieux comprendre ce qu’ils représentent pour celles et ceux qui les portaient.",
  },
  "clothing-black-is-beautiful": {
    intro: " Le slogan n’a pas effacé les différences de goûts ni imposé une nouvelle norme unique. Il a plutôt élargi l’espace des représentations : plusieurs textures de cheveux, carnations et silhouettes pouvaient être montrées avec fierté. Les images de cette période dialoguent encore avec les choix vestimentaires et capillaires d’aujourd’hui.",
    sections: ["Dans les années 1960 et 1970, les coiffures naturelles sont devenues visibles dans les médias, les universités, les arts et les mouvements politiques. Pour certaines personnes, porter ses cheveux naturels était un choix esthétique ; pour d’autres, il s’inscrivait aussi dans une réflexion sur l’identité et les normes de beauté. Les motivations pouvaient se croiser, sans être exactement les mêmes pour tout le monde.", "Le vêtement accompagne souvent cette affirmation, mais il ne faut pas en faire un code obligatoire. Une veste à motifs, une robe longue, un afro ou des bijoux choisis peuvent raconter une intention ; ils peuvent aussi être simplement beaux et agréables à porter. Les artistes ont utilisé les pochettes et la scène pour construire des images fortes, chacune avec sa sensibilité.", "Aujourd’hui, le slogan continue d’apparaître dans la mode, la photographie et les conversations sur la représentation. Son histoire rappelle que l’image publique ne se construit pas seulement dans les défilés : les musiciens, les militants, les photographes et le public y contribuent. Regarder les archives permet de voir à la fois la force du message et la variété des personnes qui l’ont porté."],
    outro: "« Black is Beautiful » est à la fois un slogan historique et une invitation à regarder qui a le droit d’être présenté comme beau. Les images de la période sont puissantes, mais elles deviennent encore plus parlantes quand on les replace dans leurs contextes et leurs différences.",
  },
  "clothing-zoot-suit": {
    intro: " Le Zoot Suit est généralement associé aux communautés mexicaines-américaines, noires et jazz de plusieurs villes américaines. Sa silhouette ample se remarquait dans la rue et sur scène. L’histoire du vêtement est aussi celle des réactions qu’il suscitait : admiration pour son allure, mais aussi surveillance et préjugés visant ceux qui le portaient.",
    sections: ["Une veste longue, des épaules marquées et un pantalon ample composent une silhouette qui prend de la place. Le vêtement tranche avec les coupes plus discrètes, et cette visibilité fait partie de son attrait. Il faut néanmoins éviter d’en faire un costume porté de la même manière par toute une génération : les tissus, les accessoires et les coupes changeaient selon les personnes et les occasions.", "Pendant la Seconde Guerre mondiale, des restrictions sur les tissus ont contribué aux débats autour du Zoot Suit. Les émeutes de Los Angeles en 1943 ont ensuite visé des jeunes Mexicains-Américains, dans un climat de racisme et de tensions. Réduire l’épisode à une simple querelle de mode ferait disparaître la violence subie par les communautés concernées.", "Le costume a ensuite continué d’inspirer des musiciens, des danseurs et des créateurs. Sur scène, son volume se prête au mouvement et à une présence théâtrale ; dans la rue, il peut exprimer une confiance en soi. Les références contemporaines ne reproduisent pas toujours la coupe d’origine, mais elles reprennent parfois cette idée d’un vêtement qui refuse de se faire discret."],
    outro: "Le Zoot Suit reste marquant parce qu’il associe une silhouette forte à une histoire sociale précise. Le regarder comme un simple costume vintage serait passer à côté des personnes qui l’ont porté et des tensions auxquelles elles ont été confrontées.",
  },
  "clothing-james-brown-cape": {
    intro: " Les vêtements de scène de Brown n’étaient pas choisis au hasard : ils devaient rester visibles dans une salle, résister aux mouvements et renforcer son personnage public. La cape est devenue l’image la plus célèbre, mais elle prend tout son sens quand on la replace dans la performance entière, avec l’orchestre, le présentateur et la réaction du public.",
    sections: ["Les premiers costumes s’inscrivent dans la tradition des groupes de rhythm and blues : vestes coordonnées, allure soignée, présentation précise. À mesure que Brown prend le contrôle de sa scène, son style devient plus personnel et plus théâtral. La tenue accompagne ses déplacements au lieu de les figer, et les couleurs accrochent la lumière quand il traverse le plateau.", "La cape fonctionne comme un petit acte en plusieurs temps. Brown ralentit, semble épuisé, reçoit le vêtement, puis repart alors que la salle pense avoir vu la fin. Ce moment dépend de Danny Ray et des musiciens autant que du chanteur. Une variation de tempo ou un retard de quelques secondes peut transformer le suspense ; le public attend le retour, mais ne sait pas exactement quand il viendra.", "La conservation d’une cape dans une collection permet de relier l’objet à une histoire orale et à des captations. L’étoffe seule ne raconte pas l’expérience, mais elle rend tangible un accessoire utilisé pendant des concerts. Les costumes portés sur scène deviennent souvent des archives : ils documentent le travail d’un styliste, les moyens d’une tournée et l’image que l’artiste voulait laisser.","D’autres artistes ont ensuite développé leurs propres rituels de scène, sans reprendre nécessairement celui de Brown. La leçon n’est pas qu’il faut une cape pour devenir un showman : c’est qu’un accessoire peut renforcer une idée, à condition d’être intégré au rythme et au récit du concert."],
    outro: "La cape est devenue un symbole parce qu’elle réunissait costume, chorégraphie et mise en scène. Elle rappelle surtout que le concert de James Brown était un travail collectif, minutieusement réglé tout en laissant place à l’excitation du direct.",
  },
  "clothing-soul-train-fashion": {
    intro: " Le programme a transformé un moment de danse en archive visuelle. Les caméras captaient les pas, mais aussi les détails des vêtements et les façons de se tenir. À travers les épisodes, on voit changer les coupes, les tissus et les coiffures, sans perdre le sentiment que chaque danseur arrive avec sa personnalité.",
    sections: ["La Soul Train Line donnait à chacun quelques secondes pour traverser la piste. Un passage réussi tenait aux pas, mais aussi à la confiance et à la façon d’occuper l’espace. Les vêtements suivaient le mouvement : les pans d’une veste, une jupe ou une manche ample rendaient la danse visible même dans un plan rapide. La télévision a conservé ces gestes et les a rendus accessibles bien au-delà du studio.", "Le style ne se résume pas aux pattes d’eph ou aux imprimés associés aux années 1970. Les danseurs portaient des vêtements achetés, cousus, retouchés ou assemblés à leur goût. Certains s’habillaient entre amis, d’autres choisissaient une tenue très personnelle. Cette variété donne aux images une fraîcheur que l’on perdrait si on les réduisait à une simple « mode disco ».", "Les archives de l’émission sont aussi un document sur la représentation à la télévision américaine. Les danseurs noirs ne sont pas des silhouettes anonymes derrière les chanteurs : ils ont le temps d’apparaître et d’être regardés. Les vêtements aident à exprimer cette présence, mais le mouvement reste essentiel. Une tenue prend une autre signification lorsqu’on la voit portée, plutôt que suspendue ou photographiée seule."],
    outro: "Revoir Soul Train, c’est observer une piste où la musique, les vêtements et les gestes se répondent. Chaque épisode garde les traces d’une époque, mais aussi des choix individuels qui empêchent de réduire le style à une seule formule.",
  },
  "clothing-album-covers-fashion": {
    intro: " La pochette est souvent le premier contact avec un album, surtout à l’époque où le disque s’achetait en magasin. On pouvait la tenir, la retourner et lire les crédits. Cette taille donnait aux photographes et aux directeurs artistiques une surface pour présenter un personnage, un décor et une ambiance avant même la première écoute.",
    sections: ["Le portrait d’un chanteur n’est jamais neutre : angle, éclairage, expression et cadrage composent une image. Une photo en studio peut donner une impression de proximité, alors qu’un décor élaboré installe une distance ou un univers de fiction. Les vêtements participent à cette construction. Ils peuvent refléter le style personnel de l’artiste, répondre à une tendance ou créer un personnage destiné à la promotion.", "Les pochettes de soul montrent des choix très variés : costume classique, robe de soirée, tenue de rue, vêtements de scène. Certaines mettent l’artiste seul au centre, d’autres préfèrent le groupe et ses harmonies. La coiffure, les bijoux et les tissus apportent autant d’informations que le titre de l’album. Mais une image ne donne pas accès à toute la vie du musicien : elle est une proposition conçue pour un disque.", "Le format carré d’une miniature numérique ne rend qu’une partie de ces détails. Sur une pochette physique, on remarque les plis, les textures, les petites inscriptions et parfois les traces d’usure laissées par les écoutes. Les collectionneurs peuvent y voir un objet, tandis que les graphistes y cherchent des idées de composition. La même couverture circule ainsi entre musique, mode, design et mémoire populaire."],
    outro: "Une pochette ne dit pas tout d’un album, mais elle donne une première piste sur le monde qu’il veut présenter. La regarder après écoute peut même changer notre perception du disque : on découvre alors les détails de style qui étaient déjà là, avant la première note.",
  },
};

for (const [slug, addition] of Object.entries(clothingEditorialAdditions)) {
  const article = baseArticleProfiles[slug];
  if (!article) continue;
  article.intro.after = `${article.intro.after || ""} ${addition.intro.trim()}`;
  let sectionIndex = -1;
  for (const block of article.blocks) {
    if (block.type === "heading") sectionIndex += 1;
    else if (block.type === "paragraphs" && addition.sections[sectionIndex]) {
      block.items.push(addition.sections[sectionIndex]);
    }
  }
  article.outro = `${article.outro} ${addition.outro.trim()}`;
}

baseArticleProfiles["clothing-sunday-soul"].intro = {
  before: "Le dimanche, une tenue pouvait être réservée à l’église, à un repas de famille ou à une sortie après l’office. Costume repassé, robe choisie avec soin, chaussures cirées : ces gestes n’étaient pas forcément synonymes de luxe. Ils variaient selon les générations, les villes et les moyens de chacun. L’exposition ",
  anchor: "Sunday Best consacrée au style noir et à son histoire",
  href: "https://ago.ca/exhibitions/sunday-best-power-glory-black-style",
  after: " en montre plusieurs expressions, du vêtement du dimanche à la création contemporaine. Cette élégance pouvait accompagner une cérémonie, une réunion familiale ou une sortie après l’office.",
};
baseArticleProfiles["clothing-james-brown-cape"].outro = "La cape est devenue un symbole parce qu’elle réunissait costume, chorégraphie et mise en scène. Elle rappelle que le concert de James Brown était un travail collectif, réglé avec précision tout en gardant l’excitation du direct. Le geste ne fonctionne que parce que le groupe et la salle en font partie.";

const clothingLengthPass = {
  "clothing-black-is-beautiful": [null, null, "Dans les pochettes et les portraits de presse, cette visibilité prend des formes très différentes. Certaines images sont militantes, d’autres jouent avec le glamour ou la mode ; elles ne racontent pas toutes la même chose. Les regarder côte à côte évite de réduire le mouvement à une seule esthétique et montre comment des artistes ont investi leur propre représentation. Les archives gagnent à être accompagnées de dates et de noms : replacées dans leur contexte, elles disent davantage qu’une simple tendance vestimentaire."],
  "clothing-james-brown-cape": ["La tenue devait aussi fonctionner dans des conditions très concrètes : déplacements rapides, chaleur des projecteurs et changements parfois effectués en coulisses. Une veste spectaculaire qui gêne le mouvement ne sert pas le show. Les costumes étaient donc pensés avec le corps du danseur et la durée du concert en tête, pas seulement pour une photographie promotionnelle.", null, "D’autres accessoires ont ponctué les spectacles de Brown, mais aucun n’a pris la même valeur de signe que la cape. Le public pouvait reconnaître le rituel et attendre sa résolution ; ce retour donnait au concert un petit récit à l’intérieur du programme. L’objet compte donc moins isolément que par le moment où il apparaît et la réaction qu’il provoque."],
  "clothing-soul-train-fashion": [null, null, "Les choix de vêtements étaient aussi liés aux contraintes de la télévision : les couleurs devaient rester lisibles sous les lumières et les coupes permettre de danser. Les images diffusées dans tout le pays ont ainsi fait circuler des styles créés par les participants eux-mêmes. On y voit moins une tendance imposée qu’un échange entre musique, habillement et mouvement. Les rediffusions donnent aujourd’hui accès à ces détails, mais l’émission reste d’abord un espace de performance et de divertissement, pas un catalogue de mode."],
  "clothing-sunday-soul": [null, null, "Les photographies de famille apportent un autre éclairage que les images de célébrités. Elles montrent comment une tenue se composait avec les vêtements réellement disponibles, parfois portés pendant plusieurs années et soigneusement entretenus. Cette dimension ordinaire évite de raconter la mode du dimanche uniquement à travers les silhouettes les plus célèbres."]
};
for (const [slug, additions] of Object.entries(clothingLengthPass)) {
  const article = baseArticleProfiles[slug];
  let sectionIndex = -1;
  for (const block of article.blocks) {
    if (block.type === "heading") sectionIndex += 1;
    else if (block.type === "paragraphs" && additions[sectionIndex]) block.items.push(additions[sectionIndex]);
  }
}

const soulFoodLengthPass = {
  "soul-food-chicken-waffles": {
    outro: "Des cuisines familiales du Sud aux tables de Harlem, les Chicken & Waffles ont parcouru du chemin. Le duo garde son attrait dans une assiette généreuse : poulet croustillant, gaufre moelleuse et garniture à choisir selon ses goûts. Pas besoin d’une recette figée pour en profiter ; c’est aussi ce qui permet à chacun d’en faire sa version.",
  },
  "soul-food-hoppin-john": {
    intro: " Le plat continue ainsi de vivre au-delà du repas du 1er janvier, selon les habitudes de chaque foyer.",
    sections: [null, null, "Le repas se prépare souvent en quantité, car il se partage facilement et se réchauffe bien. Le lendemain, les pois et le riz peuvent être servis tels quels ou revenus doucement à la poêle. Ce ne sont pas des règles anciennes gravées dans le marbre, plutôt des habitudes de cuisine qui se transmettent et s’ajustent. Dans chaque famille, la texture du riz, le niveau d’épices ou la présence de viande peuvent devenir une petite signature. Ce plat se prête aussi aux adaptations du quotidien : un bouillon plus ou moins réduit, des légumes ajoutés en fin de cuisson, ou une portion de riz gardée à part pour mieux contrôler la texture."] ,
    outro: "Riz, black-eyed peas et tradition du Nouvel An : le Hoppin’ John reste un plat du Lowcountry qui se prête aux habitudes de chaque famille. Avec des collard greens ou du cornbread, il se partage sans recette figée. Le rituel compte autant que ce qu’on met dans la marmite. Cette liberté explique aussi pourquoi les versions d’une maison à l’autre ne sont jamais tout à fait les mêmes.",
  },
  "soul-food-mac-n-cheese": {
    intro: " Il reste surtout une recette de transmission, adaptée aux goûts et aux produits disponibles.",
    sections: [
      "Les versions américaines ont changé avec les ingrédients disponibles et les habitudes de table. Le plat peut rester simple, avec une sauce au cheddar, ou accueillir plusieurs fromages et des épices. Dans les cuisines familiales afro-américaines, il accompagne souvent d’autres plats de fête ; il n’est pas forcément servi comme un repas à lui seul. Ce contexte aide à comprendre pourquoi les recettes privilégient parfois une texture riche et une croûte bien dorée.",
      "Pour varier sans perdre le côté réconfortant, on peut jouer sur la forme des pâtes, le mélange de fromages ou la cuisson. Un cheddar marqué donne du caractère, tandis qu’un fromage plus doux apporte une sauce souple. La moutarde en poudre, le paprika ou une pointe de piment relèvent l’ensemble sans masquer le goût du fromage. Certaines familles ajoutent aussi une chapelure, d’autres préfèrent une surface gratinée sans croûte épaisse.",
      "La cuisson au four et la version à la casserole répondent à deux envies différentes. La première forme une couche dorée et permet de servir le plat en parts ; la seconde garde une sauce plus fluide et se prépare rapidement. Il faut surtout éviter de trop cuire les pâtes avant le passage au four, car elles continuent d’absorber la sauce. Un plat encore légèrement souple à la sortie sera plus crémeux après quelques minutes de repos.",
      "Le mac and cheese peut aussi changer de rôle selon le repas. En accompagnement, une portion modeste suffit à compléter poulet, légumes ou haricots ; servi seul, on peut y ajouter des légumes rôtis ou une salade croquante. Cette manière de le décliner évite de croire qu’il existe une seule version « authentique ». Les recettes se transmettent surtout par les gestes et les préférences : un fromage favori, un plat bien gratiné, ou une sauce que l’on goûte avant d’enfourner.",
    ],
    outro: "Le mac and cheese a traversé les cuisines et les générations en gardant une idée simple : des pâtes, une sauce au fromage et une texture généreuse. Cheddar, épices, chapelure ou cuisson au four, chacun peut l’adapter à sa table. C’est un classique qui accepte volontiers les petites habitudes de la maison.",
  },
  "soul-food-cornbread": {
    intro: " Une cuisson en fonte ou un peu de babeurre suffisent ensuite à changer son caractère.",
    sections: [
      "Le maïs est au cœur de nombreuses cuisines des Amériques depuis bien avant la création des États-Unis. Les recettes de cornbread ont ensuite évolué au contact des traditions autochtones, européennes et africaines, ainsi que des ingrédients accessibles dans chaque région. Cette histoire ne se résume donc pas à une recette unique. Farine de maïs seule ou mélangée à de la farine de blé, lait fermenté ou eau : les choix modifient la mie et la saveur.",
      "Le babeurre apporte une légère acidité et aide à obtenir une mie tendre. La fonte, préchauffée avec un peu de matière grasse, favorise une croûte bien marquée. Si l’on préfère un résultat plus moelleux, un moule classique fonctionne aussi. Il faut simplement surveiller la cuisson : le pain doit être pris au centre sans sécher. Une pique qui ressort avec quelques miettes est souvent un meilleur repère qu’une surface très brune.",
      "Le cornbread peut être servi chaud avec du beurre, émietté dans un bol de haricots ou utilisé pour accompagner un plat en sauce. Certaines familles le préfèrent peu sucré, d’autres ajoutent une touche de miel. Les restes peuvent être réchauffés à la poêle ou transformés en farce. Ces usages montrent pourquoi il a sa place dans les repas quotidiens autant que sur une table de fête.",
    ],
    outro: "Le cornbread accompagne la Soul Food sans façon : une part chaude, une croûte dorée et le goût du maïs suffisent. Sa recette change selon les régions et les familles, du pain peu sucré à la version plus moelleuse. Il trouve facilement sa place à côté d’un plat mijoté ou sur une table de fête.",
  },
  "soul-food-sweet-potato-pie": {
    intro: " Sa simplicité laisse justement à chaque famille la place d’ajuster les épices.",
    sections: [
      "La patate douce est cultivée et cuisinée depuis longtemps dans les Amériques. Les traditions culinaires afro-américaines l’ont intégrée à des préparations salées et sucrées, en tirant parti de sa disponibilité et de sa douceur naturelle. Les recettes de tartes se sont transmises dans les foyers, avec des différences de pâte, d’épices et de texture. Cette histoire familiale explique pourquoi deux parts de sweet potato pie peuvent être très différentes tout en portant le même nom.",
      "Pour la garniture, la patate douce doit être tendre avant d’être écrasée. La cuisson au four donne une saveur plus concentrée, tandis que l’eau ou la vapeur préservent une texture plus neutre. On ajoute ensuite œufs, lait ou crème, sucre et épices. Le mélange doit rester lisse, sans être liquide. Une pincée de sel aide à équilibrer le sucre, et la muscade ou la cannelle se dosent selon le goût recherché.",
      "La tarte gagne à refroidir avant d’être découpée : la garniture se tient mieux et les arômes ressortent. Elle se sert nature, avec un peu de crème ou accompagnée d’un café. Pour une version moins sucrée, la patate douce peut faire l’essentiel du travail ; inutile de masquer son goût sous une grande quantité de sucre. Les restes se conservent au frais et se dégustent aussi bien le lendemain.",
    ],
    outro: "La sweet potato pie tient à peu de choses : une patate douce bien cuite, une garniture équilibrée et une pâte qui reste croustillante. Cannelle, vanille ou muscade donnent ensuite à chaque famille sa propre version. Servie fraîche ou à température ambiante, elle reste un dessert simple à partager à l’automne comme le reste de l’année.",
  },
  "soul-food-gumbo-jambalaya-po-boy": {
    intro: " Ce sont ces différences qui donnent à chaque assiette son identité.",
    sections: [
      "Le gumbo se construit autour d’un roux, d’un bouillon et d’ingrédients qui varient selon la saison et la maison. Le roux demande de la patience : il faut remuer régulièrement jusqu’à obtenir la couleur voulue, sans le brûler. Poulet, saucisse ou fruits de mer peuvent entrer dans la marmite, avec des légumes et des épices. Servi avec du riz, le gumbo est pensé pour être partagé et gagne souvent en profondeur après un peu de repos.",
      "La jambalaya mélange le riz aux autres ingrédients pendant la cuisson. Poulet, saucisse, crevettes ou légumes peuvent s’y retrouver ; le liquide et le temps de cuisson doivent être ajustés pour que les grains restent distincts. Il existe plusieurs façons de préparer la jambalaya, et les variantes reflètent les produits disponibles autant que les habitudes locales. Le plat n’a pas besoin d’une garniture compliquée : le riz absorbe déjà les saveurs de la marmite.",
      "Le po’ boy, lui, se sert dans un pain long et croustillant. Il peut être garni de crevettes ou d’huîtres frites, mais aussi de viande rôtie, avec laitue, tomate et sauce selon les envies. Le contraste entre le pain, la garniture chaude et les crudités fait tout son intérêt. Dans les trois cas, la cuisine louisianaise préfère souvent une préparation généreuse et conviviale à une présentation sophistiquée.",
    ],
    outro: "Gumbo, jambalaya et po’ boy racontent trois facettes différentes de la Louisiane : une marmite mijotée, un riz parfumé et un sandwich garni. Leurs recettes varient, mais gardent le goût des cuisines créoles et des repas partagés. C’est aussi ce qui rend la cuisine de la région si difficile à résumer en un seul plat.",
  },
};

for (const [slug, edit] of Object.entries(soulFoodLengthPass)) {
  const article = baseArticleProfiles[slug];
  if (!article) continue;
  if (edit.intro) article.intro.after = `${article.intro.after || ""} ${edit.intro.trim()}`;
  if (edit.outro) article.outro = edit.outro;
  let sectionIndex = -1;
  for (const block of article.blocks) {
    if (block.type === "heading") sectionIndex += 1;
    else if (block.type === "paragraphs" && edit.sections?.[sectionIndex]) block.items.push(edit.sections[sectionIndex]);
  }
}

export const articleProfiles = { ...baseArticleProfiles, ...remainingArticleProfiles };
