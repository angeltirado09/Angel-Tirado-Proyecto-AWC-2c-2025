document.addEventListener('DOMContentLoaded', () => {

    function getCart() {
        // Obtiene el carrito del localStorage
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        // Guarda el carrito en localStorage y actualiza el iconito de contador de la bolsa
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartCount();
    }


    function getCartTotalQuantity() {
        // Calcula la cantidad total de items en el carrito
        return getCart().reduce((acc, it) => acc + (it.qty || 0), 0);
    }

    function renderCartCount() {
        // Actualiza el badge en el header que muestra cuántos items hay en el carrito
        const cartCountBadge = document.getElementById('cart-count');
        if (!cartCountBadge) return;
        const total = getCartTotalQuantity();
        cartCountBadge.innerText = total > 0 ? total : '';
        cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none';
    }

    // ========================================
    // FUNCIONES PARA GESTIONAR FAVORITOS
    // ========================================

    // Estas funciones guardan y recuperan los favoritos desde el localStorage
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favorites')) || [];
        } catch {
            return [];
        }
    }

    // Guarda los favoritos en localStorage. Convierte el array 'favorites' a una cadena JSON y lo almacena en 'favorites'. Luego dispara un evento 'storage' para actualizar la interfaz.
    function saveFavorites(favorites) {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new Event('storage'));
    }

    // Agrega o elimina un producto de los favoritos. Si el producto ya está en favoritos, lo elimina; si no, lo agrega. Luego actualiza los botones de favoritos en la interfaz.
    function toggleFavorite(product) {
        const favorites = getFavorites();
        const itemKey = product.recordId || String(product.id);
        const isFavorited = favorites.some(fav => 
            (fav.recordId && fav.recordId === itemKey) || (String(fav.id) === itemKey)
        );

        if (isFavorited) {
            // Eliminar de favoritos
            const filtered = favorites.filter(fav => {
                const favKey = fav.recordId || String(fav.id);
                return favKey !== itemKey;
            });
            saveFavorites(filtered);
        } else {
            // Agregar a favoritos
            favorites.push({
                id: product.id,
                recordId: product.recordId,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                brand: product.brand,
                description: product.description
            });
            saveFavorites(favorites);
        }
        updateFavoriteButton();
    }

    function isFavorited(product) {
        const favorites = getFavorites();
        const itemKey = product.recordId || String(product.id);
        return favorites.some(fav => 
            (fav.recordId && fav.recordId === itemKey) || (String(fav.id) === itemKey)
        );
    }

    // estilo del boton de favorito segun si el producto esta en favoritos o no similares al del index
    function updateFavoriteButton() {
        const favoriteBtn = document.querySelector('.boton-favorito');
        if (favoriteBtn && product) {
            if (isFavorited(product)) {
                favoriteBtn.classList.add('is-favorited');
                favoriteBtn.innerHTML = '<span class="material-symbols-outlined" style="color:#FEFEFF;">favorite</span>';
            } else {
                favoriteBtn.classList.remove('is-favorited');
                favoriteBtn.innerHTML = '<span class="material-symbols-outlined">favorite</span>';
            }
        }
    }

    // ========================================
    // LÓGICA DE LA PÁGINA DE DETALLE DEL PRODUCTO
    // ========================================
    // Aquí se extrae el ID del producto del airtable

    // Leemos los parámetros del Airtable
    const urlParams = new URLSearchParams(window.location.search);
    const airtableId = urlParams.get('airtableId');

    // ========================================
    // BUSCAR EL PRODUCTO (desde Airtable)
    // ========================================
    // Busca productos mediante el ID de Airtable en el localStorage almacenado en aplicacion.js
    let product = null;
    if (airtableId) {
        try {
            const stored = JSON.parse(localStorage.getItem('productsAirtable') || '[]');
            product = stored.find(p => p.recordId === airtableId) || null;
        } catch (e) {
            console.warn('No se pudo leer productsAirtable desde localStorage', e);
        }
    }


    // ========================================
    // Si el producto existe lo muestra
    // ========================================
    // Rellenamos todos los campos de la página con la información del producto

    if (product) {
        // Actualiza el título de la página segun el producto, ejemplo "Jean Paul Gaultier Le Beau Le Parfum 125ml - La Esencia"
        document.title = `${product.name} - La Esencia`;

        // se seleccionan los elementos donde irá la información (imagen, nombre, precio, etc)
        const productImage = document.querySelector('.producto-imagen img');
        const productName = document.querySelector('.producto-nombre');
        const productBrand = document.querySelector('.producto-marca');
        const productPrice = document.querySelector('.producto-precio');
        const productInstallments = document.querySelector('.producto-cuotas');
        const productDescription = document.querySelector('.producto-descripcion p');
        const addButton = document.querySelector('.boton-anadir');

        // Llenamos la información en la página con los datos del producto (imagen, nombre, marca, precio, descripción, etc)
        productImage.src = product.image || '';
        productImage.alt = product.name || '';
        productName.textContent = product.name || '';
        productBrand.textContent = product.brand || product.category || '';
        productPrice.textContent = `$${(product.price || 0).toLocaleString('es-AR')}`;
        productInstallments.textContent = `6 cuotas sin interés de $${Math.ceil((product.price || 0) / 6).toLocaleString('es-AR')}`; // calcula 6 cuotas sin interes (redondea hacia arriba)
        productDescription.textContent = product.description || '';

        // ========================================
        // FUNCIONALIDAD DEL BOTÓN "AÑADIR A LA BOLSA" Y FAVORITOS
        // ========================================
        // Manejamos el clic en los botones para agregar el producto al carrito y a favoritos

        if (addButton) {
            addButton.addEventListener('click', () => {
                // Añade al carrito usando el id (Airtable) 
                if (product && product.recordId) {
                    const cart = getCart();
                    const existing = cart.find(i => i.recordId === product.recordId);
                    if (existing) existing.qty = (existing.qty || 0) + 1;
                    else cart.push({ recordId: product.recordId, name: product.name, price: product.price, image: product.image, qty: 1 });
                    saveCart(cart);
                } else {
                    // Producto no válido
                    alert('Este producto no está disponible para agregar al carrito.');
                }
                // Cambia el texto del botón a "¡Añadido!" para confirmar al usuario
                const originalText = addButton.textContent;
                addButton.textContent = '¡Añadido!';
                addButton.disabled = true;
                setTimeout(() => {
                    addButton.textContent = originalText;
                    addButton.disabled = false;
                }, 1500);
            });
        }

        // Botón de favoritos
        const favoriteBtn = document.querySelector('.boton-favorito');
        if (favoriteBtn) {
            updateFavoriteButton();
            favoriteBtn.addEventListener('click', () => {
                toggleFavorite(product);
            });
        }

    } else {
        // ========================================
        // SI NO SE ENCUENTRA EL PRODUCTO
        // ========================================
        // se muestra un mensaje de error

        const productContainer = document.querySelector('.producto-main');
        productContainer.innerHTML = '<h1>Producto no encontrado</h1><p>El producto que buscas no existe o fue removido. <a href="index.html">Volver a la página principal</a>.</p>';
    }

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    // Se sincroniza el contador de la bolsa al cargar la página y se actualiza

    renderCartCount();
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            renderCartCount();
        }
    });
});
