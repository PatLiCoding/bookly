// import { useState } from 'react'
import './App.css'
import Header from './components/header/header'
import Navbar from './components/navbar/navbar'
import CategoryPage from './pages/category-page/category-page'
// import Home from './pages/home/home'


function App() {

  return (
    <div className="appContainer">
      <Navbar />
      <div className="header-main">
        <Header />
        <CategoryPage category="Krimi"/>
        {/* <Home /> */}
      </div>
      
    </div>
  )
}

export default App
