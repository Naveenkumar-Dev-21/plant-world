// Global variables
let plantData = {};
let currentCategory = '';
let filteredPlants = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadPlantData();
    initializeAnimations();
    initializeEventListeners();
    startFloatingAnimations();
});

// Load plant data from JSON file
async function loadPlantData() {
    try {
        const response = await fetch('plant_data.json');
        plantData = await response.json();
        console.log('Plant data loaded:', plantData);
    } catch (error) {
        console.error('Error loading plant data:', error);
        // Fallback data for demo
        plantData = {
            fruits: [{ name: "Apple", biological_name: "Malus domestica", seasonal_time: "Winter", soil_type: "Loamy", water_requirement: "Moderate", bio_fertilizers: "Azotobacter", bio_pesticides: "Neem oil", medicinal_values: "Anti-inflammatory" }],
            vegetables: [{ name: "Carrot", biological_name: "Daucus carota", seasonal_time: "Winter", soil_type: "Sandy loam", water_requirement: "Moderate", bio_fertilizers: "PSB", bio_pesticides: "Trichoderma", medicinal_values: "Rich in Vitamin A" }],
            pulses: [{ name: "Chickpea", biological_name: "Cicer arietinum", seasonal_time: "Winter", soil_type: "Well-drained", water_requirement: "Low", bio_fertilizers: "Rhizobium", bio_pesticides: "Neem", medicinal_values: "High protein" }],
            cereals: [{ name: "Wheat", biological_name: "Triticum aestivum", seasonal_time: "Winter", soil_type: "Loamy", water_requirement: "Moderate", bio_fertilizers: "Azotobacter", bio_pesticides: "BT", medicinal_values: "Energy source" }],
            flowers: [{ name: "Rose", biological_name: "Rosa", seasonal_time: "Spring", soil_type: "Well-drained", water_requirement: "Moderate", bio_fertilizers: "Compost", bio_pesticides: "Neem", medicinal_values: "Aromatherapy" }],
            nuts: [{ name: "Almond", biological_name: "Prunus dulcis", seasonal_time: "Winter", soil_type: "Sandy loam", water_requirement: "Low", bio_fertilizers: "Mycorrhizae", bio_pesticides: "Neem", medicinal_values: "Heart health" }],
            greens: [{ name: "Spinach", biological_name: "Spinacia oleracea", seasonal_time: "Winter", soil_type: "Rich loamy", water_requirement: "High", bio_fertilizers: "Compost", bio_pesticides: "IPM", medicinal_values: "Iron rich" }],
            spices: [{ name: "Turmeric", biological_name: "Curcuma longa", seasonal_time: "Monsoon", soil_type: "Red loamy", water_requirement: "High", bio_fertilizers: "FYM", bio_pesticides: "Neem", medicinal_values: "Anti-inflammatory" }],
            herbs: [{ name: "Basil", biological_name: "Ocimum basilicum", seasonal_time: "Summer", soil_type: "Well-drained", water_requirement: "Moderate", bio_fertilizers: "Vermicompost", bio_pesticides: "Neem", medicinal_values: "Respiratory health" }],
            medicinal_plants: [{ name: "Aloe Vera", biological_name: "Aloe barbadensis", seasonal_time: "Year-round", soil_type: "Sandy", water_requirement: "Low", bio_fertilizers: "Minimal", bio_pesticides: "Natural", medicinal_values: "Skin healing" }]
        };
    }
}

// Initialize all animations
function initializeAnimations() {
    animateHomepage();
    animateCategoryCards();
    animateFooter();
}

// Animate homepage elements
function animateHomepage() {
    // Animate welcome text lines
    anime({
        targets: '.welcome-line',
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.8, 1],
        duration: 1000,
        delay: anime.stagger(300, {start: 500}),
        easing: 'easeOutExpo'
    });

    // Animate click here button with bounce effect
    anime({
        targets: '.click-here-btn',
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 800,
        delay: 1800,
        easing: 'easeOutBounce'
    });

    // Continuous pulse animation for button
    anime({
        targets: '.click-here-btn',
        scale: [1, 1.05, 1],
        duration: 2000,
        loop: true,
        easing: 'easeInOutSine',
        delay: 2500
    });

    // Animate categories subtitle
    anime({
        targets: '.categories-subtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: 2200,
        easing: 'easeOutQuad'
    });
}

// Animate category cards with stagger effect
function animateCategoryCards() {
    anime({
        targets: '.category-card',
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.8, 1],
        duration: 600,
        delay: anime.stagger(100, {start: 500}),
        easing: 'easeOutExpo'
    });
}

// Animate footer
function animateFooter() {
    // Create intersection observer for footer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: '.footer-text',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 800,
                    easing: 'easeOutQuad'
                });
            }
        });
    });

    const footer = document.querySelector('.footer');
    if (footer) observer.observe(footer);
}

// Start floating leaf animations
function startFloatingAnimations() {
    // Enhanced floating animation for leaves
    document.querySelectorAll('.floating-leaf').forEach((leaf, index) => {
        // Random floating animation
        anime({
            targets: leaf,
            translateX: [
                {value: anime.random(-50, 50), duration: anime.random(3000, 5000)},
                {value: anime.random(-50, 50), duration: anime.random(3000, 5000)}
            ],
            translateY: [
                {value: anime.random(-30, 30), duration: anime.random(3000, 5000)},
                {value: anime.random(-30, 30), duration: anime.random(3000, 5000)}
            ],
            rotate: [
                {value: anime.random(-180, 180), duration: anime.random(4000, 6000)},
                {value: anime.random(-180, 180), duration: anime.random(4000, 6000)}
            ],
            scale: [
                {value: anime.random(0.8, 1.2), duration: anime.random(2000, 4000)},
                {value: anime.random(0.8, 1.2), duration: anime.random(2000, 4000)}
            ],
            loop: true,
            easing: 'easeInOutSine',
            delay: index * 1000
        });
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Click here button - show categories (dynamic navigation)
    document.getElementById('click-here-btn').addEventListener('click', () => {
        showCategoriesSection();
    });

    // Category cards click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            showCategoryDetails(category);
        });

        // Add hover glow effect
        card.addEventListener('mouseenter', (e) => {
            anime({
                targets: e.currentTarget,
                boxShadow: '0 15px 40px rgba(76, 175, 80, 0.3)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        card.addEventListener('mouseleave', (e) => {
            anime({
                targets: e.currentTarget,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        showHomepage();
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('input', (e) => {
        filterPlants(e.target.value);
    });


}

// Show categories section (dynamic navigation)
function showCategoriesSection() {
    // Hide homepage, show categories
    anime({
        targets: '#homepage',
        opacity: 0,
        duration: 400,
        easing: 'easeOutQuad',
        complete: () => {
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('categories').style.display = 'block';
            
            // Re-animate category cards to fix alignment
            anime.set('.category-card', {
                opacity: 0,
                translateY: 50
            });
            
            anime({
                targets: '#categories',
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutQuad',
                complete: () => {
                    // Re-trigger category cards animation
                    animateCategoryCards();
                }
            });
        }
    });
}

// Show category details
function showCategoryDetails(category) {
    currentCategory = category;
    const categoryData = plantData[category] || [];
    filteredPlants = [...categoryData];

    // Hide homepage and categories
    anime({
        targets: ['#homepage', '#categories'],
        opacity: 0,
        duration: 400,
        easing: 'easeOutQuad',
        complete: () => {
            document.getElementById('homepage').style.display = 'none';
            document.getElementById('categories').style.display = 'none';
            
            // Show details section
            document.getElementById('category-details').style.display = 'block';
            
            // Set category title
            document.getElementById('category-title').textContent = 
                category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            // Render plants
            renderPlants(filteredPlants);
            
            // Animate in details section
            anime({
                targets: '#category-details',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 500,
                easing: 'easeOutQuad'
            });
        }
    });
}

// Show homepage
function showHomepage() {
    anime({
        targets: '#category-details',
        opacity: 0,
        duration: 400,
        easing: 'easeOutQuad',
        complete: () => {
            document.getElementById('category-details').style.display = 'none';
            document.getElementById('homepage').style.display = 'block';
            
            // Reset and re-animate homepage elements
            anime.set(['.welcome-line', '.click-here-btn', '.categories-subtitle'], {
                opacity: 0,
                translateY: 30,
                scale: 0.9
            });
            
            anime({
                targets: '#homepage',
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutQuad',
                complete: () => {
                    // Re-trigger homepage animations
                    animateHomepage();
                }
            });
            
            // Clear search
            document.getElementById('search-input').value = '';
        }
    });
}

// Render plants in the container
function renderPlants(plants) {
    const container = document.getElementById('plants-container');
    container.innerHTML = '';

    plants.forEach((plant, index) => {
        // Skip plants without names or header rows
        if (!plant.name || plant.name.includes('COMMON') || plant.name.toUpperCase() === plant.name && plant.name.length > 20) {
            return;
        }

        const plantCard = createPlantCard(plant, index);
        container.appendChild(plantCard);
    });

    // Animate plant cards
    anime({
        targets: '.plant-card',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 500,
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
    });
}

// Generate plant image slug from name
function getPlantImageSlug(plantName) {
    return plantName.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20); // Limit length
}


// Create plant card element
function createPlantCard(plant, index) {
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.setAttribute('data-plant-index', index);
    
    // Try to load local image first
    const slug = getPlantImageSlug(plant.name);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    
    // We'll check for images after card creation
    const plantImagePath = `images/${currentCategory}/${slug}`;
    
    card.innerHTML = `
        <div class="plant-card-content">
            <div class="plant-image-container"></div>
            <h3 class="plant-name">${plant.name}</h3>
            <p class="plant-biological-name">${plant.biological_name || ''}</p>
        </div>
    `;
    
    // Hosted version: no images

    // Add click handler for modal popup
    card.addEventListener('click', () => {
        showPlantModal(plant, index);
    });

    return card;
}

// Filter plants based on search input
function filterPlants(searchTerm) {
    const categoryData = plantData[currentCategory] || [];
    const filtered = categoryData.filter(plant => 
        plant.name && plant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Animate out current plants
    anime({
        targets: '.plant-card',
        opacity: 0,
        translateY: -20,
        duration: 300,
        complete: () => {
            renderPlants(filtered);
        }
    });
}

// Show plant modal popup
function showPlantModal(plant, plantIndex) {
    const modal = document.getElementById('plant-modal');
    const modalContent = document.getElementById('modal-content');
    const modalPlantName = document.getElementById('modal-plant-name');
    const modalPlantImage = document.getElementById('modal-plant-image');
    const modalDetails = document.getElementById('modal-details');
    const modalPdfBtn = document.getElementById('modal-download-pdf-btn');
    
    // Set plant name
    modalPlantName.textContent = plant.name;
    
    // Hosted version: no images
    modalPlantImage.style.display = 'none';
    
    // Create details HTML
    let detailsHTML = '';
    
    const fields = [
        { label: 'Biological Name', value: plant.biological_name },
        { label: 'Seasonal Time', value: plant.seasonal_time },
        { label: 'Soil Type', value: plant.soil_type },
        { label: 'Water Requirement', value: plant.water_requirement },
        { label: 'Bio Fertilizers', value: plant.bio_fertilizers },
        { label: 'Bio Pesticides', value: plant.bio_pesticides },
        { label: 'Medicinal Values', value: plant.medicinal_values },
        { label: 'Genetic Sequence', value: plant.genetic_sequence, isLink: true },
        { label: 'Genomic Sequence', value: plant.genomic_sequence, isLink: true },
        { label: 'Reference URL', value: plant.url, isLink: true }
    ];
    
    fields.forEach(field => {
        if (field.value && field.value.trim() !== '' && field.value !== 'Not specified') {
            let valueHTML = field.value;
            if (field.isLink && field.value.startsWith('http')) {
                valueHTML = `<a href="${field.value}" target="_blank" rel="noopener noreferrer" style="color: #4CAF50; text-decoration: underline;">View Link</a>`;
            }
            detailsHTML += `
                <div class="detail-item">
                    <span class="detail-label">${field.label}:</span>
                    <span class="detail-value">${valueHTML}</span>
                </div>
            `;
        }
    });
    
    modalDetails.innerHTML = detailsHTML;
    
    // Set up PDF download button
    modalPdfBtn.onclick = () => downloadPlantPDF(plant.name, plantIndex);
    
    // Show modal with animation
    modal.style.display = 'flex';
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    anime({
        targets: modalContent,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        delay: 100,
        easing: 'easeOutExpo'
    });
}

// Hide plant modal popup
function hideePlantModal() {
    const modal = document.getElementById('plant-modal');
    const modalContent = document.getElementById('modal-content');
    
    anime({
        targets: modalContent,
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuad'
    });
    
    anime({
        targets: modal,
        opacity: [1, 0],
        duration: 300,
        delay: 100,
        easing: 'easeInQuad',
        complete: () => {
            modal.style.display = 'none';
        }
    });
}


// Download PDF for individual plant
function downloadPlantPDF(plantName, plantIndex) {
    // Get plant data from current category
    const categoryData = plantData[currentCategory] || [];
    const plant = filteredPlants[plantIndex] || categoryData[plantIndex];
    
    if (!plant) {
        alert('Plant data not found!');
        return;
    }
    
    // Find the PDF button and show loading state
    const modalPdfBtn = document.getElementById('modal-download-pdf-btn');
    const originalText = modalPdfBtn.querySelector('span').textContent;
    modalPdfBtn.querySelector('span').textContent = 'Generating...';
    
    // Animate button
    anime({
        targets: modalPdfBtn,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeOutQuad'
    });
    
    // Create new jsPDF instance
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // PDF styling
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Plant World', pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;
    
    // Plant name as subtitle
    doc.setFontSize(18);
    doc.setTextColor(46, 125, 50); // Green color
    doc.text(plantName, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;
    
    // Hosted version: no images in PDF
    
    // Plant details from modal
    const detailItems = document.querySelectorAll('#modal-details .detail-item');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    
    detailItems.forEach(item => {
        const label = item.querySelector('.detail-label').textContent;
        const valueElement = item.querySelector('.detail-value');
        let value = valueElement.textContent;
        
        // Handle links in PDF - show the URL
        const link = valueElement.querySelector('a');
        if (link) {
            value = link.getAttribute('href');
        }
        
        if (value && value !== 'Not specified' && value.trim() !== '') {
            // Check if we need a new page
            if (currentY > pageHeight - 40) {
                doc.addPage();
                currentY = margin;
            }
            
            // Label
            doc.setFont(undefined, 'bold');
            doc.text(label, margin, currentY);
            currentY += 6;
            
            // Value (with text wrapping)
            doc.setFont(undefined, 'normal');
            const lines = doc.splitTextToSize(value, contentWidth - 5);
            lines.forEach(line => {
                if (currentY > pageHeight - 20) {
                    doc.addPage();
                    currentY = margin;
                }
                doc.text(line, margin, currentY);
                currentY += 5;
            });
            currentY += 4;
        }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('Plant World - Your Guide to Plants and Nature', pageWidth / 2, pageHeight - 5, { align: 'center' });
    }
    
    // Save the PDF
    const fileName = `Plant-World-${plantName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    doc.save(fileName);
    
    // Reset button text
    modalPdfBtn.querySelector('span').textContent = 'Downloaded!';
    setTimeout(() => {
        modalPdfBtn.querySelector('span').textContent = originalText;
    }, 2000);
}

// Enhanced button hover animations and modal setup
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced hover for back button
    document.getElementById('back-btn').addEventListener('mouseenter', (e) => {
        anime({
            targets: e.currentTarget,
            scale: 1.05,
            duration: 200,
            easing: 'easeOutQuad'
        });
    });

    document.getElementById('back-btn').addEventListener('mouseleave', (e) => {
        anime({
            targets: e.currentTarget,
            scale: 1,
            duration: 200,
            easing: 'easeOutQuad'
        });
    });
    
    // Modal close event listeners
    document.getElementById('modal-close-btn').addEventListener('click', hideePlantModal);
    document.getElementById('modal-overlay').addEventListener('click', hideePlantModal);
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideePlantModal();
        }
    });
});
