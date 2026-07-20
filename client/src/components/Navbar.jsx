import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, CalendarRange, Phone, Clock, Smartphone, Download, Share, CheckCircle2 } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About Us', path: '/about-us' },
  { name: 'Contact Us', path: '/contact-us' },
];

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed the Washly web app');
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  // Close mobile menu on route change
  useEffect(() => { setTimeout(() => setIsOpen(false), 0); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled || isOpen
            ? 'bg-white/95 backdrop-blur-lg shadow-[0_2px_32px_-8px_rgba(26,60,110,0.12)] border-b border-[#e4e1da]'
            : 'bg-transparent'
        }`}
      >
        {/* Top Info Bar */}
        <div className={`bg-[#0f2444] text-white/80 text-xs py-2 px-4 hidden md:block transition-all duration-300 ${scrolled ? 'max-h-0 overflow-hidden py-0 opacity-0' : 'max-h-10 opacity-100'}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c9922a]" />
                Mon – Sun: 8:00 AM – 5:30 PM
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#c9922a]" />
                +91 8074004714  WASHLY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c9922a]/20 border border-[#c9922a]/30 text-[#e8b04b] text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9922a] animate-pulse"></span>
                Bike Wash Now Available
              </span>
              <span className="text-white/40">|</span>
              <span className="font-semibold text-white/70">Premium Hand Car Wash &amp; Detailing</span>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center select-none group">
              <img 
                src="/logo.png" 
                alt="Washly Logo" 
                className={`h-14 md:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                  scrolled || isOpen
                    ? 'filter drop-shadow-[0_2px_6px_rgba(15,36,68,0.25)]'
                    : 'filter drop-shadow-[0_2px_18px_rgba(255,255,255,0.9)] drop-shadow-[0_0_4px_rgba(15,36,68,0.45)]'
                }`} 
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''} ${!scrolled ? '!text-white/90 hover:!text-white' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={handleInstallClick}
                aria-label="Add Washly App to Home Screen"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[#c9922a]/50 text-[#c9922a] hover:bg-[#c9922a] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                title="Add to Home Screen"
              >
                <Smartphone className="w-4 h-4" /> Add App
              </button>
              <Link
                to="/book-now"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a3c6e] hover:bg-[#2557a7] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <CalendarRange className="w-4 h-4" /> Book Now
              </Link>
            </div>

            {/* Mobile Header Action Controls */}
            <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
              {/* Add to Home Mobile Button */}
              <button
                onClick={handleInstallClick}
                aria-label="Add Washly to Home Screen"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#c9922a]/50 bg-[#c9922a]/15 text-[#c9922a] hover:bg-[#c9922a] hover:text-white text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
                title="Add to Home Screen"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Add App</span>
              </button>

              <Link
                to="/book-now"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a3c6e] text-white text-xs font-bold uppercase tracking-wide shadow cursor-pointer"
              >
                <CalendarRange className="w-3.5 h-3.5" /> Book
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  scrolled || isOpen 
                    ? 'text-[#1a3c6e] hover:bg-[#f4f2ee]' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="lg:hidden mobile-menu-open bg-white border-t border-[#e4e1da] shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-[#1a3c6e]/8 text-[#1a3c6e] font-bold'
                      : 'text-[#454340] hover:bg-[#f4f2ee] hover:text-[#1a3c6e]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-[#e4e1da] my-3" />

              <div className="flex flex-col gap-2.5 px-4 pt-1">
                <button
                  onClick={() => { setIsOpen(false); handleInstallClick(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#c9922a] bg-[#c9922a]/10 text-[#c9922a] text-xs font-bold uppercase tracking-wider"
                >
                  <Smartphone className="w-4 h-4" /> Add Washly App to Home Screen
                </button>
                <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 font-bold uppercase tracking-wider py-2">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#c9922a]" /> +91 8074004714</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MODAL: Add to Home Screen Instructions */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999999] flex items-center justify-center p-4" onClick={() => setShowInstallGuide(false)}>
          <div className="bg-[#0f2444] border border-[#c9922a]/40 text-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#c9922a] to-[#e8b04b] p-0.5 shadow-lg flex items-center justify-center">
                <img src="/logo.png" alt="Washly Logo" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Add Washly to Home</h3>
                <p className="text-xs text-[#e8b04b] font-semibold">Instant Access Web App</p>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Install Washly directly onto your mobile phone for fast 1-tap access to car and bike detailing!
            </p>

            <div className="space-y-3 bg-white/5 rounded-xl p-3.5 border border-white/10 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="font-black text-[#e8b04b] bg-white/10 px-2 py-0.5 rounded text-[11px]">iPhone / iOS</span>
                <p className="text-white/90 leading-tight">
                  Tap the <strong className="text-yellow-300">Share</strong> icon <span className="inline-block px-1 bg-white/10 rounded font-mono">⎕↑</span> at the bottom of Safari, then choose <strong className="text-yellow-300">"Add to Home Screen ➕"</strong>.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div className="flex items-start gap-2.5">
                <span className="font-black text-[#e8b04b] bg-white/10 px-2 py-0.5 rounded text-[11px]">Android</span>
                <p className="text-white/90 leading-tight">
                  Tap the <strong className="text-yellow-300">Menu ⋮</strong> at the top right of Chrome, then select <strong className="text-yellow-300">"Add to Home screen"</strong> or <strong className="text-yellow-300">"Install app"</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#c9922a] hover:bg-[#b88526] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" /> Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
