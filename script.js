let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count > 0 ? `(${count})` : '';
    }
}

function addToCart(name, price, image, button) {
    let product = cart.find(p => p.name === name);
    if (product) {
        product.quantity += 1;
    } else {
        product = { name, price, image, quantity: 1 };
        cart.push(product);
    }
    saveCart();
    button.textContent = "Added to Cart";
}

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');

    if (!cartItems) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const div = document.createElement('div');
        div.className = "cart-item";
        div.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <span>${item.name} - ₹${item.price}</span>
    <div class="qty-control">
        <button class="minus-btn">-</button>
        <span>${item.quantity}</span>
        <button class="plus-btn">+</button>
    </div>
    <button class="remove-btn">Remove</button>
`;


        div.querySelector('.minus-btn').addEventListener('click', () => {
            item.quantity--;
            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }
            saveCart();
            displayCart();
        });

        div.querySelector('.plus-btn').addEventListener('click', () => {
            item.quantity++;
            saveCart();
            displayCart();
        });

        div.querySelector('.remove-btn').addEventListener('click', () => {
            cart.splice(index, 1);
            saveCart();
            displayCart();
        });

        cartItems.appendChild(div);
    });

    totalEl.textContent = `Total: ₹${total}`;
}

function clearCart() {
    cart = [];
    saveCart();
    displayCart();
}

document.addEventListener('DOMContentLoaded', () => {
    // Product pages
    document.querySelectorAll('.add-to-cart').forEach(button => {
        const name = button.dataset.name;
        const inCart = cart.find(p => p.name === name);
        if (inCart) {
            button.textContent = "Added to Cart";
        }
        button.addEventListener('click', () => {
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            addToCart(name, price, image, button);
        });
    });

    // Cart page
    displayCart();

    // Always update cart count
    updateCartCount();
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }
    // Search functionality for existing navbar
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.querySelector('.searchicon');

    if (searchInput && searchIcon) {
        // Click on icon
        searchIcon.addEventListener('click', () => {
            filterProducts();
        });

        // Press Enter in search box
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                filterProducts();
            }
        });
    }

    function filterProducts() {
        const searchText = searchInput.value.trim().toLowerCase();
        const products = document.querySelectorAll('.box');

        products.forEach(product => {
            const titleText = (product.querySelector('h3')?.textContent || '').toLowerCase();
            const linkText = (product.querySelector('a')?.textContent || '').toLowerCase();

            if (titleText.includes(searchText) || linkText.includes(searchText) || searchText === '') {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    searchInput.addEventListener('input', filterProducts);



});
