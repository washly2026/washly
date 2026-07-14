import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

// Social icons as inline SVG (lucide-react v5 removed brand icons)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);


const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Contact Us', to: '/contact-us' },
  { label: 'Book Now', to: '/book-now' },
];

const services = [
  'Express Wash',
  'Signature Wash',
  'Top Seller',
  'Perfect Polish',
  'Mini Detail',
  'Interior Detail',
  'Paint Restoring',
  'Express Bike Wash',
  'Signature Bike Wash',
];

const locations = [
  { name: 'Benz Circle Studio, Vijayawada', phone: '+91 866 257 1111' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f2444] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center group">
              <img src="/logo.png" alt="Washly Logo" className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Bike Wash Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c9922a]/50 bg-[#c9922a]/10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9922a] animate-pulse flex-shrink-0" />
              <span className="text-[#c9922a] text-xs font-bold tracking-widest uppercase">
                Bike Wash Now Available
              </span>
            </div>

            {/* Tagline */}
            <p className="text-white/55 text-sm leading-relaxed">
              Vijayawada's premium car &amp; bike wash experience — delivering showroom quality at every location across Andhra Pradesh.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/60 hover:bg-[#c9922a] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/60 hover:bg-[#c9922a] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/60 hover:bg-[#c9922a] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                <TwitterIcon />

              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-2 mt-1">
              <a
                href="tel:1300927459"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#c9922a] transition-colors duration-200 group w-fit"
              >
                <Phone size={14} className="text-[#c9922a] flex-shrink-0" />
                <span className="font-medium">1300 WASHLY</span>
              </a>
              <a
                href="mailto:hello@washly.com.au"
                className="flex items-center gap-2.5 text-sm text-white/60 hover:text-[#c9922a] transition-colors duration-200 group w-fit"
              >
                <Mail size={14} className="text-[#c9922a] flex-shrink-0" />
                <span className="font-medium">hello@washly.com.au</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/60">
                <Clock size={14} className="text-[#c9922a] flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">
                  Mon – Sat: 8am – 6pm<br />Sun: 9am – 5pm
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-white/90 relative">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#c9922a] rounded-full" />
            </h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-sm text-white/55 hover:text-[#c9922a] transition-colors duration-200 group w-fit"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c9922a]/40 group-hover:bg-[#c9922a] transition-colors duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-white/90 relative">
              Our Services
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#c9922a] rounded-full" />
            </h3>
            <ul className="flex flex-col gap-2.5 mt-2">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="flex items-center gap-2 text-sm text-white/55 hover:text-[#c9922a] transition-colors duration-200 group w-fit"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#c9922a]/40 group-hover:bg-[#c9922a] transition-colors duration-200 flex-shrink-0" />
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Locations */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-bold tracking-[0.15em] uppercase text-white/90 relative">
              Our Locations
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#c9922a] rounded-full" />
            </h3>
            <ul className="flex flex-col gap-4 mt-2">
              {locations.map((loc) => (
                <li key={loc.name} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#c9922a] flex-shrink-0" />
                    <span className="text-sm font-semibold text-white/80">{loc.name}</span>
                  </div>
                  <a
                    href={`tel:${loc.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 ml-5 text-xs text-white/50 hover:text-[#c9922a] transition-colors duration-200 w-fit"
                  >
                    <Phone size={11} className="flex-shrink-0" />
                    {loc.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/8" />
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/35 font-medium text-center sm:text-left">
            &copy; {currentYear} Washly Car &amp; Bike Wash. All rights reserved. &nbsp;|&nbsp; Made by <a href="https://sitezy.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-[#c9922a]">sitezy</a>
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">Privacy Policy</span>
            <span className="text-white/15 text-xs">·</span>
            <span className="text-xs text-white/30">Terms of Service</span>
            <span className="text-white/15 text-xs">·</span>
            <Link
              to="/admin"
              className="text-xs text-white/20 hover:text-white/40 transition-colors duration-200"
              tabIndex={-1}
            >
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
