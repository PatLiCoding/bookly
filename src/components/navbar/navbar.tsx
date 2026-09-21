import "./navbar.css";
import { Link, NavLink } from "react-router-dom";

const CATEGORIES = [
  "Fantasy",
  "Krimi",
  "Thriller",
  "Liebesroman",
  "Komödie",
  "Young Adult",
  "Kinderbuch",
  "Ratgeber",
  "Sachbuch",
  "History",
];

function Navbar() {
  return (
    <section className="navbar">
      <div className="logo-nav">
        <Link to="/" className="logo-container">
          <img className="logo" src="/assets/icons/logo.png" alt="Logo" />
          <span>Bookly</span>
        </Link>

        <div className="nav-container">
          <div className="category-container">
            <h3>Kategorien</h3>
            {CATEGORIES.map((category) => (
              <NavLink key={category} to={`/kategorie/${category}`}>
                <p>{category}</p>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="Imprint-policy-container">
        <p>Impressum</p>
        <p>Datenschutzerklärung</p>
      </div>
    </section>
  );
}

export default Navbar;
