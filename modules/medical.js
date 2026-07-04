// Medical Help Centers and First Aid Guides (Indian Version)
export const hospitals = [
    {
        name: "SSKM Medical College & Hospital (PG)",
        status: "Critical capacity / Emergency only",
        lat: 22.5398,
        lng: 88.3435,
        phone: "+91 33 2223 6242",
        services: ["IPGMER Trauma Unit", "Critical Blood Bank", "Burn Ward"]
    },
    {
        name: "NRS Medical College & Hospital",
        status: "Open - Normal Waiting Times",
        lat: 22.5645,
        lng: 88.3685,
        phone: "+91 33 2286 0012",
        services: ["Disaster Emergency Triage", "Pediatric Ward", "General Medicine"]
    },
    {
        name: "Salt Lake Sub-Divisional Field Hospital",
        status: "Special Relief Station Active",
        lat: 22.5802,
        lng: 88.4110,
        phone: "+91 33 2337 9113",
        services: ["Decontamination Care", "Oral Rehydration Camp", "Vaccination Center"]
    }
];

export const triageGuides = [
    {
        title: "Severe Bleeding Control",
        keywords: ["bleeding", "blood", "wound", "cut", "wound care"],
        steps: [
            "Apply direct pressure to the wound with a clean cloth or bandage.",
            "Maintain continuous pressure for at least 5-10 minutes without lifting.",
            "Elevate the injured limb above heart level if possible.",
            "If blood seeps through, place another bandage ON TOP. Do not remove original.",
            "For severe limb arterial bleeding, prepare to apply a tourniquet 2-3 inches above the wound."
        ]
    },
    {
        title: "Fractures & Bone Injuries",
        keywords: ["fracture", "bone", "break", "splint", "arm", "leg"],
        steps: [
            "Do NOT try to realign or push back a bone that has broken the skin.",
            "Immobilize the area. Create a temporary splint using rolled cardboard, sticks, or magazines.",
            "Apply cold packs wrapped in a cloth to reduce swelling (no direct ice).",
            "Stop any active bleeding around the break without moving the joint.",
            "Keep the victim calm and still until emergency services arrive."
        ]
    },
    {
        title: "Thermal & Chemical Burns",
        keywords: ["burn", "fire", "scald", "heat", "chemical"],
        steps: [
            "Cool the burn immediately using cool running water (not cold/ice) for 10-20 minutes.",
            "Remove rings, tight clothing, or bracelets from the burned zone quickly.",
            "Do NOT pop blisters. Keep them intact to prevent severe bacterial infection.",
            "Cover the burn loosely with sterile non-stick dressing or plastic cling film.",
            "Seek emergency care for third-degree burns or burns to face, hands, or feet."
        ]
    },
    {
        title: "Water Contamination & Hydration",
        keywords: ["water", "drink", "dehydration", "purify", "stomach"],
        steps: [
            "Never drink untreated floodwater. Assume it is contaminated with toxic chemicals and sewage.",
            "Boil water vigorously for at least 1 full minute to destroy pathogens.",
            "If boiling is impossible, use chlorine purification tablets or 8 drops of unscented household bleach per gallon.",
            "For severe dehydration, prepare oral rehydration solution: 6 teaspoons sugar, 0.5 teaspoon salt, in 1 liter clean water."
        ]
    }
];

export function renderTriageGuides(containerId, searchVal = "") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const filtered = triageGuides.filter(g => {
        if (!searchVal) return true;
        const q = searchVal.toLowerCase();
        return g.title.toLowerCase().includes(q) || g.keywords.some(k => k.includes(q));
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="form-alert-info"><i data-lucide="info"></i> No matching first-aid guides found. Search 'bleeding', 'burn', or 'fracture'.</div>`;
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    filtered.forEach((g, index) => {
        const card = document.createElement("div");
        card.className = "triage-card";
        card.innerHTML = `
            <div class="triage-card-header">
                <h3>${g.title}</h3>
                <i data-lucide="chevron-down" class="toggle-icon"></i>
            </div>
            <div class="triage-details hidden" id="triage-details-${index}">
                <strong>First-Aid Steps:</strong>
                <ol>
                    ${g.steps.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
        `;

        card.addEventListener("click", () => {
            const details = card.querySelector(".triage-details");
            const icon = card.querySelector(".toggle-icon");
            if (details.classList.contains("hidden")) {
                details.classList.remove("hidden");
                icon.setAttribute("data-lucide", "chevron-up");
            } else {
                details.classList.add("hidden");
                icon.setAttribute("data-lucide", "chevron-down");
            }
            if (window.lucide) window.lucide.createIcons();
        });

        container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}

export function renderHospitals(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    hospitals.forEach(h => {
        const card = document.createElement("div");
        card.className = "contact-card";
        card.style.display = "block";
        card.style.marginBottom = "12px";
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h4 style="color:#fff; font-size:14px;">${h.name}</h4>
                <span class="badge ${h.status.includes('Critical') ? 'red' : 'green'}">${h.status.includes('Critical') ? 'CRITICAL' : 'STABLE'}</span>
            </div>
            <div style="font-size:11px; color:var(--text-secondary); margin:4px 0 8px 0;">${h.status}</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
                ${h.services.map(s => `<span class="amenity-badge">${s}</span>`).join('')}
            </div>
            <a href="tel:${h.phone}" style="font-size:12px; font-weight:700; color:var(--accent-blue); display:flex; align-items:center; gap:4px;">
                <i data-lucide="phone" style="width:12px; height:12px;"></i> ${h.phone}
            </a>
        `;
        container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}
