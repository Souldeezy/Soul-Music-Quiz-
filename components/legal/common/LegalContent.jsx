const CONTACT_EMAIL = "soulmusicquiz.contact@proton.me";

function ContactEmail() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="mailto">
      {CONTACT_EMAIL}
    </a>
  );
}

export default function LegalContent() {
  return (
    <section className="legal-content-section">
      <div className="legal-vinyl-decorations" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <span className="legal-vinyl-disc" key={index} />
        ))}
      </div>
      {/* SITE EDITOR.................................................................................................................. */}

      <h2>Éditeur du site</h2>

      <p className="legal-content-paragraph" id="SMQ-editeur">
        Le site <strong>Soul Music Quiz</strong> est un site indépendant à
        vocation culturelle et éducative, dédié à la découverte et à la
        célébration de la Soul Music.
        <br />
        <br />
        Éditeur du site et directeur de la publication : <strong>Deezy</strong>
        (pseudonyme public).
        <br />
        <br />
        <ContactEmail />
      </p>

      {/* HOSTING...................................................................................................................... */}

      <h2>Hébergement</h2>

      <p className="legal-content-paragraph" id="SMQ-hebergement">
        Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca
        Avenue #4133, Covina, CA 91723, États-Unis.
        <br />
        <br />
        <a
          href="https://vercel.com"
          className="mailto"
          target="_blank"
          rel="noopener noreferrer"
        >
          vercel.com
        </a>
      </p>

      {/* SITE ACCESS.................................................................................................................. */}

      <h2>Accès au site</h2>

      <p className="legal-content-paragraph" id="SMQ-acces">
        L’accès au site Soul Music Quiz est gratuit. L’éditeur s’efforce
        d’assurer l’accessibilité du site à tout moment, mais ne saurait être
        tenu responsable d’interruptions temporaires liées à des opérations de
        maintenance ou à des contraintes techniques.
      </p>

      {/* INTELLECTUAL PROPERTY........................................................................................................ */}

      <h2>Propriété intellectuelle</h2>

      <p className="legal-content-paragraph" id="SMQ-propriete">
        Les contenus présents sur le site (textes, quiz, articles, visuels,
        structure) sont protégés par le droit de la propriété intellectuelle.
        Toute reproduction, diffusion ou exploitation sans autorisation écrite
        est interdite.
      </p>

      {/* LIABILITY.................................................................................................................... */}

      <h2>Responsabilité</h2>

      <p className="legal-content-paragraph" id="SMQ-responsabilite">
        Les informations proposées sur Soul Music Quiz sont fournies à titre
        informatif. L’éditeur ne peut être tenu responsable d’erreurs,
        d’omissions ou de l’utilisation faite des contenus du site par les
        utilisateurs.
      </p>

      {/* PERSONAL DATA................................................................................................................ */}

      <h2>Données personnelles</h2>

      <p className="legal-content-paragraph" id="SMQ-donnees">
        Soul Music Quiz ne demande pas la création d’un compte et ne propose ni
        formulaire de contact ni newsletter. Les résultats des quiz et
        certaines préférences de navigation peuvent être conservés uniquement
        dans le stockage local du navigateur, afin d’assurer le fonctionnement
        du site. Ces données ne sont pas transmises à Soul Music Quiz.
        <br />
        <br />
        Le site utilise Vercel Web Analytics pour mesurer sa fréquentation et
        connaître les pages consultées. Selon Vercel, les statistiques sont
        agrégées et cet outil ne dépose pas de cookies.
        <br />
        <br />
        Si vous contactez l’éditeur par email, votre adresse et le contenu de
        votre message sont utilisés uniquement pour répondre à votre demande.
        Aucune donnée personnelle n’est vendue ni cédée à des tiers à des fins
        commerciales.
      </p>

      {/* USER RIGHTS.................................................................................................................. */}

      <h2>Vos droits</h2>

      <p className="legal-content-paragraph" id="SMQ-droits">
        Conformément au RGPD, vous disposez d’un droit d’accès, de rectification
        et de suppression de vos données personnelles. Pour exercer ces droits,
        vous pouvez contacter : <ContactEmail />
      </p>

      {/* IMAGE CREDITS................................................................................................................ */}

      <h2>Crédits images</h2>

      <p className="legal-content-paragraph" id="SMQ-credits-images">
        Les images utilisées sur Soul Music Quiz peuvent provenir notamment de
        Wikimedia Commons, de la Library of Congress, d’Unsplash ou d’autres
        sources proposant des contenus réutilisables. Lorsque cela est
        nécessaire, l’auteur, la licence et la source sont indiqués dans la
        légende de l’image. Chaque visuel doit être utilisé conformément à la
        licence mentionnée et aux conditions de sa source.
      </p>

      {/* COOKIES...................................................................................................................... */}

      <h2>Cookies</h2>

      <p className="legal-content-paragraph" id="SMQ-cookies">
        Soul Music Quiz n’utilise pas de cookies publicitaires. La mesure
        d’audience assurée par Vercel Web Analytics ne dépose pas de cookies.
        Certaines fonctionnalités enregistrent des informations dans le stockage local ou de session du navigateur,
        par exemple les résultats d’un quiz ou la position de navigation. Ces
        informations restent sur votre appareil et peuvent être supprimées
        depuis les réglages de votre navigateur.
        <br />
        <br />
        Les liens externes, notamment vers YouTube, peuvent appliquer leurs
        propres règles lorsque vous quittez le site Soul Music Quiz.
      </p>

      {/* TERMS OF USE................................................................................................................. */}

      <h2>Conditions générales d’utilisation</h2>

      <p className="legal-content-paragraph" id="SMQ-cgu">
        L’utilisation du site implique l’acceptation pleine et entière des
        présentes mentions légales et des conditions générales d’utilisation.
      </p>

      {/* CONTACT...................................................................................................................... */}

      <h2 id="site-contact">Contact</h2>

      <p className="legal-content-paragraph" id="SMQ-contact">
        Pour toute question, information ou demande relative au site Soul Music
        Quiz, vous pouvez nous contacter par email à l’adresse suivante :{" "}
        <ContactEmail />
      </p>
    </section>
  );
}
