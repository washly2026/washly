import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Droplet, UserCheck, Star, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

const stats = [
  { value: '200+',    label: 'Served Customers' },
  { value: '99.4%',   label: 'Customer Satisfaction' },
  { value: '2+',     label: 'Years of Washellence' },
];

const values = [
  { icon: ShieldCheck, title: 'Scratch-Free Hand Wash',          desc: 'Every single vehicle is washed entirely by hand using premium microfiber cloths and soft clay bars. We never use automated brushes that cause swirl marks.' },
  { icon: Droplet,     title: 'Eco-Responsible Water Filtering', desc: 'All Washly locations feature high-performance water reclamation systems that separate oils and cleaning compounds before safe discharge.' },
  { icon: UserCheck,   title: 'Certified Detailing Professionals', desc: 'Our machine-buffing and paint-restoration staff hold professional certification in dual-action polishing, ceramic coating, and interior steam detailing.' },
];

export default function AboutUs() {
  
  // SEO dynamic updates
  useEffect(() => {
    document.title = "About Our Scratch-Free Hand Detailing | Washly";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Founded in 2014, Washly has been delivering premium scratch-free detailing. Read about our eco-water reclamation & professional standards.";
  }, []);

  return (
    <div className="bg-[#fafaf8]">
      {/* Hero */}
      <div className="relative pt-40 pb-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2444 0%, #1a3c6e 55%, #2557a7 100%)' }}>
        <div className="absolute inset-0 stripe-overlay opacity-20" />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2340&auto=format&fit=crop"
            alt="About Washly"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            loading="eager"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="section-eyebrow text-[#e8b04b] mb-3">Our Story</div>
            <div className="gold-line mb-6" />
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-6">
              Built on the Belief That<br />
              <span className="italic text-yellow-300">Every Detail Matters</span>
            </h1>
            <p className="text-white/80 text-base leading-relaxed max-w-lg">
Founded in 2025, Washly was born from a simple observation: people love a clean car, but they don't have the time to drive to a detailing shop and wait around. To solve this, we decided to bring the car wash directly to you. Starting with just a single van and a commitment to meticulous hand washing, we make premium car care completely effortless by serving you right at your doorstep            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-[#e4e1da]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="text-4xl lg:text-5xl font-black text-[#1a3c6e] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {s.value}
                </div>
                <div className="text-sm text-[#8a8378] font-semibold uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="img-hover-zoom rounded-2xl shadow-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=2000&auto=format&fit=crop"
                  alt="Hand car wash detailing"
                  className="w-full h-full object-cover"
                />
              </div>
              
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="section-eyebrow mb-3">Who We Are</div>
              <div className="gold-line mb-6" />
              <h2 className="font-serif text-4xl font-bold text-[#1a3c6e] mb-6">Hand Washing as an Art Form</h2>
              <div className="space-y-5 text-[#454340] text-base leading-relaxed">
                <p>We started with a single question: why do car washes leave swirl marks, water spots, and unclean wheel wells? Because they use machinery. We decided to do the opposite.</p>
                <p>Every Washly team member is personally trained in hand wash techniques, microfibre care, clay bar prep, and premium product application. The same standards apply to every package.</p>
                <p>In 2024 we expanded our service offering to include premium motorcycle and bike detailing bringing the same scratch free, pH-neutral, hand applied care to two wheelers.</p>
              </div>
              <div className="flex flex-wrap gap-4 mt-10">
                <Link to="/book-now" className="btn-primary">Book a Wash Today</Link>
                <Link to="/services" className="btn-ghost">View All Services <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="section-eyebrow mb-3">Our Standards</div>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl font-bold text-[#1a3c6e]">The Washly Quality Promise</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="card-premium p-8 text-center"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(26,60,110,0.07)' }}>
                  <v.icon className="w-7 h-7 text-[#1a3c6e]" />
                </div>
                <h3 className="font-bold text-[#1a3c6e] text-lg mb-3">{v.title}</h3>
                <p className="text-sm text-[#8a8378] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-20 bg-[#fafaf8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            className="testimonial-card p-12 shadow-xl bg-white"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex justify-center gap-0.5 mb-6 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#c9922a] text-[#c9922a]" />)}
            </div>
            <p className="font-serif text-xl text-[#1a3c6e] italic leading-relaxed mb-8 max-w-2xl mx-auto">
              "I booked the Signature Bike Wash for my Royal Enfield. They used the GPS lock feature to come straight to my home in Vijayawada, deep-cleaned the chain, polished the chrome, and left it looking like a showroom. Washly has a customer for life."
            </p>
            <div>
              <div className="font-bold text-[#1a3c6e] text-base">Rajesh Kumar K.</div>
              <div className="text-sm text-[#8a8378]">Royal Enfield Classic 350 — Vijayawada Location</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
