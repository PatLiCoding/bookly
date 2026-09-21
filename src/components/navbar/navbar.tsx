import "./navbar.css";
import { NavLink } from "react-router-dom";

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
      <div className="navbar-content-max-width">
            {CATEGORIES.map((category) => (
              <NavLink key={category} to={`/kategorie/${category}`}>
                <p>{category}</p>
              </NavLink>
            ))}
      </div>
    </section>
  );
}

export default Navbar;
