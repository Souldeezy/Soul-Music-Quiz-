export default function Mall() {
  return (
    <div id="seq2-mall" className="seq2-content">
      
      {/* MAP...................................................................................................... */}

      <div className="effet-map-mall"></div>
      <div className="effet-map-trait"></div>

      {/* SHOPS.................................................................................................... */}

      <a href="#mall-vinyls" className="effet-mall-shop-vinyls">
        Vinyles
      </a>

      <a href="#mall-books" className="effet-mall-shop-books-movies">
        Livres
      </a>

      <a href="#mall-audio" className="effet-mall-shop-audio">
        Matériel
        <br />
        Audio
      </a>

      <a href="#mall-fashion" className="effet-mall-shop-fashion">
        Fashion
      </a>
    </div>
  );
}
