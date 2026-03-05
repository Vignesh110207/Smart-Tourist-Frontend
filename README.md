# 🌍 Smart Tourist Management System — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-v6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A modern, responsive **React frontend** for the Smart Tourist Management System — built with Vite, React Router v6, Axios, and a sleek dark theme UI.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Pages](#-pages) • [Project Structure](#-project-structure)

</div>

---

## ✨ Features

- 🎨 **Dark Theme UI** — Modern glassmorphism design with gradient accents
- 🔐 **JWT Authentication** — Login, register, auto-logout on token expiry
- 🛡️ **Protected Routes** — Role-based route guards (Tourist / Admin)
- 🗺️ **Destination Browsing** — Search, filter by category, paginated results
- 📦 **Package Booking** — Select guide, date, persons with live price calculation
- ⭐ **Interactive Reviews** — Star rating system with review submission
- 📅 **My Bookings** — View and cancel own bookings with status tracking
- 📊 **Admin Dashboard** — Stats overview, booking management, add destinations
- ⚡ **Vite Proxy** — Development proxy to Spring Boot backend (no CORS issues)
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI Component Library |
| Vite | 5.0 | Build Tool & Dev Server |
| React Router DOM | v6 | Client-side Navigation |
| Axios | 1.6 | HTTP API Client |
| React Hot Toast | 2.4 | Toast Notifications |
| Lucide React | 0.460 | Icon Library |
| Context API | Built-in | Global State Management |

---

## 📋 Prerequisites

Make sure these are installed before running:

- ✅ **Node.js 18+** — [Download Node.js](https://nodejs.org/)
- ✅ **npm 9+** — Comes with Node.js
- ✅ **VS Code** (recommended) — [Download VS Code](https://code.visualstudio.com/)
- ✅ **Backend running** on `http://localhost:8080` — See [backend README](../backend/README.md)

---

## 🚀 Getting Started

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/smart-tourist-system.git
cd smart-tourist-system/smart-tourist-frontend
```

### Step 2 — Install Dependencies

```bash
npm install
```

> If you get a peer dependency error, use:
> ```bash
> npm install --legacy-peer-deps
> ```

### Step 3 — Start the Backend First

Make sure Spring Boot is running at `http://localhost:8080` before starting the frontend. The Vite proxy will forward all `/api` requests to the backend.

### Step 4 — Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:3000/
```

### Step 5 — Open in Browser

Visit **http://localhost:3000**

Login with the default admin account:
| Field | Value |
|---|---|
| Email | `admin@smarttour.com` |
| Password | `password` |

---

## 📁 Project Structure

```
smart-tourist-frontend/
│
├── index.html                         ← Root HTML (Vite requires at root)
├── vite.config.js                     ← Vite config: port 3000, proxy /api → :8080
├── package.json                       ← Dependencies and npm scripts
│
└── src/
    ├── main.jsx                       ← App entry point — ReactDOM.createRoot()
    ├── App.jsx                        ← Router setup + ProtectedRoute + AdminRoute
    ├── index.css                      ← Global styles, animations, scrollbar
    │
    ├── context/
    │   └── AuthContext.jsx            ← Global auth state — useAuth() hook
    │                                     Provides: user, login, register, logout, isAdmin
    │
    ├── services/
    │   └── api.js                     ← Axios instance + all API functions
    │                                     Interceptors: JWT header + 401 redirect
    │
    ├── components/
    │   └── common/
    │       ├── Navbar.jsx             ← Sticky navbar, user dropdown, active links
    │       ├── LoadingSpinner.jsx     ← Animated spinner (inline + fullPage modes)
    │       └── StarRating.jsx         ← Display or interactive 1-5 star ratings
    │
    └── pages/
        ├── HomePage.jsx               ← Hero, search, featured destinations, stats
        ├── LoginPage.jsx              ← Email/password form, show/hide password
        ├── RegisterPage.jsx           ← Name, email, phone, password form
        ├── DestinationsPage.jsx       ← Grid, category filter pills, search, pagination
        ├── DestinationDetailPage.jsx  ← Hero image, packages list, reviews, submit review
        ├── PackagesPage.jsx           ← Package cards with difficulty, price, slots
        ├── PackageDetailPage.jsx      ← Detail + booking form + guide select + price calc
        ├── GuidesPage.jsx             ← Guide cards with avatar, rating, availability
        ├── MyBookingsPage.jsx         ← 🔒 Auth — booking history + cancel button
        └── AdminDashboardPage.jsx     ← 🔒 Admin — stats, bookings table, add destination
```

---

## 📱 Pages

| Page | Route | Access | Description |
|---|---|---|---|
| Home | `/` | Public | Hero section, featured destinations, stats, CTA |
| Login | `/login` | Public | Email/password login with JWT |
| Register | `/register` | Public | Create new tourist account |
| Destinations | `/destinations` | Public | Browse all destinations with search & category filter |
| Destination Detail | `/destinations/:id` | Public | View destination, packages, reviews |
| Packages | `/packages` | Public | Browse all tour packages |
| Package Detail | `/packages/:id` | Public | View package details and book |
| Guides | `/guides` | Public | Browse all available guides |
| My Bookings | `/my-bookings` | 🔒 Auth | View and cancel own bookings |
| Admin Dashboard | `/admin` | 🔒 Admin | Stats, manage bookings, add destinations |

---

## 🔌 API Integration

All API calls are in `src/services/api.js`. The Vite dev proxy forwards `/api` requests to `http://localhost:8080`.

### API Modules

```javascript
authAPI        → /api/auth/login, /api/auth/register
destinationAPI → /api/destinations
packageAPI     → /api/packages
bookingAPI     → /api/bookings
guideAPI       → /api/guides
reviewAPI      → /api/reviews
adminAPI       → /api/admin/dashboard
```

### How Authentication Works

```
1. User logs in → POST /api/auth/login
2. Backend returns JWT token
3. Token saved to localStorage
4. Every request: axios interceptor adds Authorization: Bearer <token>
5. If 401 received: interceptor clears token and redirects to /login
```

---

## 🔐 Route Protection

Two custom route guards are implemented in `App.jsx`:

**ProtectedRoute** — Requires any authenticated user:
```jsx
<Route path="/my-bookings" element={
  <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
} />
```

**AdminRoute** — Requires ADMIN role:
```jsx
<Route path="/admin" element={
  <AdminRoute><AdminDashboardPage /></AdminRoute>
} />
```

If conditions are not met, users are redirected to `/login` or `/` respectively.

---

## ⚙️ Vite Configuration

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',   ← All /api calls go to Spring Boot
        changeOrigin: true,
      }
    }
  }
})
```

The proxy means `/api/destinations` in React code automatically calls `http://localhost:8080/api/destinations` — no CORS issues during development.

---

## 🧩 Key Components

### Navbar
- Sticky navigation bar with SmartTour logo
- Shows active page with highlight
- User dropdown with name, role badge, My Bookings, Admin Dashboard links
- Login / Sign Up buttons when not authenticated
- Closes dropdown on outside click using `useRef`

### AuthContext
Global authentication state available to all components via `useAuth()` hook:

```javascript
const { user, login, register, logout, isAdmin } = useAuth()

// user object:
{
  id: 1,
  name: "Admin User",
  email: "admin@smarttour.com",
  role: "ADMIN",
  accessToken: "eyJ..."
}
```

### StarRating
Reusable star rating component with two modes:

```jsx
// Display mode (read-only)
<StarRating rating={4} size={16} />

// Interactive mode (for submitting reviews)
<StarRating rating={rating} size={24} interactive onRate={(r) => setRating(r)} />
```

### LoadingSpinner

```jsx
// Inline spinner
<LoadingSpinner size={30} />

// Full page centered spinner
<LoadingSpinner fullPage />
```

---

## 🎨 Design System

| Element | Value |
|---|---|
| Background | `#070d1a` — Deep dark navy |
| Surface | `rgba(255,255,255,0.03)` — Glassmorphism cards |
| Primary | `#06b6d4` — Cyan accent |
| Secondary | `#3b82f6` — Blue accent |
| Text Primary | `#e2e8f0` — Light gray |
| Text Muted | `#475569` — Medium gray |
| Border | `rgba(255,255,255,0.07)` — Subtle border |
| Success | `#22c55e` — Green |
| Error | `#ef4444` — Red |

All styles are written as **inline styles** in JSX — no external CSS files required per component.

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server on port 3000
npm run build      # Build for production (output in /dist)
npm run preview    # Preview production build locally
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `Failed to resolve import "../services/api"` | Make sure `src/services/api.js` exists |
| `npm install` ERESOLVE error | Run `npm install --legacy-peer-deps` |
| White screen / no data | Make sure Spring Boot backend is running on port 8080 |
| `Network Error` in console | Backend not running — start `SmartTouristApplication.java` |
| Login shows 401 error | Run seed SQL to insert admin user in database |
| `Port 3000 already in use` | Change `port: 3000` to `port: 3001` in `vite.config.js` |
| Images not loading | Unsplash images need internet connection |
| Infinite loading spinner | Check browser console (F12) for API error details |
| Changes not reflecting | Hard refresh with `Ctrl + Shift + R` |

---

## 🔗 Related

- 📦 [Backend Repository](../backend) — Spring Boot REST API
- 📚 [Learning Guide](../docs/Smart_Tourist_Learning_Guide.docx) — Complete concept explanations

---

## 👨‍💻 Default Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@smarttour.com | password |
| Tourist | Register via `/register` | Any password |

---

## 📄 License

This project is for educational purposes.

---

<div align="center">
Built with ❤️ using React 18 + Vite + Axios + React Router v6
</div>
