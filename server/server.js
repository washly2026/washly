const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Database connection logic
let isMongoConnected = false;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carwash';

const dbFolder = path.join(__dirname, 'db');
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder);
}

const bookingsFile = path.join(dbFolder, 'bookings.json');
const customersFile = path.join(dbFolder, 'customers.json');
const packagesFile = path.join(dbFolder, 'packages.json');
const contactsFile = path.join(dbFolder, 'contacts.json');

// Initialize local JSON files if they don't exist
if (!fs.existsSync(bookingsFile)) fs.writeFileSync(bookingsFile, JSON.stringify([]));
if (!fs.existsSync(customersFile)) fs.writeFileSync(customersFile, JSON.stringify([]));
if (!fs.existsSync(contactsFile)) fs.writeFileSync(contactsFile, JSON.stringify([]));

// Default packages list in Indian Rupees (₹) for Vijayawada, AP
const defaultPackages = [
  // Cars
  { name: 'Express Wash', price: '499', category: 'car', time: '20–30 min', extra: '+₹200 SUV/Wagon | +₹300 Luxury', features: ['Premium foam hand wash', 'Wheels & rims cleaned', 'Microfiber spotless dry', 'Exterior glass cleared', 'Running board wipe-down'], badge: 'Quick', featured: false },
  { name: 'Signature Wash', price: '899', category: 'car', time: '35–45 min', extra: '+₹200 SUV/Wagon | +₹300 Luxury', featured: true, features: ['Express Wash included', 'Full interior vacuuming', 'Dashboard & console detailed', 'Windows cleaned inside & out', 'Premium tyre dressing & shine', 'Air freshener spray'], badge: 'Popular', featured: true },
  { name: 'Top Seller Wash', price: '1299', category: 'car', time: '50–60 min', extra: '+₹200 SUV/Wagon | +₹300 Luxury', features: ['Signature Wash included', 'Bug, sand & tar removal', 'Door panels deep cleaned', 'High-gloss spray wax shield', 'Boot/trunk vacuumed'], badge: 'Best Value', featured: false },
  { name: 'Perfect Polish', price: '2499', category: 'car', time: '90–120 min', extra: '+₹300 SUV/Wagon | +₹500 Luxury', features: ['Top Seller Wash included', 'Full clay bar treatment', 'Tar & tree sap extraction', 'Premium machine buff-polish', 'Long-lasting paint sealant guard'], badge: 'Premium', featured: false },
  { name: 'Mini Detail', price: '3999', category: 'car', time: '90–120 min', extra: '+₹300 SUV/Wagon | +₹500 Luxury', features: ['Signature Wash included', 'Engine bay dry-cleaning', 'Exterior trim restoration', 'Chrome metal components polished', 'Leather seat clean & cream care'], badge: 'Detail', featured: false },
  { name: 'Interior Detail', price: '5499', category: 'car', time: '3–4 hours', extra: '+₹400 SUV/Wagon | +₹600 Luxury', features: ['Signature Wash included', 'Steam clean seats, roof & carpets', 'Hot-water extraction shampooing', 'Odor neutralization treatment', 'Dashboard UV protectant finish'], badge: 'Interior', featured: false },
  { name: 'Paint Restoring', price: '7999', category: 'car', time: '3–4 hours', extra: '+₹500 SUV/Wagon | +₹800 Luxury', features: ['Top Seller Wash included', 'Multi-stage paint correction', 'Swirl mark & minor scratch reduction', 'High-performance polymer sealant', 'Deep mirror-glaze finish'], badge: 'Restore', featured: false },
  { name: 'Detail Deluxe', price: '9999', category: 'car', time: '4–5 hours', extra: '+₹500 SUV/Wagon | +₹800 Luxury', features: ['Perfect Polish included', 'Complete interior steam cleaning', 'Wheel hub detailing & polish', 'Full undercarriage washing', 'Premium Carnauba wax shield'], badge: 'Deluxe', featured: false },
  { name: 'Showroom Detail', price: '14999', category: 'car', time: 'Full Day', extra: '+₹800 SUV/Wagon | +₹1200 Luxury', features: ['Paint Restoring included', 'Detail Deluxe included', '1-Year Ceramic Coating protection', 'Glass water-repellent treatment', 'Premium alloy wheel sealant guard'], badge: 'Elite', featured: false },
  
  // Bikes
  { name: 'Express Bike Wash', price: '299', category: 'bike', time: '15–20 min', extra: 'All standard motorcycles', features: ['pH-neutral foam pre-soak', 'Hand wash & precision rinse', 'Blower forced-air dry (spot-free)', 'Chain lubrication & dressing', 'Tyre wall detailing'], badge: 'Quick', featured: false },
  { name: 'Signature Bike Wash', price: '599', category: 'bike', time: '35–45 min', extra: '+₹100 Cruiser / Superbike', featured: true, features: ['Express Bike Wash included', 'Bug, tar & asphalt removal', 'Chrome & exhaust pipe polish', 'Chain deep clean & re-lube', 'Hand spray wax coating', 'Cockpit & visor polished'], badge: 'Popular', featured: true },
  { name: 'Detail Deluxe Bike Wash', price: '1499', category: 'bike', time: '90–120 min', extra: '+₹250 Cruiser / Superbike', features: ['Signature Bike Wash included', 'Engine bay & crankcase clean', 'Scratch reduction buffing', 'Ultra paint sealant guard', 'Leather seat clean & condition', 'Spoke & hub detail polish'], badge: 'Premium', featured: false },

  // Memberships
  { name: 'Silver Pass', price: '1999', category: 'membership', time: 'Monthly', extra: 'Priority Scheduling', features: ['2× Signature Car or Bike washes per month', 'Priority booking queue', 'Free wheel detailing on every visit', '10% off any detailing packages'], badge: 'Starter', featured: false },
  { name: 'Gold VIP Pass', price: '3499', category: 'membership', time: 'Monthly', extra: 'Best Value Membership', features: ['Unlimited Express washes', '2× Signature washes per month', '1× Interior steam sanitize per year', '15% discount on detailing packages', 'Dedicated VIP account manager'], badge: 'Most Popular', featured: true },
  { name: 'Platinum Elite Pass', price: '5999', category: 'membership', time: 'Monthly', extra: 'All-Inclusive Detailing', features: ['Unlimited Signature washes (Car/Bike)', '1× Detail Deluxe package per month', 'Unlimited GPS geolocated mobile visits', '25% discount on all custom detailing', 'Complimentary replacement car option'], badge: 'Elite', featured: false }
];

const shouldSeedLocal = !fs.existsSync(packagesFile) || 
                         fs.statSync(packagesFile).size === 0 || 
                         fs.readFileSync(packagesFile, 'utf-8').trim() === '[]';
if (shouldSeedLocal) {
  fs.writeFileSync(packagesFile, JSON.stringify(defaultPackages, null, 2));
}

// Helper functions for JSON database fallback
const readLocalJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    let parsed = JSON.parse(data);
    if (filePath.endsWith('packages.json') && Array.isArray(parsed)) {
      let changed = false;
      parsed = parsed.map((p, idx) => {
        if (!p._id) {
          p._id = `local-pkg-${idx + 1}`;
          changed = true;
        }
        return p;
      });
      if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
      }
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeLocalJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
};

// Establish MongoDB connection (optional fallback)
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    isMongoConnected = true;
    seedDatabaseIfNeeded();
  })
  .catch((err) => {
    console.warn('MongoDB connection failed. Using local JSON files as fallback database.', err.message);
    isMongoConnected = false;
  });

// Define Mongoose Schemas (if MongoDB is used)
const CustomerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  bookingCount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  vehicleType: { type: String, required: true }, // 'car' or 'bike' or 'membership'
  vehicleModel: { type: String, required: true },
  servicePackage: { type: String, required: true },
  bookingDate: { type: String, required: true },
  bookingTime: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  status: { type: String, default: 'Pending' }, // Pending, In Progress, Completed, Cancelled
  createdAt: { type: Date, default: Date.now }
});

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true }, // 'car', 'bike', 'membership'
  time: { type: String, default: '' },
  extra: { type: String, default: '' },
  features: [{ type: String }],
  badge: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', CustomerSchema);
const Booking = mongoose.model('Booking', BookingSchema);
const Package = mongoose.model('Package', PackageSchema);
const Contact = mongoose.model('Contact', ContactSchema);

// Seed MongoDB with default packages if empty
async function seedDatabaseIfNeeded() {
  try {
    // If currency changed, re-sync packages to India rates
    await Package.deleteMany({});
    await Package.insertMany(defaultPackages);
    console.log('Seeded dynamic Indian Rupee packages to MongoDB.');
  } catch (err) {
    console.error('Error seeding packages:', err);
  }
}

// Admin Authentication Configuration
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'washly2514@gmail.com').trim();

// Setup Nodemailer Mail Transporter for Gmail (Forcing IPv4 to prevent ENETUNREACH IPv6 errors)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: (process.env.EMAIL_USER || 'washly2514@gmail.com').trim(),
    pass: (process.env.EMAIL_PASS || '').trim() // Added via .env
  },
  family: 4 // Forces IPv4 DNS resolution
});

// Helper function to send booking email notification to Admin
async function sendBookingEmail(booking) {
  const mailOptions = {
    from: `"Washly Booking Alert" <no-reply@washly.com.au>`,
    to: ADMIN_EMAIL,
    subject: `🚨 New Booking Received: ${booking.name} (${booking.vehicleType.toUpperCase()})`,
    html: `
      <h2>New Booking Details</h2>
      <table style="width:100%; border-collapse:collapse; font-family:sans-serif; margin-bottom:20px;">
        <tr style="background:#f4f2ee;"><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Customer Name</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.name}</td></tr>
        <tr><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Phone Number</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.phone}</td></tr>
        <tr style="background:#f4f2ee;"><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Email Address</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.email || 'N/A'}</td></tr>
        <tr><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Vehicle Type</td><td style="padding:10px; border:1px solid #e4e1da; text-transform:uppercase;">${booking.vehicleType}</td></tr>
        <tr style="background:#f4f2ee;"><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Model/Make</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.vehicleModel}</td></tr>
        <tr><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Service/Package</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.servicePackage}</td></tr>
        <tr style="background:#f4f2ee;"><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Date & Time</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.bookingDate} at ${booking.bookingTime}</td></tr>
        <tr><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Address</td><td style="padding:10px; border:1px solid #e4e1da;">${booking.location?.address || 'N/A'}</td></tr>
        <tr style="background:#f4f2ee;"><td style="padding:10px; border:1px solid #e4e1da; font-weight:bold;">Coordinates</td><td style="padding:10px; border:1px solid #e4e1da;">Lat: ${booking.location?.latitude || 'N/A'}, Lon: ${booking.location?.longitude || 'N/A'}</td></tr>
      </table>
      <p style="font-size:12px; color:#8a8378;">This is an automated notification. To manage this booking, please sign in to the Staff Portal.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Booking notification email successfully sent. MessageId: ${info.messageId}`);
  } catch (err) {
    console.error('Nodemailer failed to send email. Falling back to log print:', err.message);
  }
}

// Helper to send contact form to Admin
async function sendContactEmail(contact) {
  const mailOptions = {
    from: `"Washly Contact Portal" <no-reply@washly.com.au>`,
    to: ADMIN_EMAIL,
    subject: `✉️ New Contact Message from ${contact.name}: ${contact.subject || 'No Subject'}`,
    html: `
      <h2>New Contact Form Inquiry</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
      <p><strong>Message:</strong></p>
      <div style="background:#f4f2ee; padding:15px; border-radius:8px; border:1px solid #e4e1da; font-style:italic; font-family:sans-serif;">
        ${contact.message}
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact form notification email successfully sent.`);
  } catch (err) {
    console.error('Failed to send contact notification email:', err.message);
  }
}

// API ROUTES

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'mock-admin-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// Bookings routes
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, email, vehicleType, vehicleModel, servicePackage, bookingDate, bookingTime, location } = req.body;

    if (!name || !phone || !vehicleType || !vehicleModel || !servicePackage || !bookingDate || !bookingTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let savedBooking;
    if (isMongoConnected) {
      const newBooking = new Booking({
        name, phone, email, vehicleType, vehicleModel, servicePackage, bookingDate, bookingTime, location, status: 'Pending'
      });
      savedBooking = await newBooking.save();

      let customer = await Customer.findOne({ phone });
      if (customer) {
        customer.bookingCount += 1;
        customer.name = name;
        if (email) customer.email = email;
        await customer.save();
      } else {
        customer = new Customer({ phone, name, email, bookingCount: 1 });
        await customer.save();
      }
    } else {
      const bookings = readLocalJSON(bookingsFile);
      const customers = readLocalJSON(customersFile);

      const newBooking = {
        _id: 'b_' + Math.random().toString(36).substr(2, 9),
        name, phone, email, vehicleType, vehicleModel, servicePackage, bookingDate, bookingTime, location, status: 'Pending', createdAt: new Date()
      };
      bookings.push(newBooking);
      writeLocalJSON(bookingsFile, bookings);
      savedBooking = newBooking;

      let customerIndex = customers.findIndex(c => c.phone === phone);
      if (customerIndex !== -1) {
        customers[customerIndex].bookingCount += 1;
        customers[customerIndex].name = name;
        if (email) customers[customerIndex].email = email;
      } else {
        const newCustomer = { phone, name, email, bookingCount: 1, createdAt: new Date() };
        customers.push(newCustomer);
      }
      writeLocalJSON(customersFile, customers);
    }

    sendBookingEmail(savedBooking);
    res.status(201).json({ success: true, booking: savedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating booking' });
  }
});

// Get bookings (Admin only)
app.get('/api/bookings', async (req, res) => {
  try {
    if (isMongoConnected) {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      res.json({ success: true, bookings });
    } else {
      const bookings = readLocalJSON(bookingsFile);
      const sorted = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json({ success: true, bookings: sorted });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching bookings' });
  }
});

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (isMongoConnected) {
      const updatedBooking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      res.json({ success: true, booking: updatedBooking });
    } else {
      const bookings = readLocalJSON(bookingsFile);
      const index = bookings.findIndex(b => b._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
      bookings[index].status = status;
      writeLocalJSON(bookingsFile, bookings);
      res.json({ success: true, booking: bookings[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get permanent customers
app.get('/api/customers', async (req, res) => {
  try {
    if (isMongoConnected) {
      const customers = await Customer.find().sort({ bookingCount: -1 });
      res.json({ success: true, customers });
    } else {
      const customers = readLocalJSON(customersFile);
      const sorted = [...customers].sort((a, b) => b.bookingCount - a.bookingCount);
      res.json({ success: true, customers: sorted });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Contact Us forms routes
app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let savedContact;
    if (isMongoConnected) {
      const newContact = new Contact({ name, email, subject, message });
      savedContact = await newContact.save();
    } else {
      const contacts = readLocalJSON(contactsFile);
      const newContact = {
        _id: 'c_' + Math.random().toString(36).substr(2, 9),
        name, email, subject, message, createdAt: new Date()
      };
      contacts.push(newContact);
      writeLocalJSON(contactsFile, contacts);
      savedContact = newContact;
    }

    sendContactEmail(savedContact);
    res.status(201).json({ success: true, contact: savedContact });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ success: false, message: 'Server error saving contact message' });
  }
});

// Get contact inquiries (Admin only)
app.get('/api/contacts', async (req, res) => {
  try {
    if (isMongoConnected) {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json({ success: true, contacts });
    } else {
      const contacts = readLocalJSON(contactsFile);
      const sorted = [...contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      res.json({ success: true, contacts: sorted });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching contact messages' });
  }
});

// ─── PACKAGES CRUD API ───
app.get('/api/packages', async (req, res) => {
  try {
    if (isMongoConnected) {
      const packages = await Package.find().sort({ createdAt: 1 });
      res.json({ success: true, packages });
    } else {
      const packages = readLocalJSON(packagesFile);
      res.json({ success: true, packages });
    }
  } catch (error) {
    res.status(500).json({ success: true, packages: defaultPackages });
  }
});

app.post('/api/packages', async (req, res) => {
  try {
    const { name, price, category, time, extra, features, badge, featured } = req.body;
    if (isMongoConnected) {
      const newPkg = new Package({ name, price, category, time, extra, features, badge, featured });
      await newPkg.save();
      res.status(201).json({ success: true, package: newPkg });
    } else {
      const packages = readLocalJSON(packagesFile);
      const newPkg = {
        _id: 'p_' + Math.random().toString(36).substr(2, 9),
        name, price, category, time, extra, features, badge, featured, createdAt: new Date()
      };
      packages.push(newPkg);
      writeLocalJSON(packagesFile, packages);
      res.status(201).json({ success: true, package: newPkg });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding package' });
  }
});

app.put('/api/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, time, extra, features, badge, featured } = req.body;
    if (isMongoConnected) {
      const updated = await Package.findByIdAndUpdate(id, { name, price, category, time, extra, features, badge, featured }, { new: true });
      res.json({ success: true, package: updated });
    } else {
      const packages = readLocalJSON(packagesFile);
      const index = packages.findIndex(p => p._id === id);
      if (index === -1) return res.status(404).json({ success: false, message: 'Not found' });
      packages[index] = { ...packages[index], name, price, category, time, extra, features, badge, featured };
      writeLocalJSON(packagesFile, packages);
      res.json({ success: true, package: packages[index] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating package' });
  }
});

app.delete('/api/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Package.findByIdAndDelete(id);
      res.json({ success: true });
    } else {
      const packages = readLocalJSON(packagesFile);
      const filtered = packages.filter(p => p._id !== id);
      writeLocalJSON(packagesFile, filtered);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting package' });
  }
});

// Stats dashboard endpoint
app.get('/api/stats', async (req, res) => {
  try {
    let bookings = [];
    let customers = [];
    if (isMongoConnected) {
      bookings = await Booking.find();
      customers = await Customer.find();
    } else {
      bookings = readLocalJSON(bookingsFile);
      customers = readLocalJSON(customersFile);
    }
    const totalBookings = bookings.length;
    const totalCustomers = customers.length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;
    const inProgressBookings = bookings.filter(b => b.status === 'In Progress').length;
    
    const revenue = bookings.reduce((sum, b) => {
      if (b.status !== 'Completed') return sum;
      const num = b.servicePackage.match(/\d+/);
      return sum + (num ? parseInt(num[0]) : 0);
    }, 0);

    res.json({
      success: true,
      stats: { totalBookings, totalCustomers, pendingBookings, completedBookings, inProgressBookings, revenue }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'alive',
    timestamp: new Date(),
    databaseConnected: isMongoConnected
  });
});
