import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import WhatsAppButton from './components/common/WhatsAppButton'
import ScrollToTop from './components/common/ScrollToTop'
import Home from './pages/Home'
import LodgeList from './pages/LodgeList'
import LodgeDetail from './pages/LodgeDetail'
import Booking from './pages/Booking'
import BookingConfirmation from './pages/BookingConfirmation'

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lodges" element={<LodgeList />} />
          <Route path="/lodge/:slug" element={<LodgeDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App
