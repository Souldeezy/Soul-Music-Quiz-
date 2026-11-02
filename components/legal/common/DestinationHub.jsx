export default function DestinationHub() {
  return (
    <div id="mall-seq1">
      {/* DESTINATIONS............................................................................................... */}

      <div className="mall-zone" id="zone-coney">
        <a href="#zone-coney" className="mall-zone-label" data-lieu="coney">
          Coney Island
        </a>
      </div>

      <div className="mall-zone" id="zone-mall">
        <a href="#zone-mall" className="mall-zone-label" data-lieu="mall">
          SMQ Mall
        </a>
      </div>

      <div className="mall-zone" id="zone-casino">
        <a href="#zone-casino" className="mall-zone-label" data-lieu="casino">
          SMQ Casino
        </a>
      </div>

      {/* LIGHT EFFECTS........................................................................................................ */}

      <div className="effet-lumiere-coney"></div>
      <div className="effet-lumiere-mall"></div>
      <div className="effet-lumiere-casino"></div>

      {/* PLAYER INFORMATION......................................................................................... */}

      <div id="mall-gauche">
        <div id="mall-logo-zone">
          <div id="mall-logo"></div>

          <div id="mall-titre">
            <div id="mall-bienvenue">Welcome to</div>
            <div id="mall-nom">New York City</div>
          </div>
        </div>

        <div id="mall-retraites-zone">
          <div id="mall-retraites-label">Retraités disponibles</div>

          <div id="mall-carousel">
            <div id="mall-retraite-actif">
              <div id="mall-current-nom"></div>
              <div id="mall-current-argent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* METRO...................................................................................................... */}

      <div id="destination-metro">
        <img
          src="/svg/legal/banner-bottom-nyc-games/destination-hub/destination-hub-metro-train.png"
          alt=""
        />
      </div>
    </div>
  );
}
