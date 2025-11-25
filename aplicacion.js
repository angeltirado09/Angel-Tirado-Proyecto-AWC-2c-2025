//Airtable
    const airtableToken = 'patCZdCvB2srAXTe1.4451010d1ce059acb4c011ccd404b29478d76d4ea2f80d87abffb55efaa27423';
    const baseID = 'app0yz4FNhIC5VUu5';
    const tableName = 'Productos';
    const airtableUrl = `https://api.airtable.com/v0/${baseID}/${tableName}`;

// se deja comentario para tener track del avance realizado 23/11/2025
/*
document.addEventListener("DOMContentLoaded", () => {
    const products = [
        {id: 1, name: "Jean Paul Gaultier Le Beau Le Parfum 125ml", price: 177600, image: "https://http2.mlstatic.com/D_NQ_NP_2X_790143-MLA70673937702_072023-F.webp", category: "Hombre"},
        {id: 2, name: "One Million Elixir 100ml", price: 176400, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/4/142880-a-one-million-elixir-parfum-intense-200ml.jpg", category: "Hombre"},
        {id: 3, name: "Versace Dylan Blue Pour Homme 100ml", price: 196000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/r/v/rv139283.jpg", category: "Hombre"},
        {id: 4, name: "Stronger With You Intensely For Him EDP 100ml", price: 289000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/2/125747-a-stronger-with-you-intensely-for-him-edp-100ml.jpg", category: "Hombre"},
        {id: 5, name: "Club de Nuit Intense Man EDT 105ml", price: 109000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/5/155114-a-club-de-nuit-intense-men-edt-105ml.jpg", category: "Hombre"},
        {id: 6, name: "Dior Sauvage Elixir 100ml", price: 482000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/4/147916-a-sauvage-elixir-100ml.jpg", category: "Hombre"},
        {id: 7, name: "LA VIE EST BELLE INTENSEMENT EDP INTENSE 100ML", price: 171000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/3/130792a.jpg", category: "Mujer"},
        {id: 8, name: "Versace The Dreamer 100ml", price: 72000, image: "https://www.infoparfum.ro/wp-content/uploads/2016/08/versace-the-dreamer-e1472019454983.jpg", category: "Hombre"},
        {id: 9, name: "Lattafa Khamrah Qahwa 100ml", price: 65000, image: "https://perfume-malaysia.com/wp-content/uploads/2024/08/khamrah-qahwa.jpg", category: "Unisex"},
    ];

    const productContainer = document.querySelector(".product-section");
    if (!productContainer) {
        console.warn("aplicacion.js: no se encontró .product-section. Coloca <section class=\"product-section\"></section> y carga el script después del DOM.");
        return;
    }*/


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

    // funciones para la interfaz de usuario
    function renderCartCount() {
        const cartCountBadge = document.getElementById('cart-count');
        if (!cartCountBadge) return;
        const total = getCartTotalQuantity();
        cartCountBadge.innerText = total > 0 ? total : '';
        cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none';
    }

    /* se deja comentario para tener track del avance realizado 23/11/2025
    function mostrarProductos(listaDeProductos) {
        productContainer.innerHTML = '';

        listaDeProductos.forEach(producto => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("product-item");

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

        // manejadores de eventos a los botones "Añadir a la bolsa"
        const botones = productContainer.querySelectorAll('.product-actions button');
        botones.forEach(boton => {
            boton.addEventListener('click', (evento) => {
                evento.preventDefault();
                evento.stopPropagation();
                const id = evento.currentTarget.dataset.id;
                addToCart(id);
            });
        });*/
    

    // inicio
    /*mostrarProductos(products);
    renderCartCount();*/

    // por si hay cambios desde otra pestaña
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') renderCartCount();
    });


    // Lógica para cargar y renderizar productos desde Airtable
    document.addEventListener('DOMContentLoaded', () => {
        const productContainer = document.querySelector('.product-section');
        if (!productContainer) console.warn('No existe .product-section en el DOM');

        async function getProductsFromAirtable() {
            try {
                const response = await fetch(airtableUrl, {
                    headers: {
                        'Authorization': `Bearer ${airtableToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error('Airtable responded with', response.status, text);
                    productContainer && (productContainer.innerHTML = '<p>Error cargando productos. Revisa la consola.</p>');
                    return;
                }

                const data = await response.json();
                console.log('Products from Airtable:', data);

                if (!data.records) {
                    console.error('Respuesta de Airtable sin records', data);
                    productContainer && (productContainer.innerHTML = '<p>No hay productos.</p>');
                    return;
                }

                const mappedProducts = data.records.map((item, idx) => {
                    const f = item.fields || {};
                    // extraer url si el campo es un attachment
                    let image = '';
                    const imgField = f.Img || f.Image || f.Images || f.img;
                    if (Array.isArray(imgField) && imgField.length > 0) image = imgField[0].url || imgField[0].thumbnails?.large?.url || '';
                    else if (typeof imgField === 'string') image = imgField;

                    return {
                        id: idx + 1, // índice local (opcional)
                        recordId: item.id, // id de Airtable (recXXXXX)
                        name: f.Name || f.Title || 'Sin nombre',
                        price: f.Price || f.Precio || 0,
                        image: image,
                        category: f.Category || ''
                    };
                });

                // Guardar en localStorage para que producto.html lo lea
                try { localStorage.setItem('productsAirtable', JSON.stringify(mappedProducts)); } catch (e) { console.warn('No se pudo guardar productsAirtable en localStorage', e); }

                // render
                renderProducts(mappedProducts);
            }
            catch (error) {
                console.error('Error fetching products from Airtable:', error);
                productContainer && (productContainer.innerHTML = '<p>Error cargando productos. Mira la consola.</p>');
            }
        }

        function renderProducts(lista) {
            if (!productContainer) return;
            productContainer.innerHTML = '';
            lista.forEach(prod => {
                const div = document.createElement('div');
                div.className = 'product-item';
                div.innerHTML = `
                    <a href="producto.html?airtableId=${encodeURIComponent(prod.recordId)}" class="product-link" data-id="${prod.recordId}">
                        <div class="product-card">
                            <img src="${prod.image || 'Imagen-no-disponible.png'}" alt="${prod.name}">
                            <div class="product-detail">
                                <div class="product-text">
                                    <p>${prod.name}</p>
                                    <p class="card-price">$${Number(prod.price).toLocaleString('es-AR')}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                    <div class="product-actions">
                        <button type="button" data-id="${prod.recordId}">Añadir a la bolsa</button>
                    </div>`;
                productContainer.appendChild(div);
            });


            productContainer.querySelectorAll('.product-actions button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const recId = e.currentTarget.dataset.id;
                    // buscar producto en productsAirtable por recordId y añadir al carrito
                    const stored = JSON.parse(localStorage.getItem('productsAirtable') || '[]');
                    const p = stored.find(item => item.recordId === recId);
                    if (!p) return alert('Producto no encontrado en localStorage');
                    // usar addToCart por recordId: añadimos con recordId para identificar
                    const cart = getCart();
                    const existing = cart.find(i => i.recordId === p.recordId);
                    if (existing) existing.qty = (existing.qty || 0) + 1;
                    else cart.push({ recordId: p.recordId, name: p.name, price: p.price, image: p.image, qty: 1 });
                    saveCart(cart);
                });
            });
        }

        // iniciador
        getProductsFromAirtable();
    });