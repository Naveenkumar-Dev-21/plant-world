// Plant World Application
const PlantWorld = (function() {
    // Private state
    const state = {
        plantData: {},
        currentCategory: '',
        filteredPlants: [],
        currentPage: 'home'
    };

    // DOM Elements
    let appContainer = null;

    // Load plant data
    async function loadPlantData() {
        try {
            const response = await fetch('plant_data.json');
            state.plantData = await response.json();
        } catch (error) {
            console.error('Error loading plant data:', error);
            // Set fallback data
            state.plantData = {
                fruits: [{ name: "Apple", biological_name: "Malus domestica" }],
                vegetables: [{ name: "Carrot", biological_name: "Daucus carota" }],
                herbs: [{ name: "Basil", biological_name: "Ocimum basilicum" }]
            };
        }
    }

    // Show homepage
    function showHomepage() {
        state.currentPage = 'home';
        const homepageHTML = `
            <section id="homepage" class="page homepage">
                <div class="homepage-content">
                    <div class="welcome-text">
                        <h1 class="welcome-line line-1">WELCOME</h1>
                        <h1 class="welcome-line line-2">TO</h1>
                        <h1 class="welcome-line line-3">PLANT WORLD</h1>
                    </div>
                    <button id="click-here-btn" class="click-here-btn">
                        <span>EXPLORE</span>
                        <i class="fas fa-leaf"></i>
                    </button>
                </div>
            </section>
        `;

        if (appContainer) {
            appContainer.innerHTML = homepageHTML;
            const homepage = document.querySelector('.homepage');
            
            if (homepage) {
                homepage.style.display = 'flex';
                homepage.style.opacity = '0';
                
                requestAnimationFrame(() => {
                    homepage.style.transition = 'opacity 500ms ease-out';
                    homepage.style.opacity = '1';
                    
                    // Animate welcome lines
                    const welcomeLines = homepage.querySelectorAll('.welcome-line');
                    welcomeLines.forEach((line, index) => {
                        line.style.opacity = '0';
                        line.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            line.style.transition = 'all 300ms ease-out';
                            line.style.opacity = '1';
                            line.style.transform = 'translateY(0)';
                        }, index * 200);
                    });

                    // Animate explore button
                    const exploreBtn = homepage.querySelector('.click-here-btn');
                    if (exploreBtn) {
                        exploreBtn.style.opacity = '0';
                        exploreBtn.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            exploreBtn.style.transition = 'all 300ms ease-out';
                            exploreBtn.style.opacity = '1';
                            exploreBtn.style.transform = 'translateY(0)';
                        }, welcomeLines.length * 200);
                    }
                });
            }
        }
    }

    // Show categories section
    function showCategoriesSection() {
        state.currentPage = 'categories';
        const categoriesHTML = `
            <section id="categories" class="page categories-section">
                <div class="container">
                    <div class="categories-grid">
                        <div class="category-card cat-fruits" data-category="fruits">
                            <div class="category-icon">🍎</div>
                            <h3>Fruits</h3>
                            <p>Explore various fruits and their properties</p>
                        </div>
                        <div class="category-card cat-vegetables" data-category="vegetables">
                            <div class="category-icon">🥕</div>
                            <h3>Vegetables</h3>
                            <p>Learn about different vegetables</p>
                        </div>
                        <div class="category-card cat-herbs" data-category="herbs">
                            <div class="category-icon">🌿</div>
                            <h3>Herbs</h3>
                            <p>Discover medicinal herbs</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        if (appContainer) {
            const currentPage = appContainer.querySelector('.page');
            if (currentPage) {
                currentPage.style.opacity = '0';
            }

            setTimeout(() => {
                appContainer.innerHTML = categoriesHTML;
                
                const cards = document.querySelectorAll('.category-card');
                cards.forEach((card, index) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 300ms ease-out';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    card.addEventListener('click', (e) => {
                        const category = e.currentTarget.getAttribute('data-category');
                        if (category) {
                            showCategoryDetails(category);
                        }
                    });
                });
            }, 300);
        }
    }

    // Event listeners
    function initializeEventListeners() {
        // Handle clicks
        document.body.addEventListener('click', (e) => {
            // Explore button
            const exploreBtn = e.target.closest('#click-here-btn');
            if (exploreBtn) {
                showCategoriesSection();
            }
        });
    }

    // Initialize
    async function init() {
        appContainer = document.getElementById('app-container');
        if (!appContainer) return;
        
        await loadPlantData();
        showHomepage();
        initializeEventListeners();
    }

    // Public API
    return {
        init: init
    };
})();

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PlantWorld.init().catch(console.error);
});