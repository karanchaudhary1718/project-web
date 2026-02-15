/* ===================================================================
   SERVICES PAGE JAVASCRIPT - B.L VERDANTIX WEBSITE
   JavaScript specific to services.html (Services Page)
   =================================================================== */

// ===== GLOBAL VARIABLES =====
let map;
let drawnItems;
let drawControl;
let currentPolygon = null;

// ===== STATE AND DISTRICT DATA =====
const stateDistrictData = {
    "Uttar Pradesh": ["Meerut", "Agra", "Lucknow", "Kanpur", "Varanasi", "Allahabad", "Ghaziabad", "Noida"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
    "Haryana": ["Faridabad", "Gurgaon", "Rohtak", "Hisar", "Panipat", "Karnal"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"]
};

const cropData = {
    "Wheat": ["Sandy Loam", "Loamy", "Clay Loam"],
    "Rice": ["Clay", "Clay Loam", "Loamy"],
    "Cotton": ["Black Soil", "Red Soil", "Alluvial"],
    "Sugarcane": ["Loamy", "Clay Loam", "Red Loam"],
    "Maize": ["Loamy", "Sandy Loam", "Clay Loam"],
    "Potato": ["Sandy Loam", "Loamy", "Red Soil"],
    "Tomato": ["Loamy", "Sandy Loam", "Red Soil"],
    "Onion": ["Loamy", "Sandy Loam", "Black Soil"]
};

const treeData = [
    { name: "Mango", icon: "🥭" },
    { name: "Apple", icon: "🍎" },
    { name: "Banana", icon: "🍌" },
    { name: "Orange", icon: "🍊" },
    { name: "Guava", icon: "🍐" },
    { name: "Papaya", icon: "🍈" },
    { name: "Coconut", icon: "🥥" },
    { name: "Lemon", icon: "🍋" },
    { name: "Pomegranate", icon: "🍎" },
    { name: "Grapes", icon: "🍇" }
];

// ===== SERVICE PANEL SWITCHING =====
function switchService(serviceType) {
    // Hide all panels
    const panels = document.querySelectorAll('.service-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.service-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected panel
    document.getElementById(`panel-${serviceType}`).classList.add('active');
    document.getElementById(`tab-${serviceType}`).classList.add('active');
}

// ===== GPS LAND CALCULATOR =====

// Initialize Map
function initMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }
    
    map = L.map('map').setView([28.9845, 77.7064], 13); // Meerut coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    
    drawControl = new L.Control.Draw({
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true,
                metric: true
            },
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });
    
    map.on(L.Draw.Event.CREATED, function(event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        currentPolygon = layer;
        calculateArea(layer);
        document.getElementById('polygonInfo').classList.add('show');
    });
    
    map.on(L.Draw.Event.DELETED, function() {
        currentPolygon = null;
        document.getElementById('resultCard').classList.remove('show');
        document.getElementById('polygonInfo').classList.remove('show');
    });
}

// Search Location
function searchLocation() {
    const location = document.getElementById('searchLocation').value.trim();
    
    if (!location) {
        alert('कृपया स्थान दर्ज करें / Please enter a location');
        return;
    }
    
    document.getElementById('loading').classList.add('show');
    
    // Use Nominatim API for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').classList.remove('show');
            
            if (data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                map.setView([lat, lon], 15);
                
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(data[0].display_name)
                    .openPopup();
            } else {
                alert('स्थान नहीं मिला / Location not found');
            }
        })
        .catch(error => {
            document.getElementById('loading').classList.remove('show');
            console.error('Error:', error);
            alert('त्रुटि हुई / Error occurred');
        });
}

// Get Current Location
function getCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    
    document.getElementById('loading').classList.add('show');
    
    navigator.geolocation.getCurrentPosition(
        function(position) {
            document.getElementById('loading').classList.remove('show');
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            map.setView([lat, lon], 15);
            
            L.marker([lat, lon]).addTo(map)
                .bindPopup('आपका स्थान / Your Location')
                .openPopup();
        },
        function(error) {
            document.getElementById('loading').classList.remove('show');
            alert('स्थान प्राप्त नहीं हो सका / Could not get location');
            console.error(error);
        }
    );
}

// Start Drawing
function startDrawing() {
    if (!map) {
        alert('कृपया पहले मानचित्र लोड करें / Please load map first');
        return;
    }
    
    if (!drawControl._map) {
        map.addControl(drawControl);
    }
    
    // Trigger polygon drawing
    new L.Draw.Polygon(map, drawControl.options.draw.polygon).enable();
}

// Calculate Area
function calculateArea(layer) {
    if (typeof turf === 'undefined') {
        console.error('Turf.js library not loaded');
        return;
    }
    
    const geoJSON = layer.toGeoJSON();
    const area = turf.area(geoJSON); // in square meters
    const perimeter = turf.length(geoJSON, { units: 'meters' });
    
    // Convert to different units
    const areaSqM = area.toFixed(2);
    const areaAcre = (area * 0.000247105).toFixed(4);
    const areaHectare = (area * 0.0001).toFixed(4);
    const areaBigha = (area * 0.00062).toFixed(4); // Approximate conversion
    const perimeterM = perimeter.toFixed(2);
    
    // Display results
    document.getElementById('areaSqM').textContent = areaSqM;
    document.getElementById('areaAcre').textContent = areaAcre;
    document.getElementById('areaHectare').textContent = areaHectare;
    document.getElementById('areaBigha').textContent = areaBigha;
    document.getElementById('perimeter').textContent = perimeterM;
    
    document.getElementById('resultCard').classList.add('show');
}

// Clear All
function clearAll() {
    if (drawnItems) {
        drawnItems.clearLayers();
    }
    currentPolygon = null;
    document.getElementById('resultCard').classList.remove('show');
    document.getElementById('polygonInfo').classList.remove('show');
    document.getElementById('searchLocation').value = '';
}

// ===== AGRICULTURE CALCULATORS =====

// Load States
function loadStates() {
    const stateSelect = document.getElementById('state');
    if (!stateSelect) return;
    
    stateSelect.innerHTML = '<option value="">-- Choose State --</option>';
    Object.keys(stateDistrictData).forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Load Districts
function loadDistricts() {
    const state = document.getElementById('state').value;
    const districtSelect = document.getElementById('district');
    const cropSelect = document.getElementById('crop');
    
    districtSelect.innerHTML = '<option value="">-- Choose District --</option>';
    cropSelect.innerHTML = '<option value="">-- Choose Crop --</option>';
    
    if (state && stateDistrictData[state]) {
        stateDistrictData[state].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
    
    // Load crops
    Object.keys(cropData).forEach(crop => {
        const option = document.createElement('option');
        option.value = crop;
        option.textContent = crop;
        cropSelect.appendChild(option);
    });
}

// Convert Area
function convertArea(fromUnit) {
    const acres = parseFloat(document.getElementById('acres').value) || 0;
    const hectares = parseFloat(document.getElementById('hectares').value) || 0;
    const bigha = parseFloat(document.getElementById('bigha').value) || 0;
    
    if (fromUnit === 'acres' && acres > 0) {
        document.getElementById('hectares').value = (acres * 0.404686).toFixed(4);
        document.getElementById('bigha').value = (acres * 1.613).toFixed(4);
    } else if (fromUnit === 'hectares' && hectares > 0) {
        document.getElementById('acres').value = (hectares * 2.47105).toFixed(4);
        document.getElementById('bigha').value = (hectares * 3.986).toFixed(4);
    } else if (fromUnit === 'bigha' && bigha > 0) {
        document.getElementById('acres').value = (bigha * 0.62).toFixed(4);
        document.getElementById('hectares').value = (bigha * 0.251).toFixed(4);
    }
}

// Calculate Fertilizer
function calculateFertilizer() {
    const state = document.getElementById('state').value;
    const district = document.getElementById('district').value;
    const crop = document.getElementById('crop').value;
    const soil = document.getElementById('soil').value;
    const acres = parseFloat(document.getElementById('acres').value) || 0;
    
    if (!state || !district || !crop || !soil || acres <= 0) {
        alert('कृपया सभी फील्ड भरें / Please fill all fields');
        return;
    }
    
    // Sample calculation (adjust based on actual requirements)
    const nitrogenPerAcre = 120;
    const phosphorusPerAcre = 60;
    const potassiumPerAcre = 40;
    
    const nitrogen = (nitrogenPerAcre * acres).toFixed(2);
    const phosphorus = (phosphorusPerAcre * acres).toFixed(2);
    const potassium = (potassiumPerAcre * acres).toFixed(2);
    
    const urea = (nitrogen / 0.46).toFixed(2);
    const dap = (phosphorus / 0.46).toFixed(2);
    const mop = (potassium / 0.60).toFixed(2);
    
    const costPerKgUrea = 6;
    const costPerKgDAP = 27;
    const costPerKgMOP = 17;
    
    const totalCost = (urea * costPerKgUrea + dap * costPerKgDAP + mop * costPerKgMOP).toFixed(2);
    
    const resultHTML = `
        <h3>🌾 Fertilizer Recommendation</h3>
        <div class="result-item">
            <span class="result-label">Crop</span>
            <span class="result-value">${crop}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Soil Type</span>
            <span class="result-value">${soil}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Field Area</span>
            <span class="result-value">${acres} Acres</span>
        </div>
        <hr>
        <h4>Required Nutrients (kg)</h4>
        <div class="result-item">
            <span class="result-label">Nitrogen (N)</span>
            <span class="result-value">${nitrogen} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">Phosphorus (P)</span>
            <span class="result-value">${phosphorus} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">Potassium (K)</span>
            <span class="result-value">${potassium} kg</span>
        </div>
        <hr>
        <h4>Required Fertilizers (kg)</h4>
        <div class="result-item">
            <span class="result-label">Urea</span>
            <span class="result-value">${urea} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">DAP</span>
            <span class="result-value">${dap} kg</span>
        </div>
        <div class="result-item">
            <span class="result-label">MOP</span>
            <span class="result-value">${mop} kg</span>
        </div>
        <div class="total-cost">
            Total Estimated Cost: ₹${totalCost}
        </div>
    `;
    
    const resultBox = document.getElementById('fertilizerResult');
    resultBox.innerHTML = resultHTML;
    resultBox.classList.add('show');
}

// Calculate Irrigation
function calculateIrrigation() {
    const crop = document.getElementById('irrigCrop').value;
    const method = document.getElementById('irrigMethod').value;
    const area = parseFloat(document.getElementById('irrigArea').value) || 0;
    const soilType = document.getElementById('soilType').value;
    
    if (!crop || !method || area <= 0 || !soilType) {
        alert('कृपया सभी फील्ड भरें / Please fill all fields');
        return;
    }
    
    // Sample calculation
    let waterPerAcrePerDay = 0;
    
    if (method === 'drip') {
        waterPerAcrePerDay = 1500; // liters
    } else if (method === 'sprinkler') {
        waterPerAcrePerDay = 2500;
    } else if (method === 'flood') {
        waterPerAcrePerDay = 5000;
    } else if (method === 'furrow') {
        waterPerAcrePerDay = 3500;
    }
    
    const totalWaterPerDay = (waterPerAcrePerDay * area).toFixed(2);
    const waterPerWeek = (totalWaterPerDay * 7).toFixed(2);
    const waterPerMonth = (totalWaterPerDay * 30).toFixed(2);
    
    const efficiency = method === 'drip' ? '90-95%' : method === 'sprinkler' ? '75-85%' : '60-70%';
    
    const resultHTML = `
        <h3>💧 Irrigation Requirements</h3>
        <div class="result-item">
            <span class="result-label">Crop</span>
            <span class="result-value">${crop}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Method</span>
            <span class="result-value">${method}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Area</span>
            <span class="result-value">${area} Acres</span>
        </div>
        <div class="result-item">
            <span class="result-label">Soil Type</span>
            <span class="result-value">${soilType}</span>
        </div>
        <hr>
        <h4>Water Requirements</h4>
        <div class="result-item">
            <span class="result-label">Per Day</span>
            <span class="result-value">${totalWaterPerDay} Liters</span>
        </div>
        <div class="result-item">
            <span class="result-label">Per Week</span>
            <span class="result-value">${waterPerWeek} Liters</span>
        </div>
        <div class="result-item">
            <span class="result-label">Per Month</span>
            <span class="result-value">${waterPerMonth} Liters</span>
        </div>
        <div class="result-item">
            <span class="result-label">Efficiency</span>
            <span class="result-value">${efficiency}</span>
        </div>
    `;
    
    const resultBox = document.getElementById('irrigationResult');
    resultBox.innerHTML = resultHTML;
    resultBox.classList.add('show');
}

// Calculate Bulk Density
function calculateBulkDensity() {
    const weight = parseFloat(document.getElementById('soilWeight').value) || 0;
    const volume = parseFloat(document.getElementById('soilVolume').value) || 0;
    
    if (weight <= 0 || volume <= 0) {
        alert('कृपया वैध मान दर्ज करें / Please enter valid values');
        return;
    }
    
    const bulkDensity = (weight / volume).toFixed(3);
    
    let soilType = '';
    if (bulkDensity < 1.0) {
        soilType = 'Peat or Highly Organic Soil';
    } else if (bulkDensity < 1.3) {
        soilType = 'Sandy Soil';
    } else if (bulkDensity < 1.5) {
        soilType = 'Loamy Soil';
    } else {
        soilType = 'Clay Soil';
    }
    
    const resultHTML = `
        <h3>📊 Bulk Density Result</h3>
        <div class="result-item">
            <span class="result-label">Soil Weight</span>
            <span class="result-value">${weight} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">Soil Volume</span>
            <span class="result-value">${volume} cm³</span>
        </div>
        <hr>
        <div class="result-item">
            <span class="result-label">Bulk Density</span>
            <span class="result-value">${bulkDensity} g/cm³</span>
        </div>
        <div class="result-item">
            <span class="result-label">Soil Type</span>
            <span class="result-value">${soilType}</span>
        </div>
    `;
    
    const resultBox = document.getElementById('bulkDensityResult');
    resultBox.innerHTML = resultHTML;
    resultBox.classList.add('show');
}

// Initialize Tree Grid
function initTreeGrid() {
    const treeGrid = document.getElementById('treeGrid');
    if (!treeGrid) return;
    
    treeGrid.innerHTML = '';
    
    treeData.forEach(tree => {
        const card = document.createElement('div');
        card.className = 'tree-card';
        card.innerHTML = `
            <div class="t-icon">${tree.icon}</div>
            <div class="t-name">${tree.name}</div>
        `;
        
        card.addEventListener('click', function() {
            document.querySelectorAll('.tree-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
        
        treeGrid.appendChild(card);
    });
}

// Calculate Tree Dose
function calculateTreeDose() {
    const selectedTree = document.querySelector('.tree-card.selected');
    const age = parseInt(document.getElementById('treeAge').value) || 0;
    const count = parseInt(document.getElementById('treeCount').value) || 1;
    
    if (!selectedTree) {
        alert('कृपया पेड़ का प्रकार चुनें / Please select tree type');
        return;
    }
    
    if (age <= 0) {
        alert('कृपया वैध उम्र दर्ज करें / Please enter valid age');
        return;
    }
    
    const treeName = selectedTree.querySelector('.t-name').textContent;
    
    // Sample calculation based on tree age
    let nPerTree = 0;
    let pPerTree = 0;
    let kPerTree = 0;
    
    if (age < 365) { // Less than 1 year
        nPerTree = 50;
        pPerTree = 30;
        kPerTree = 20;
    } else if (age < 730) { // 1-2 years
        nPerTree = 100;
        pPerTree = 60;
        kPerTree = 40;
    } else if (age < 1095) { // 2-3 years
        nPerTree = 200;
        pPerTree = 120;
        kPerTree = 80;
    } else { // 3+ years
        nPerTree = 300;
        pPerTree = 180;
        kPerTree = 120;
    }
    
    const totalN = (nPerTree * count).toFixed(2);
    const totalP = (pPerTree * count).toFixed(2);
    const totalK = (kPerTree * count).toFixed(2);
    
    const resultHTML = `
        <h3>🌳 Tree Fertilizer Dose</h3>
        <div class="result-item">
            <span class="result-label">Tree Type</span>
            <span class="result-value">${treeName}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Tree Age</span>
            <span class="result-value">${age} days (${(age / 365).toFixed(1)} years)</span>
        </div>
        <div class="result-item">
            <span class="result-label">Number of Trees</span>
            <span class="result-value">${count}</span>
        </div>
        <hr>
        <h4>Total Fertilizer Required (grams)</h4>
        <div class="result-item">
            <span class="result-label">Nitrogen (N)</span>
            <span class="result-value">${totalN} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">Phosphorus (P)</span>
            <span class="result-value">${totalP} g</span>
        </div>
        <div class="result-item">
            <span class="result-label">Potassium (K)</span>
            <span class="result-value">${totalK} g</span>
        </div>
    `;
    
    const resultBox = document.getElementById('treeDoseResult');
    resultBox.innerHTML = resultHTML;
    resultBox.classList.add('show');
}

// Convert All Areas
function convertAllAreas() {
    const value = parseFloat(document.getElementById('areaValue').value) || 0;
    const fromUnit = document.getElementById('fromUnit').value;
    
    if (value <= 0) {
        document.getElementById('areaResult').classList.remove('show');
        return;
    }
    
    // Conversion factors to square meters
    const toSqMeters = {
        'acre': 4046.86,
        'hectare': 10000,
        'bigha': 1618.74,
        'sqmeter': 1,
        'sqfoot': 0.092903,
        'katha': 126.45,
        'guntha': 101.17,
        'biswa': 809.37
    };
    
    const sqMeters = value * toSqMeters[fromUnit];
    
    const results = {
        'Acre': (sqMeters / 4046.86).toFixed(4),
        'Hectare': (sqMeters / 10000).toFixed(4),
        'Bigha': (sqMeters / 1618.74).toFixed(4),
        'Square Meter': sqMeters.toFixed(2),
        'Square Feet': (sqMeters / 0.092903).toFixed(2),
        'Katha': (sqMeters / 126.45).toFixed(4),
        'Guntha': (sqMeters / 101.17).toFixed(4),
        'Biswa': (sqMeters / 809.37).toFixed(4)
    };
    
    let resultHTML = '<h3>📏 Area Conversion Results</h3>';
    
    for (const [unit, val] of Object.entries(results)) {
        resultHTML += `
            <div class="result-item">
                <span class="result-label">${unit}</span>
                <span class="result-value">${val}</span>
            </div>
        `;
    }
    
    const resultBox = document.getElementById('areaResult');
    resultBox.innerHTML = resultHTML;
    resultBox.classList.add('show');
}

// Switch Agriculture Tab
function openAgriTab(tabName, button) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.agri-tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.agri-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    button.classList.add('active');
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Services page scripts initialized! 🛠️');
    
    // Initialize GPS map if on services page
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Load initial data
    loadStates();
    initTreeGrid();
    
    console.log('✅ Services.js loaded successfully!');
});

// ===== EXPORT FUNCTIONS =====
window.ServicesPageFunctions = {
    switchService,
    searchLocation,
    getCurrentLocation,
    startDrawing,
    clearAll,
    loadDistricts,
    convertArea,
    calculateFertilizer,
    calculateIrrigation,
    calculateBulkDensity,
    calculateTreeDose,
    convertAllAreas,
    openAgriTab
};
