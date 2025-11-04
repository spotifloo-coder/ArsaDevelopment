document.addEventListener('DOMContentLoaded', () => {

    // 0. LOGIKA HAMBURGER MENIJA
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarNav = document.getElementById('sidebar-nav');
    const navLinks = document.querySelectorAll('#sidebar-nav a');

    if (menuToggle && sidebarNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            sidebarNav.classList.toggle('active');
            document.body.classList.toggle('menu-open'); 
        });

        // Zatvori navigaciju kada se klikne na link (na mobilnom)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Proveravamo da li je mobilni/tablet rezolucija
                if (window.innerWidth <= 900) { 
                    menuToggle.classList.remove('active');
                    sidebarNav.classList.remove('active');
                    document.body.classList.remove('menu-open'); 
                }
            });
        });
    }

    // 1. Smooth Skrolovanje za Navigaciju
    // ... (Postojeći kod je premešten gore za bolje performanse) ...

    // 2. Animacije na Skrolu (Intersection Observer)
    const observerOptions = {
        root: null, 
        threshold: 0.1, 
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Ako želite da se animacija pokrene samo jednom, odkomentarišite sledeću liniju:
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-animate, .card-animate').forEach(el => {
        observer.observe(el);
    });

    // 3. INTEGRACIJA PARTICLES.JS ZA HERO SEKCIJU
    // Proverava da li je particlesJS globalno dostupan (što jeste zbog script taga u HTML-u)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particle-canvas', {
            "particles": {
                "number": {
                    "value": 80, 
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    // Mešanje ljubičaste i cijan boje za čestice
                    "value": ["#6A0DAD", "#00BFFF", "#FFFFFF"] 
                },
                "shape": {
                    "type": "circle",
                    "stroke": { "width": 0, "color": "#000000" }
                },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#6A0DAD", // Ljubičaste linije
                    "opacity": 0.4,
                    "width": 1
                },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }


    // 4. LOGIKA ODABIRA PAKETA I KALKULACIJE CENE

    const selectPackageBtns = document.querySelectorAll('.select-package-btn');
    const selectedPackageInfo = document.getElementById('selected-package-info');
    const selectedPackageInput = document.getElementById('selected-package-input');
    const totalPriceInput = document.getElementById('total-price-input');
    const maintenanceCheckbox = document.getElementById('maintenance-checkbox');
    const maintenanceDetails = document.getElementById('maintenance-details');
    const maintenancePeriod = document.getElementById('maintenance-period');
    const currentMaintenancePrice = document.getElementById('current-maintenance-price');

    let basePackagePrice = 0;
    const maintenanceBaseMonthlyPrice = 49;

    function handlePackageSelection(packageId, packageName, packagePrice) {
        
        document.querySelectorAll('.package-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-package-id="${packageId}"]`).classList.add('selected');

        basePackagePrice = parseFloat(packagePrice);
        
        const descriptionMap = {
            'start': 'Osnovni sajt za vizit kartu. Idealno za brzi start.',
            'pro': 'Sveobuhvatni sajt sa CMS-om i naprednim animacijama.',
            'custom': 'Projekat po dogovoru. Kontaktirajte nas za ponudu.'
        };
        
        // Ažuriranje dinamičkog bloka (HTML se ažurira unutar calculateTotal za total)
        selectedPackageInfo.innerHTML = `
            <h4>Odabrali ste: <span class="accent-color">${packageName.toUpperCase()}</span></h4>
            <p>${descriptionMap[packageId] || 'Detalji su poslati u formi.'}</p>
            <p>Osnovna cena paketa: **€${basePackagePrice.toLocaleString('sr-RS')}**</p>
            <p id="maintenance-summary"></p>
            <p class="final-price">Ukupno: <span id="final-calculated-price">€${calculateTotal()}</span></p>
        `;

        // Skrolovanje do kontakt forme
        document.querySelector('#kontakt').scrollIntoView({ behavior: 'smooth' });
    }

    function calculateTotal() {
        let total = basePackagePrice;
        let totalMaintenance = 0;
        let maintenanceSummaryText = '';
        let finalPriceText = '';

        if (maintenanceCheckbox.checked) {
            const period = parseInt(maintenancePeriod.value);
            const discount = parseFloat(maintenancePeriod.options[maintenancePeriod.selectedIndex].dataset.discount);
            
            let monthlyPrice = maintenanceBaseMonthlyPrice * (1 - discount);
            totalMaintenance = monthlyPrice * period;
            
            maintenanceSummaryText = `
                <p>+ Održavanje: ${period} meseci (${Math.round(discount * 100)}% popusta)</p>
                <p>Mesečna cena održavanja sa popustom: **€${monthlyPrice.toLocaleString('sr-RS', { minimumFractionDigits: 2 })}**</p>
                <p>Ukupna cena održavanja za period: **€${totalMaintenance.toLocaleString('sr-RS', { minimumFractionDigits: 2 })}**</p>
            `;
            
            total += totalMaintenance;
            
            currentMaintenancePrice.textContent = `€${monthlyPrice.toLocaleString('sr-RS', { minimumFractionDigits: 2 })}`;
            finalPriceText = total.toLocaleString('sr-RS', { minimumFractionDigits: 2 });
        } else {
            maintenanceSummaryText = '<p>Održavanje nije uključeno.</p>';
            finalPriceText = total.toLocaleString('sr-RS', { minimumFractionDigits: 2 });
        }

        // Ažuriraj skrita polja i prikaz
        selectedPackageInput.value = (basePackagePrice > 0) ? `${document.querySelector('.package-card.selected').dataset.packageName} (€${basePackagePrice.toLocaleString('sr-RS')}) + Održavanje ${totalMaintenance.toFixed(2)}` : "Nije odabrano";
        totalPriceInput.value = total.toFixed(2);
        
        const summaryElement = document.getElementById('maintenance-summary');
        if(summaryElement) summaryElement.innerHTML = maintenanceSummaryText;
        
        const finalPriceElement = document.getElementById('final-calculated-price');
        if(finalPriceElement) finalPriceElement.textContent = finalPriceText;
        
        return total.toFixed(2);
    }

    // Event Slušači
    selectPackageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.package-card');
            const id = card.dataset.packageId;
            const name = card.dataset.packageName;
            const price = card.dataset.packagePrice;
            handlePackageSelection(id, name, price);
        });
    });

    maintenanceCheckbox.addEventListener('change', () => {
        maintenanceDetails.style.display = maintenanceCheckbox.checked ? 'block' : 'none';
        calculateTotal();
    });

    maintenancePeriod.addEventListener('change', calculateTotal);

    // Inicijalni poziv
    calculateTotal();


    // 5. LOGIKA MODAL POPUP-a ZA "O MENI" SEKCIJU
const featureBoxes = document.querySelectorAll('[data-modal-target]');
const modalContainer = document.getElementById('modal-container');
const closeButtons = document.querySelectorAll('.modal-close-btn');
const modalDialogs = document.querySelectorAll('.modal-dialog');


// Funkcija za otvaranje modala
function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        // Sakrivamo sve modale pre otvaranja jednog
        modalDialogs.forEach(modal => modal.style.display = 'none');
        
        targetModal.style.display = 'block'; // Prikazuje samo ciljani modal
        modalContainer.classList.add('active'); // Aktiviranje celog kontejnera/overlay-a
        document.body.classList.add('menu-open'); // Dodajemo klasu za blokiranje skrolovanja
    }
}

// Funkcija za zatvaranje modala
function closeModal() {
    modalContainer.classList.remove('active');
    document.body.classList.remove('menu-open'); // Uklanjanje blokade skrolovanja

    // Mali timeout da se odradi CSS animacija zatvaranja pre skrivanja modala
    setTimeout(() => {
        modalDialogs.forEach(modal => modal.style.display = 'none');
    }, 400); 
}

// 1. Otvaranje modala klikom na karticu
featureBoxes.forEach(box => {
    box.addEventListener('click', (e) => {
        // Sprečavamo zatvaranje ako se klikne na a link unutar boxa
        if (e.target.tagName.toLowerCase() === 'a') return; 
        
        const modalId = box.dataset.modalTarget;
        openModal(modalId);
    });
});

// 2. Zatvaranje klikom na X dugme
closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// 3. Zatvaranje klikom na zamagljenu pozadinu (overlay)
modalContainer.addEventListener('click', (e) => {
    // Proveravamo da li je kliknuto direktno na kontejner, a ne na sadržaj modala
    if (e.target.id === 'modal-container') {
        closeModal();
    }
});

// 4. Zatvaranje pritiskom na ESC taster
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
        closeModal();
    }
    });
});