// script.js

// Global variables
let cart = [];
let currentSection = 'items';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Show initial section
    showSection(currentSection);
    
    // Initialize cart from localStorage if available
    loadCartFromStorage();
    updateCartUI();
}

// Set up all event listeners
function setupEventListeners() {
    // Category filtering for items
    const itemCategoryButtons = document.querySelectorAll('#items .category-btn');
    itemCategoryButtons.forEach(button => {
        button.addEventListener('click', filterItems);
    });
    
    // Category filtering for services
    const serviceCategoryButtons = document.querySelectorAll('#services .category-btn');
    serviceCategoryButtons.forEach(button => {
        button.addEventListener('click', filterServices);
    });
    
    // Add to cart buttons for items
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-btn')) {
            const itemElement = e.target.closest('.main_div');
            addItemToCart(itemElement);
        }
    });
    
    // Add to cart buttons for services
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-service-btn')) {
            const serviceElement = e.target.closest('.service_div');
            addServiceToCart(serviceElement);
        }
    });
    
    // View gallery buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-gallery-btn')) {
            const serviceElement = e.target.closest('.service_div');
            showServicerGallery(serviceElement);
        }
    });
    
    // Book appointment buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('book-appointment-btn')) {
            const serviceElement = e.target.closest('.service_div');
            showAppointmentForm(serviceElement);
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Appointment form submission
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

// Show/hide sections
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
    
    // Update active state of nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Special case for cart button (not in the nav-buttons container)
    if (sectionId === 'cart') {
        document.querySelector('.cart-btn').classList.add('active');
    }
}

// Filter items by category
function filterItems(e) {
    const category = e.target.dataset.category;
    
    // Update active state of buttons
    const buttons = document.querySelectorAll('#items .category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter items
    const items = document.querySelectorAll('#items .main_div');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter services by category
function filterServices(e) {
    const category = e.target.dataset.category;
    
    // Update active state of buttons
    const buttons = document.querySelectorAll('#services .category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter services
    const services = document.querySelectorAll('#services .service_div');
    services.forEach(service => {
        if (category === 'all' || service.dataset.category === category) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });
}

// Add item to cart
function addItemToCart(itemElement) {
    const name = itemElement.dataset.name;
    const price = parseFloat(itemElement.dataset.price);
    const category = itemElement.dataset.category;
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.name === name && item.type === 'item'
    );
    
    if (existingItemIndex !== -1) {
        // Increment quantity if item already in cart
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            name,
            price,
            category,
            type: 'item',
            quantity: 1
        });
    }
    
    // Show confirmation message
    showNotification(`${name} added to cart!`);
    
    // Update cart UI and save to storage
    updateCartUI();
    saveCartToStorage();
}

// Add service to cart
function addServiceToCart(serviceElement) {
    const name = serviceElement.dataset.name;
    const price = parseFloat(serviceElement.dataset.price);
    const category = serviceElement.dataset.category;
    const servicer = serviceElement.dataset.servicer;
    
    // Check if service already exists in cart
    const existingServiceIndex = cart.findIndex(service => 
        service.name === name && service.type === 'service'
    );
    
    if (existingServiceIndex !== -1) {
        // Increment quantity if service already in cart
        cart[existingServiceIndex].quantity += 1;
    } else {
        // Add new service to cart
        cart.push({
            name,
            price,
            category,
            servicer,
            type: 'service',
            quantity: 1
        });
    }
    
    // Show confirmation message
    showNotification(`${name} service added to cart!`);
    
    // Update cart UI and save to storage
    updateCartUI();
    saveCartToStorage();
}

// Update cart UI
function updateCartUI() {
    const cartList = document.getElementById('cartList');
    const totalPriceElement = document.getElementById('totalPrice');
    const cartCountElement = document.querySelector('.cart-count');
    
    // Clear current cart list
    cartList.innerHTML = '';
    
    // Calculate total and update list
    let total = 0;
    
    if (cart.length === 0) {
        cartList.innerHTML = '<li style="color: grey; text-align: center; font-style: italic; list-style: none;">No items added to cart yet</li>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const listItem = document.createElement('li');
            listItem.className = 'cart-item';
            listItem.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    ${item.type === 'service' ? `<span class="cart-item-servicer">By: ${item.servicer}</span>` : ''}
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">R${itemTotal.toFixed(2)}</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            cartList.appendChild(listItem);
        });
    }
    
    // Update total price and cart count
    totalPriceElement.textContent = total.toFixed(2);
    
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;
}

// Change item quantity in cart
function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    // Remove item if quantity becomes 0
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    // Update UI and storage
    updateCartUI();
    saveCartToStorage();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    
    // Update UI and storage
    updateCartUI();
    saveCartToStorage();
}

// Handle search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Determine which section is active
    if (currentSection === 'items') {
        searchItems(searchTerm);
    } else if (currentSection === 'services') {
        searchServices(searchTerm);
    }
}

// Search items
function searchItems(searchTerm) {
    const items = document.querySelectorAll('#items .main_div');
    
    items.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        const category = item.dataset.category.toLowerCase();
        
        if (name.includes(searchTerm) || category.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Search services
function searchServices(searchTerm) {
    const services = document.querySelectorAll('#services .service_div');
    
    services.forEach(service => {
        const name = service.dataset.name.toLowerCase();
        const category = service.dataset.category.toLowerCase();
        const servicer = service.dataset.servicer.toLowerCase();
        
        if (name.includes(searchTerm) || category.includes(searchTerm) || servicer.includes(searchTerm)) {
            service.style.display = 'block';
        } else {
            service.style.display = 'none';
        }
    });
}

// Show servicer gallery
function showServicerGallery(serviceElement) {
    const servicerName = serviceElement.dataset.servicer;
    const modal = document.getElementById('servicerModal');
    const galleryContainer = document.getElementById('servicerGallery');
    const servicerNameElement = document.getElementById('servicerName');
    
    // Set servicer name
    servicerNameElement.textContent = `${servicerName}'s Gallery`;
    
    // Clear previous gallery content
    galleryContainer.innerHTML = '';
    
    // In a real app, you would fetch these images from a server
    // For demo purposes, we'll use placeholder images
    const placeholderImages = [
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    ];
    
    // Add images to gallery
    placeholderImages.forEach(imgSrc => {
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = `${servicerName}'s work`;
        imgElement.className = 'gallery-img';
        galleryContainer.appendChild(imgElement);
    });
    
    // Show the modal
    modal.style.display = 'block';
}

// Close servicer gallery
function closeServicerGallery() {
    const modal = document.getElementById('servicerModal');
    modal.style.display = 'none';
}

// Show appointment form
function showAppointmentForm(serviceElement) {
    const serviceName = serviceElement.dataset.name;
    const servicerName = serviceElement.dataset.servicer;
    const modal = document.getElementById('appointmentModal');
    
    // Fill form fields
    document.getElementById('selectedServicer').value = servicerName;
    document.getElementById('selectedService').value = serviceName;
    document.getElementById('appointmentServicer').value = servicerName;
    document.getElementById('appointmentServiceName').value = serviceName;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    
    // Show the modal
    modal.style.display = 'block';
}

// Close appointment form
function closeAppointmentForm() {
    const modal = document.getElementById('appointmentModal');
    modal.style.display = 'none';
}

// Handle appointment form submission
function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const servicer = document.getElementById('selectedServicer').value;
    const service = document.getElementById('selectedService').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const notes = document.getElementById('appointmentNotes').value;
    
    // In a real app, you would send this data to a server
    // For demo purposes, we'll just show a confirmation
    showNotification(`Appointment booked with ${servicer} for ${service} on ${date} at ${time}`);
    
    // Close the modal
    closeAppointmentForm();
    
    // Reset the form
    e.target.reset();
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real app, you would process payment here
    // For demo purposes, we'll just show a confirmation
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Order placed successfully! Total: R${total.toFixed(2)}`);
    
    // Clear the cart
    cart = [];
    updateCartUI();
    saveCartToStorage();
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and style
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('tutMarketCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('tutMarketCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Close modals when clicking outside
window.onclick = function(e) {
    const servicerModal = document.getElementById('servicerModal');
    const appointmentModal = document.getElementById('appointmentModal');
    
    if (e.target === servicerModal) {
        closeServicerGallery();
    }
    
    if (e.target === appointmentModal) {
        closeAppointmentForm();
    }
}