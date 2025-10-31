document.addEventListener('DOMContentLoaded', () => {
    const app = {
        plantData: null,

        init: function() {
            this.cacheDOMElements();
            this.addEventListeners();
            this.loadPlantData();
        },

        cacheDOMElements: function() {
            this.appContainer = document.getElementById('app-container');
            this.homepage = document.getElementById('homepage');
            this.categoriesSection = document.getElementById('categories');
            this.plantGridSection = document.getElementById('plant-grid');
            this.plantGridTitle = document.getElementById('plant-grid-title');
            this.plantCardsContainer = document.getElementById('plant-cards-container');
            this.modal = document.getElementById('plant-modal');
            this.modalContent = document.getElementById('modal-content');
            this.modalPlantName = document.getElementById('modal-plant-name');
            this.modalDetails = document.getElementById('modal-details');
            this.modalCloseBtn = document.getElementById('modal-close-btn');
            this.modalDownloadPdfBtn = document.getElementById('modal-download-pdf-btn');
            this.exploreBtn = document.getElementById('click-here-btn');
            this.backToCategoriesBtn = document.getElementById('back-to-categories');
        },

        addEventListeners: function() {
            this.exploreBtn.addEventListener('click', () => this.showCategories());
            this.categoriesSection.addEventListener('click', (e) => {
                const categoryCard = e.target.closest('.category-card');
                if (categoryCard) {
                    const category = categoryCard.dataset.category;
                    this.showPlantGrid(category);
                }
            });
            this.backToCategoriesBtn.addEventListener('click', () => this.showCategoriesFromGrid());
            this.plantCardsContainer.addEventListener('click', (e) => {
                const plantCard = e.target.closest('.plant-card');
                if (plantCard) {
                    const plantName = plantCard.dataset.plantName;
                    const category = plantCard.dataset.category;
                    const plant = this.plantData[category].find(p => p.name === plantName);
                    if (plant) {
                        this.showPlantModal(plant);
                    }
                }
            });
            this.modalCloseBtn.addEventListener('click', () => this.closeModal());
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
            this.modalDownloadPdfBtn.addEventListener('click', () => this.generatePDF());
        },

        loadPlantData: async function() {
            try {
                const response = await fetch('plant_data.json');
                this.plantData = await response.json();
            } catch (error) {
                console.error('Error loading plant data:', error);
            }
        },

        showCategories: function() {
            this.homepage.style.display = 'none';
            this.plantGridSection.style.display = 'none';
            this.categoriesSection.style.display = 'block';
        },

        showCategoriesFromGrid: function() {
            this.plantGridSection.style.display = 'none';
            this.categoriesSection.style.display = 'block';
        },

        showPlantGrid: function(category) {
            if (!this.plantData || !this.plantData[category]) {
                console.error('No data for category:', category);
                return;
            }
            this.plantGridTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            this.plantCardsContainer.innerHTML = this.plantData[category].map(plant => this.getPlantCardHTML(plant, category)).join('');
            this.categoriesSection.style.display = 'none';
            this.plantGridSection.style.display = 'block';
        },

        getPlantCardHTML: function(plant, category) {
            return `
                <div class="plant-card" data-plant-name="${plant.name}" data-category="${category}">
                    <h4>${plant.common_name || plant.name}</h4>
                    <p>${plant.medicinal_values || ''}</p>
                    <button class="view-details-btn">View Details</button>
                </div>
            `;
        },

        showPlantModal: function(plant) {
            this.currentPlant = plant;
            this.modalPlantName.textContent = plant.common_name || plant.name;
            this.modalDetails.innerHTML = this.getPlantDetailsHTML(plant);
            this.modal.style.display = 'block';
        },

        getPlantDetailsHTML: function(plant) {
            return Object.entries(plant).map(([key, value]) => {
                if (value) {
                    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return `<div class="detail-item"><strong>${formattedKey}:</strong> <span>${value}</span></div>`;
                }
                return '';
            }).join('');
        },

        closeModal: function() {
            this.modal.style.display = 'none';
        },

        generatePDF: function() {
            const { jsPDF } = window.jspdf;
            const plant = this.currentPlant;
            if (!plant) return;

            const doc = new jsPDF();
            const plantName = plant.common_name || plant.name;

            // Constants for layout
            const page = {
                width: 210,
                height: 297,
                margins: { top: 15, right: 15, bottom: 20, left: 15 }
            };
            const contentWidth = page.width - page.margins.left - page.margins.right;
            const keyColumnWidth = 60;
            const valueColumnWidth = contentWidth - keyColumnWidth - 5;

            // --- Helper Functions ---
            const addHeader = () => {
                doc.setFillColor(46, 125, 50); // Dark Green
                doc.rect(0, 0, page.width, page.margins.top + 5, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(20);
                doc.setTextColor(255, 255, 255);
                doc.text(plantName, page.width / 2, page.margins.top, { align: 'center' });
            };

            const addFooter = () => {
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(10);
                    doc.setTextColor(150);
                    doc.text(`Page ${i} of ${pageCount}`, page.width / 2, page.height - page.margins.bottom + 10, { align: 'center' });
                }
            };

            // --- PDF Generation ---
            let y = page.margins.top + 20;

            const addNewPage = () => {
                doc.addPage();
                y = page.margins.top + 20;
            };

            addHeader();

            for (const [key, value] of Object.entries(plant)) {
                if (!value) continue;

                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const valueText = String(value);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(40, 40, 40);
                const keyLines = doc.splitTextToSize(formattedKey, keyColumnWidth);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                const valueLines = doc.splitTextToSize(valueText, valueColumnWidth);

                const requiredHeight = Math.max(keyLines.length, valueLines.length) * 6 + 4; // 6 per line, 4 for padding

                if (y + requiredHeight > page.height - page.margins.bottom) {
                    addNewPage();
                    addHeader();
                }

                doc.setFont('helvetica', 'bold');
                doc.setTextColor(40, 40, 40);
                doc.text(keyLines, page.margins.left, y);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(80, 80, 80);
                doc.text(valueLines, page.margins.left + keyColumnWidth + 5, y);

                y += requiredHeight;

                if (y < page.height - page.margins.bottom - 10) {
                    doc.setDrawColor(220, 220, 220);
                    doc.line(page.margins.left, y - 2, page.width - page.margins.right, y - 2);
                }
            }

            addFooter();
            doc.save(`${plantName}.pdf`);
        }
    };

    app.init();
});