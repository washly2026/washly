# Majestic 1 Car & Bike Wash - Fullstack Web Application

A premium, fullstack car and bike wash website featuring a responsive customer-facing site, a one-click geolocation address lock for mobile bookings, and a private, dashboard-driven admin panel.

## Features

### 1. Customer Side (Public Facing Website)
- **Home**: Banner, car wash summaries, and an easy-access dedicated motorcycle wash showcase section.
- **Services**: Tabbed view to switch between Car Wash (9 packages) and Bike Wash (3 packages) detailing service lists.
- **Pricing**: Dynamic pricing comparison grids for different vehicle types.
- **About Us**: Detail showing scratch-free hand washing processes, eco-friendly water reclamation, and client review.
- **Book Now Form**:
  - Automatically captures selected services via URL parameters.
  - **1-Click Location Lock**: Uses the browser's Geolocation API to lock coordinates and fetches reverse geocoding addresses via OpenStreetMap (Nominatim API) to lock wash locations.
  - Phone number as primary identifier for database logging.

### 2. Admin Side (`/admin`)
- **Login screen**: Password credentials shield to prevent direct customer access.
- **Bookings Tab**: Management table to sort bookings, update wash status (Pending, In Progress, Completed, Cancelled), inspect details, and open locked coordinates directly in Google Maps.
- **Customers Tab**: Displays permanent customer records showing their name, email, and cumulative booking count.
- **Stats Metrics Bar**: Analytics reporting estimated revenue, pending counts, and total active users.

---

## Tech Stack
- **Frontend**: React (Vite), JavaScript, Tailwind CSS (v4), Framer Motion, Lucide Icons, React Router DOM.
- **Backend**: Node.js, Express, Mongoose (MongoDB ORM), CORS, Dotenv.
- **Database**: MongoDB (with automated JSON file database fallback `server/db/` so the application runs out of the box even without MongoDB services active).

---

## Installation & Launch

### Prerequisites
Ensure [Node.js](https://nodejs.org/) is installed.

### Setup Instructions

1. **Install Dependencies**:
   Run the following command in the root folder to install root, client, and server packages:
   ```bash
   npm run install-all
   ```

2. **Configure Database**:
   - By default, the application runs on a local JSON file database backup if MongoDB isn't running.
   - If you have MongoDB installed, make sure it is running locally or specify your URI in `server/.env`:
     ```env
     MONGODB_URI=mongodb://localhost:27017/carwash
     PORT=5001
     ADMIN_PASSWORD=admin123
     ```

3. **Start the Application**:
   Run the root development command to launch BOTH the frontend (Vite) and backend (Express) concurrently:
   ```bash
   npm run dev
   ```

   - **Frontend (Client)**: http://localhost:5173
   - **Backend (API Server)**: http://localhost:5001
   - **Admin Portal**: http://localhost:5173/admin (Default password: `admin123`)
