// Leaflet Map Integration & Plotting
import { shelters } from "./shelters.js";
import { hazards } from "./roads.js";
import { hospitals } from "./medical.js";

// Keep track of map instances to prevent reinitialization errors
const maps = {};

// Default Map Center (Capital/City coordinates)
const defaultCenter = [22.5626, 88.3639];
const defaultZoom = 13;

export function initMap(elementId, options = {}) {
    if (maps[elementId]) {
        // Map already exists, force a layout resize check
        maps[elementId].invalidateSize();
        return maps[elementId];
    }

    const map = L.map(elementId, {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(options.center || defaultCenter, options.zoom || defaultZoom);

    // Modern dark theme map tiles (CartoDB Positron Dark)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    maps[elementId] = map;
    return map;
}

// Generate styled circular markers for robust, asset-free map display
function createCircleMarker(map, lat, lng, style) {
    return L.circleMarker([lat, lng], {
        radius: style.radius || 10,
        fillColor: style.fillColor || '#00a2ff',
        color: style.color || '#ffffff',
        weight: style.weight || 2,
        opacity: 1,
        fillOpacity: style.fillOpacity || 0.8
    }).addTo(map);
}

export function plotShelters(mapElementId) {
    const map = maps[mapElementId];
    if (!map) return;

    shelters.forEach(s => {
        const occupancyRate = s.capacity / s.maxCapacity;
        let color = '#10b981'; // Green
        let status = 'Vacancies Available';

        if (occupancyRate >= 1.0) {
            color = '#ff3355'; // Red
            status = 'Full / Capacity Exceeded';
        } else if (occupancyRate >= 0.8) {
            color = '#ff9100'; // Orange
            status = 'Near capacity';
        }

        const marker = createCircleMarker(map, s.lat, s.lng, {
            radius: 12,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.85
        });

        marker.bindPopup(`
            <div style="font-family:'Inter', sans-serif; color:#fff; min-width:160px; line-height:1.4;">
                <h4 style="margin:0 0 6px 0; font-family:'Outfit', sans-serif; color:${color}; font-size:14px;">${s.name}</h4>
                <p style="margin:0 0 4px 0; font-size:11px;"><strong>Location:</strong> ${s.location}</p>
                <p style="margin:0 0 4px 0; font-size:11px;"><strong>Status:</strong> ${status}</p>
                <p style="margin:0; font-size:11px;"><strong>Capacity:</strong> ${s.capacity}/${s.maxCapacity} (${Math.round(occupancyRate * 100)}%)</p>
            </div>
        `);
    });
}

export function plotHazards(mapElementId) {
    const map = maps[mapElementId];
    if (!map) return;

    hazards.forEach(h => {
        let color = '#ff9100'; // Orange
        if (h.type === 'flooded' || h.type === 'landslide') {
            color = '#ff3355'; // Red
        }

        const marker = createCircleMarker(map, h.lat, h.lng, {
            radius: 10,
            fillColor: color,
            color: '#000000',
            weight: 1.5,
            fillOpacity: 0.9
        });

        marker.bindPopup(`
            <div style="font-family:'Inter', sans-serif; color:#fff; min-width:160px; line-height:1.4;">
                <h4 style="margin:0 0 4px 0; font-family:'Outfit', sans-serif; color:${color}; font-size:13px; text-transform:uppercase;">🚨 ROAD HAZARD</h4>
                <p style="margin:0 0 4px 0; font-size:11px;"><strong>Type:</strong> ${h.type}</p>
                <p style="margin:0 0 6px 0; font-size:11px;"><strong>Details:</strong> ${h.desc}</p>
                <span style="font-size:9px; color:#888;">Reported: ${h.reportedAt}</span>
            </div>
        `);
    });
}

export function plotHospitals(mapElementId) {
    const map = maps[mapElementId];
    if (!map) return;

    hospitals.forEach(h => {
        const isCritical = h.status.includes('Critical');
        const color = isCritical ? '#ff3355' : '#00a2ff';

        const marker = createCircleMarker(map, h.lat, h.lng, {
            radius: 11,
            fillColor: color,
            color: '#ffffff',
            weight: 2,
            fillOpacity: 0.8
        });

        marker.bindPopup(`
            <div style="font-family:'Inter', sans-serif; color:#fff; min-width:160px; line-height:1.4;">
                <h4 style="margin:0 0 4px 0; font-family:'Outfit', sans-serif; color:${color}; font-size:13px;">${h.name}</h4>
                <p style="margin:0 0 4px 0; font-size:11px;"><strong>Status:</strong> ${h.status}</p>
                <p style="margin:0 0 6px 0; font-size:11px;"><strong>Phone:</strong> ${h.phone}</p>
                <div style="display:flex; gap:4px; flex-wrap:wrap;">
                    ${h.services.map(s => `<span style="background:rgba(255,255,255,0.06); font-size:9px; padding:2px 4px; border-radius:3px; border:1px solid rgba(255,255,255,0.04);">${s}</span>`).join('')}
                </div>
            </div>
        `);
    });
}

export function drawSOSMarker(mapElementId, lat, lng, notes = "SOS Emergency Request") {
    const map = maps[mapElementId];
    if (!map) return null;

    map.setView([lat, lng], 15);

    const sosMarker = L.circleMarker([lat, lng], {
        radius: 16,
        fillColor: '#ff3355',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9
    }).addTo(map);

    sosMarker.bindPopup(`
        <div style="font-family:'Inter', sans-serif; color:#fff; line-height:1.4;">
            <h4 style="margin:0 0 4px 0; font-family:'Outfit', sans-serif; color:#ff3355; font-size:14px; text-transform:uppercase;">🚨 ACTIVE SOS BROADCAST</h4>
            <p style="margin:0 0 4px 0; font-size:11px;"><strong>Coordinates:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
            <p style="margin:0; font-size:11px;"><strong>Status:</strong> Evacuation Dispatched</p>
            <p style="margin:6px 0 0 0; font-size:11px; color:#aaa; font-style:italic;">"${notes}"</p>
        </div>
    `).openPopup();

    // Pulse animation effect using a second rings overlay
    let ringRadius = 16;
    const pulseRing = L.circleMarker([lat, lng], {
        radius: ringRadius,
        fillColor: 'transparent',
        color: '#ff3355',
        weight: 1.5,
        opacity: 0.8
    }).addTo(map);

    const interval = setInterval(() => {
        ringRadius += 2;
        if (ringRadius > 45) {
            ringRadius = 16;
        }
        pulseRing.setRadius(ringRadius);
        pulseRing.setStyle({ opacity: (45 - ringRadius) / 30 });
    }, 80);

    return {
        remove: () => {
            clearInterval(interval);
            map.removeLayer(sosMarker);
            map.removeLayer(pulseRing);
        }
    };
}
