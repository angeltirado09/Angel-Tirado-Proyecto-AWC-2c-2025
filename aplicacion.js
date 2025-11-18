// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
    const products = [
        {id: 1, name: "Jean Paul Gaultier Le Beau Le Parfum 125ml", price: 177600, image: "https://http2.mlstatic.com/D_NQ_NP_2X_790143-MLA70673937702_072023-F.webp"},
        {id: 2, name: "One Million Elixir 100ml", price: 176400, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/4/142880-a-one-million-elixir-parfum-intense-200ml.jpg"},
        {id: 3, name: "Versace Dylan Blue Pour Homme 100ml", price: 196000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/r/v/rv139283.jpg"},
        {id: 4, name: "Stronger With You Intensely For Him EDP 100ml", price: 289000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/2/125747-a-stronger-with-you-intensely-for-him-edp-100ml.jpg"},
        {id: 5, name: "Club de Nuit Intense Man EDT 105ml", price: 109000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/5/155114-a-club-de-nuit-intense-men-edt-105ml.jpg"},
        {id: 6, name: "Dior Sauvage Elixir 100ml", price: 482000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/4/147916-a-sauvage-elixir-100ml.jpg"},
        {id: 7, name: "Lattafa Asad Bourbon 100ml", price: 78000, image: "https://perfumeschile.cl/cdn/shop/files/Lattafa-Asad-Bourbon-EDP-100ML-Hombre.png?v=1738956960&width=1500"},
        {id: 8, name: "Versace The Dreamer 100ml", price: 72000, image: "https://www.infoparfum.ro/wp-content/uploads/2016/08/versace-the-dreamer-e1472019454983.jpg"},
        {id: 9, name: "Lattafa Khamrah Qahwa 100ml", price: 65000, image: "https://perfume-malaysia.com/wp-content/uploads/2024/08/khamrah-qahwa.jpg"},
    ];

    const productContainer = document.querySelector(".product-section");
    if (!productContainer) {
        console.warn("aplicacion.js: no se encontró .product-section. Coloca <section class=\"product-section\"></section> y carga el script después del DOM.");
        return;
    }

    // --- LocalStorage cart helpers ---
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartCount();
    }
    function addToCart(productId) {
        const producto = products.find(p => p.id === Number(productId));
        if (!producto) return;
        const cart = getCart();
        const existing = cart.find(i => i.id === producto.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: producto.id, name: producto.name, price: producto.price, image: producto.image, qty: 1 });
        }
        saveCart(cart);
    }
    function getCartTotalQuantity() {
        return getCart().reduce((acc, it) => acc + (it.qty || 0), 0);
    }

    // --- UI functions ---
    function renderCartCount() {
        const cartCountBadge = document.getElementById('cart-count');
        if (!cartCountBadge) return;
        const total = getCartTotalQuantity();
        cartCountBadge.innerText = total > 0 ? total : '';
        cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none';
    }

    function mostrarProductos(listaDeProductos) {
        productContainer.innerHTML = '';

        listaDeProductos.forEach(producto => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("product-item");

            // Cambié el enlace para llevar el id en la query string
            productoDiv.innerHTML = `
                <a href="./producto.html?id=${producto.id}" class="product-link" data-id="${producto.id}">
                    <div class="product-card">
                        <img src="${producto.image}" alt="${producto.name}">
                        <div class="product-detail">
                            <div class="product-text">
                                <p>${producto.name}</p>
                                <p class="card-price">$${producto.price.toLocaleString('es-AR')}</p>
                            </div>
                        </div>
                    </div>
                </a>
                <div class="product-actions">
                    <button type="button" data-id="${producto.id}">Añadir a la bolsa</button>
                </div>
            `;

            productContainer.appendChild(productoDiv);
        });

        // listeners para botones "Añadir a la bolsa"
        const botones = productContainer.querySelectorAll('.product-actions button');
        botones.forEach(boton => {
            boton.addEventListener('click', (evento) => {
                evento.preventDefault();
                evento.stopPropagation();
                const id = evento.currentTarget.dataset.id;
                addToCart(id);
            });
        });
    }

    // inicializar
    mostrarProductos(products);
    renderCartCount();

    // Opcional: actualizar badge si se cambia localStorage desde otra pestaña
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') renderCartCount();
    });
});
// ...existing code...