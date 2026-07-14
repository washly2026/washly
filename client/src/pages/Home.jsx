import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { Car, Bike, Sparkles, Star, CheckCircle, ChevronRight, ArrowRight, Shield, Clock, Navigation, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Dynamic premium images with descriptive design categories
const interactiveGallery = [
  { url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800&auto=format&fit=crop", label: "PH-Neutral Snow Wash", desc: "Eco-friendly shampoo foam protects paintwork clear-coats." },
  { url: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=800&auto=format&fit=crop", label: "Professional Machine Buffing", desc: "Removes swirls & oxidation to recover original deep factory gloss." },
  { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop", label: "Deep Steam Extraction", desc: "Hot dry steam sanitization extracts ground-in cabin grime." },
  { url: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop", label: "Hand Clay Bar Finishing", desc: "Lifts embedded micro-contaminants for a glass-smooth surface." }
];

const stats = [
  { value: '200+',    label: 'Served Customers' },
  { value: '99.4%',   label: 'Customer Satisfaction' },
  { value: '1',       label: 'Premium Location' },
  { value: '12+',     label: 'Years of Excellence' },
];

const reasons = [
  { icon: Shield,     title: '100% Hand Wash — No Machines',  desc: 'Every vehicle washed by hand. No automated brushes that cause swirl marks.' },
  { icon: Navigation, title: 'One-Click GPS Location Lock',    desc: 'Lock your coordinates in one tap so our team arrives at exactly the right spot.' },
  { icon: Sparkles,   title: 'Premium Chemical Products',      desc: 'pH-neutral shampoos, clay bars, carnauba wax and ceramic-grade sealants only.' },
  { icon: Clock,      title: 'Open 7 Days, Punctual Service',  desc: 'Monday to Sunday 8 AM – 5:30 PM. We respect your schedule every time.' },
];

export default function Home() {
  const heroRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO Optimization & Schema Markup
  useEffect(() => {
    document.title = "Washly Car & Bike Wash | Premium Hand Wash & Detailing";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Vijayawada's premium scratch-free hand car wash and motorcycle detailing service. VIP memberships, 1-click GPS location lock, and email confirmations.";

    // Inject JSON-LD local business schema
    let schemaScript = document.getElementById('seo-home-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'seo-home-schema';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AutoWash",
      "name": "Washly Car & Bike Wash",
      "image": "/logo.png",
      "@id": window.location.origin,
      "url": window.location.origin,
      "telephone": "1300927459",
      "priceRange": "$$ - $$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Benz Circle Crossing Bandar Road",
        "addressLocality": "Vijayawada",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "520010",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "17:30"
      }
    });

    return () => {
      const script = document.getElementById('seo-home-schema');
      if (script) script.remove();
    };
  }, []);

  // Fetch dynamic packages
  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await fetch(`${API}/api/packages`);
        const data = await res.json();
        if (data.success) {
          // Select only a few featured ones to showcase on home page
          setPackages(data.packages.filter(p => p.featured || p.badge === 'Elite').slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching dynamic packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  // GSAP hero animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero-badge',     { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo('.hero-title',     { opacity: 0, y: 40  }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
        .fromTo('.hero-subtitle',  { opacity: 0, y: 24  }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo('.hero-ctas',      { opacity: 0, y: 16  }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .fromTo('.hero-trust-bar', { opacity: 0, y: 12  }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* ═══════════════════════════════════ HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2340&auto=format&fit=crop"
            alt="Premium car wash"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-0 stripe-overlay opacity-30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-24">
          <div className="max-w-3xl">
            
            <h1 className="hero-title font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              The Art of<br />
              <span className="italic text-yellow-300">Perfect Clean.</span>
            </h1>

            <p className="hero-subtitle text-lg text-white/80 max-w-xl leading-relaxed mb-10">
              Hand-washed to perfection. From express cleans to showroom-grade detailing — for cars, motorcycles, and monthly memberships. Zero scratches guaranteed.
            </p>

            <div className="hero-ctas flex flex-wrap gap-4">
              <Link to="/book-now" className="btn-primary shadow-xl cursor-pointer">
                <Car className="w-5 h-5" /> Book Car Wash
              </Link>
              <Link to="/book-now?type=bike" className="btn-gold shadow-xl cursor-pointer">
                <Bike className="w-5 h-5" /> Book Bike Wash
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-white/40 text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-[#1a3c6e] transition-all duration-300 cursor-pointer">
                View All Services
              </Link>
            </div>

            <div className="hero-trust-bar flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/20">
              {['Benz Circle Studio', '200+ Served Customers', '99.4% Satisfaction', 'Open 7 Days'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-yellow-300" />
                  <span className="text-white/90 text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#8a8378] animate-bounce">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════ STATS BAR */}
      <section className="bg-[#0f2444] py-16 border-t border-[#c9922a]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="text-4xl lg:text-5xl font-black text-[#c9922a] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {s.value}
                </div>
                <div className="text-sm text-white/70 font-semibold uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ CAR & BIKE PACKAGES (DYNAMICAL) */}
      <section className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="section-eyebrow mb-3">Featured Detailing Programs</div>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-[#1a3c6e] mb-5">
              Precision Cleaning Programs
            </h2>
            <p className="text-[#454340] max-w-2xl mx-auto text-base leading-relaxed">
              Dynamically loaded hand detailing options crafted for maximum gloss retention and complete sanitization.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-[#8a8378]">
              <Loader2 className="w-8 h-8 animate-spin text-[#1a3c6e] mb-2" />
              <p className="font-semibold text-sm">Synchronizing packages…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <motion.div
                  key={pkg._id}
                  className={`card-premium group cursor-pointer relative overflow-hidden ${
                    pkg.category === 'membership' ? 'border-indigo-400' : pkg.category === 'bike' ? 'border-[#c9922a]' : 'border-[#e4e1da]'
                  }`}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-5">
                      <span className={`tag-pill ${
                        pkg.category === 'membership' ? 'gold' : pkg.category === 'bike' ? 'gold' : 'blue'
                      }`}>{pkg.badge || 'Popular'}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-[#c9922a]">₹</span>
                        <span className="text-3xl font-black text-[#1a3c6e]" style={{ fontFamily: 'var(--font-display)' }}>{pkg.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {pkg.category === 'bike' 
                        ? <Bike className="w-4 h-4 text-[#c9922a]" /> 
                        : <Car className="w-4 h-4 text-[#1a3c6e]" />}
                      <h3 className="font-bold text-[#1a3c6e] text-lg">{pkg.name}</h3>
                    </div>
                    <p className="text-[#8a8378] text-sm leading-relaxed mb-5 line-clamp-2">
                      {pkg.features?.[0] || 'Premium hand wash detailed solution.'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8a8378] font-semibold uppercase tracking-wide flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {pkg.time || 'Flexible'}
                      </span>
                      <Link
                        to={`/book-now?type=${pkg.category}&package=${encodeURIComponent(pkg.name)}`}
                        className="flex items-center gap-1 text-xs font-bold text-[#2557a7] uppercase tracking-wide group-hover:text-[#c9922a] transition-colors"
                      >
                        Book Option <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/services" className="btn-ghost cursor-pointer">
              Explore All Detailing &amp; Memberships <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ PREMIUM DESIGNED IMAGES GALLERY */}
      <section className="py-24 bg-[#0f2444] relative overflow-hidden border-t border-b border-[#c9922a]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="section-eyebrow text-[#e8b04b] mb-3">Designed Premium Spaces</div>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              Premium Detailing Execution
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-base">
              Hover over our service spaces to discover how our professionals maintain vehicle clearcoats.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {interactiveGallery.map((item, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-2xl aspect-[3/4] group shadow-md border border-[#c9922a]/20"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -6 }}
              >
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2444]/95 via-[#0f2444]/40 to-transparent flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-bold text-white text-lg mb-1.5">{item.label}</h3>
                  <p className="text-white/85 text-xs leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ WHY CHOOSE US */}
      <section className="py-24 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="img-hover-zoom aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=2000&auto=format&fit=crop"
                  alt="Professional hand car wash detailing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative -mt-12 ml-8 z-10 inline-block">
                <div className="bg-white rounded-2xl shadow-xl px-6 py-4 border border-[#e4e1da]">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#c9922a] text-[#c9922a]" />)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#1a3c6e]">15,000+ Verified Reviews</div>
                      <div className="text-xs text-[#8a8378]">Google &amp; Facebook</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="section-eyebrow mb-3">Why Washly</div>
              <div className="gold-line mb-6" />
              <h2 className="font-serif text-4xl font-bold text-[#1a3c6e] mb-6">
                Vijayawada's Most Trusted Premium Detailer
              </h2>
              <p className="text-[#454340] text-base leading-relaxed mb-10">
                We believe automated car washes cause micro-scratches and produce inferior results. Since 2014 Washly has been delivering scratch-free, hand-washed perfection — now expanded to motorcycles, bikes, and dynamic passes.
              </p>

              <div className="space-y-4">
                {reasons.map((reason, i) => (
                  <motion.div
                    key={reason.title}
                    className="flex gap-5 items-start p-5 rounded-xl hover:bg-[#fafaf8] transition-colors duration-300"
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(26,60,110,0.08)' }}>
                      <reason.icon className="w-6 h-6 text-[#1a3c6e]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1a3c6e] mb-1">{reason.title}</h4>
                      <p className="text-sm text-[#8a8378] leading-relaxed">{reason.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-4 mt-10">
                <Link to="/about-us" className="btn-primary cursor-pointer">Our Story</Link>
                <Link to="/book-now" className="btn-ghost cursor-pointer">Book Today</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ TESTIMONIALS */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="section-eyebrow mb-3">What Customers Say</div>
            <div className="gold-line mx-auto mb-5" />
            <h2 className="font-serif text-3xl font-bold text-[#1a3c6e]">Thousands of Happy Drivers</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Rajesh Kumar K.', vehicle: 'KTM Duke 390 — Benz Circle', quote: "Washly's Bike Detail completely transformed my Duke 390. Chain spotless, chrome mirror-finish, and they used the GPS lock to come right to my home in Benz Circle. Absolutely premium service." },
              { name: 'Sandeep Varma',  vehicle: 'Hyundai Creta — Vijayawada', quote: "I've tried every car wash in Vijayawada. Nobody comes close to Washly. The Signature Wash is incredible value — tyre shine, interior vacuum, and full clean by hand." },
              { name: 'Srinivas Rao M.', vehicle: 'Skoda Octavia — Vijayawada', quote: "Used the Showroom Detail for my Octavia before a family event. The ceramic treatment was flawless. It looked brand new. Worth every Rupee." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card shadow-sm bg-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex gap-0.5 mb-4 mt-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#c9922a] text-[#c9922a]" />)}
                </div>
                <p className="text-[#454340] text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-[#1a3c6e]">{t.name}</div>
                  <div className="text-xs text-[#8a8378]">{t.vehicle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ FINAL CTA */}
      <section className="py-20 bg-[#1a3c6e] relative overflow-hidden">
        <div className="absolute inset-0 stripe-overlay opacity-30" />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="section-eyebrow text-yellow-300 mb-3 font-semibold">Ready to Book?</div>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6">
            Give Your Vehicle the<br />
            <span className="italic text-yellow-300">Washly Treatment</span>
          </h2>
          <p className="text-white/75 text-base max-w-lg mx-auto mb-10 leading-relaxed">
            Book online in under 60 seconds. Lock your GPS location with one tap. Choose from cars, bikes, or memberships.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/book-now" className="btn-gold shadow-xl cursor-pointer">
              <Car className="w-5 h-5" /> Book Car Wash
            </Link>
            <Link to="/book-now?type=bike" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/30 text-white text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-[#1a3c6e] transition-all duration-300 shadow-xl cursor-pointer">
              <Bike className="w-5 h-5" /> Book Bike Wash
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
