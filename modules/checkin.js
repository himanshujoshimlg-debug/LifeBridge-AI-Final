// Safety Check-In Registry & Missing Persons Tracker (Indian Version)
export const safeRegistry = [
    { name: "Priya Mukherjee", phone: "+91 98300 12345", status: "Safe & Shelter", location: "Netaji Indoor Evacuation Stadium", checkedInAt: "10m ago" },
    { name: "Rajesh Kumar Das", phone: "+91 94330 98765", status: "Safe & Home", location: "Sector 2, Salt Lake Residence", checkedInAt: "1h ago" },
    { name: "Amit Sharma", phone: "+91 98110 55555", status: "Safe & Relocating", location: "Kolkata Bypass, Newtown Road", checkedInAt: "3h ago" }
];

export const missingReports = [
    { name: "Sarah Sen", age: 34, lastSeen: "Howrah Station platform area", reporterContact: "+91 98311 00909", desc: "Wearing a red saree, height 5'4\". Carrying a blue cloth bag.", reportedAt: "2h ago" },
    { name: "Devendra Patel", age: 67, lastSeen: "Sundarbans Gosaba village neighborhood", reporterContact: "+91 91234 77880", desc: "Speaks Bengali/Hindi, white hair, walking cane, wearing white dhoti.", reportedAt: "4h ago" }
];

export function registerSafeCheckIn(record) {
    safeRegistry.unshift({
        name: record.name,
        phone: record.phone,
        status: record.status,
        location: record.location,
        checkedInAt: "Just now"
    });
}

export function registerMissingReport(record) {
    missingReports.unshift({
        name: record.name,
        age: parseInt(record.age),
        lastSeen: record.lastSeen,
        reporterContact: record.reporterContact,
        desc: record.desc,
        reportedAt: "Just now"
    });
}

export function renderRegistry(containerId, searchVal = "", activeTab = "safe") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (activeTab === "safe") {
        const filtered = safeRegistry.filter(r => {
            if (!searchVal) return true;
            const q = searchVal.toLowerCase();
            return r.name.toLowerCase().includes(q) || r.phone.includes(q);
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="form-alert-info"><i data-lucide="info"></i> No matches in Safe Registry.</div>`;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        filtered.forEach(r => {
            const card = document.createElement("div");
            card.className = "registry-card";
            card.innerHTML = `
                <div class="registry-details">
                    <h4>${r.name}</h4>
                    <p><i data-lucide="phone" style="width:11px; height:11px; display:inline; vertical-align:middle; margin-right:4px;"></i> ${r.phone}</p>
                    <p style="font-size:11px; color:var(--text-muted); margin-top:2px;">Location: ${r.location}</p>
                </div>
                <div style="text-align:right;">
                    <span class="badge green">${r.status}</span>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${r.checkedInAt}</div>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        const filtered = missingReports.filter(m => {
            if (!searchVal) return true;
            const q = searchVal.toLowerCase();
            return m.name.toLowerCase().includes(q) || m.reporterContact.includes(q);
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="form-alert-info"><i data-lucide="info"></i> No matching missing reports.</div>`;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        filtered.forEach(m => {
            const card = document.createElement("div");
            card.className = "registry-card";
            card.style.flexDirection = "column";
            card.style.alignItems = "stretch";
            card.style.gap = "8px";
            card.innerHTML = `
                <div style="display:flex; justify-content:between; align-items:center; width:100%;">
                    <h4 style="color:var(--accent-orange);">${m.name} (Age: ${m.age})</h4>
                    <span class="badge orange" style="margin-left:auto;">MISSING REPORT</span>
                </div>
                <p style="font-size:12px; color:var(--text-secondary);"><strong>Last Seen:</strong> ${m.lastSeen} • ${m.reportedAt}</p>
                <p style="font-size:12px; color:var(--text-secondary);"><strong>Description:</strong> ${m.desc}</p>
                <p style="font-size:11px; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.05); padding-top:4px;">
                    <strong>Reporter Contact:</strong> ${m.reporterContact}
                </p>
            `;
            container.appendChild(card);
        });
    }

    if (window.lucide) window.lucide.createIcons();
}
