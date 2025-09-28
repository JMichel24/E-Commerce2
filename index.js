// Datos de productos (incluyendo ofertas)
const products = [
    {
        id: 1,
        name: "Audífonos Gamer RGB",
        price: 499,
        image: "https://images.unsplash.com/photo-1578932797382-0fb4a4a24ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Sonido envolvente 7.1, micrófono retráctil y luces personalizables."
    },
    {
        id: 2,
        name: "Teclado Mecánico",
        price: 899,
        image: "https://images.unsplash.com/photo-1590662031563-6d29224315a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Switches azules, retroiluminación RGB y diseño ergonómico."
    },
    {
        id: 3,
        name: "Mouse Inalámbrico",
        price: 299,
        image: "https://images.unsplash.com/photo-1617829390610-c4e0f1d722e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Sensor óptico de 2400 DPI y batería recargable USB-C."
    },
    {
        id: 4,
        name: "Monitor Curvo 27\"",
        price: 5999,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Resolución Full HD, 144Hz y tiempo de respuesta de 1ms."
    },
    {
        id: 5,
        name: "Silla Gamer Ergonómica",
        price: 2499,
        image: "https://images.unsplash.com/photo-1590662031563-6d29224315a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Soporte lumbar, reposabrazos 4D y cuero sintético premium."
    },
    {
        id: 6,
        name: "Alfombrilla RGB XL",
        price: 399,
        image: "https://images.unsplash.com/photo-1606929875503-f186eae44b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Superficie tejida, iluminación RGB y zona extendida para mouse y teclado."
    },
    // OFERTAS
    {
        id: 7,
        name: "Laptop Gamer RGB",
        price: 17999,
        originalPrice: 25999,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "RTX 4070, Intel i7, 16GB RAM, SSD 1TB y pantalla 144Hz."
    },
    {
        id: 8,
        name: "Smartwatch Galaxy Pro",
        price: 2699,
        originalPrice: 4500,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "GPS, monitor de sueño, resistente al agua y 7 días de batería."
    },
    {
        id: 9,
        name: "Drone 4K Ultra HD",
        price: 6749,
        originalPrice: 8999,
        image: "https://images.unsplash.com/photo-1606929875503-f186eae44b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Cámara estabilizada, vuelo automático y control por app móvil."
    }
];

let cart = [];
let carouselIndex = 0;

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    initNewsletter();
});

// Cargar productos en catálogo
function loadProducts() {
    const container = document.getElementById('productsGrid');
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        let priceDisplay = product.originalPrice ? 
            `<p class="price" style="text-decoration:line-through; font-size:0.9rem; color:#888;">$${product.originalPrice} MXN</p>
             <p class="price" style="color:#ff00cc; font-size:1.2rem;">$${product.price} MXN</p>` :
            `<p class="price">$${product.price} MXN</p>`;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                ${priceDisplay}
                <button class="btn-add" onclick="addToCart(${product.id})">Agregar al Carrito</button>
            </div>
        `;
        container.appendChild(card);
    });

    initCarousel(); // Inicializa el carrusel con los primeros productos
}

// Inicializar carrusel con imágenes, precios y botones
function initCarousel() {
    const container = document.getElementById('carouselContainer');
    container.innerHTML = '';

    products.slice(0, 4).forEach(product => {
        const item = document.createElement('div');
        item.className = 'carousel-item';

        let priceDisplay = product.originalPrice ? 
            `<p style="text-decoration: line-through; color: #888; font-size: 0.9rem;">$${product.originalPrice} MXN</p>
             <p style="color: #ff00cc; font-weight: 700; font-size: 1.2rem;">$${product.price} MXN</p>` :
            `<p style="color: #ff00cc; font-weight: 700; font-size: 1.2rem;">$${product.price} MXN</p>`;

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            ${priceDisplay}
            <button class="btn-small" onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        container.appendChild(item);
    });
}

// Buscar productos
document.getElementById('searchInput').addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term));
    
    const container = document.getElementById('productsGrid');
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 3rem; color: #aaa;">No se encontraron productos.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        let priceDisplay = product.originalPrice ? 
            `<p class="price" style="text-decoration:line-through; font-size:0.9rem; color:#888;">$${product.originalPrice} MXN</p>
             <p class="price" style="color:#ff00cc; font-size:1.2rem;">$${product.price} MXN</p>` :
            `<p class="price">$${product.price} MXN</p>`;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                ${priceDisplay}
                <button class="btn-add" onclick="addToCart(${product.id})">Agregar al Carrito</button>
            </div>
        `;
        container.appendChild(card);
    });
});

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showNotification("✅ ¡Agregado al carrito!");

    // Si el modal del carrito está abierto, lo actualizamos en vivo
    if (document.getElementById('cartModal').style.display === 'block') {
        renderCart();
    }
}

// Actualizar contador del carrito
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Mostrar notificación animada
function showNotification(message) {
    // Si ya existe una notificación, la removemos primero
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.background = 'linear-gradient(135deg, #ff00cc, #3393ff)';
    notif.style.color = 'white';
    notif.style.padding = '15px 25px';
    notif.style.borderRadius = '10px';
    notif.style.zIndex = '3000';
    notif.style.boxShadow = '0 4px 20px rgba(255, 0, 204, 0.4)';
    notif.style.fontWeight = '600';
    notif.style.transform = 'translateY(100px)';
    notif.style.opacity = '0';
    notif.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    document.body.appendChild(notif);

    // Trigger animation
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

// Abrir modal de producto
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    const details = document.getElementById('modalProductDetails');

    let priceDisplay = product.originalPrice ? 
        `<p style="text-decoration:line-through; color:#888; font-size:1.1rem;">$${product.originalPrice} MXN</p>
         <p style="color:#ff00cc; font-size:1.5rem; font-weight:700;">$${product.price} MXN</p>` :
        `<p class="price" style="font-size:1.5rem; color:#ff00cc; margin:10px 0;">$${product.price} MXN</p>`;

    details.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:100%; max-height:300px; object-fit:cover; border-radius:15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);">
        <h2 style="margin:20px 0 10px; color:white;">${product.name}</h2>
        ${priceDisplay}
        <p style="color:#ccc; line-height:1.6;">${product.description}</p>
        <button class="btn" style="width:100%; margin-top:20px;" onclick="addToCart(${product.id})">Agregar al Carrito</button>
    `;

    modal.style.display = 'block';
}

// Cerrar modales
function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// Mostrar carrito
document.getElementById('cartBtn').addEventListener('click', function() {
    renderCart();
    document.getElementById('cartModal').style.display = 'block';
});

// Renderizar carrito
function renderCart() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:2rem; color:#aaa;">Tu carrito está vacío.</p>';
        document.getElementById('totalPrice').textContent = '0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item">
                <div>
                    <strong style="color:white;">${item.name}</strong> x${item.quantity}
                </div>
                <div>
                    <span style="color:#ff00cc; font-weight:600;">$${itemTotal} MXN</span>
                    <button onclick="removeFromCart(${item.id})" style="margin-left:10px; background:#ff00cc; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer; font-size:0.9rem;">🗑️ Quitar</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    document.getElementById('totalPrice').textContent = total;
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateCartCount();
}

// Mostrar formulario de checkout
function showCheckoutForm() {
    if (cart.length === 0) {
        alert("🛒 Tu carrito está vacío. ¡Agrega algo primero!");
        return;
    }

    document.getElementById('checkoutBtn').style.display = 'none';
    document.getElementById('checkoutForm').style.display = 'block';
}

// Manejar envío del formulario
document.getElementById('shippingForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Simular proceso de compra
    showNotification("⏳ Procesando pedido...");

    setTimeout(() => {
        alert("🎉 ¡Pedido confirmado!\nEn 24 hrs recibirás un correo con los detalles.");
        
        // Vaciar carrito
        cart = [];
        updateCartCount();
        renderCart();
        
        // Ocultar formulario y volver a mostrar botón
        document.getElementById('checkoutForm').style.display = 'none';
        document.getElementById('checkoutBtn').style.display = 'block';
        
        // Cerrar modal después de 1 segundo
        setTimeout(() => {
            closeCartModal();
        }, 1000);
    }, 1500);
});

// Finalizar compra (ahora abre el formulario)
function checkout() {
    showCheckoutForm();
}

// Carrusel
function moveCarousel(direction) {
    const container = document.getElementById('carouselContainer');
    const items = container.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth + 20; // + gap
    const maxIndex = items.length - Math.floor(container.offsetWidth / itemWidth);

    carouselIndex += direction;

    if (carouselIndex < 0) carouselIndex = 0;
    if (carouselIndex > maxIndex) carouselIndex = maxIndex;

    container.scrollTo({
        left: carouselIndex * itemWidth,
        behavior: 'smooth'
    });
}

// Newsletter
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                showNotification("📬 ¡Gracias por suscribirte! Las ofertas llegarán pronto.");
                this.reset();
            }
        });
    }
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
};