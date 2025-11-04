document.addEventListener('DOMContentLoaded', () => {
    const app = {
        plantData: null,
        allPlants: [],
        currentPlant: null,

        init: function() {
            console.log('Script is running!');
            this.cacheDOMElements();
            console.log('Main content element:', this.mainContent);
            if (this.mainContent) {
                this.mainContent.style.display = 'flex'; // Ensure landing page is visible initially
            }
            this.addEventListeners();
            this.loadPlantData();
        },

        cacheDOMElements: function() {
            this.mainContent = document.querySelector('.main-content');
            this.plantListSection = document.getElementById('plant-list-section');
            this.plantCardsContainer = document.getElementById('plant-cards-container');
            this.modal = document.getElementById('plant-modal');
            this.closeButton = document.querySelector('.close-button');
            this.plantDetails = document.getElementById('plant-details');
            this.downloadPdfBtn = document.getElementById('download-pdf');
            this.exploreBtn = document.getElementById('explore-btn');
            this.searchBar = document.getElementById('search-bar');
            this.searchBtn = document.getElementById('search-btn');
        },

        addEventListeners: function() {
            this.exploreBtn.addEventListener('click', () => this.showPlantList());
            this.closeButton.addEventListener('click', () => this.closeModal());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
            this.downloadPdfBtn.addEventListener('click', () => this.generatePDF(this.currentPlant));
            this.searchBtn.addEventListener('click', () => this.filterPlants());
            this.searchBar.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.filterPlants();
                }
            });
            this.plantCardsContainer.addEventListener('click', (e) => {
                const plantCard = e.target.closest('.plant-card');
                if (plantCard) {
                    const plantName = plantCard.dataset.plantName;
                    const plant = this.allPlants.find(p => p.name === plantName);
                    if (plant) {
                        this.showPlantModal(plant);
                    }
                }
            });
        },

        loadPlantData: async function() {
            try {
                const response = await fetch('plant_data.json');
                this.plantData = await response.json();
                this.allPlants = Object.values(this.plantData).flat();
                this.displayPlants(this.allPlants);
            } catch (error) {
                console.error('Error loading plant data:', error);
            }
        },

        displayPlants: function(plants) {
            this.plantCardsContainer.innerHTML = plants.map(plant => this.getPlantCardHTML(plant)).join('');
        },

        getPlantCardHTML: function(plant) {
            return `
                <div class="plant-card" data-plant-name="${plant.name}">
                    <h3>${plant.common_name || plant.name}</h3>
                    <p>${plant.medicinal_values || ''}</p>
                </div>
            `;
        },

        filterPlants: function() {
            const searchTerm = this.searchBar.value.toLowerCase();
            const filteredPlants = this.allPlants.filter(plant => {
                const plantName = (plant.common_name || plant.name).toLowerCase();
                return plantName.includes(searchTerm);
            });
            this.displayPlants(filteredPlants);
        },

        showPlantModal: function(plant) {
            this.currentPlant = plant;
            this.plantDetails.innerHTML = `
                <h2>${plant.common_name || plant.name}</h2>
                <div class="pdf-content-wrapper">
                    <div class="modal-details-content">
                        ${this.getPlantDetailsHTML(plant)}
                    </div>
                </div>
            `;
            this.modal.style.display = 'flex';
        },

        getPlantDetailsHTML: function(plant) {
            const details = [
                ['Scientific Name', plant.name],
                ['Common Name', plant.common_name],
                ['Seasonal Time', plant.seasonal_time],
                ['Soil Type', plant.soil_type],
                ['Water Requirement', plant.water_requirement],
                ['Bio Fertilizers', plant.bio_fertilizers],
                ['Bio Pesticides', plant.bio_pesticides],
                ['Medicinal Values', plant.medicinal_values],
                ['Genomic Sequence', plant.genomic_sequence],
                ['Ploidy Level', plant.ploidy_level],
                ['Key Pigments', plant.key_pigments_type_color],
                ['Physiological Properties', plant.physiological_properties],
                ['Media', plant.media],
                ['Hormones', plant.hormones],
                ['Callus Induction Potential', plant.callus_induction_potential],
                ['Key Nutritional Components', plant.key_nutritional_components],
                ['Propagation Method', plant.propagation_method]
            ];

            return details
                .filter(([_, value]) => value)
                .map(([label, value]) => `
                    <div class="detail-item">
                        <strong>${label}:</strong>
                        <span>${value}</span>
                    </div>
                `).join('');
        },

        closeModal: function() {
            this.modal.style.display = 'none';
        },

        showPlantList: function() {
            this.mainContent.style.display = 'none';
            this.plantListSection.style.display = 'block';
        },

        generatePDF: function(plant) {
            // Use html2pdf.js for PDF generation
            const element = this.plantDetails.cloneNode(true);
            const opt = {
                margin: 1,
                filename: 'plant-details.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        }
    };

    app.init();
});