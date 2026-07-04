// Shelter Directory Store and Interface Manager (Indian Version)
export const shelters = [
    {
        id: "s1",
        name: "Netaji Indoor Evacuation Stadium",
        type: "cyclone",
        location: "Maidan, Central Kolkata",
        lat: 22.5647,
        lng: 88.3433,
        capacity: 1250,
        maxCapacity: 1500,
        amenities: ["food", "medical", "power", "pets"],
        phone: "+91 33 2248 0001",
        notes: "Main state evacuation dome. Stocked with emergency beds, clean drinking water, and NDRF relief packets."
    },
    {
        id: "s2",
        name: "Salt Lake Community Block Hall",
        type: "flood",
        location: "Sector 2, Salt Lake City",
        lat: 22.5856,
        lng: 88.4125,
        capacity: 285,
        maxCapacity: 300,
        amenities: ["food", "medical", "power"],
        phone: "+91 33 2358 0002",
        notes: "Near capacity. Primarily sheltering families from waterlogged low-lying neighborhoods of Kestopur."
    },
    {
        id: "s3",
        name: "Sundarbans Multipurpose Cyclone Shelter",
        type: "cyclone",
        location: "Gosaba, South 24 Parganas",
        lat: 22.1645,
        lng: 88.8075,
        capacity: 450,
        maxCapacity: 800,
        amenities: ["food", "power", "pets"],
        phone: "+91 3218 2201",
        notes: "Seismically reinforced concrete safehouse. Backup generator online. Food and dry ration kits distributed by state."
    },
    {
        id: "s4",
        name: "Howrah Primary Relief Camp",
        type: "flood",
        location: "Howrah Junction Area",
        lat: 22.5834,
        lng: 88.3409,
        capacity: 400,
        maxCapacity: 400,
        amenities: ["food", "medical"],
        phone: "+91 33 2660 0004",
        notes: "FULLY OCCUPIED. Evacuees are requested to redirect to Netaji Indoor Stadium."
    },
    {
        id: "s5",
        name: "Pioneer Technical Institute Hall",
        type: "fire",
        location: "Behala, South Kolkata",
        lat: 22.5032,
        lng: 88.3182,
        capacity: 90,
        maxCapacity: 350,
        amenities: ["power", "pets"],
        phone: "+91 33 2445 0005",
        notes: "Evacuation staging camp. Power grid stable. Purified drinking water tankers positioned outside."
    }
];

export function renderShelterList(containerId, filterName = "", type = "all", status = "all", selectCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const filtered = shelters.filter(s => {
        // Name / Location Filter
        if (filterName && !s.name.toLowerCase().includes(filterName.toLowerCase()) && !s.location.toLowerCase().includes(filterName.toLowerCase())) {
            return false;
        }
        // Type Filter
        if (type !== "all" && s.type !== type) {
            return false;
        }
        // Status Filter
        const occupancyRate = s.capacity / s.maxCapacity;
        if (status === "available" && occupancyRate >= 1.0) {
            return false;
        }
        if (status === "full" && occupancyRate < 0.9) {
            return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="form-alert-info"><i data-lucide="info"></i> No matching shelters found. Check details or search term.</div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    filtered.forEach(s => {
        const pct = Math.round((s.capacity / s.maxCapacity) * 100);
        let colorClass = "green";
        if (pct >= 90) colorClass = "red";
        else if (pct >= 70) colorClass = "orange";

        const card = document.createElement("div");
        card.className = "shelter-card";
        card.dataset.id = s.id;
        card.innerHTML = `
            <div class="shelter-card-header">
                <h3>${s.name}</h3>
                <span class="badge ${s.type === 'flood' ? 'blue' : s.type === 'cyclone' ? 'orange' : s.type === 'earthquake' ? 'green' : 'red'}">${s.type}</span>
            </div>
            <div class="shelter-meta-row">
                <i data-lucide="map-pin" style="width:12px; height:12px; display:inline; margin-right:4px;"></i> ${s.location}
            </div>
            <p style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">${s.notes}</p>
            <div class="capacity-meter-box">
                <div class="capacity-meter-labels">
                    <span>Capacity: ${s.capacity} / ${s.maxCapacity}</span>
                    <span>${pct}% Full</span>
                </div>
                <div class="capacity-meter-bar">
                    <div class="capacity-meter-fill ${colorClass}" style="width: ${pct}%"></div>
                </div>
            </div>
            <div class="amenities-badges-row">
                ${s.amenities.map(a => `
                    <span class="amenity-badge">
                        <i data-lucide="${a === 'food' ? 'apple' : a === 'medical' ? 'ambulance' : a === 'power' ? 'zap' : 'dog'}"></i>
                        ${a}
                    </span>
                `).join('')}
            </div>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll(".shelter-card").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            if (selectCallback) selectCallback(s);
        });

        container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}
