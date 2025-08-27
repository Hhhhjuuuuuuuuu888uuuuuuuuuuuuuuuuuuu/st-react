// Declare search variables in global scope
const searchInput = document.getElementById('searchInput');
const itemList = document.getElementById('items');

// Generate a random order number
document.getElementById('order-number').textContent = Math.floor(1000 + Math.random() * 9000);
let code = document.getElementById('order-number');
let codeseat = document.getElementById('codeseat');

codeseat.value = '#TUT' + code.innerHTML;

// Add search event listener
searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toLowerCase();
    const items = itemList.getElementsByClassName('main_div');
    
    for (let i = 0; i < items.length; i++) {
        const text = items[i].getAttribute('data-name').toLowerCase();
        items[i].style.display = text.includes(filter) ? '' : 'none';
    }
});

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide order form
    document.getElementById('orderForm').style.display = 'none';
    
    // Show selected section
    if (sectionId === 'cart') {
        document.getElementById('cart').style.display = 'flex';
        updateCartDisplay();
        searchInput.style.opacity = '0';
    } else if (sectionId === 'items') {
        document.getElementById('items').style.display = 'flex';
        searchInput.style.opacity = '1';
    } else if (sectionId === 'home') {
        document.getElementById('home').style.display = 'block';
        searchInput.style.opacity = '0';
    } else if (sectionId === 'contacts') {
        document.getElementById('contacts').style.display = 'block';
        searchInput.style.opacity = '0';
    }
}

function checkout() {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show order form
    document.getElementById('orderForm').style.display = 'block';
    
    // Update order summary
    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = '';
    
    if (cartItems.length === 0) {
        orderSummary.innerHTML = '<p>No items in cart</p>';
    } else {
        cartItems.forEach(item => {
            const p = document.createElement('p');
            p.textContent = `${item.name} - R ${item.price.toFixed(2)}`;
            orderSummary.appendChild(p);
        });
    }
    
    document.getElementById('orderTotal').textContent = total.toFixed(2);
}

// Cart functionality
const cartList = document.getElementById('cartList');
const totalDisplay = document.getElementById('totalPrice');
const orderDetails = document.getElementById('orderDetails');
let total = 0;
let cartItems = [];

// Add event listeners to all Add to Cart buttons
const addButtons = document.querySelectorAll('.add-btn');
addButtons.forEach(button => {
    button.addEventListener('click', function() {
        const itemDiv = this.closest('.main_div');
        const itemName = itemDiv.getAttribute('data-name');
        const itemPrice = parseFloat(itemDiv.getAttribute('data-price'));
        
        // Add to cart
        cartItems.push({name: itemName, price: itemPrice});
        
        // Update cart display
        updateCartDisplay();
        
        // Show "Added to Cart" message
        showAddedToCartMessage(itemName);
        
        // Change button color temporarily
        const originalBgColor = this.style.backgroundColor;
        const originalColor = this.style.color;
        this.style.backgroundColor = 'pink';
        this.style.color = 'black';
        
        setTimeout(() => {
            this.style.backgroundColor = originalBgColor;
            this.style.color = originalColor;
        }, 500);
    });
});

// Show "Added to Cart" message
function showAddedToCartMessage(itemName) {
    // Remove any existing message
    const existingMessage = document.querySelector('.added-to-cart');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = 'added-to-cart';
    message.textContent = `Added ${itemName} to cart!`;
    
    document.body.appendChild(message);
    
    // Remove message after animation completes
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Update cart display function
function updateCartDisplay() {
    // Clear current cart display
    cartList.innerHTML = '';
    total = 0;
    
    if (cartItems.length === 0) {
        cartList.innerHTML = '<li style="color: grey; text-align: center; font-style: italic;">No items added to cart yet</li>';
    } else {
        // Add items to cart display
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            
            const itemText = document.createElement('span');
            itemText.textContent = `${item.name} - R ${item.price.toFixed(2)}`;
            
            const removeBtn = document.createElement('span');
            removeBtn.textContent = '✕';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = function() {
                cartItems.splice(index, 1);
                updateCartDisplay();
            };
            
            li.appendChild(itemText);
            li.appendChild(removeBtn);
            cartList.appendChild(li);
            total += item.price;
        });
    }
    
    // Update total
    totalDisplay.textContent = total.toFixed(2);
    
    // Update order details for form submission
    const orderText = cartItems.map(item => `${item.name} - R${item.price.toFixed(2)}`).join('\n');
    orderDetails.value = `Order Details:\n${orderText}\n\nTotal: R${total.toFixed(2)}`;
}

// Initialize page to show home section
showSection('home');
