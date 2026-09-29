import "./navbar.css";
import { NavLink } from "react-router-dom";
import { ALL_CATEGORY, ALL_LABEL } from "../../utils/category";

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
        <NavLink to={`/category/${ALL_CATEGORY}`}>
          <p>{ALL_LABEL}</p>
        </NavLink>
        {CATEGORIES.map((category) => (
          <NavLink key={category} to={`/category/${category}`}>
            <p>{category}</p>
          </NavLink>
        ))}
      </div>
    </section>
  );
}

export default Navbar;