// Disaster Survival Checklists and Request Delivery Board (Indian Version)
export const checklists = {
    flood: [
        { id: "f1", text: "Bottled / Purified Drinking Water (Min 3 Litres/day)" },
        { id: "f2", text: "Dry food supplies (Muri/Puffed Rice, Chira, Jaggery/Gur)" },
        { id: "f3", text: "Oral Rehydration Salt (ORS) packets" },
        { id: "f4", text: "Matchboxes, candles, and dry kerosene tablets" },
        { id: "f5", text: "First-aid kit with antiseptic creams (e.g. Boroline/Betadine)" },
        { id: "f6", text: "Waterproof polythene sheets and synthetic ropes" }
    ],
    cyclone: [
        { id: "c1", text: "Adhesive tape to secure window glass panes" },
        { id: "c2", text: "Solar power banks and charging cables for mobile phones" },
        { id: "c3", text: "Handheld LED torch and extra batteries" },
        { id: "c4", text: "Important papers (Aadhaar, Ration Card) sealed in dry bags" },
        { id: "c5", text: "First aid kits and sanitary pads" },
        { id: "c6", text: "Metal whistles for emergency signalling" }
    ],
    earthquake: [
        { id: "e1", text: "Sturdy helmet or hard hat and protective gloves" },
        { id: "e2", text: "Heavy sports shoes to protect against debris/glass" },
        { id: "e3", text: "N95 masks to filter brick dust" },
        { id: "e4", text: "Warm blankets or bedsheets" },
        { id: "e5", text: "Emergency liquid cash reserves (ATMs may crash)" },
        { id: "e6", text: "Antiseptic wipes and hand soaps" }
    ]
};

export const supplyRequests = [
    {
        name: "Shelter #3 East Wing",
        location: "Metro Dome Refuge Center",
        items: ["Clean Drinking Water Pack (6L)", "Non-perishable Dry Rations"],
        urgency: "critical",
        status: "Dispatched (ETA 15m)"
    },
    {
        name: "Apartment Block B Group",
        location: "Pioneer Industrial Complex",
        items: ["Thermal Blankets & Clothes", "First-Aid & Triage Medical Kit"],
        urgency: "high",
        status: "Approved & Preparing"
    }
];

export function saveChecklistState(disaster, checkedIds) {
    localStorage.setItem(`lifebridge_check_${disaster}`, JSON.stringify(checkedIds));
}

export function loadChecklistState(disaster) {
    const raw = localStorage.getItem(`lifebridge_check_${disaster}`);
    return raw ? JSON.parse(raw) : [];
}

export function renderChecklist(containerId, disaster, progressCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    const items = checklists[disaster] || [];
    const checked = loadChecklistState(disaster);

    const updateProgress = () => {
        const activeChecked = loadChecklistState(disaster);
        const pct = items.length ? Math.round((activeChecked.length / items.length) * 100) : 0;
        if (progressCallback) progressCallback(pct);
    };

    items.forEach(item => {
        const card = document.createElement("label");
        const isChecked = checked.includes(item.id);
        card.className = `checklist-card ${isChecked ? 'checked' : ''}`;
        
        card.innerHTML = `
            <input type="checkbox" data-id="${item.id}" ${isChecked ? 'checked' : ''}>
            <span>${item.text}</span>
        `;

        const checkbox = card.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            let activeChecked = loadChecklistState(disaster);
            if (e.target.checked) {
                card.classList.add('checked');
                if (!activeChecked.includes(item.id)) activeChecked.push(item.id);
            } else {
                card.classList.remove('checked');
                activeChecked = activeChecked.filter(id => id !== item.id);
            }
            saveChecklistState(disaster, activeChecked);
            updateProgress();
        });

        container.appendChild(card);
    });

    updateProgress();
}
