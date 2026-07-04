// Simulated NLP AI Assistant Engine (Indian Version)
import { shelters } from "./shelters.js";
import { hazards } from "./roads.js";
import { triageGuides } from "./medical.js";

export function getAssistantResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Shelter queries
    if (q.includes("shelter") || q.includes("safehouse") || q.includes("refuge") || q.includes("evacuate")) {
        const availableShelters = shelters.filter(s => s.capacity < s.maxCapacity);
        let reply = "Here are the operational shelters with current availability:<br><ul>";
        availableShelters.slice(0, 3).forEach(s => {
            const pct = Math.round((s.capacity / s.maxCapacity) * 100);
            reply += `<li><strong>${s.name}</strong> (${s.location}) - Capacity: ${s.capacity}/${s.maxCapacity} (${pct}% Full) - Services: ${s.amenities.join(', ')}</li>`;
        });
        reply += "</ul><br>You can view full listings under the <strong>Emergency Shelters</strong> tab.";
        return {
            text: reply,
            chips: ["Find nearest shelters", "Route to Netaji Stadium", "How to volunteer?"]
        };
    }

    // 2. Bleeding / Medical guides
    if (q.includes("bleed") || q.includes("wound") || q.includes("cut") || q.includes("blood")) {
        const guide = triageGuides.find(g => g.title.includes("Bleeding"));
        let reply = `<strong>First Aid: Control Severe Bleeding</strong><br><ol>`;
        guide.steps.forEach(s => {
            reply += `<li>${s}</li>`;
        });
        reply += `</ol><br>Need more assistance? Call <strong>108 Ambulance</strong> or open the <strong>Medical Help</strong> tab.`;
        return {
            text: reply,
            chips: ["Treatment for burn", "Treatment for break", "Nearest hospital"]
        };
    }

    // 3. Burns / Fire guides
    if (q.includes("burn") || q.includes("fire") || q.includes("scald")) {
        const guide = triageGuides.find(g => g.title.includes("Burn"));
        let reply = `<strong>First Aid: Thermal & Chemical Burns</strong><br><ol>`;
        guide.steps.forEach(s => {
            reply += `<li>${s}</li>`;
        });
        reply += `</ol><br>For severe burns, seek immediate attention.`;
        return {
            text: reply,
            chips: ["Treatment for bleeding", "Nearest hospital", "How to volunteer?"]
        };
    }

    // 4. Fracture guides
    if (q.includes("break") || q.includes("fracture") || q.includes("splint") || q.includes("bone")) {
        const guide = triageGuides.find(g => g.title.includes("Fracture"));
        let reply = `<strong>First Aid: Fractures & Bone Injuries</strong><br><ol>`;
        guide.steps.forEach(s => {
            reply += `<li>${s}</li>`;
        });
        reply += `</ol>`;
        return {
            text: reply,
            chips: ["Treatment for bleeding", "How to purify water", "Nearest hospital"]
        };
    }

    // 5. Water / purification
    if (q.includes("water") || q.includes("purify") || q.includes("drink") || q.includes("boil")) {
        const guide = triageGuides.find(g => g.title.includes("Water"));
        let reply = `<strong>Emergency Guide: Water Contamination</strong><br><ol>`;
        guide.steps.forEach(s => {
            reply += `<li>${s}</li>`;
        });
        reply += `</ol>`;
        return {
            text: reply,
            chips: ["Request supplies", "Find nearest shelters", "Treatment for bleeding"]
        };
    }

    // 6. Roads / route safety queries
    if (q.includes("route") || q.includes("road") || q.includes("path") || q.includes("blocked") || q.includes("highway") || q.includes("underpass")) {
        let reply = "Here are the active road blockages reported by responders and citizens:<br><ul>";
        hazards.forEach(h => {
            reply += `<li><strong>${h.type.toUpperCase()}:</strong> ${h.desc} (Coords: ${h.lat}, ${h.lng})</li>`;
        });
        reply += "</ul><br>Avoid these coordinates and plan your route using our <strong>Road Safety & Routes</strong> page.";
        return {
            text: reply,
            chips: ["Is E.M. Bypass blocked?", "Calculate safe route", "Report road hazard"]
        };
    }

    // 7. E.M. Bypass specific query
    if (q.includes("e.m. bypass") || q.includes("em bypass") || q.includes("bypass")) {
        return {
            text: "🚨 <strong>ALERT: E.M. Bypass near Chingrighata is flooded.</strong><br>Severe waterlogging under the flyover underpass. Avoid this route and use Strand Road / Howrah Bypass instead.",
            chips: ["Calculate safe route", "Find nearest shelters", "Report road hazard"]
        };
    }

    // 8. Volunteer queries
    if (q.includes("volunteer") || q.includes("help") || q.includes("join") || q.includes("assist")) {
        return {
            text: "Thank you for stepping forward! We need support in medical camps, logistics supply sorting, and delta search & rescue operations.<br><br>Please visit the <strong>Volunteer Hub</strong> tab to select active assignments or register in our dispatch database.",
            chips: ["Volunteer tasks", "Register safe checkin", "Find nearest shelters"]
        };
    }

    // Default response
    return {
        text: "I received your message. If this is a life-threatening emergency, please click the red **SOS PANIC** button to broadcast your GPS location to search and rescue teams immediately. For details on shelters, routes, check-ins, or first aid, click the suggestions below.",
        chips: ["Find nearest shelters", "Nearest hospital", "Is E.M. Bypass blocked?", "Treatment for bleeding"]
    };
}
