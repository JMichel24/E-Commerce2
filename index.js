// --- DATOS DE PRODUCTOS Y CONFIGURACIÓN ---
const FREE_SHIPPING_THRESHOLD = 1500; 

// Definir la hora de caducidad de las ofertas (simulación: ahora + X minutos)
const OFFER_EXPIRY_TIMES = {
    // Ofertas activas por 60, 45 y 30 minutos desde la carga de la página
    7: Date.now() + 60 * 60 * 1000, 
    8: Date.now() + 45 * 60 * 1000, 
    9: Date.now() + 30 * 60 * 1000, 
};

// Nombres de productos para notificaciones de stock
const STOCK_PRODUCTS = [
    "Monitor Curvo 27\"", 
    "Audífonos Gamer RGB", 
    "Mouse Inalámbrico", 
    "Teclado Mecánico"
];

// Base de datos de usuarios simulada
let MOCK_USERS = [
    { email: "demo@neon.com", password: "password", name: "Demo User" }
];

// Estado global de autenticación
let authStatus = {
    isLoggedIn: false,
    userName: "Mi Cuenta"
};


const products = [
    {
        id: 1,
        name: "Audífonos Gamer RGB",
        price: 499,
        image: "https://images.unsplash.com/photo-1578932797382-0fb4a4a24ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Sonido envolvente 7.1, micrófono retráctil y luces personalizables.",
        category: "Audio", 
        reviews: [
            { id: 101, name: "Lucas G.", rating: 5, text: "Comodidad y sonido de 10. ¡El RGB es increíble!", likes: 15 },
            { id: 102, name: "Valeria M.", rating: 4, text: "Muy buenos, solo que la diadema aprieta un poco después de 4 horas.", likes: 3 }
        ]
    },
    {
        id: 2,
        name: "Teclado Mecánico",
        price: 899,
        image: "https://images.unsplash.com/photo-1590662031563-6d29224315a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Switches azules, retroiluminación RGB y diseño ergonómico.",
        category: "Periféricos", 
        reviews: [
            { id: 201, name: "Ricardo P.", rating: 5, text: "Excelente 'clicky' sound y feels. Súper rápido para gaming.", likes: 22 }
        ]
    },
    {
        id: 3,
        name: "Mouse Inalámbrico",
        price: 299,
        image: "https://images.unsplash.com/photo-1617829390610-c4e0f1d722e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Sensor óptico de 2400 DPI y batería recargable USB-C.",
        category: "Periféricos", 
        reviews: [
            { id: 301, name: "Sofía H.", rating: 3, text: "Cumple con su función, pero el plástico se siente un poco barato.", likes: 1 }
        ]
    },
    {
        id: 4,
        name: "Monitor Curvo 27\"",
        price: 5999,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        description: "Resolución Full HD, 144Hz y tiempo de respuesta de 1ms.",
        category: "Pantallas", 
        reviews: [
            { id: 401, name: "Diego G.", rating: 5, text: "¡El mejor monitor que he tenido! Los colores son súper vibrantes.", likes: 30 }
        ]
    },
    {
        id: 5,
        name: "Silla Gamer Ergonómica",
        price: 2499,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", 
        description: "Soporte lumbar, reposabrazos 4D y cuero sintético premium.",
        category: "Mobiliario", 
        reviews: [] 
    },
    {
        id: 6,
        name: "Alfombrilla RGB XL",
        price: 399,
        image: "https://images.unsplash.com/photo-1620580980287-24855d48259e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", 
        description: "Superficie tejida, iluminación RGB y zona extendida para mouse y teclado.",
        category: "Accesorios", 
        reviews: [
            { id: 601, name: "Javier R.", rating: 4, text: "Perfecta, solo desearía que el cable USB fuera más largo.", likes: 5 }
        ]
    }
];

let cart = [];
let carouselIndex = 0;
let currentReviewingProductId = null; 

// --- Funciones de Utilidad ---

function getStarRating(rating) {
    return Array(5).fill('★').map((star, index) => 
        index < rating ? `<span class="neon" style="color:#ff00cc; text-shadow:0 0 5px #ff00cc;">${star}</span>` : `<span style="color:#333;">${star}</span>`
    ).join('');
}

function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; 
        background: linear-gradient(135deg, #ff00cc, #3393ff); 
        color: white; padding: 15px 25px; border-radius: 10px; 
        z-index: 3000; box-shadow: 0 4px 20px rgba(255, 0, 204, 0.4); 
        font-weight: 600; 
        transform: translateY(100px); opacity: 0; 
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.transform = 'translateY(0)';
        notif.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notif.style.transform = 'translateY(-20px)';
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 400);
    }, 2500);
}

// --- Lógica de Envío Gratis ---

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateShippingBanner() {
    const total = getCartTotal();
    const remaining = FREE_SHIPPING_THRESHOLD - total;
    const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (!progressBar || !progressText) return;

    progressBar.style.width = `${progress}%`;

    if (total >= FREE_SHIPPING_THRESHOLD) {
        progressText.innerHTML = `<i class="fas fa-check-circle"></i> **¡ENVÍO GRATIS DESBLOQUEADO!**`;
        progressText.style.color = '#00ffff';
    } else {
        progressText.innerHTML = `Te faltan **$${remaining.toLocaleString('es-MX', { minimumFractionDigits: 0 })} MXN** para el Envío Gratis`;
        progressText.style.color = '#ff00cc';
    }
}

// --- LÓGICA DE AUTENTICACIÓN ---

function updateAuthDisplay() {
    const authText = document.getElementById('authText');
    const authBtn = document.getElementById('authBtn');
    
    if (!authText || !authBtn) return;
    
    // Remover manejadores anteriores para evitar duplicados
    authBtn.removeEventListener('click', handleLogoutClick);
    authBtn.removeEventListener('click', openAuthModal);

    if (authStatus.isLoggedIn) {
        authText.textContent = authStatus.userName.split(' ')[0]; 
        authBtn.addEventListener('click', handleLogoutClick); 
        showNotification(`👋 ¡Hola, ${authStatus.userName.split(' ')[0]}! Has iniciado sesión.`);
    } else {
        authText.textContent = "Mi Cuenta";
        authBtn.addEventListener('click', openAuthModal);
    }
}

window.openAuthModal = function() {
    if (authStatus.isLoggedIn) {
        showNotification(`Ya has iniciado sesión como ${authStatus.userName}.`);
        return; 
    }
    document.getElementById('authModal').style.display = 'block';
    switchAuthMode('login');
}

window.closeAuthModal = function() {
    document.getElementById('authModal').style.display = 'none';
}

window.switchAuthMode = function(mode) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authTitle = document.getElementById('authTitle');
    
    if (mode === 'register') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.innerHTML = '<i class="fas fa-user-plus"></i> Registrarse';
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
    }
}

function handleLogoutClick() {
    authStatus.isLoggedIn = false;
    authStatus.userName = "Mi Cuenta";
    updateAuthDisplay();
    showNotification(`🚪 ¡Sesión cerrada! Vuelve pronto.`);
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (user) {
        authStatus.isLoggedIn = true;
        authStatus.userName = user.name;
        closeAuthModal();
        updateAuthDisplay();
    } else {
        showNotification("❌ Error: Credenciales incorrectas. (demo@neon.com / password)");
    }
    this.reset();
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (MOCK_USERS.some(u => u.email === email)) {
        showNotification("❌ Error: El correo ya está registrado.");
        return;
    }
    
    const newUser = { name, email, password };
    MOCK_USERS.push(newUser);
    
    authStatus.isLoggedIn = true;
    authStatus.userName = name;
    
    closeAuthModal();
    updateAuthDisplay();
    showNotification(`🎉 ¡Registro exitoso, ${name}! Sesión iniciada.`);
    this.reset();
});


// --- LÓGICA DEL CONTADOR DE OFERTAS ---

function formatTime(ms) {
    if (ms <= 0) return "¡TERMINÓ!";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function startOfferCountdowns() {
    Object.keys(OFFER_EXPIRY_TIMES).forEach(id => {
        const timerElement = document.getElementById(`timer-${id}`);
        const offerCard = timerElement ? timerElement.closest('.offer-card') : null;
        const button = offerCard ? offerCard.querySelector('.btn-offer') : null;
        
        if (!timerElement) return;

        if (timerElement.dataset.intervalId) {
            clearInterval(timerElement.dataset.intervalId);
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const expiryTime = OFFER_EXPIRY_TIMES[id];
            const timeLeft = expiryTime - now;

            if (timeLeft <= 0) {
                timerElement.textContent = "¡TERMINÓ!";
                timerElement.classList.remove('urgent');
                if (button) {
                    button.textContent = "AGOTADO";
                    button.disabled = true;
                    offerCard.classList.remove('pulse');
                }
                clearInterval(interval);
            } else {
                timerElement.textContent = formatTime(timeLeft);

                if (timeLeft < 300000) {
                    timerElement.classList.add('urgent');
                }
            }
        }, 1000);
        
        timerElement.dataset.intervalId = interval;
    });
}

// --- LÓGICA DE NOTIFICACIONES DE STOCK ---

function showStockNotification(productName) {
    const container = document.getElementById('stockNotifications');
    if (!container) return;

    const card = document.createElement('div');
    card.className = 'stock-notification-card';
    card.innerHTML = `<i class="fas fa-bolt"></i> ¡**${productName}** tiene bajo stock! Solo quedan 5 unidades.`;
    
    container.appendChild(card);
    
    setTimeout(() => {
        card.classList.add('show');
    }, 10);

    setTimeout(() => {
        card.classList.remove('show');
        card.style.transform = 'translateY(100%)';
        setTimeout(() => card.remove(), 500);
    }, 8000);
}

function startStockAlerts() {
    setInterval(() => {
        const randomProduct = STOCK_PRODUCTS[Math.floor(Math.random() * STOCK_PRODUCTS.length)];
        showStockNotification(randomProduct);
    }, 15000 + Math.random() * 15000); 
}


// --- Funciones de Modales ---

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    if (currentReviewingProductId !== null) {
        openModal(currentReviewingProductId);
    }
}

// Abrir/Cerrar Modal de Contacto
function openContactModal() {
    document.getElementById('contactModal').style.display = 'block';
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}


// --- Lógica de Filtros y Catálogo ---

function getUniqueCategories() {
    const categories = products.map(p => p.category);
    return ["TODO", ...new Set(categories)]; 
}

function renderFilterButtons() {
    const categories = getUniqueCategories();
    const container = document.getElementById('filterControls');
    container.innerHTML = ''; 

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category.toUpperCase();
        button.setAttribute('data-category', category);
        button.onclick = () => filterProducts(category, button);
        
        if (category === "TODO") {
            button.classList.add('active'); 
        }

        container.appendChild(button);
    });
}

function filterProducts(category, clickedButton) {
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    const filteredProducts = category === "TODO"
        ? products
        : products.filter(p => p.category === category);

    loadProducts(filteredProducts); 
}

function loadProducts(productList = products) { 
    const container = document.getElementById('productsGrid');
    container.innerHTML = '';

    if (productList.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #aaa;">No se encontraron productos en esta categoría.</p>';
        return;
    }
    
    productList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id); 
        card.onclick = () => openModal(product.id); 

        let priceDisplay = product.originalPrice ? 
            `<p class="price" style="text-decoration:line-through; font-size:0.9rem; color:#888;">$${product.originalPrice} MXN</p>
             <p class="price" style="color:#ff00cc; font-size:1.2rem;">$${product.price} MXN</p>` :
            `<p class="price">$${product.price} MXN</p>`;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                ${priceDisplay}
                <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})">Agregar al Carrito</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function initCarousel() {
    const container = document.getElementById('carouselContainer');
    container.innerHTML = '';

    products.slice(0, 4).forEach(product => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.setAttribute('data-id', product.id);
        item.onclick = () => openModal(product.id); 

        let priceDisplay = product.originalPrice ? 
            `<p style="text-decoration: line-through; color: #888; font-size: 0.9rem;">$${product.originalPrice} MXN</p>
             <p style="color: #ff00cc; font-weight: 700; font-size: 1.2rem;">$${product.price} MXN</p>` :
            `<p style="color: #ff00cc; font-weight: 700; font-size: 1.2rem;">$${product.price} MXN</p>`;

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            ${priceDisplay}
            <button class="btn" style="padding: 8px 16px; margin-top: 10px; font-size: 0.9rem;" onclick="event.stopPropagation(); addToCart(${product.id})">Agregar al Carrito</button>
        `;
        container.appendChild(item);
    });
}

window.moveCarousel = function(direction) {
    const container = document.getElementById('carouselContainer');
    const items = container.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + 20; 
    container.scrollLeft += direction * itemWidth;
}


// --- Funciones de Carrito y Compras ---

window.addToCart = function(productId) {
    let product;
    
    if (productId <= 6) {
        product = products.find(p => p.id === productId);
    } else {
        const offerCard = document.querySelector(`.offer-card button[onclick="addToCart(${productId})"]`).closest('.offer-card');
        
        if (!offerCard || offerCard.querySelector('.btn-offer').disabled) {
             showNotification(`❌ Este producto de oferta no está disponible.`);
             return;
        }
        
        const priceStr = offerCard.querySelector('.discount-price').textContent.replace(/[$, MXN]/g, '').trim();
        product = {
            id: productId,
            name: offerCard.querySelector('h3').textContent,
            price: parseFloat(priceStr.replace(',', '')),
            image: offerCard.querySelector('img').src,
            description: "Producto en Oferta Relámpago"
        };
    }
    
    if (!product) return;

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    updateShippingBanner(); 
    showNotification(`✅ ¡${product.name} agregado al carrito!`);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

document.getElementById('cartBtn').addEventListener('click', function() {
    renderCart();
    document.getElementById('cartModal').style.display = 'block';
});

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalSpan = document.getElementById('totalPrice');
    const total = getCartTotal(); 
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem; color:#aaa;">Tu carrito está vacío.</p>';
        totalSpan.textContent = '0';
        document.getElementById('checkoutBtn').style.display = 'none';
        document.getElementById('checkoutForm').style.display = 'none';
        return;
    }
    
    document.getElementById('checkoutBtn').style.display = 'block';
    
    let html = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div>
                    <strong style="color:white;">${item.name}</strong> x${item.quantity}
                </div>
                <div>
                    <span style="color:#ff00cc; font-weight:600;">$${itemTotal.toLocaleString('es-MX', { minimumFractionDigits: 0 })} MXN</span>
                    <button onclick="removeFromCart(${item.id})" style="margin-left:10px; background:#ff00cc; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer; font-size:0.9rem;">🗑️ Quitar</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalSpan.textContent = total.toLocaleString('es-MX', { minimumFractionDigits: 0 });
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateCartCount();
    updateShippingBanner(); 
}

window.showCheckoutForm = function() {
    if (cart.length === 0) {
        showNotification("🛒 Tu carrito está vacío. ¡Agrega algo para comprar!");
        return;
    }
    document.getElementById('checkoutBtn').style.display = 'none';
    document.getElementById('checkoutForm').style.display = 'block';
}

// --- Lógica de Reseñas de Producto ---

function renderProductReviews(productId) {
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('productReviewsContainer');
    if (!product || !container) return;

    if (product.reviews.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:15px;">Sé el primero en dejar una reseña para este producto. ¡Anímate!</p>';
        return;
    }

    container.innerHTML = ''; 
    product.reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        reviewCard.innerHTML = `
            <div style="font-size: 1.1rem; margin-bottom: 5px;">${getStarRating(review.rating)}</div>
            <p style="font-style: italic; color: #ccc;">"${review.text}"</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px dashed rgba(255, 0, 204, 0.2); padding-top: 10px;">
                <span style="font-weight: 600; color: #3393ff;">— ${review.name}</span>
                <button 
                    class="like-btn" 
                    data-product-id="${productId}" 
                    data-review-id="${review.id}" 
                    onclick="toggleLike(${productId}, ${review.id})"
                >
                    <i class="fas fa-heart"></i> <span id="likes-${review.id}">${review.likes}</span> Me Gusta
                </button>
            </div>
        `;
        container.appendChild(reviewCard);
    });
}

window.toggleLike = function(productId, reviewId) {
    const product = products.find(p => p.id === productId);
    const review = product.reviews.find(r => r.id === reviewId);

    if (review) {
        review.likes += 1;
        
        const likesSpan = document.getElementById(`likes-${reviewId}`);
        if (likesSpan) {
            likesSpan.textContent = review.likes;
            showNotification(`❤️ ¡Un Me Gusta más para la reseña de ${review.name}!`);
        }
    }
}

window.openModal = function(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    const details = document.getElementById('modalProductDetails');

    currentReviewingProductId = productId; 
    if (!product) return;

    // Bloque de precio corregido
    let priceDisplay = product.originalPrice ? 
        `<p style="text-decoration:line-through; color:#888; font-size:1.1rem;">$${product.originalPrice} MXN</p>
         <p style="color:#ff00cc; font-size:1.5rem; font-weight:700;">$${product.price} MXN</p>` :
        `<p class="price" style="font-size:1.5rem; color:#ff00cc; margin:10px 0;">$${product.price} MXN</p>`;

    details.innerHTML = `
        <div style="text-align:center;">
            <img src="${product.image}" alt="${product.name}" style="width:100%; max-height:300px; object-fit:cover; border-radius:15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
            <h2 style="margin:20px 0 10px; color:white;">${product.name}</h2>
            ${priceDisplay}
            <p style="color:#ccc; line-height:1.6;">${product.description}</p>
            <button class="btn" style="width:100%; margin-top:20px;" onclick="addToCart(${product.id}); closeModal();">Agregar al Carrito</button>
        </div>

        <h3 style="margin-top: 40px; color: #3393ff; border-top: 1px solid rgba(51, 147, 255, 0.2); padding-top: 20px;">
            <i class="fas fa-star"></i> Reseñas (${product.reviews.length})
        </h3>
        <div id="productReviewsContainer" style="max-height: 400px; overflow-y: auto; padding-right: 15px;">
            </div>
        <button class="btn-small btn" style="margin-top: 20px;" onclick="openReviewModalFromProduct()">Escribir Reseña</button>
    `;
    
    renderProductReviews(product.id);
    modal.style.display = 'block';
}

window.openReviewModalFromProduct = function() {
    closeModal();
    document.getElementById('reviewModal').style.display = 'block';
}


// --- Manejo de Formularios ---

document.getElementById('shippingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    showNotification("⏳ Procesando pedido...");

    setTimeout(() => {
        const total = getCartTotal();
        let message = "🎉 ¡Pedido confirmado!\nEn 24 hrs recibirás un correo con los detalles.";
        if (total >= FREE_SHIPPING_THRESHOLD) {
            message += "\n¡Disfruta tu envío GRATIS!";
        }
        alert(message);
        
        cart = [];
        updateCartCount();
        updateShippingBanner(); 
        renderCart();
        
        document.getElementById('checkoutForm').style.display = 'none';
        document.getElementById('checkoutBtn').style.display = 'block';
        
        setTimeout(() => {
            closeCartModal();
        }, 1000);
        this.reset();
    }, 1500);
});

document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
        showNotification("📬 ¡Gracias por suscribirte! Las ofertas llegarán pronto.");
        this.reset();
    }
});

document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (currentReviewingProductId === null) {
        showNotification("Error: No se ha seleccionado un producto para reseñar.");
        return;
    }

    const product = products.find(p => p.id === currentReviewingProductId);
    const name = document.getElementById('reviewName').value;
    const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
    const text = document.getElementById('reviewText').value;

    const newReview = {
        id: Date.now(), 
        name: name,
        rating: rating,
        text: text,
        likes: 0
    };
    
    product.reviews.unshift(newReview); 
    
    closeReviewModal();
    this.reset();
    showNotification(`🌟 ¡Gracias, ${name}! Tu reseña para ${product.name} ha sido agregada.`);
});

// Manejo del formulario de contacto
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    
    showNotification(`📧 Mensaje de ${name} enviado. ¡Te responderemos pronto!`);
    
    closeContactModal();
    this.reset();
});


// --- EVENTOS DE INICIO ---

document.addEventListener('DOMContentLoaded', function() {
    loadProducts(); 
    initCarousel(); 
    renderFilterButtons(); 
    updateCartCount();
    updateShippingBanner(); 
    startOfferCountdowns(); 
    startStockAlerts(); 
    updateAuthDisplay(); // Carga el estado de la sesión al inicio
    
    // Función para manejar el clic en los enlaces de contacto
    const handleContactClick = (e) => {
        e.preventDefault();
        openContactModal();
    };

    // 1. Asignar evento al link de contacto en la navegación (nav)
    const navContactLink = document.querySelector('nav ul li:last-child a');
    if (navContactLink) {
        navContactLink.addEventListener('click', handleContactClick);
    }
    
    // 2. Asignar evento al link de contacto en el footer
    const footerContactLink = document.querySelector('footer a[href="#contacto"]');
    if (footerContactLink) {
        footerContactLink.addEventListener('click', handleContactClick);
    }
    
    // Mensaje informativo para la sección de Reseñas
    const reviewsContainer = document.getElementById('reviewsGrid');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #aaa;">Las reseñas se muestran en la ventana de detalle de cada producto. ¡Haz clic en cualquier producto para verlas!</p>';
    }

    document.getElementById('addReviewBtn').addEventListener('click', () => {
        showNotification("⚠️ ¡Primero selecciona un producto en el catálogo para dejar tu reseña!");
    });
    
    // Cerrar modales al hacer clic fuera
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    };
});