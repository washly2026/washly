import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import BookNow from './pages/BookNow';
import AdminPanel from './pages/AdminPanel';

// Scroll to Top on Route Change component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Fixed Floating WhatsApp Icon (Mobile responsive & touch action fixed)
function WhatsAppWidget() {
  return (
    <a
      href="https://wa.me/919876543210" // Washly Vijayawada support WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95 group cursor-pointer flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      style={{ 
        touchAction: 'manipulation', 
        width: '54px', 
        height: '54px', 
        position: 'fixed', 
        bottom: '24px', 
        right: '24px', 
        zIndex: 999999 
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="#ffffff"
        style={{ width: '28px', height: '28px' }}
      >
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.37 5.054L2 22l5.077-1.331a9.92 9.92 0 004.93 1.302c5.508 0 9.99-4.478 9.99-9.985A9.99 9.99 0 0012.012 2zm5.793 13.916c-.244.686-1.42 1.254-1.956 1.353-.49.09-1.127.16-3.284-.73-2.756-1.134-4.525-3.95-4.662-4.133-.137-.184-1.12-1.493-1.12-2.85 0-1.355.706-2.02.956-2.29.25-.27.542-.338.723-.338.18 0 .36.002.518.01.164.007.385-.062.602.46.223.535.76 1.854.826 1.988.066.134.11.29.02.47-.09.18-.135.29-.27.447-.134.156-.282.35-.403.47-.136.135-.277.283-.12.553.157.27.7 1.15 1.5 1.865.98.88 1.802 1.152 2.056 1.278.254.126.402.106.553-.068.15-.174.646-.75.82-1.008.17-.258.345-.218.58-.13.238.087 1.503.708 1.763.837.26.13.432.194.496.303.064.11.064.636-.18 1.322z" />
      </svg>
      {/* Hidden Tooltip on Mobile viewports */}
      <span className="absolute right-16 bg-[#0f2444] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-[#e4e1da] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block">
        Need Help? Chat Now!
      </span>
    </a>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen overflow-x-hidden" style={{ background: '#fafaf8', color: '#1a1917' }}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/book-now" element={<BookNow />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </Router>
  );
}

export default App;
