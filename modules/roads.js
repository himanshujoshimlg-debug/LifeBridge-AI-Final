// Road Safety Status, Custom Hazards, and Route Calculator (Indian Version)
export const hazards = [
    {
        id: "h1",
        type: "flooded",
        desc: "Severe waterlogging on E.M. Bypass near Chingrighata underpass. Light vehicles advised to divert.",
        lat: 22.5623,
        lng: 88.3985,
        reportedAt: "20m ago"
    },
    {
        id: "h2",
        type: "landslide",
        desc: "Structural debris and fallen trees blocking VIP Road near Ultadanga Crossing.",
        lat: 22.5952,
        lng: 88.3840,
        reportedAt: "5m ago"
    },
    {
        id: "h3",
        type: "blocked",
        desc: "Felled electrical poles blocking traffic lanes near College Street Bookstore Row.",
        lat: 22.5745,
        lng: 88.3630,
        reportedAt: "1h ago"
    }
];

export const safeRoutes = {
    "howrah to netaji indoor stadium": {
        dist: "3.2 km",
        steps: [
            "Start heading East on Howrah Station Road toward Howrah Bridge.",
            "Cross Howrah Bridge (Rabindra Setu) - traffic speed is slow but safe.",
            "Take the left ramp toward Strand Road (avoid College Street blockage).",
            "Proceed south on Strand Road. Netaji Indoor Evacuation Stadium is on your left."
        ]
    },
    "default": {
        dist: "4.5 km",
        steps: [
            "Head toward the nearest primary municipal evacuation highway.",
            "Monitor live updates via LifeBridge AI for waterlogging on arterial roads.",
            "Follow instructions to Netaji Indoor Stadium or Salt Lake Community Camps.",
            "Avoid low-lying underpasses (Chingrighata/Ultadanga) and old structures."
        ]
    }
};

export function addHazard(newHazard) {
    hazards.push({
        id: "h" + (hazards.length + 1),
        type: newHazard.type,
        desc: newHazard.desc,
        lat: parseFloat(newHazard.lat),
        lng: parseFloat(newHazard.lng),
        reportedAt: "Just now"
    });
}

export function searchSafeRoute(fromLoc, toLoc) {
    const key = `${fromLoc.toLowerCase().trim()} to ${toLoc.toLowerCase().trim()}`;
    return safeRoutes[key] || safeRoutes["default"];
}
