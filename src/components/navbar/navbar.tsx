import "./navbar.css";
import { NavLink } from "react-router-dom";
import { ALL_CATEGORY, ALL_LABEL } from "../../utils/category";
import { CATEGORIES } from "../../constants/categories";

/**
 * Renders the top navigation bar containing links for all book categories.
 */
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