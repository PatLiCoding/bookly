import "./footer.css";
import { Link } from "react-router-dom";

/**
 * Renders the global application footer containing legal and privacy policy links.
 */
function Footer() {
  return (
    <section className="footer">
      <Link className="link" to="/imprint">Impressum</Link>
      <Link className="link" to="/policy">Datenschutz</Link>
    </section>
  );
}

export default Footer;
