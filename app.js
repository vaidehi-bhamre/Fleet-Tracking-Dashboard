// ═══════════════════════════════════════════
//  STEP 1 — DATA
// ═══════════════════════════════════════════

const VEHICLES = [
  {
    id: "VH-001",
    name: "Mumbai Cargo Truck",
    lat: 19.076,
    lng: 72.877,
    status: "moving",
    speed: 62,
    fuel: 78,
    driver: "Rajan Mehta",
    destination: "Pune Depot",
  },
  {
    id: "VH-002",
    name: "Pune Delivery Van",
    lat: 18.52,
    lng: 73.856,
    status: "idle",
    speed: 0,
    fuel: 45,
    driver: "Priya Shah",
    destination: "Hinjewadi Hub",
  },
  {
    id: "VH-003",
    name: "Nashik Supply Truck",
    lat: 19.997,
    lng: 73.789,
    status: "moving",
    speed: 55,
    fuel: 91,
    driver: "Amit Patil",
    destination: "Mumbai Port",
  },
  {
    id: "VH-004",
    name: "Navi Mumbai Van",
    lat: 19.033,
    lng: 73.029,
    status: "alert",
    speed: 88,
    fuel: 22,
    driver: "Sunita Rao",
    destination: "Thane Yard",
  },
  {
    id: "VH-005",
    name: "Aurangabad Courier",
    lat: 19.877,
    lng: 75.343,
    status: "moving",
    speed: 71,
    fuel: 60,
    driver: "Karan Joshi",
    destination: "Osmanabad",
  },
  {
    id: "VH-006",
    name: "Kolhapur Logistics",
    lat: 16.705,
    lng: 74.243,
    status: "idle",
    speed: 0,
    fuel: 33,
    driver: "Meena Kulkarni",
    destination: "Sangli Depot",
  },
];

const STATUS_ICON = { moving: "🚛", idle: "🅿️", alert: "🚨" };

// ═══════════════════════════════════════════
//  STEP 2 — INIT MAP
// ═══════════════════════════════════════════

const map = L.map("map", { zoomControl: false }).setView([18.8, 73.5], 7);
L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);

// ═══════════════════════════════════════════
//  STEP 3 — MARKERS
// ═══════════════════════════════════════════

const markers = {};
let selectedId = null;
let activeRoute = null;

function makeIcon(v) {
  return L.divIcon({
    html: `<div class="vehicle-marker ${v.status}">${
      STATUS_ICON[v.status]
    }</div>`,
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -22],
  });
}

function makePopup(v) {
  return `
      <div class="popup-inner">
        <div class="popup-id">${v.id}</div>
        <div class="popup-name">${v.name}</div>
        <div class="popup-row"><span>Driver</span><b>${v.driver}</b></div>
        <div class="popup-row"><span>Speed</span><b>${v.speed} km/h</b></div>
        <div class="popup-row"><span>Fuel</span><b>${v.fuel}%</b></div>
        <div class="popup-row"><span>Heading to</span><b>${v.destination}</b></div>
      </div>`;
}

VEHICLES.forEach((v) => {
  const marker = L.marker([v.lat, v.lng], { icon: makeIcon(v) })
    .addTo(map)
    .bindPopup(makePopup(v), { maxWidth: 230 });
  marker.on("click", () => selectVehicle(v.id));
  markers[v.id] = marker;
});

// ═══════════════════════════════════════════
//  STEP 4 — LEFT SIDEBAR CARDS
// ═══════════════════════════════════════════

let currentStatusFilter = "all";

function renderVehicleList(filter = "") {
  const container = document.getElementById("vehicle-list");
  const filtered = VEHICLES.filter((v) => {
    const matchesStatus =
      currentStatusFilter === "all" || v.status === currentStatusFilter;
    const matchesSearch =
      v.name.toLowerCase().includes(filter.toLowerCase()) ||
      v.driver.toLowerCase().includes(filter.toLowerCase()) ||
      v.id.toLowerCase().includes(filter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  container.innerHTML =
    filtered
      .map(
        (v) => `
      <div class="vehicle-card ${selectedId === v.id ? "active" : ""}"
           id="card-${v.id}"
           onclick="selectVehicle('${v.id}')">
        <div class="vc-top">
          <span class="vc-id">${v.id}</span>
          <span class="vc-status ${v.status}">${v.status.toUpperCase()}</span>
        </div>
        <div class="vc-name">${v.name}</div>
        <div class="vc-meta">
          <span>🚀 <b>${v.speed}</b> km/h</span>
          <span>⛽ <b>${v.fuel}%</b></span>
        </div>
      </div>
    `
      )
      .join("") ||
    `<div style="font-size:12px;color:var(--text-3);padding:8px 4px;">No vehicles match.</div>`;
}

function filterVehicles(query) {
  renderVehicleList(query);
}

function filterByStatus(status, btn) {
  currentStatusFilter = status;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active-filter"));
  btn.classList.add("active-filter");
  renderVehicleList();
}

// ═══════════════════════════════════════════
//  STEP 5 — SELECT VEHICLE
// ═══════════════════════════════════════════

function selectVehicle(id) {
  selectedId = id;
  const v = VEHICLES.find((x) => x.id === id);
  if (!v) return;

  // fly map to vehicle
  map.flyTo([v.lat, v.lng], 12, { duration: 1.2 });
  markers[id].openPopup();

  // draw route line
  if (activeRoute) activeRoute.remove();
  activeRoute = L.polyline(
    [
      [v.lat, v.lng],
      [v.lat + 0.5, v.lng + 0.7],
    ],
    { color: "#1a6b5e", weight: 3, dashArray: "7 5", opacity: 0.75 }
  ).addTo(map);

  // build detail panel
  const fuelColor =
    v.fuel > 50 ? "var(--green)" : v.fuel > 25 ? "var(--amber)" : "var(--red)";
  const speedPct = Math.min((v.speed / 120) * 100, 100);
  const barColor =
    v.speed > 80
      ? "var(--red)"
      : v.speed > 50
      ? "var(--amber)"
      : "var(--green)";

  document.getElementById("detail-body").innerHTML = `
      <div class="detail-row"><span class="detail-key">Vehicle ID</span><span class="detail-val">${
        v.id
      }</span></div>
      <div class="detail-row"><span class="detail-key">Name</span><span class="detail-val" style="font-family:var(--font);font-size:11px;">${
        v.name
      }</span></div>
      <div class="detail-row"><span class="detail-key">Driver</span><span class="detail-val" style="font-family:var(--font);">${
        v.driver
      }</span></div>
      <div class="detail-row"><span class="detail-key">Status</span><span class="vc-status ${
        v.status
      }">${v.status.toUpperCase()}</span></div>
      <div class="detail-row"><span class="detail-key">Destination</span><span class="detail-val" style="font-family:var(--font);font-size:11px;">${
        v.destination
      }</span></div>
      <div class="detail-row"><span class="detail-key">Fuel Level</span><span class="detail-val" style="color:${fuelColor}">${
    v.fuel
  }%</span></div>
      <div class="speed-bar-wrap">
        <div class="speed-bar-label"><span>Speed</span><span style="color:var(--text-2)">${
          v.speed
        } km/h</span></div>
        <div class="speed-bar-bg">
          <div class="speed-bar-fill" style="width:${speedPct}%;background:${barColor}"></div>
        </div>
      </div>
    `;

  renderVehicleList();
}

// ═══════════════════════════════════════════
//  STEP 6 — STATS
// ═══════════════════════════════════════════

function updateStats() {
  document.getElementById("stat-active").textContent = VEHICLES.filter(
    (v) => v.status === "moving"
  ).length;
  document.getElementById("stat-idle").textContent = VEHICLES.filter(
    (v) => v.status === "idle"
  ).length;
  document.getElementById("stat-alert").textContent = VEHICLES.filter(
    (v) => v.status === "alert"
  ).length;
  document.getElementById("stat-speed").textContent = Math.round(
    VEHICLES.reduce((s, v) => s + v.speed, 0) / VEHICLES.length
  );
}

// ═══════════════════════════════════════════
//  STEP 7 — ALERTS
// ═══════════════════════════════════════════

const ALERTS = [
  {
    id: "a1",
    type: "alert-red",
    msg: "VH-004 speed limit exceeded — 88 km/h",
    time: "Just now",
  },
  {
    id: "a2",
    type: "alert-red",
    msg: "VH-004 fuel critical — 22% remaining",
    time: "2 min ago",
  },
  {
    id: "a3",
    type: "alert-amber",
    msg: "VH-006 fuel low — 33% remaining",
    time: "5 min ago",
  },
  {
    id: "a4",
    type: "alert-blue",
    msg: "VH-001 approaching Pune Depot",
    time: "8 min ago",
  },
];
let visibleAlerts = [...ALERTS];

function renderAlerts() {
  const el = document.getElementById("alerts-list");
  el.innerHTML =
    visibleAlerts.length === 0
      ? `<div style="font-size:12px;color:var(--text-3);">No active alerts. All clear.</div>`
      : visibleAlerts
          .map(
            (a) => `
          <div class="alert-item ${a.type}" id="alert-${a.id}">
            <button class="dismiss-btn" onclick="dismissAlert('${a.id}')">✕</button>
            <div class="alert-msg">${a.msg}</div>
            <div class="alert-meta">${a.time}</div>
          </div>`
          )
          .join("");
}

function dismissAlert(id) {
  visibleAlerts = visibleAlerts.filter((a) => a.id !== id);
  renderAlerts();
}

// ═══════════════════════════════════════════
//  STEP 8 — SIMULATE MOVEMENT
// ═══════════════════════════════════════════

function simulateMovement() {
  VEHICLES.forEach((v) => {
    if (v.status !== "moving") return;
    v.lat += (Math.random() - 0.45) * 0.004;
    v.lng += (Math.random() - 0.3) * 0.004;
    markers[v.id].setLatLng([v.lat, v.lng]);
    markers[v.id].setIcon(makeIcon(v));
    if (selectedId === v.id && markers[v.id].isPopupOpen()) {
      markers[v.id].setPopupContent(makePopup(v));
    }
  });
  renderVehicleList();
  updateStats();
}

// ═══════════════════════════════════════════
//  STEP 9 — CLOCK
// ═══════════════════════════════════════════

function updateClock() {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString(
    "en-IN",
    { hour12: false }
  );
}

// ═══════════════════════════════════════════
//  STEP 10 — START
// ═══════════════════════════════════════════

renderVehicleList();
updateStats();
renderAlerts();
setInterval(simulateMovement, 2000);
setInterval(updateClock, 1000);
updateClock();
