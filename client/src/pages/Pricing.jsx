import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Check, Info, ArrowRight, CalendarRange, Loader2, Award } from 'lucide-react';

const API = 'http://localhost:5001';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardIn = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
};

export default function Pricing() {
  const [vehicleType, setVehicleType] = useState('car'); // 'car', 'bike', 'membership'
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEO Optimization
  useEffect(() => {
    document.title = "Affordable Detailing Prices & VIP Memberships | Washly";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Compare hand car wash, premium motorcycle detail packages, and monthly VIP passes. Clean pricing with zero hidden surcharges at Washly.";

    let schemaScript = document.getElementById('seo-pricing-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'seo-pricing-schema';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PriceSpecification",
      "priceCurrency": "AUD",
      "name": "Washly Cleaning Price List",
      "url": window.location.href
    });

    return () => {
      const script = document.getElementById('seo-pricing-schema');
      if (script) script.remove();
    };
  }, []);

  // Fetch packages from backend
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch(`${API}/api/packages`);
        const data = await res.json();
        if (data.success) {
          setPackages(data.packages);
        }
      } catch (err) {
        console.error('Error loading packages:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const list = packages.filter(p => p.category === vehicleType);
  const isGold = vehicleType === 'bike';
  const isMembership = vehicleType === 'membership';

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <div className="relative pt-40 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2444 0%, #1a3c6e 55%, #2557a7 100%)' }}>
        <div className="absolute inset-0 stripe-overlay opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-eyebrow text-[#e8b04b] mb-3 font-semibold">Transparent Pricing</div>
          <div className="gold-line mx-auto mb-6" />
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-5">Honest Rates, Showroom Quality</h1>
          <p className="text-white/80 max-w-xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            Select standard detailing options or join our monthly VIP pass programs to enjoy automatic discounts.
          </p>

          {/* Category Switcher Tabs */}
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-2 p-1.5 bg-white/10 rounded-2xl border border-white/15">
              <button
                onClick={() => setVehicleType('car')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  vehicleType === 'car' ? 'bg-white text-[#1a3c6e] shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" /> Car Pricing
              </button>
              <button
                onClick={() => setVehicleType('bike')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  vehicleType === 'bike' ? 'bg-[#c9922a] text-white shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                <Bike className="w-4 h-4" /> Bike Pricing
              </button>
              <button
                onClick={() => setVehicleType('membership')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  vehicleType === 'membership' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/70 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" /> VIP Memberships
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8a8378]">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3c6e] mb-2" />
            <p className="font-semibold text-sm">Loading dynamic pricing grids…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={vehicleType}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {list.map((item) => (
                <motion.div
                  key={item._id}
                  className={`bg-white rounded-2xl border border-[#e4e1da] border-t-4 p-7 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${
                    isMembership
                      ? 'border-t-indigo-600'
                      : isGold
                        ? 'border-t-[#c9922a]'
                        : 'border-t-[#1a3c6e]'
                  } ${
                    item.featured 
                      ? isMembership
                        ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                        : isGold 
                          ? 'border-[#c9922a] shadow-md ring-2 ring-[#c9922a]/20'
                          : 'border-[#2557a7] shadow-md ring-2 ring-[#2557a7]/20'
                      : 'hover:border-[#2557a7]'
                  }`}
                  variants={cardIn}
                >
                  {item.badge && (
                    <div className="absolute top-4 right-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        isMembership 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                          : isGold 
                            ? 'bg-[#fef3da] text-[#c9922a] border border-[rgba(201,146,42,0.3)]' 
                            : 'bg-[rgba(26,60,110,0.08)] text-[#1a3c6e] border border-[rgba(26,60,110,0.1)]'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="mb-5 pr-16">
                      <div className="text-xs text-[#8a8378] font-bold uppercase tracking-wider mb-1">
                        {isMembership ? 'Monthly VIP Pass' : 'Hand detailing from'}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-base font-bold ${isMembership ? 'text-indigo-600' : 'text-[#c9922a]'}`}>₹</span>
                        <span className={`text-4.5xl font-black leading-none ${isMembership ? 'text-indigo-700' : 'text-[#1a3c6e]'}`} style={{ fontFamily: 'var(--font-display)' }}>
                          {item.price}
                        </span>
                        {item.time && <span className="text-xs font-semibold text-[#8a8378] ml-1">/ {item.time}</span>}
                      </div>
                    </div>

                    <h3 className="font-bold text-[#1a3c6e] text-xl mb-1">{item.name}</h3>
                    <div className="h-px bg-[#e4e1da] my-4" />
                    <ul className="space-y-2.5 mb-6">
                      {item.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#454340] leading-relaxed">
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isMembership ? 'text-indigo-600' : isGold ? 'text-[#c9922a]' : 'text-[#1a3c6e]'
                          }`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    {item.extra && (
                      <div className="text-[10px] text-[#8a8378] bg-[#fafaf8] p-2.5 rounded-lg mb-4 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#c9922a]" />
                        {item.extra}
                      </div>
                    )}
                    <Link
                      to={`/book-now?type=${vehicleType}&package=${encodeURIComponent(item.name)}`}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 ${
                        isMembership
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                          : isGold
                            ? 'bg-[#fef3da] text-[#c9922a] group-hover:bg-[#c9922a] group-hover:text-white'
                            : 'bg-[rgba(26,60,110,0.06)] text-[#1a3c6e] group-hover:bg-[#1a3c6e] group-hover:text-white'
                      }`}
                    >
                      <CalendarRange className="w-4 h-4" /> {isMembership ? 'Acquire Membership' : 'Book Package'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Note */}
        <motion.div
          className="mt-14 flex gap-4 items-start p-6 bg-white rounded-2xl border border-[#e4e1da] max-w-3xl mx-auto shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 shrink-0">
            <Info className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-[#1a3c6e] mb-1.5">Surcharges &amp; Vehicle Sizing Note</h4>
            <p className="text-sm text-[#8a8378] leading-relaxed">
              Prices shown are for standard hatchbacks/sedans or standard motorbikes. SUVs, Wagons &amp; Luxury vehicles incur surcharges of ₹200–₹1,200 depending on the package.
              VIP Memberships cover standard vehicle sizes; custom quotes available for commercial fleets. All prices include GST.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
