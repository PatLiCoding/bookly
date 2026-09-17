// import { useState } from 'react'
import './App.css'
import Header from './components/header/header'
import Navbar from './components/navbar/navbar'
import Home from './components/main/home/home'


function App() {

  return (
    <div className="appContainer">
      <Navbar />
      <div className="header-main">
        <Header />
        <Home />
      </div>
      
    </div>
  )
}

export default App
