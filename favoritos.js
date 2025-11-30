document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // SELECCIONAR CLASES DE FAVORITOS.HTML
    // ========================================
    // Aquí buscamos los productos favoritos en el HTML para poder manipularlos
    const favoritesListContainer = document.querySelector(".favoritos-items-list");

    // ========================================
    // FUNCIONES PARA GESTIONAR FAVORITOS
    // ========================================
    // Estas funciones guardan y recuperan los favoritos desde el localStorage

    function getFavorites() {
        // Obtiene los favoritos del localStorage y los convierte en un array
        try {
            return JSON.parse(localStorage.getItem('favorites')) || [];
        } catch {
            return [];
        }
    }

    function saveFavorites(favorites) {
        // Guarda los favoritos en localStorage y también notifica el cambio al storage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        window.dispatchEvent(new Event('storage'));
    }

    // ========================================
    // FUNCIONES DE RENDERIZADO
    // ========================================
    // Estas funciones muestran los items de favoritos en la página

    function formatPrice(price) {
        // Convierte a pesos argentinos
        return `$${price.toLocaleString('es-AR')}`;
    }

    function renderFavorites() {
        // Obtiene los favoritos y los dibuja en la página como filas con imagen, nombre y precio
        const favorites = getFavorites();
        favoritesListContainer.innerHTML = '';

        // Si no hay favoritos avisa que n ohay productos
        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '<p class="bolsa-vacia-msg">No tienes productos en favoritos.</p>';
            return;
        }

        // Dibujamos cada favorito como una fila
        favorites.forEach(item => {
            const itemDiv = document.createElement('div');
            // esta clase es para estilos CSS
            itemDiv.classList.add('bolsa-item');
            // se usa el id 
            const itemKey = (item.id ?? item.id ?? '') ? String(item.id) : String(item.recordId || '');
            itemDiv.dataset.id = itemKey;

            itemDiv.innerHTML = `
                <div class="bolsa-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="bolsa-item-info">
                    <p class="item-nombre">${item.name}</p>
                    <p class="item-precio-unitario">Precio: ${formatPrice(item.price)}</p>
                </div>
                <div class="bolsa-item-eliminar">
                    <button class="btn-eliminar">&times;</button>
                </div>
            `;
            favoritesListContainer.appendChild(itemDiv);
        });

        addEventListenersToFavorites();
    }

    // ========================================
    // MANEJADORES DE EVENTOS
    // ========================================
    // Aquí se configura la lógica para eliminar items de favoritos

    function addEventListenersToFavorites() {
        // Evento para eliminar un favorito
        document.querySelectorAll('.favoritos-items-list .btn-eliminar').forEach(button => {
            button.addEventListener('click', (e) => {
                // Obtenemos el ID del item a eliminar
                const itemId = e.target.closest('.bolsa-item').dataset.id;
                let favorites = getFavorites();
                // filtramos los favoritos para sacar el item eliminado
                favorites = favorites.filter(item => {
                    const key = (item.id !== undefined && item.id !== null) ? String(item.id) : String(item.recordId || '');
                    return key !== itemId;
                });
                saveFavorites(favorites);
                renderFavorites();
            });
        });
    }

    // ========================================
    // SINCRONIZACIÓN ENTRE PESTAÑAS
    // ========================================
    // para tener los favoritos sincronizados entre pestañas

    window.addEventListener('storage', () => {
        renderFavorites();
    });

    // ========================================
    // INICIO
    // ========================================
    // Mostramos los favoritos cuando la página carga

    renderFavorites();
});
