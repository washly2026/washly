import { useState, useEffect } from 'react';
import {
  Lock, LogOut, RefreshCw, BookOpen, Users,
  Eye, ExternalLink, CheckCircle, AlertTriangle,
  Bike, Car, X, TrendingUp, Settings, Plus, Edit2, Trash2, Calendar, Mail
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const statusConfig = {
  'Pending':     { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-300',  dot: 'bg-amber-400' },
  'In Progress': { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-300',   dot: 'bg-blue-400'  },
  'Completed':   { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-300',  dot: 'bg-green-400' },
  'Cancelled':   { bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-300',    dot: 'bg-red-400'   },
};

function StatusBadge({ status }) {
  const c = statusConfig[status] || statusConfig['Pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`}></span>
      {status}
    </span>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuth] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, customers, packages, analytics
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters & Sorting
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [dateRange, setDateRange] = useState('AllTime'); // AllTime, Today, 7Days, 30Days
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest-value
  
  // Detail & Form modals
  const [selectedBooking, setSelected] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [pkgForm, setPkgForm] = useState({ name: '', price: '', originalPrice: '', category: 'car', time: '', extra: '', features: '', badge: '', featured: false });
  const [offerSettingText, setOfferSettingText] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');
  
  const [serverError, setServerError] = useState('');

  const fetchAll = async () => {
    setLoading(true); setServerError('');
    try {
      const [bRes, cRes, pRes, mRes, sRes] = await Promise.all([
        fetch(`${API}/api/bookings`),
        fetch(`${API}/api/customers`),
        fetch(`${API}/api/packages`),
        fetch(`${API}/api/contacts`),
        fetch(`${API}/api/settings`)
      ]);
      if (!bRes.ok || !cRes.ok || !pRes.ok || !mRes.ok || !sRes.ok) throw new Error('Server error');
      const [b, c, p, m, s] = await Promise.all([bRes.json(), cRes.json(), pRes.json(), mRes.json(), sRes.json()]);
      if (b.success) setBookings(b.bookings);
      if (c.success) setCustomers(c.customers);
      if (p.success) setPackages(p.packages);
      if (m.success) setContacts(m.contacts);
      if (s.success && s.settings?.offerText) setOfferSettingText(s.settings.offerText);
    } catch {
      setServerError('Cannot reach server at port 5001. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('adminToken')) {
      setTimeout(() => {
        setAuth(true);
        fetchAll();
      }, 0);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); setAuthError('');
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('adminToken', data.token);
        setAuth(true);
        fetchAll();
      } else {
        setAuthError(data.message || 'Incorrect password.');
      }
    } catch {
      setAuthError('Cannot connect to server. Is the backend running?');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setAuth(false);
    setPassword('');
  };

  const handleStatusChange = async (id, status) => {
    try {
      await fetch(`${API}/api/bookings/${id}/status`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      if (selectedBooking?._id === id) setSelected(prev => ({ ...prev, status }));
      

    } catch (e) {
      console.error(e);
    }
  };

  // Packages CRUD Handlers
  const handleSavePackage = async (e) => {
    e.preventDefault();
    const payload = {
      ...pkgForm,
      price: pkgForm.price.toString(),
      features: pkgForm.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    try {
      let res;
      if (editingPackage) {
        res = await fetch(`${API}/api/packages/${editingPackage._id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API}/api/packages`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (data.success) {
        setIsPkgModalOpen(false);
        setPkgForm({ name: '', price: '', originalPrice: '', category: 'car', time: '', extra: '', features: '', badge: '', featured: false });
        setEditingPackage(null);
        fetchAll();
      }
    } catch (err) {
      console.error('Error saving package:', err);
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing package?')) return;
    try {
      const res = await fetch(`${API}/api/packages/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerText: offerSettingText })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage('Offer ticker text updated successfully!');
      } else {
        setSettingsMessage('Failed to update offer ticker.');
      }
    } catch (err) {
      console.error(err);
      setSettingsMessage('Error connecting to backend.');
    } finally {
      setSavingSettings(false);
    }
  };

  const openAddPkg = () => {
    setEditingPackage(null);
    setPkgForm({ name: '', price: '', originalPrice: '', category: 'car', time: '', extra: '', features: '', badge: '', featured: false });
    setIsPkgModalOpen(true);
  };

  const openEditPkg = (pkg) => {
    setEditingPackage(pkg);
    setPkgForm({
      name: pkg.name,
      price: pkg.price,
      originalPrice: pkg.originalPrice || '',
      category: pkg.category,
      time: pkg.time || '',
      extra: pkg.extra || '',
      features: pkg.features ? pkg.features.join(', ') : '',
      badge: pkg.badge || '',
      featured: pkg.featured || false
    });
    setIsPkgModalOpen(true);
  };

  // ─── FILTERING & SORTING LOGIC ──────────────────────────────────────────────
  const getFilteredBookings = () => {
    return bookings.filter(b => {
      // 1. Status Filter
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      
      // 2. Location Filter (Check reverse address string)
      if (locationFilter !== 'All') {
        const address = (b.location?.address || '').toLowerCase();
        if (!address.includes(locationFilter.toLowerCase())) return false;
      }

      // 3. Date Range Filter
      if (dateRange !== 'AllTime') {
        const bookingDate = new Date(b.createdAt || Date.now());
        const now = new Date();
        if (dateRange === 'Today') {
          if (bookingDate.toDateString() !== now.toDateString()) return false;
        } else if (dateRange === '7Days') {
          const diffTime = Math.abs(now - bookingDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 7) return false;
        } else if (dateRange === '30Days') {
          const diffTime = Math.abs(now - bookingDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 30) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // 4. Sort Ordering
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'highest-value') {
        const aVal = parseInt(a.servicePackage.match(/\d+/) || 0);
        const bVal = parseInt(b.servicePackage.match(/\d+/) || 0);
        return bVal - aVal;
      }
      return 0;
    });
  };

  // Analytics Computation Helper
  const getAnalytics = () => {
    const completed = bookings.filter(b => b.status === 'Completed');
    
    // Revenue by category
    let carRevenue = 0;
    let bikeRevenue = 0;
    let membershipRevenue = 0;

    // Location booking volume
    const locCounts = { 'Salamander Bay': 0, 'Orange': 0, 'Goulburn': 0, 'Greenhills': 0, 'Foster': 0, 'Dubbo': 0, 'Other': 0 };

    completed.forEach(b => {
      const price = parseInt(b.servicePackage.match(/\d+/) || 0);
      if (b.vehicleType === 'bike') bikeRevenue += price;
      else if (b.vehicleType === 'membership') membershipRevenue += price;
      else carRevenue += price;

      // Extract location matches
      const addr = (b.location?.address || '').toLowerCase();
      let matched = false;
      Object.keys(locCounts).forEach(loc => {
        if (loc !== 'Other' && addr.includes(loc.toLowerCase())) {
          locCounts[loc] += 1;
          matched = true;
        }
      });
      if (!matched) locCounts['Other'] += 1;
    });

    const totalCalculatedRevenue = carRevenue + bikeRevenue + membershipRevenue;

    return {
      carRevenue,
      bikeRevenue,
      membershipRevenue,
      totalCalculatedRevenue,
      locCounts,
      completedCount: completed.length
    };
  };

  const analytics = getAnalytics();
  const filteredList = getFilteredBookings();

  // ─── LOGIN DISPLAY ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-[#fafaf8]">
        <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-xl p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-indigo-50">
              <Lock className="w-8 h-8 text-[#1a3c6e]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1a3c6e]">Staff Portal</h2>
            <p className="text-sm text-[#8a8378] mt-1">Washly — Controls &amp; Analytics</p>
          </div>

          {authError && (
            <div className="flex gap-2 items-start p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label-premium">Access Password</label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="input-premium font-mono text-center tracking-[0.4em] text-lg"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Sign In to Control Center
            </button>
          </form>
          <p className="text-center text-[10px] text-[#8a8378] mt-6">
            Default passcode: <code className="bg-[#fafaf8] px-2 py-0.5 rounded font-mono text-[#1a3c6e]">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  // ─── ADMINISTRATIVE CONTROL PANEL ───────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 pb-16 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-[#e4e1da] shadow-sm">
          <div>
            <p className="section-eyebrow mb-1">Administrative Center</p>
            <h1 className="font-serif text-3xl font-bold text-[#1a3c6e]">Washly System Panel</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchAll} disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#fafaf8] border border-[#e4e1da] rounded-xl text-xs font-bold uppercase tracking-wider text-[#454340] hover:border-[#1a3c6e] transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-[#1a3c6e] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {serverError && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-6 shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold mb-0.5">Communication Error</div>
              {serverError}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-xl border border-[#e4e1da] shadow-sm w-fit">
          {[
            { id: 'bookings',  label: `Bookings (${bookings.length})`, icon: BookOpen },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'packages',  label: `Pricing CRUD (${packages.length})`, icon: Settings },
            { id: 'settings',  label: `Offer Ticker`, icon: RefreshCw },
            { id: 'messages',  label: `Messages (${contacts.length})`, icon: Mail },
            { id: 'analytics', label: 'Revenue Analysis', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? tab.id === 'packages' 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : tab.id === 'analytics' 
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : tab.id === 'messages'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-[#1a3c6e] text-white shadow-sm'
                  : 'text-[#8a8378] hover:text-[#1a3c6e]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════ TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-[#e4e1da] p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="label-premium">Booking Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-premium">
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="label-premium">Location / City</label>
                <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="input-premium">
                  <option value="All">All Locations</option>
                  <option value="Salamander Bay">Salamander Bay</option>
                  <option value="Orange">Orange</option>
                  <option value="Goulburn">Goulburn Square</option>
                  <option value="Greenhills">Greenhills</option>
                  <option value="Foster">Foster</option>
                  <option value="Dubbo">Dubbo</option>
                </select>
              </div>

              <div>
                <label className="label-premium">Booking Date Range</label>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="input-premium">
                  <option value="AllTime">All Time</option>
                  <option value="Today">Today Only</option>
                  <option value="7Days">Last 7 Days</option>
                  <option value="30Days">Last 30 Days</option>
                </select>
              </div>

              <div>
                <label className="label-premium">Sort Order</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-premium">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-value">Highest Value</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#e4e1da] bg-[#fafaf8]">
                      {['Customer details', 'Service Option', 'Schedule', 'GPS Coordinates / Location', 'Status', 'Actions', ''].map(h => (
                        <th key={h} className="py-3.5 px-5 text-[10px] font-black uppercase tracking-widest text-[#8a8378]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f2ee]">
                    {filteredList.length === 0 ? (
                      <tr><td colSpan={7} className="py-16 text-center text-sm text-[#8a8378]">No matching bookings found.</td></tr>
                    ) : filteredList.map(b => (
                      <tr key={b._id} className="hover:bg-[#fafaf8] transition-colors text-sm">
                        <td className="py-4 px-5">
                          <div className="font-semibold text-[#1a3c6e]">{b.name}</div>
                          <div className="text-xs text-[#8a8378] font-mono mt-0.5">{b.phone}</div>
                          {b.email && <div className="text-xs text-indigo-600 mt-0.5">{b.email}</div>}
                        </td>
                        <td className="py-4 px-5">
                          <span className={`tag-pill mb-1 inline-flex ${
                            b.vehicleType === 'bike' ? 'gold' : b.vehicleType === 'membership' ? 'green' : 'blue'
                          }`}>
                            {b.vehicleType}
                          </span>
                          <div className="font-bold text-[#1a3c6e]">{b.vehicleModel}</div>
                          <div className="text-xs text-[#8a8378]">{b.servicePackage}</div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-[#1a3c6e]">{b.bookingDate}</div>
                          <div className="text-xs text-[#8a8378]">{b.bookingTime}</div>
                        </td>
                        <td className="py-4 px-5 max-w-[200px] text-xs">
                          <div className="truncate text-[#8a8378]">{b.location?.address || '—'}</div>
                          {b.location?.latitude && (
                            <a href={`https://www.google.com/maps/search/?api=1&query=${b.location.latitude},${b.location.longitude}`} target="_blank" rel="noreferrer" className="text-[#2557a7] font-bold hover:underline flex items-center gap-0.5 mt-1">
                              <ExternalLink className="w-3 h-3" /> maps
                            </a>
                          )}
                        </td>
                        <td className="py-4 px-5">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="py-4 px-5">
                          <select
                            value={b.status}
                            onChange={e => handleStatusChange(b._id, e.target.value)}
                            className="text-xs border border-[#e4e1da] rounded-lg px-2 py-1.5 bg-white text-[#1a3c6e] focus:outline-none cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-5">
                          <button onClick={() => setSelected(b)} className="p-2 bg-[#fafaf8] rounded-xl hover:bg-slate-200 text-[#1a3c6e] transition-colors cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ TAB 2: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#e4e1da] bg-[#fafaf8]">
                    {['Phone (Loyalty ID)', 'Customer Name', 'Email Address', 'Booking Count', 'Created At'].map(h => (
                      <th key={h} className="py-3.5 px-5 text-[10px] font-black uppercase tracking-widest text-[#8a8378]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f2ee] text-sm">
                  {customers.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center text-sm text-[#8a8378]">No customer records located.</td></tr>
                  ) : customers.map(c => (
                    <tr key={c.phone} className="hover:bg-[#fafaf8] transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-[#c9922a]">{c.phone}</td>
                      <td className="py-4 px-5 font-bold text-[#1a3c6e]">{c.name}</td>
                      <td className="py-4 px-5 text-[#8a8378]">{c.email || '—'}</td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[rgba(26,60,110,0.08)] rounded-lg text-[#1a3c6e] font-black">
                          {c.bookingCount} visits
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-[#8a8378]">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ TAB 3: PACKAGES CRUD */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-[#e4e1da] shadow-sm">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1a3c6e]">Manage Pricing &amp; Memberships</h3>
                <p className="text-xs text-[#8a8378] mt-1">Dynamically create, update, or remove packages shown on the website.</p>
              </div>
              <button onClick={openAddPkg} className="btn-gold flex items-center gap-1.5 shadow cursor-pointer text-xs md:text-sm">
                <Plus className="w-4 h-4" /> Add Package Option
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map(pkg => (
                <div key={pkg._id} className="bg-white rounded-2xl border border-[#e4e1da] p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`tag-pill ${
                        pkg.category === 'bike' ? 'gold' : pkg.category === 'membership' ? 'green' : 'blue'
                      }`}>{pkg.category}</span>
                      <div className="text-right">
                        {pkg.originalPrice && (
                          <span className="text-xs font-bold line-through text-red-500/70 mr-1 block">
                            ₹{pkg.originalPrice}
                          </span>
                        )}
                        <span className="text-2xl font-black text-[#1a3c6e]">₹{pkg.price}</span>
                        {pkg.time && <span className="text-xs text-[#8a8378] block">/ {pkg.time}</span>}
                      </div>
                    </div>

                    <h4 className="font-bold text-[#1a3c6e] text-lg mb-2">{pkg.name}</h4>
                    <p className="text-xs text-[#8a8378] mb-4 italic">{pkg.extra || 'No extra info.'}</p>
                    
                    <div className="h-px bg-[#e4e1da] my-3" />
                    
                    <ul className="space-y-1.5 mb-6">
                      {(pkg.features || []).map((f, idx) => (
                        <li key={idx} className="text-xs text-[#454340] flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-[#e4e1da]">
                    <button onClick={() => openEditPkg(pkg)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-[#1a3c6e] hover:text-white rounded-lg text-xs font-bold transition-all text-[#1a3c6e] cursor-pointer">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDeletePackage(pkg._id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-all text-red-600 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ TAB 4: REVENUE ANALYSIS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Dynamic metrics summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#e4e1da] shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8a8378] mb-2">Completed Bookings Revenue</p>
                <div className="text-4xl font-black text-[#1a3c6e]" style={{ fontFamily: 'var(--font-display)' }}>
                  ₹{analytics.totalCalculatedRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Derived from {analytics.completedCount} completions
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e4e1da] shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8a8378] mb-2">Average Ticket Value</p>
                <div className="text-4xl font-black text-indigo-600" style={{ fontFamily: 'var(--font-display)' }}>
                  ₹{analytics.completedCount > 0 ? Math.round(analytics.totalCalculatedRevenue / analytics.completedCount) : 0}
                </div>
                <p className="text-xs text-[#8a8378] mt-2">Estimated average spend per vehicle wash</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#e4e1da] shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8a8378] mb-2">Retention Metric</p>
                <div className="text-4xl font-black text-emerald-600" style={{ fontFamily: 'var(--font-display)' }}>
                  {customers.length > 0 ? Math.round((bookings.length / customers.length) * 10) / 10 : 0}x
                </div>
                <p className="text-xs text-[#8a8378] mt-2">Average visits per distinct loyalty phone number</p>
              </div>
            </div>

            {/* Visual SVG chart panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#e4e1da] shadow-sm">
                <h4 className="font-serif text-lg font-bold text-[#1a3c6e] mb-6">Revenue Contribution by Category</h4>
                
                {/* SVG Visual Dials */}
                <div className="space-y-5">
                  {[
                    { category: 'Cars Wash Detailing', value: analytics.carRevenue, color: 'bg-[#1a3c6e]' },
                    { category: 'Bikes Wash Detailing', value: analytics.bikeRevenue, color: 'bg-[#c9922a]' },
                    { category: 'VIP Pass Memberships', value: analytics.membershipRevenue, color: 'bg-indigo-600' }
                  ].map(c => {
                    const percentage = analytics.totalCalculatedRevenue > 0 
                      ? Math.round((c.value / analytics.totalCalculatedRevenue) * 100) 
                      : 0;
                    return (
                      <div key={c.category}>
                        <div className="flex justify-between text-xs font-bold text-[#454340] mb-2">
                          <span>{c.category}</span>
                          <span>₹{c.value.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${c.color}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location Volume Chart */}
              <div className="bg-white p-6 rounded-2xl border border-[#e4e1da] shadow-sm">
                <h4 className="font-serif text-lg font-bold text-[#1a3c6e] mb-6">Completed Bookings by Vijayawada Studio</h4>
                <div className="space-y-4">
                  {Object.entries(analytics.locCounts).map(([loc, count]) => {
                    const maxVal = Math.max(...Object.values(analytics.locCounts), 1);
                    const widthPercent = Math.round((count / maxVal) * 100);
                    return (
                      <div key={loc} className="flex items-center gap-3">
                        <span className="w-28 text-xs font-semibold text-[#8a8378] truncate">{loc}</span>
                        <div className="flex-grow h-6 bg-slate-100 rounded overflow-hidden relative flex items-center">
                          <div className="h-full bg-slate-200" style={{ width: `${widthPercent}%` }}></div>
                          <span className="absolute left-2 text-[10px] font-bold text-[#1a3c6e]">{count} completions</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ TAB 5: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-sm p-6">
            <h3 className="font-serif text-2xl font-bold text-[#1a3c6e] mb-6">User Inquiry Messages</h3>
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-[#8a8378]">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#1a3c6e]" />
                <p className="font-bold">No inquiry messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((msg) => (
                  <div key={msg._id} className="p-5 rounded-xl border border-[#e4e1da] hover:border-[#1a3c6e]/40 transition-colors">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <h4 className="font-bold text-[#1a3c6e] text-base">{msg.name}</h4>
                        <a href={`mailto:${msg.email}`} className="text-xs text-[#2557a7] hover:underline font-semibold">{msg.email}</a>
                      </div>
                      <span className="text-xs text-[#8a8378] font-medium">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '—'}
                      </span>
                    </div>
                    {msg.subject && (
                      <div className="text-xs font-bold uppercase tracking-wider text-[#c9922a] mb-2">
                        Subject: {msg.subject}
                      </div>
                    )}
                    <p className="text-sm text-[#454340] leading-relaxed bg-[#fafaf8] p-4 rounded-lg border border-[#e4e1da]/60 whitespace-pre-wrap italic">
                      "{msg.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* ═══════════════════════════════════ TAB 6: SETTINGS (OFFER TICKER) */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#e4e1da] shadow-sm p-6 max-w-xl">
            <h3 className="font-serif text-2xl font-bold text-[#1a3c6e] mb-2">Offer Ticker Settings</h3>
            <p className="text-sm text-[#8a8378] mb-6">Configure the moving notification/offer bar displayed globally below the website navigation header.</p>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {settingsMessage && (
                <div className={`p-4 rounded-xl text-sm font-semibold border ${
                  settingsMessage.includes('successfully') 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {settingsMessage}
                </div>
              )}
              
              <div>
                <label className="label-premium">Offer Bar Text</label>
                <textarea
                  rows={4}
                  required
                  value={offerSettingText}
                  onChange={e => setOfferSettingText(e.target.value)}
                  className="input-premium"
                  placeholder="e.g. Special Opening Offer: Get up to 30% off on all Detailing services this weekend! Book now!"
                />
                <p className="text-xs text-[#8a8378] mt-1.5 leading-relaxed">
                  Tip: Use emojis like ✨, 🚨, or 🔥 to make the text stand out. This text scrolls automatically from right to left.
                </p>
              </div>
              
              <button 
                type="submit" 
                disabled={savingSettings}
                className="btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? 'Saving...' : 'Update Ticker text'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ─── MODAL: ADD/EDIT PACKAGE ───────────────────────────────────────── */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a3c6e] px-6 py-5 flex justify-between items-center text-white">
              <h3 className="font-bold uppercase tracking-wider text-sm">
                {editingPackage ? 'Edit Detailing Package' : 'Create Package'}
              </h3>
              <button onClick={() => setIsPkgModalOpen(false)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="label-premium">Package Name</label>
                <input required type="text" value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} className="input-premium" placeholder="e.g. Signature Wash" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-premium">Offer Price (₹)</label>
                  <input required type="number" value={pkgForm.price} onChange={e => setPkgForm({...pkgForm, price: e.target.value})} className="input-premium" placeholder="e.g. 899" />
                </div>
                <div>
                  <label className="label-premium">MRP / Original (₹)</label>
                  <input type="number" value={pkgForm.originalPrice} onChange={e => setPkgForm({...pkgForm, originalPrice: e.target.value})} className="input-premium" placeholder="e.g. 1299 (Optional)" />
                </div>
              </div>

              <div>
                <label className="label-premium">Time Estimate</label>
                <input type="text" value={pkgForm.time} onChange={e => setPkgForm({...pkgForm, time: e.target.value})} className="input-premium" placeholder="e.g. 35–45 min" />
              </div>

              <div>
                <label className="label-premium">Category</label>
                <select value={pkgForm.category} onChange={e => setPkgForm({...pkgForm, category: e.target.value})} className="input-premium">
                  <option value="car">Car Detailing</option>
                  <option value="bike">Bike Detailing</option>
                  <option value="membership">VIP Membership / Pass</option>
                </select>
              </div>

              <div>
                <label className="label-premium">Surcharge Note / Extra</label>
                <input type="text" value={pkgForm.extra} onChange={e => setPkgForm({...pkgForm, extra: e.target.value})} className="input-premium" placeholder="e.g. +₹200 SUV | Heavy Harleys" />
              </div>

              <div>
                <label className="label-premium">Highlights Badge (Optional)</label>
                <input type="text" value={pkgForm.badge} onChange={e => setPkgForm({...pkgForm, badge: e.target.value})} className="input-premium" placeholder="e.g. Popular, Starter, Best Value" />
              </div>

              <div>
                <label className="label-premium">Bullet Features (Comma Separated)</label>
                <textarea rows={3} value={pkgForm.features} onChange={e => setPkgForm({...pkgForm, features: e.target.value})} className="input-premium resize-none" placeholder="Feature 1, Feature 2, Feature 3" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="featured-check" checked={pkgForm.featured} onChange={e => setPkgForm({...pkgForm, featured: e.target.checked})} className="w-4 h-4 rounded text-[#1a3c6e] focus:ring-[#1a3c6e]" />
                <label htmlFor="featured-check" className="text-xs font-bold text-[#1a3c6e] uppercase tracking-wide cursor-pointer">Feature on main lists</label>
              </div>

              <button type="submit" className="btn-primary w-full justify-center mt-2 cursor-pointer">
                Save Package Config
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: VIEW BOOKING ───────────────────────────────────────────── */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a3c6e] px-6 py-5 flex justify-between items-center text-white">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Booking Spec Sheet</h3>
                <p className="text-white/60 text-xs font-mono mt-0.5">#{selectedBooking._id?.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <span className="text-[9px] font-black uppercase text-[#8a8378] tracking-widest block mb-1">Customer</span>
                  <div className="font-bold text-[#1a3c6e]">{selectedBooking.name}</div>
                  <div className="font-mono text-xs mt-0.5 text-[#454340]">{selectedBooking.phone}</div>
                  {selectedBooking.email && <div className="text-xs mt-0.5 text-[#8a8378]">{selectedBooking.email}</div>}
                </div>

                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <span className="text-[9px] font-black uppercase text-[#8a8378] tracking-widest block mb-1">Status</span>
                  <div className="mt-1"><StatusBadge status={selectedBooking.status} /></div>
                </div>
              </div>

              <div className="bg-[#fafaf8] rounded-xl p-4">
                <span className="text-[9px] font-black uppercase text-[#8a8378] tracking-widest block mb-2">Package Option</span>
                <div className="flex items-center gap-1.5 font-bold text-[#1a3c6e] uppercase text-sm mb-1">
                  {selectedBooking.vehicleType === 'bike' ? <Bike className="w-4 h-4 text-[#c9922a]" /> : <Car className="w-4 h-4 text-[#1a3c6e]" />}
                  {selectedBooking.vehicleType} &mdash; {selectedBooking.vehicleModel}
                </div>
                <div className="text-xs text-[#8a8378] font-semibold">{selectedBooking.servicePackage}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <span className="text-[9px] font-black uppercase text-[#8a8378] tracking-widest block mb-1">Date &amp; Time</span>
                  <div className="font-bold text-[#1a3c6e] text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c9922a]" /> {selectedBooking.bookingDate}
                  </div>
                  <div className="text-xs text-[#8a8378] mt-0.5">{selectedBooking.bookingTime}</div>
                </div>

                <div className="bg-[#fafaf8] rounded-xl p-4">
                  <span className="text-[9px] font-black uppercase text-[#8a8378] tracking-widest block mb-1">Update Status</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['Pending', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedBooking._id, status)}
                        className={`text-[9px] font-bold uppercase px-2 py-1 rounded transition-all cursor-pointer ${
                          selectedBooking.status === status
                            ? 'bg-[#1a3c6e] text-white'
                            : 'bg-white border border-[#e4e1da] text-[#8a8378]'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#fafaf8] rounded-xl p-4">
                <span className="text-[9px] font-black uppercase text-[#8a8378] tracking-widest block mb-2">Coordinates / Address</span>
                <p className="text-xs text-[#454340] leading-relaxed mb-2">{selectedBooking.location?.address || 'Onsite Location'}</p>
                {selectedBooking.location?.latitude && (
                  <div className="flex items-center gap-2 border-t border-[#e4e1da] pt-2 mt-2">
                    <span className="text-[10px] font-mono text-[#8a8378]">Lat: {selectedBooking.location.latitude}, Lon: {selectedBooking.location.longitude}</span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedBooking.location.latitude},${selectedBooking.location.longitude}`}
                      target="_blank" rel="noreferrer"
                      className="text-xs text-[#2557a7] font-bold hover:underline flex items-center gap-0.5 ml-auto"
                    >
                      <ExternalLink className="w-3 h-3" /> View Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
