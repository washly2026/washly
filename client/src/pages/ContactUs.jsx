import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react';

const locations = [
  { name: 'Benz Circle Studio', phone: '+91 866 257 1111', address: 'Shop 12, Ground Floor, Benz Circle, Vijayawada, AP 520010' },
];

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Contact Our Detailing Locations in Vijayawada | Washly";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Locate or contact our premium hand car wash centers in Vijayawada, Andhra Pradesh, India. Benz Circle, Moghalrajpuram, and VIP Kanuru locations listed.";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setForm({ name: '', email: '', subject: '', message: '' });
        }, 4000);
      } else {
        setError(data.message || 'Failed to send message.');
      }
    } catch {
      setError('Cannot connect to the server at port 5001.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-enter bg-[#fafaf8]">
      {/* Hero */}
      <div className="relative pt-40 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2444 0%, #1a3c6e 55%, #2557a7 100%)' }}>
        <div className="absolute inset-0 stripe-overlay opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-eyebrow text-[#e8b04b] mb-3">Get In Touch</div>
          <div className="gold-line mx-auto mb-6"></div>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-5">Contact & Locations</h1>
          <p className="text-white/80 max-w-lg mx-auto">Reach our team directly or find your nearest Washly location across Vijayawada, AP.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-[#e4e1da] p-8 flex flex-col gap-7 shadow-sm">
            <div>
              <div className="section-eyebrow mb-3">Central Office</div>
              <h3 className="font-serif text-2xl font-bold text-[#1a3c6e] mb-1">Reach Us Directly</h3>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[rgba(26,60,110,0.08)] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#1a3c6e]" />
              </div>
              <div>
                <div className="font-bold text-[#1a3c6e] mb-0.5">Central Hotline</div>
                <p className="text-sm text-[#454340]">1300 927 459 (1300 WASHLY)</p>
                <p className="text-xs text-[#8a8378]">Mon – Sun 8 AM – 5:30 PM</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[rgba(26,60,110,0.08)] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#1a3c6e]" />
              </div>
              <div>
                <div className="font-bold text-[#1a3c6e] mb-0.5">Email Address</div>
                <p className="text-sm text-[#454340]">bookings@washly.com.au</p>
                <p className="text-xs text-[#8a8378]">Reply within 24 hours</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-[rgba(26,60,110,0.08)] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#1a3c6e]" />
              </div>
              <div>
                <div className="font-bold text-[#1a3c6e] mb-0.5">Opening Hours</div>
                <p className="text-sm text-[#454340]">Monday – Sunday</p>
                <p className="text-sm text-[#454340]">8:00 AM – 5:30 PM</p>
                <p className="text-xs text-[#c9922a] font-bold mt-1">Open Public Holidays</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e4e1da] p-8 shadow-sm">
            <div className="section-eyebrow mb-2">Send A Message</div>
            <h3 className="font-serif text-2xl font-bold text-[#1a3c6e] mb-7">How Can We Help You?</h3>

            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="font-bold text-[#1a3c6e] text-xl">Message Sent!</h4>
                <p className="text-sm text-[#8a8378]">Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {error && (
                  <div className="sm:col-span-2 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
                    {error}
                  </div>
                )}
                <div>
                  <label className="label-premium">Your Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-premium" placeholder="John Smith" />
                </div>
                <div>
                  <label className="label-premium">Email Address</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-premium" placeholder="john@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-premium">Subject</label>
                  <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-premium" placeholder="e.g. Booking enquiry, pricing question..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-premium">Message</label>
                  <textarea rows={4} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-premium resize-none" placeholder="Tell us how we can help..." />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto justify-center cursor-pointer disabled:opacity-50">
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Locations grid */}
        

        
      </div>
    </div>
  );
}
