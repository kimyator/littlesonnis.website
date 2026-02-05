document.addEventListener("DOMContentLoaded", function() {
    
    // --- GLOBAL VARIABLES ---
    let allGalleryImages = []; // We will store the JSON data here to search it later

    // --- 1. HIGHLIGHT ACTIVE MENU ---
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll("#nav-list a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.style.color = "#D88E8E";
            link.style.borderBottom = "2px solid #D88E8E";
        }
    });

    console.log("System check: Professional Mode Activated! 🚀");

    // --- 2. FETCH DATA & HANDLE SEARCH ---
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            loadServices(data.services);
            
            // Save data to our global variable so we can search it
            allGalleryImages = data.gallery; 
            loadGallery(allGalleryImages); // Load all initially
        })
        .catch(error => console.error('Error loading JSON:', error));

    // --- SEARCH LOGIC ---
    const searchInput = document.getElementById("gallery-search");
    if (searchInput) {
        searchInput.addEventListener("keyup", function(e) {
            const searchText = e.target.value.toLowerCase();
            
            // Filter the global array
            const filteredImages = allGalleryImages.filter(img => 
                img.caption.toLowerCase().includes(searchText)
            );
            
            // Re-draw the gallery with only matches
            loadGallery(filteredImages);
        });
    }

    // --- 3. FORM LOGIC (Toast + Modals + Delivery) ---
    setupContactForm();
});

// --- HELPER FUNCTIONS ---

function loadServices(services) {
    const listContainer = document.getElementById("services-list");
    if (listContainer) {
        listContainer.innerHTML = "";
        services.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            listContainer.appendChild(li);
        });
    }
}

function loadGallery(images) {
    const galleryContainer = document.querySelector(".gallery-grid");
    if (galleryContainer) {
        galleryContainer.innerHTML = "";
        
        if (images.length === 0) {
            galleryContainer.innerHTML = "<p>No flowers found matching that name. 🌸</p>";
            return;
        }

        images.forEach(imgData => {
            const card = document.createElement("div");
            card.className = "gallery-item";
            card.innerHTML = `
                <img src="${imgData.src}" alt="${imgData.caption}">
                <div class="caption">${imgData.caption}</div>
            `;
            galleryContainer.appendChild(card);
        });
    }
}

// --- THE NEW TOAST FUNCTION ---
function showToast(message, isError = false) {
    const toast = document.getElementById("toast-box");
    if (!toast) return;

    toast.textContent = message;
    toast.style.backgroundColor = isError ? "#e74c3c" : "#2ecc71"; // Red for error, Green for success
    toast.className = "show";

    // Hide it after 3 seconds
    setTimeout(function() { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

function setupContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    // A. DELIVERY CALCULATOR
    const citySelect = document.getElementById("delivery-city");
    const feeDisplay = document.getElementById("fee-amount");
    
    // Define your prices here
    const deliveryPrices = {
        "Eldoret": 200,
        "Eldoret-Out": 350,
        "Nakuru": 500,
        "Nairobi": 800,
        "Other": 1000
    };

    if (citySelect) {
        citySelect.addEventListener("change", function() {
            const selectedCity = citySelect.value;
            const price = deliveryPrices[selectedCity] || 0;
            feeDisplay.textContent = price;
        });
    }

    // B. MODAL LOGIC (Order Review)
    const modalOrder = document.getElementById("order-modal");
    const summaryName = document.getElementById("summary-name");
    const summaryEmail = document.getElementById("summary-email");
    const summaryMessage = document.getElementById("summary-message");
    const btnSendOrder = document.getElementById("btn-confirm-order");
    const btnEditOrder = document.getElementById("btn-edit-order");

    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Validate Fields
        const name = document.getElementById("input-name").value;
        const email = document.getElementById("input-email").value;
        const msg = document.getElementById("input-message").value;

        if (name === "" || email === "" || msg === "") {
            showToast("Please fill in all fields! ⚠️", true);
            return;
        }

        // Fill Summary
        summaryName.textContent = name;
        summaryEmail.textContent = email;
        summaryMessage.textContent = msg;

        modalOrder.showModal();
    });

    // Final Send Button
    if (btnSendOrder) {
        btnSendOrder.addEventListener("click", function() {
            modalOrder.close();
            contactForm.reset(); 
            feeDisplay.textContent = "0"; // Reset delivery fee
            showToast("🎉 Order Sent Successfully!");
        });
    }

    if (btnEditOrder) {
        btnEditOrder.addEventListener("click", () => modalOrder.close());
    }

    // C. CLEAR FORM LOGIC
    const btnClear = document.getElementById("btn-clear-form");
    const modalClear = document.getElementById("confirm-modal");
    const btnYesClear = document.getElementById("btn-confirm-clear");
    const btnNoClear = document.getElementById("btn-cancel-clear");

    if (btnClear) {
        btnClear.addEventListener("click", () => modalClear.showModal());
        btnYesClear.addEventListener("click", () => {
            contactForm.reset();
            modalClear.close();
            showToast("Form cleared.");
        });
        btnNoClear.addEventListener("click", () => modalClear.close());
    }
}