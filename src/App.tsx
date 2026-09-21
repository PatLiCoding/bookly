import './App.css'
import { Routes, Route } from "react-router-dom";
import Header from './components/header/header'
import Navbar from './components/navbar/navbar'
import Home from './pages/home/home'
import CategoryPage from './pages/category-page/category-page'



function App() {

  return (
    <div className="appContainer">
      <Navbar />
      <div className="header-main">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kategorie/:name" element={<CategoryPage />} />
        </Routes>
      </div>
      
    </div>
  )
}

export default App
