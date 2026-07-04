// Volunteer Coordination Hub Data Store & Dispatch Manager (Indian Version)
export const volunteers = [
    { name: "Sanjay Sen", skill: "Search & Rescue", status: "Active Dispatch" },
    { name: "Dr. Ananya Roy", skill: "Medical Help (EMT)", status: "Active NRS Clinic" }
];

export const volunteerTasks = [
    {
        id: "vt1",
        title: "Medical Camp Triage Assist",
        shelter: "Netaji Indoor Evacuation Stadium",
        desc: "Need doctors, medical students, or first aid certified volunteers to help distribute primary medicines and ORS packets.",
        skill: "Medical (MD/Nurse/First Aid)",
        urgency: "high",
        volunteersCount: 3,
        volunteersNeeded: 10
    },
    {
        id: "vt2",
        title: "NDRF Inflatable Boat Shuttle crew",
        shelter: "Sundarbans Multipurpose Cyclone Shelter",
        desc: "Requires local swimmers and search-rescue support crews to pilot emergency transit vessels around flooded rural delta islands.",
        skill: "Search & Rescue",
        urgency: "critical",
        volunteersCount: 2,
        volunteersNeeded: 8
    },
    {
        id: "vt3",
        title: "Rations Sorting & packing",
        shelter: "Salt Lake Community Block Hall",
        desc: "Sort incoming relief packets, bag dry rations (Muri, Chira, Gur), and load evacuation trucks.",
        skill: "Logistics & Distribution",
        urgency: "standard",
        volunteersCount: 14,
        volunteersNeeded: 25
    }
];

export function signUpVolunteer(record) {
    volunteers.push({
        name: record.name,
        skill: record.skill,
        status: "Registered / Standby"
    });
}

export function renderVolunteerTasks(containerId, acceptTaskCallback) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    volunteerTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = `v-task-card glass-panel ${task.urgency === 'critical' ? 'border-glow-red' : task.urgency === 'high' ? 'border-glow-orange' : 'border-glow-blue'}`;
        card.style.marginBottom = "16px";
        card.innerHTML = `
            <div class="v-task-header">
                <h3>${task.title}</h3>
                <span class="badge ${task.urgency === 'critical' ? 'red' : task.urgency === 'high' ? 'orange' : 'blue'}">${task.urgency}</span>
            </div>
            <div class="v-task-meta">
                <i data-lucide="map-pin" style="width:12px; height:12px; display:inline; margin-right:4px;"></i> ${task.shelter}
            </div>
            <p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">${task.desc}</p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:11px; color:var(--text-muted);">Skill Required: <strong>${task.skill}</strong></span>
                <span style="font-size:11px; font-weight:600; color:var(--accent-blue);">${task.volunteersCount} / ${task.volunteersNeeded} Volunteers</span>
            </div>
            <div style="margin-top:14px; text-align:right;">
                <button class="btn btn-primary small-pill-btn btn-accept-task" data-id="${task.id}">
                    <i data-lucide="user-plus" style="width:12px; height:12px;"></i> Claim Task Assignment
                </button>
            </div>
        `;

        const btn = card.querySelector(".btn-accept-task");
        btn.addEventListener("click", () => {
            task.volunteersCount++;
            if (acceptTaskCallback) acceptTaskCallback(task);
            renderVolunteerTasks(containerId, acceptTaskCallback);
        });

        container.appendChild(card);
    });

    if (window.lucide) window.lucide.createIcons();
}
