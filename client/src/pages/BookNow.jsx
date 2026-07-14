import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Navigation, Loader2, Car, Bike, Calendar, Clock, CheckCircle, AlertTriangle, ChevronRight, Award } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const timeSlots = ['08:00 AM', '09:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

export default function BookNow() {
  const [searchParams] = useSearchParams();

  const [vehicleType, setVehicleType] = useState('car'); // 'car', 'bike', 'membership'
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', vehicleModel: '', servicePackage: '',
    bookingDate: '', bookingTime: '', address: '', latitude: '', longitude: '',
  });
  const [locating, setLocating] = useState(false);
  const [locLocked, setLocLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState('');

  // SEO Optimization
  useEffect(() => {
    document.title = "Book Premium Hand Wash, Detailing & Memberships | Washly";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Secure your premium hand car wash, bike detail, or monthly VIP pass with Washly. Features 1-click GPS lock for mobile services across Vijayawada, AP.";

    // Inject structured JSON-LD schema
    let schemaScript = document.getElementById('seo-booking-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.id = 'seo-booking-schema';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ReservationAction",
      "name": "Book Hand Car and Bike Detailing Service",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": window.location.href,
        "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
      },
      "result": {
        "@type": "Reservation",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Washly Car & Bike Wash",
          "image": "/logo.png"
        }
      }
    });

    return () => {
      const script = document.getElementById('seo-booking-schema');
      if (script) script.remove();
    };
  }, []);

  // Fetch packages dynamically from backend
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
        setLoadingPackages(false);
      }
    }
    loadPackages();
  }, []);

  // Handle URL query parameter pre-fill
  useEffect(() => {
    if (packages.length === 0) return;
    const typeParam = searchParams.get('type');
    const pkgParam = searchParams.get('package');
    const type = (typeParam === 'bike' || typeParam === 'bikes') 
      ? 'bike' 
      : (typeParam === 'membership' || typeParam === 'memberships') 
        ? 'membership' 
        : 'car';
    
    setTimeout(() => {
      setVehicleType(type);
      if (pkgParam) {
        const filteredList = packages.filter(p => p.category === type);
        const match = filteredList.find(p => p.name.toLowerCase().includes(pkgParam.toLowerCase()));
        if (match) {
          setForm(prev => ({ ...prev, servicePackage: `${match.name} — ₹${match.price}` }));
        }
      }
    }, 0);
  }, [searchParams, packages]);

  const handleVehicleTypeSwitch = (type) => {
    setVehicleType(type);
    setForm(prev => ({ ...prev, servicePackage: '', vehicleModel: type === 'membership' ? 'VIP Membership Pass' : '' }));
  };

  const handleLocationLock = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported by your browser.'); return; }
    setLocating(true); setLocLocked(false); setError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setForm(prev => ({ ...prev, latitude: latitude.toFixed(6), longitude: longitude.toFixed(6) }));
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setForm(prev => ({ ...prev, address: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } catch {
          setForm(prev => ({ ...prev, address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}` }));
        }
        setLocLocked(true); setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError(err.code === err.PERMISSION_DENIED ? 'Location permission denied. Please allow location access.' : 'Could not retrieve location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.servicePackage) { setError('Please select a service package.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, phone: form.phone, email: form.email,
          vehicleType, vehicleModel: form.vehicleModel || 'VIP Pass Customer',
          servicePackage: form.servicePackage,
          bookingDate: form.bookingDate, bookingTime: form.bookingTime,
          location: { 
            latitude: form.latitude ? parseFloat(form.latitude) : null, 
            longitude: form.longitude ? parseFloat(form.longitude) : null, 
            address: form.address || 'On-site Location' 
          },
        }),
      });
      const data = await res.json();
      if (data.success) { setBookingRef(data.booking); setSuccess(true); window.scrollTo(0, 0); }
      else setError(data.message || 'Booking failed. Please try again.');
    } catch { setError('Cannot connect to server. Please ensure the backend is running on port 5001.'); }
    finally { setSubmitting(false); }
  };

  // Group dynamic packages by category
  const filteredPackages = packages.filter(p => p.category === vehicleType);
  const isGold = vehicleType === 'bike';
  const isMembership = vehicleType === 'membership';

  return (
    <div className="page-enter bg-[#fafaf8] min-h-screen">
      {/* Hero Banner */}
      <div className="relative pt-40 pb-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2444 0%, #1a3c6e 55%, #2557a7 100%)' }}>
        <div className="absolute inset-0 stripe-overlay opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="section-eyebrow text-[#e8b04b] mb-3">Hassle-Free Booking</div>
          <div className="gold-line mx-auto mb-6"></div>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-white mb-5">
            {isMembership ? 'Acquire Membership Pass' : 'Book Your Detail'}
          </h1>
          <p className="text-white/80 max-w-lg mx-auto">Select your package, lock your GPS location in one tap, and confirm. We'll handle the rest.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {success ? (
          /* SUCCESS SCREEN */
          <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a3c6e] to-[#2557a7] px-8 py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-yellow-300" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-white/80 text-sm">Reference: #{bookingRef?._id?.slice(-8).toUpperCase()}</p>
            </div>

            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8a8378] mb-1">Customer</div>
                  <div className="font-bold text-[#1a3c6e]">{bookingRef?.name}</div>
                  <div className="text-sm text-[#454340] font-mono">{bookingRef?.phone}</div>
                </div>
                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8a8378] mb-1">Service Type</div>
                  <div className="font-bold text-[#1a3c6e] uppercase">{bookingRef?.vehicleType}</div>
                  <div className="text-sm text-[#454340]">{bookingRef?.vehicleModel}</div>
                </div>
                <div className="bg-[#fafaf8] rounded-xl p-4 col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8a8378] mb-1">Selected Package / Pass</div>
                  <div className="font-bold text-[#1a3c6e] text-base">{bookingRef?.servicePackage}</div>
                </div>
                <div className="bg-[#fafaf8] rounded-xl p-4 col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8a8378] mb-1">Schedule</div>
                  <div className="font-bold text-[#1a3c6e] text-sm flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {bookingRef?.bookingDate}</div>
                  <div className="text-sm text-[#454340] flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5" /> {bookingRef?.bookingTime}</div>
                </div>
              </div>

              {!isMembership && (
                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8a8378] mb-2">Wash Location</div>
                  <div className="flex items-start gap-2 text-sm text-[#454340]">
                    <MapPin className="w-4 h-4 text-[#c9922a] mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{bookingRef?.location?.address}</span>
                  </div>
                  {bookingRef?.location?.latitude && (
                    <div className="mt-2">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${bookingRef.location.latitude},${bookingRef.location.longitude}`}
                        target="_blank" rel="noreferrer"
                        className="text-xs text-[#2557a7] font-bold hover:underline"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => { setSuccess(false); setForm({ name:'',phone:'',email:'',vehicleModel:'',servicePackage:'',bookingDate:'',bookingTime:'',address:'',latitude:'',longitude:'' }); setLocLocked(false); }}
                className="btn-primary w-full justify-center mt-4"
              >
                Create Another Booking / Membership
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-xl overflow-hidden">
            {/* Vehicle Type Toggle */}
            <div className="border-b border-[#e4e1da] p-6">
              <div className="label-premium mb-4">Step 1 — Select Category</div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleVehicleTypeSwitch('car')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    vehicleType === 'car'
                      ? 'border-[#1a3c6e] bg-[rgba(26,60,110,0.06)] text-[#1a3c6e] shadow-sm'
                      : 'border-[#e4e1da] text-[#8a8378] hover:border-[#1a3c6e]/40'
                  }`}
                >
                  <Car className={`w-5 h-5 ${vehicleType === 'car' ? 'text-[#1a3c6e]' : 'text-[#8a8378]'}`} />
                  Car det.
                </button>
                <button
                  type="button"
                  onClick={() => handleVehicleTypeSwitch('bike')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    vehicleType === 'bike'
                      ? 'border-[#c9922a] bg-[#fef3da] text-[#c9922a] shadow-sm'
                      : 'border-[#e4e1da] text-[#8a8378] hover:border-[#c9922a]/40'
                  }`}
                >
                  <Bike className={`w-5 h-5 ${vehicleType === 'bike' ? 'text-[#c9922a]' : 'text-[#8a8378]'}`} />
                  Bike det.
                </button>
                <button
                  type="button"
                  onClick={() => handleVehicleTypeSwitch('membership')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    vehicleType === 'membership'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'border-[#e4e1da] text-[#8a8378] hover:border-indigo-600/40'
                  }`}
                >
                  <Award className={`w-5 h-5 ${vehicleType === 'membership' ? 'text-indigo-600' : 'text-[#8a8378]'}`} />
                  Member Pass
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Step 2 — Personal Details */}
              <div>
                <div className="label-premium mb-4">Step 2 — Personal Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-premium">Full Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-premium" placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="label-premium">Mobile Number <span className="text-[#c9922a]">(Loyalty ID)</span></label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-premium font-mono" placeholder="+91 98765 43210" />
                    <p className="text-[10px] text-[#8a8378] mt-1.5">Used as your loyalty ID — tracks visit history & reward milestones.</p>
                  </div>
                  <div className={isMembership ? 'sm:col-span-2' : ''}>
                    <label className="label-premium">Email Address</label>
                    <input type="email" required={isMembership} value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-premium" placeholder="john@example.com" />
                  </div>
                  {!isMembership && (
                    <div>
                      <label className="label-premium">{vehicleType === 'car' ? 'Car' : 'Bike'} Model / Make</label>
                      <input type="text" required value={form.vehicleModel} onChange={e => setForm({...form, vehicleModel: e.target.value})} className="input-premium" placeholder={vehicleType === 'car' ? 'e.g. Toyota RAV4 (Black)' : 'e.g. Yamaha R6 (Blue)'} />
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 — Package & Schedule */}
              <div>
                <div className="label-premium mb-4">Step 3 — Package & Schedule</div>
                <div className="space-y-4">
                  <div>
                    <label className="label-premium">Select Package / Pass Option</label>
                    {loadingPackages ? (
                      <div className="flex items-center gap-2 text-sm text-[#8a8378] p-3 border border-[#e4e1da] rounded-lg bg-[#fafaf8]">
                        <Loader2 className="w-4 h-4 animate-spin text-[#1a3c6e]" /> Loading dynamic options…
                      </div>
                    ) : (
                      <select required value={form.servicePackage} onChange={e => setForm({...form, servicePackage: e.target.value})} className="input-premium font-semibold">
                        <option value="" disabled>— Choose dynamic option —</option>
                        {filteredPackages.map(p => (
                          <option key={p._id} value={`${p.name} — ₹${p.price}`}>
                            {p.name} — ₹{p.price} {p.time ? `(${p.time})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-premium">Preferred Date</label>
                      <input type="date" required value={form.bookingDate} onChange={e => setForm({...form, bookingDate: e.target.value})} className="input-premium" min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="label-premium">Preferred Time Slot</label>
                      <select required value={form.bookingTime} onChange={e => setForm({...form, bookingTime: e.target.value})} className="input-premium">
                        <option value="" disabled>— Select time slot —</option>
                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 — Location Lock (Skip for Memberships unless required) */}
              {!isMembership && (
                <div>
                  <div className="label-premium mb-4">Step 4 — Wash Location</div>
                  <div className="bg-[#fafaf8] rounded-xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h4 className="font-bold text-[#1a3c6e] text-sm flex items-center gap-1.5">
                          <Navigation className="w-4 h-4 text-[#c9922a]" /> One-Click GPS Location Lock
                        </h4>
                        <p className="text-xs text-[#8a8378] mt-1">Locks coordinates for fast mobile on-site delivery.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLocationLock}
                        disabled={locating}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm ${
                          locLocked
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-[#1a3c6e] hover:bg-[#2557a7] text-white'
                        }`}
                      >
                        {locating ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Locating…</>
                        ) : locLocked ? (
                          <><CheckCircle className="w-4 h-4" /> Coordinates Locked</>
                        ) : (
                          <><Navigation className="w-4 h-4" /> Lock Coordinates</>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="label-premium">Delivery Address / Location</label>
                      <textarea
                        required
                        rows={2}
                        value={form.address}
                        onChange={e => { setForm({...form, address: e.target.value}); setLocLocked(false); }}
                        className="input-premium resize-none"
                        placeholder="Enter home/office address manually or use GPS lock above"
                      />
                    </div>

                    {locLocked && form.latitude && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          GPS Pinned — {form.latitude}, {form.longitude}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg ${
                  isGold
                    ? 'bg-gradient-to-r from-[#c9922a] to-[#e8b04b] text-[#1a3c6e]'
                    : isMembership
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-[#1a3c6e]'
                      : 'bg-gradient-to-r from-[#1a3c6e] to-[#2557a7] text-[#1a3c6e]'
                }`}
              >
                {submitting
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting Request…</>
                  : <><Calendar className="w-5 h-5" /> Confirm &amp; Schedule Pass <ChevronRight className="w-5 h-5" /></>
                }
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
