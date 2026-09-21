import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/home/home";
import CategoryPage from "./pages/category-page/category-page";
import Footer from "./components/footer/footer";

function App() {
  return (
    <div className="appContainer">
      <Header />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kategorie/:name" element={<CategoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
