# 🚛 HERE Fleet — Live Vehicle Tracking Dashboard

A real-time fleet tracking dashboard built with vanilla HTML, CSS, and JavaScript using Leaflet.js and OpenStreetMap. Inspired by HERE Technologies' location intelligence platform used by companies like BMW, Uber, and Ford.

**[Live Demo →](https://your-netlify-link.netlify.app)**

---

## 📸 Preview

> Dashboard features a warm, professional UI with a 3-panel layout — vehicle list, interactive map, and live detail panel.

---

## ✨ Features

- **Live vehicle tracking** — 6 vehicles simulated moving on a real interactive map in real time
- **Custom map markers** — color-coded by status: Moving 🟢 / Idle 🟡 / Alert 🔴
- **Click to inspect** — click any vehicle to fly the map to it, open a popup, and load its full details in the right panel
- **Route visualization** — a dashed route line draws from the vehicle to its destination on selection
- **Search & filter** — search vehicles by name, driver, or ID; filter by status (All / Moving / Idle / Alert)
- **Live stats** — real-time count of active, idle, and alert vehicles plus average fleet speed
- **Dismissible alerts** — overspeed and low-fuel alerts with one-click dismiss
- **Live clock** — real-time clock in the topbar

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, CSS Grid layout, animations |
| JavaScript (ES6) | Interactivity, data simulation, DOM updates |
| Leaflet.js | Interactive map rendering and marker management |
| OpenStreetMap | Free map tile provider |
| Netlify | Deployment and hosting |

---

## 📁 Project Structure

```
fleet-tracking-dashboard/
│
├── index.html       # Main HTML — structure only, no inline styles
├── style.css        # All styles — design tokens, layout, components
└── README.md        # Project documentation
```

CSS is fully separated from HTML following professional frontend architecture standards.

---

## 🚀 How to Run Locally

No installation needed. No npm. No server.

1. Clone this repository
```bash
git clone https://github.com/YOUR_USERNAME/fleet-tracking-dashboard.git
```

2. Open the folder in VS Code

3. Right click `index.html` → **Open with Live Server**
   *(Install the Live Server extension by Ritwick Dey if not already installed)*

   OR simply double-click `index.html` to open in your browser directly.

---

## 🔧 How It Works

### Data Layer
Vehicle data is stored as a JavaScript array of objects — each with an ID, name, coordinates (lat/lng), status, speed, fuel level, driver name, and destination. In a production system, this would be fetched from a REST API.

### Map Rendering
Leaflet.js initializes on the `<div id="map">` element and loads map tiles from OpenStreetMap's free CDN. Each vehicle is placed on the map using a custom `divIcon` — a styled HTML div rendered as a map marker.

### Real-Time Movement Simulation
`setInterval()` fires every 2 seconds and nudges each moving vehicle's `lat` and `lng` values by a small random offset. Leaflet's `setLatLng()` method repositions the marker on the map, creating smooth simulated movement — no backend or GPS required.

### Vehicle Selection Flow
```
User clicks marker or sidebar card
        ↓
selectVehicle(id) runs
        ↓
map.flyTo() animates camera to vehicle
        ↓
Popup opens with vehicle info
        ↓
Route polyline draws to destination
        ↓
Right panel DOM updates with full details
```

### Search & Filter
Search uses JavaScript's `.filter()` and `.includes()` on the vehicle array to match query against name, driver, and ID. Status filter buttons toggle a `currentStatusFilter` variable that re-renders the sidebar list.

---

## 🗺️ Relevance to HERE Technologies

HERE Technologies provides location intelligence, mapping, and fleet management APIs to enterprise clients worldwide. This dashboard simulates the kind of UI their engineering teams build — interactive map overlays, real-time vehicle status monitoring, alert systems, and geospatial data visualization.

The project directly demonstrates skills relevant to HERE's UI Design & Engineering role:
- Interactive map UI with Leaflet.js
- Real-time data rendering and DOM updates
- Responsive 3-panel dashboard layout
- Component-based UI architecture
- Data visualization (stats cards, speed bar, status badges)

---

## 👩‍💻 Author

**Vaidehi Bhamre**
Frontend Developer | MIT-WPU, Pune

- Portfolio: [https://vaidehibhamre.netlify.app/]
- GitHub: [https://github.com/vaidehi-bhamre]

---

## 📄 License

MIT License — free to use and modify.
