// import { useState } from 'react';
import "./navbar.css";

function Navbar() {
  return (
    <section className="navbar">
      <div className="logo-nav">
        <div className="logo-container">
          <img className="logo" src="/assets/icons/logo.png" alt="Logo" />
          <span>Bookly</span>
        </div>

        <div className="nav-container">
          <div className="category-container">
            <h3>Kategorien</h3>
            <p>Fantasy</p>
            <p>Krimi</p>
            <p>Thriller</p>
            <p>Liebesroman</p>
            <p>Komödie</p>
            <p>Young Adult</p>
            <p>Kinderbuch</p>
            <p>Ratgeber</p>
            <p>Sachbuch</p>
            <p>History</p>
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
