git commit -m "Initial commit: MERN stack project structure"import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, CheckCircle, AlertTriangle, CalendarRange, Clock, ArrowRight, Loader2, Award } from 'lucide-react';

const API = 'http://localhost:5001';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

// Designed gallery with luxury overlay and zoom animations
const designedImages = [
  { url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1200&auto=format&fit=crop", label: "PH-Neutral Hand Foam" },
  { url: "https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=1200&auto=format&fit=crop", label: "Dual-Action Machine Buffing" },
  { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200&auto=format&fit=crop", label: "Interior Steam Extraction" },
  { url: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop", label: "Carnauba Wax Sealant" }
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'bikes' ? 'bike' : searchParams.get('tab') === 'memberships' ? 'membership' : 'car';
  
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO dynamic updates
  useEffect(() => {
    document.title = "Luxury Detailing & PH-Neutral Wash Services | Washly";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Explore PH-neutral hand car wash, precision bike detail, and VIP membership subscriptions. Hand-washed, clay-barred and detailed to perfection.";

    let schemaScript = document.getElementById('seo-services-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'seo-services-schema';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Washly Professional Detailing",
      "description": "Premium hand car and bike detailing services with dynamic options.",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Washly Car & Bike Wash"
      }
    });

    return () => {
      const script = document.getElementById('seo-services-schema');
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
          setPackages(data.packages);
        }
      } catch (err) {
        console.error('Error fetching dynamic packages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const currentPackages = packages.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Page Hero */}
      <div className="relative pt-40 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2444 0%, #1a3c6e 60%, #2557a7 100%)' }}>
        <div className="absolute inset-0 stripe-overlay opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-eyebrow text-[#e8b04b] mb-3 font-semibold">Premium Packages</div>
          <div className="gold-line mx-auto mb-6"></div>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-5">
            Professional Detailing &amp; Passes
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Every clean performed completely by hand. Switch below to view detailing programs or memberships.
          </p>
        </div>
      </div>

      {/* Tab Toggle Sticky Bar */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-lg border-b border-[#e4e1da] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-center">
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#fafaf8] rounded-xl">
            <button
              onClick={() => setSearchParams({ tab: 'cars' })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'car' ? 'bg-[#1a3c6e] text-white shadow-lg' : 'text-[#8a8378] hover:text-[#1a3c6e]'
              }`}
            >
              <Car className="w-4 h-4" /> Car Wash
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'bikes' })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'bike' ? 'bg-[#c9922a] text-white shadow-lg' : 'text-[#8a8378] hover:text-[#c9922a]'
              }`}
            >
              <Bike className="w-4 h-4" /> Bike Wash
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'memberships' })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === 'membership' ? 'bg-indigo-600 text-white shadow-lg' : 'text-[#8a8378] hover:text-indigo-600'
              }`}
            >
              <Award className="w-4 h-4" /> VIP Memberships
            </button>
          </div>
        </div>
      </div>

      {/* Designed Luxury Image Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-2">Washly Craftsmanship</p>
          <h2 className="font-serif text-3xl font-bold text-[#1a3c6e]">In Action</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {designedImages.map((img, i) => (
            <motion.div 
              key={i}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] group shadow-sm"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={img.url} 
                alt={img.label} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2444]/90 via-transparent to-transparent flex items-end p-4">
                <span className="text-[#1a3c6e] text-xs md:text-sm font-semibold tracking-wide">{img.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#8a8378]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3c6e] mb-2" />
            <p className="font-bold text-sm">Synchronizing packages list…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentPackages.map((pkg) => (
                <motion.div
                  key={pkg._id}
                  className={`pricing-card flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-white border-t-4 ${
                    activeTab === 'membership'
                      ? 'border-indigo-600'
                      : activeTab === 'bike'
                        ? 'border-[#c9922a]'
                        : 'border-[#1a3c6e]'
                  } ${
                    pkg.featured 
                      ? activeTab === 'membership'
                        ? 'featured border border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : activeTab === 'bike'
                          ? 'featured-bike border border-[#c9922a] shadow-md ring-2 ring-[#c9922a]/20'
                          : 'featured border border-[#2557a7] shadow-md ring-2 ring-[#2557a7]/20'
                      : ''
                  }`}
                  variants={cardVariants}
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        pkg.featured ? 'bg-white/20 text-white' : 'bg-[#fef3da] text-[#c9922a] border border-[rgba(201,146,42,0.3)]'
                      }`}>
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-start mb-5 pr-16">
                      <div>
                        <div className={`flex items-baseline gap-1 mb-1 ${pkg.featured ? 'text-white' : ''}`}>
                          <span className={`text-sm font-bold ${pkg.featured ? 'text-yellow-300' : 'text-[#c9922a]'}`}>₹</span>
                          <span className={`text-4xl font-black leading-none ${pkg.featured ? 'text-white' : 'text-[#1a3c6e]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                            {pkg.price}
                          </span>
                          {pkg.time && <span className={`text-xs font-semibold ${pkg.featured ? 'text-white/60' : 'text-[#8a8378]'} ml-1`}>/ {pkg.time}</span>}
                        </div>
                        {pkg.time && activeTab !== 'membership' && (
                          <div className={`flex items-center gap-1 text-xs font-semibold ${pkg.featured ? 'text-white/70' : 'text-[#8a8378]'}`}>
                            <Clock className="w-3.5 h-3.5" /> {pkg.time}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className={`font-bold text-xl mb-5 ${pkg.featured ? 'text-white' : 'text-[#1a3c6e]'}`}>{pkg.name}</h3>

                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((f, i) => (
                        <li key={i} className={`flex items-start gap-2.5 text-sm ${pkg.featured ? 'text-white/90' : 'text-[#454340]'}`}>
                          <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                            pkg.featured 
                              ? 'text-yellow-300' 
                              : activeTab === 'membership' 
                                ? 'text-indigo-600' 
                                : activeTab === 'bike' 
                                  ? 'text-[#c9922a]' 
                                  : 'text-[#1a3c6e]'
                          }`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className={`flex items-start gap-2 p-3 rounded-lg mb-5 text-[11px] ${
                      pkg.featured ? 'bg-white/10 text-[#1a3c6e]/60' : 'bg-[#fafaf8] text-[#8a8378]'
                    }`}>
                      <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${pkg.featured ? 'text-[#8a8378]' : 'text-[#c9922a]'}`} />
                      {pkg.extra || 'Standard vehicle sizes apply.'}
                    </div>
                    <Link
                      to={`/book-now?type=${activeTab}&package=${encodeURIComponent(pkg.name)}`}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${
                        pkg.featured
                          ? 'bg-white text-[#1a3c6e] hover:bg-[#fafaf8] shadow-lg'
                          : activeTab === 'membership'
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                            : activeTab === 'car'
                              ? 'bg-[#1a3c6e] hover:bg-[#2557a7] text-white shadow-md'
                              : 'bg-[#c9922a] hover:bg-[#e8b04b] text-white shadow-md'
                      }`}
                    >
                      <CalendarRange className="w-4 h-4" /> {activeTab === 'membership' ? 'Choose Membership' : 'Book Package'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
