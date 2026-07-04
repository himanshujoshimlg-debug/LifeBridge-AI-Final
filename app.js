// LifeBridge AI Central Controller
import { initMap, plotShelters, plotHazards, plotHospitals, drawSOSMarker } from "./modules/map.js";
import { renderShelterList, shelters } from "./modules/shelters.js";
import { addHazard, searchSafeRoute } from "./modules/roads.js";
import { renderTriageGuides, renderHospitals } from "./modules/medical.js";
import { renderChecklist } from "./modules/supplies.js";
import { registerSafeCheckIn, registerMissingReport, renderRegistry } from "./modules/checkin.js";
import { signUpVolunteer, renderVolunteerTasks } from "./modules/volunteer.js";
import { getAssistantResponse } from "./modules/assistant.js";

// Global Translation Directory
const translations = {
    en: {
        title: "Dashboard Overview",
        subtitle: "Real-time status updates and primary emergency tools.",
        sosBtn: "SOS PANIC",
        alertsLabel: "LIVE EMERGENCY ALERTS"
    },
    es: {
        title: "Panel General",
        subtitle: "Actualizaciones en tiempo real y herramientas primarias de emergencia.",
        sosBtn: "PÁNICO SOS",
        alertsLabel: "ALERTAS DE EMERGENCIA EN VIVO"
    },
    hi: {
        title: "डैशबोर्ड सिंहावलोकन",
        subtitle: "वास्तविक समय स्थिति अपडेट और प्राथमिक आपातकालीन उपकरण।",
        sosBtn: "एसओएस आपातकाल",
        alertsLabel: "आपातकालीन चेतावनी लाइव"
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lucide Icons
    if (window.lucide) window.lucide.createIcons();

    // App State Variables
    let activeDisasterChecklist = "flood";
    let activeRegistryTab = "safe";
    let activeSOSMarker = null;

    // 1. Tab Navigation Routing System
    const navItems = document.querySelectorAll(".nav-menu .nav-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    const switchTab = (tabId) => {
        navItems.forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tabId));
        tabPanes.forEach(pane => pane.classList.toggle("active", pane.id === `tab-${tabId}`));
        
        // Custom Viewport Header adjustment
        const pageTitle = document.getElementById("page-title");
        const pageSubtitle = document.getElementById("page-subtitle");
        
        const lang = document.getElementById("lang-toggle").value;
        
        if (tabId === "dashboard") {
            pageTitle.innerText = translations[lang].title;
            pageSubtitle.innerText = translations[lang].subtitle;
            
            // Map rendering
            const map = initMap("dashboard-leaflet-map");
            plotShelters("dashboard-leaflet-map");
            plotHazards("dashboard-leaflet-map");
            plotHospitals("dashboard-leaflet-map");
        } else if (tabId === "shelters") {
            pageTitle.innerText = "Emergency Shelter Finder";
            pageSubtitle.innerText = "Locate nearby shelters, capacities, and evacuation safety guidelines.";
            
            initMap("shelter-map");
            plotShelters("shelter-map");
           renderShelterList(
    "shelter-list",
    "",
    "all",
    "all"
);
        } else if (tabId === "roads") {
            pageTitle.innerText = "Safe Roadways & Hazard Reporting";
            pageSubtitle.innerText = "Avoid blockages, map routes, or click map to file new hazard coordinates.";
            
            const roadMap = initMap("road-map");
            plotHazards("road-map");
            
            // Allow pinning hazards directly on map click
            roadMap.off('click');
            roadMap.on('click', (e) => {
                const subtabBtn = document.querySelector('[data-subtab="report-hazard"]');
                subtabBtn.click();
                
                document.getElementById("hazard-lat").value = e.latlng.lat.toFixed(5);
                document.getElementById("hazard-lng").value = e.latlng.lng.toFixed(5);
            });
        } else if (tabId === "medical") {
            pageTitle.innerText = "Emergency Medical Clinic Router";
            pageSubtitle.innerText = "Locate active trauma units, view waiting capacities, or consult first aid triage.";
            
            initMap("medical-map");
            plotHospitals("medical-map");
            renderMedicalGuides();
            renderHospitals("hospitals-list-container");
        } else if (tabId === "supplies") {
            pageTitle.innerText = "Survival checklists & Rations Dispatch";
            pageSubtitle.innerText = "Ensure readiness for regional threats, and request direct food or water drops.";
            
            renderSuppliesChecklist();
            populateSupplyShelters();
        } else if (tabId === "checkin") {
            pageTitle.innerText = "Safety Check-In & Missing Persons Search";
            pageSubtitle.innerText = "Search safety logs or report family status and safe relocations.";
            
            renderSafetyRegistry();
        } else if (tabId === "volunteer") {
            pageTitle.innerText = "Volunteer Coordination Hub";
            pageSubtitle.innerText = "Lend skills to support local medical camps, logistical lines, or evacuations.";
            
            renderVolunteerDashboard();
        } else if (tabId === "assistant") {
            pageTitle.innerText = "LifeBridge AI Support Bot";
            pageSubtitle.innerText = "Instant emergency guides, shelter searches, and disaster information.";
        }
    };

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            switchTab(item.dataset.tab);
        });
    });

    // Default Tab Trigger
    switchTab("dashboard");

    // 2. Language Selection Translation logic
    const langToggle = document.getElementById("lang-toggle");
    langToggle.addEventListener("change", (e) => {
        const lang = e.target.value;
        const currentActiveTab = document.querySelector(".nav-menu .nav-item.active").dataset.tab;
        
        // Translate Header Alerts label
        const alertsLabel = document.querySelector(".ticker-label");
        alertsLabel.innerHTML = `<i data-lucide="alert-triangle"></i> ${translations[lang].alertsLabel}`;
        
        // Translate SOS button
        const sosText = document.querySelector(".sos-trigger-btn span:not(.sos-pulse)");
        if (sosText) sosText.innerText = translations[lang].sosBtn;

        if (window.lucide) window.lucide.createIcons();
        switchTab(currentActiveTab);
    });

    // 3. SOS Panic Drawer Evacuation System
    const globalSOSBtn = document.getElementById("global-sos-btn");
    const sosDrawer = document.getElementById("sos-drawer");
    const sosDrawerClose = document.getElementById("sos-drawer-close");
    const formSOSPanic = document.getElementById("form-sos-panic");

    globalSOSBtn.addEventListener("click", () => {
        sosDrawer.classList.remove("hidden");
        // Fill coordinates with simulated location if GeoLocation fails/denied
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    document.getElementById("sos-lat").value = position.coords.latitude.toFixed(5);
                    document.getElementById("sos-lng").value = position.coords.longitude.toFixed(5);
                },
                () => {
                    // Fallback to City Center
                    document.getElementById("sos-lat").value = "22.56260";
                    document.getElementById("sos-lng").value = "88.36390";
                }
            );
        } else {
            document.getElementById("sos-lat").value = "22.56260";
            document.getElementById("sos-lng").value = "88.36390";
        }
    });

    sosDrawerClose.addEventListener("click", () => {
        sosDrawer.classList.add("hidden");
    });

    formSOSPanic.addEventListener("submit", (e) => {
        e.preventDefault();
        const phone = document.getElementById("sos-phone").value;
        const triage = document.getElementById("sos-triage").value;
        const count = document.getElementById("sos-people-count").value;
        const notes = document.getElementById("sos-notes").value;
        const lat = parseFloat(document.getElementById("sos-lat").value);
        const lng = parseFloat(document.getElementById("sos-lng").value);

        sosDrawer.classList.add("hidden");

        // Shift views to Medical Help to track dispatch progress
        switchTab("medical");

        // Remove active marker if previously submitted
        if (activeSOSMarker) {
            activeSOSMarker.remove();
        }

        // Draw pulsing SOS marker on Map
        activeSOSMarker = drawSOSMarker("medical-map", lat, lng, notes);

        // Start Rescue Timeline stepping animation
        const steps = ["step-received", "step-assigned", "step-enroute", "step-arrived"];
        steps.forEach(id => {
            const stepEl = document.getElementById(id);
            if (stepEl) {
                stepEl.classList.remove("active", "completed");
            }
        });

        // Step 1: Received
        document.getElementById("step-received").classList.add("active");
        document.getElementById("dispatch-status-badge").innerText = "SOS Dispatched";
        document.getElementById("dispatch-status-badge").className = "badge red red-glow";
        
        const etaBox = document.getElementById("dispatch-eta");
        etaBox.classList.remove("hidden");
        etaBox.innerHTML = `SOS Dispatched. Estimated Rescue Arrival: <strong>15 minutes</strong>`;

        // Simulate step transitions
        setTimeout(() => {
            document.getElementById("step-received").classList.add("completed");
            document.getElementById("step-assigned").classList.add("active");
            etaBox.innerHTML = `NDRF Rescue Team Delta Assigned. ETA: <strong>11 minutes</strong>`;
        }, 5000);

        setTimeout(() => {
            document.getElementById("step-assigned").classList.add("completed");
            document.getElementById("step-enroute").classList.add("active");
            etaBox.innerHTML = `En Route via Strand Road Bypass. ETA: <strong>6 minutes</strong>`;
        }, 12000);

        setTimeout(() => {
            document.getElementById("step-enroute").classList.add("completed");
            document.getElementById("step-arrived").classList.add("active");
            document.getElementById("dispatch-status-badge").innerText = "Rescued Successfully";
            document.getElementById("dispatch-status-badge").className = "badge green";
            etaBox.innerHTML = `NDRF Rescue Team Delta has arrived. Evacuation completed.`;
        }, 22000);
    });

    // 4. Shelter search and filtering
    const shelterSearch = document.getElementById("shelter-search");
    const shelterTypeFilter = document.getElementById("shelter-filter-type");
    const shelterStatusFilter = document.getElementById("shelter-filter-status");

    const renderShelters = () => {
        renderShelterList(
            "shelter-list",
            shelterSearch.value,
            shelterTypeFilter.value,
            shelterStatusFilter.value,
            (selectedShelter) => {
                // Focus Shelter Map on selected shelter coordinates
                const map = initMap("shelter-map");
                map.setView([selectedShelter.lat, selectedShelter.lng], 16);
            }
        );
    };

    shelterSearch.addEventListener("input", renderShelters);
    shelterTypeFilter.addEventListener("change", renderShelters);
    shelterStatusFilter.addEventListener("change", renderShelters);

    // 5. Road Safety - Safe Routing & Hazard reporting
    const subTabBtns = document.querySelectorAll(".sub-tab-nav .sub-tab-btn");
    const subTabPanes = document.querySelectorAll(".sub-tab-content");

    subTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            subTabPanes.forEach(pane => {
                pane.classList.toggle("active", pane.id === `subtab-${btn.dataset.subtab}`);
            });
        });
    });

    // Safe Route Search
    const btnFindRoute = document.getElementById("btn-find-route");
    btnFindRoute.addEventListener("click", () => {
        const fromVal = document.getElementById("route-from").value;
        const toVal = document.getElementById("route-to").value;

        if (!fromVal || !toVal) return;

        const result = searchSafeRoute(fromVal, toVal);
        const resultsBox = document.getElementById("route-results");
        resultsBox.classList.remove("hidden");

        document.getElementById("route-dist").innerText = result.dist;
        const stepsContainer = document.getElementById("route-steps");
        stepsContainer.innerHTML = result.steps.map(step => `<li>${step}</li>`).join('');
    });

    // Citizen Road Hazard Submission
    const formHazard = document.getElementById("form-hazard-report");
    formHazard.addEventListener("submit", (e) => {
        e.preventDefault();
        const newH = {
            type: document.getElementById("hazard-type").value,
            desc: document.getElementById("hazard-desc").value,
            lat: document.getElementById("hazard-lat").value,
            lng: document.getElementById("hazard-lng").value
        };

        addHazard(newH);
        
        // Reset and switch view
        formHazard.reset();
        
        // Refresh hazards markers on the Road Map
        plotHazards("road-map");

        // Shift back to Safe Route subtab
        document.querySelector('[data-subtab="route-finder"]').click();
        
        // Increment dashboard counter
        const hazardStat = document.getElementById("stat-hazards");
        if (hazardStat) {
            const count = parseInt(hazardStat.innerText) || 0;
            hazardStat.innerText = `${count + 1} Reports`;
        }
    });

    // 6. Medical Search Symptom Guide
    const triageSearch = document.getElementById("triage-search");
    const renderMedicalGuides = () => {
        renderTriageGuides("triage-guides-list", triageSearch.value);
    };
    triageSearch.addEventListener("input", renderMedicalGuides);

    // 7. Supplies checklists & Requests
    const checklistTabs = document.querySelectorAll("[data-checklist]");
    const renderSuppliesChecklist = () => {
        renderChecklist("checklist-items-container", activeDisasterChecklist, (pct) => {
            document.getElementById("checklist-pct").innerText = `${pct}% Ready`;
            document.getElementById("checklist-progress").style.width = `${pct}%`;
        });
    };

    checklistTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            checklistTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeDisasterChecklist = tab.dataset.checklist;
            renderSuppliesChecklist();
        });
    });

    // Request Delivery form
    const formSupplyRequest = document.getElementById("form-supply-request");
    const populateSupplyShelters = () => {
        const select = document.getElementById("supply-shelter");
        select.innerHTML = `<option value="">Select shelter/drop point...</option>` +
            shelters.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    };

    formSupplyRequest.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Emergency supplies air drop request has been filed with Logistics command.");
        formSupplyRequest.reset();
    });

    // 8. Safety check-in and Missing registry
    const btnShowSafe = document.getElementById("btn-show-safe-checkins");
    const btnShowMissing = document.getElementById("btn-show-missing-reports");
    const checkinSearch = document.getElementById("checkin-search");

    const renderSafetyRegistry = () => {
        renderRegistry("checkin-registry-list", checkinSearch.value, activeRegistryTab);
    };

    btnShowSafe.addEventListener("click", () => {
        btnShowSafe.classList.add("active");
        btnShowMissing.classList.remove("active");
        activeRegistryTab = "safe";
        renderSafetyRegistry();
    });

    btnShowMissing.addEventListener("click", () => {
        btnShowSafe.classList.remove("active");
        btnShowMissing.classList.add("active");
        activeRegistryTab = "missing";
        renderSafetyRegistry();
    });

    checkinSearch.addEventListener("input", renderSafetyRegistry);

    // Safe Registration form
    const formCheckin = document.getElementById("form-safety-checkin");
    formCheckin.addEventListener("submit", (e) => {
        e.preventDefault();
        const record = {
            name: document.getElementById("checkin-name").value,
            phone: document.getElementById("checkin-phone").value,
            status: document.getElementById("checkin-status").value,
            location: document.getElementById("checkin-location").value
        };

        registerSafeCheckIn(record);
        formCheckin.reset();
        
        // Refresh Safe List
        btnShowSafe.click();

        // Increment Safe checkin dashboard counter
        const safeStat = document.getElementById("stat-safe-checkins");
        if (safeStat) {
            const count = parseInt(safeStat.innerText.replace(/,/g, '')) || 0;
            safeStat.innerText = `${(count + 1).toLocaleString()} People`;
        }
    });

    // Missing Person Modal toggling
    const btnTriggerMissing = document.getElementById("btn-trigger-missing-modal");
    const missingModal = document.getElementById("missing-person-modal");
    const btnCloseMissing = document.getElementById("btn-close-missing-modal");
    const formMissing = document.getElementById("form-missing-report");

    btnTriggerMissing.addEventListener("click", () => {
        missingModal.classList.remove("hidden");
    });

    btnCloseMissing.addEventListener("click", () => {
        missingModal.classList.add("hidden");
    });

    formMissing.addEventListener("submit", (e) => {
        e.preventDefault();
        const record = {
            name: document.getElementById("missing-name").value,
            age: document.getElementById("missing-age").value,
            lastSeen: document.getElementById("missing-last-seen").value,
            reporterContact: document.getElementById("missing-contact").value,
            desc: document.getElementById("missing-desc").value
        };

        registerMissingReport(record);
        formMissing.reset();
        missingModal.classList.add("hidden");

        // View missing persons logs
        btnShowMissing.click();
    });

    // 9. Volunteer coordination tasks board
    const renderVolunteerDashboard = () => {
        renderVolunteerTasks("volunteer-tasks-container", (claimedTask) => {
            alert(`You have successfully claimed: "${claimedTask.title}". Details dispatched to your emergency profile.`);
        });
    };

    const formVolunteer = document.getElementById("form-volunteer-signup");
    formVolunteer.addEventListener("submit", (e) => {
        e.preventDefault();
        const record = {
            name: document.getElementById("volunteer-name").value,
            skill: document.getElementById("volunteer-skill").value,
            phone: document.getElementById("volunteer-phone").value,
            status: document.getElementById("volunteer-status").value
        };

        signUpVolunteer(record);
        formVolunteer.reset();
        alert("Registration complete! You are placed on Standby dispatcher queues.");
    });

    // 10. AI Assistant Chat UI
    const chatInput = document.getElementById("ai-chat-input");
    const btnSendChat = document.getElementById("btn-send-chat");
    const chatMessages = document.getElementById("ai-chat-messages");

    const appendChatMessage = (sender, text) => {
        const msg = document.createElement("div");
        msg.className = `chat-message ${sender}`;
        msg.innerHTML = `
            <div class="msg-avatar">
                <i data-lucide="${sender === 'assistant' ? 'bot' : 'user'}"></i>
            </div>
            <div class="msg-bubble">
                <p>${text}</p>
            </div>
        `;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
    };

    const handleSendMessage = () => {
        const query = chatInput.value.trim();
        if (!query) return;

        appendChatMessage("user", query);
        chatInput.value = "";

        // Simulated loader
        setTimeout(() => {
            const reply = getAssistantResponse(query);
            appendChatMessage("assistant", reply.text);
            
            // Append Suggestion Chips if available
            if (reply.chips && reply.chips.length > 0) {
                const chipsContainer = document.createElement("div");
                chipsContainer.className = "chat-chip-suggestions";
                chipsContainer.innerHTML = reply.chips.map(chip => `<button class="chat-chip" data-query="${chip}">${chip}</button>`).join('');
                
                // Add click listener to suggestions
                chipsContainer.querySelectorAll(".chat-chip").forEach(chip => {
                    chip.addEventListener("click", () => {
                        chatInput.value = chip.dataset.query;
                        handleSendMessage();
                    });
                });
                
                const lastBubble = chatMessages.lastElementChild.querySelector(".msg-bubble");
                lastBubble.appendChild(chipsContainer);
            }
        }, 600);
    };

    btnSendChat.addEventListener("click", handleSendMessage);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleSendMessage();
    });

    // Support Suggestions inside the first static bubble
    document.querySelectorAll(".chat-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            chatInput.value = chip.dataset.query;
            handleSendMessage();
        });
    });

    // 11. Offline Sync Status updates
    setInterval(() => {
        const syncText = document.querySelector(".sync-status");
        if (syncText) {
            const time = new Date().toLocaleTimeString();
            syncText.innerText = `Last Synced: ${time}`;
        }
    }, 15000);
});
