// import { useState } from 'react';
import "./navbar.css";

function Navbar() {
  return (
    <section className="navbar">
      <div className="logo-nav">
        <div className="logo-container">
          <img className="logo" src="assets/icons/logo.png" alt="Logo" />
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

          {/* <div className="filter-container">
            <h3>Filter</h3>
            <p>Meistverkauft</p>
            <p>Beliebteste</p>
            <p>Neuerscheinungen</p>
            <p>Am meisten geliked</p>
            <p>Ab 4 Sterne</p>
            <p>Ab 3 Sterne</p>
            <p>Preis: Aufsteigend</p>
            <p>Preis: Absteigend</p>
          </div> */}
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
