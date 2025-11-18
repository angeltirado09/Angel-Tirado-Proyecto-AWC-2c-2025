document.addEventListener("DOMContentLoaded", () => {
    const itemsListContainer = document.querySelector(".bolsa-items-list");
    const subtotalElem = document.getElementById("resumen-subtotal");
    const totalElem = document.getElementById("resumen-total");
    const vaciarBolsaBtn = document.querySelector(".btn-vaciar-bolsa");
    const cartCountBadge = document.getElementById('cart-count');

    // funciones para el carrito

    function getCart() {
        try {
            // Reutilizamos la misma lógica que en aplicacion.js
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        // esto nos ayuda a notificar a otras pestañas alguna actualizacion
    }

    // funciones para renderizar y actualizar
    function formatPrice(price) {
        return `$${price.toLocaleString('es-AR')}`;
    }

    function renderItems() {
        const cart = getCart();
        itemsListContainer.innerHTML = ''; // Limpiamos el contenedor

        if (cart.length === 0) {
            itemsListContainer.innerHTML = '<p class="bolsa-vacia-msg">Tu bolsa de compras está vacía.</p>';
            updateSummary();
            updateCartCount();
            return;
        }

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('bolsa-item');
            itemDiv.dataset.id = item.id;

            itemDiv.innerHTML = `
                <div class="bolsa-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="bolsa-item-info">
                    <p class="item-nombre">${item.name}</p>
                    <p class="item-precio-unitario">Precio: ${formatPrice(item.price)}</p>
                </div>
                <div class="bolsa-item-cantidad">
                    <input type="number" class="item-cantidad-input" value="${item.qty}" min="1" max="99">
                </div>
                <div class="bolsa-item-precio-total">
                    <p>${formatPrice(item.price * item.qty)}</p>
                </div>
                <div class="bolsa-item-eliminar">
                    <button class="btn-eliminar">&times;</button>
                </div>
            `;
            itemsListContainer.appendChild(itemDiv);
        });

        addEventListenersToItems();
        updateSummary();
        updateCartCount();
    }

    function updateSummary() {
        const cart = getCart();
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        
        subtotalElem.textContent = formatPrice(subtotal);
        totalElem.textContent = formatPrice(subtotal);
    }

    function updateCartCount() {
        const cart = getCart();
        const total = cart.reduce((acc, it) => acc + (it.qty || 0), 0);
        if (cartCountBadge) {
            cartCountBadge.innerText = total > 0 ? total : '';
            cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none';
        }
    }

    // manejadores de eventos, ejemplo si se agrega o quitan productos del carrito, esta serían las funciones que manejarían esos eventos

    function addEventListenersToItems() {
        // Evento para eliminar un item
        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.target.closest('.bolsa-item').dataset.id;
                let cart = getCart();
                cart = cart.filter(item => item.id != itemId);
                saveCart(cart);
                renderItems();
            });
        });

        // Evento para cambiar la cantidad
        document.querySelectorAll('.item-cantidad-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = e.target.closest('.bolsa-item').dataset.id;
                const newQty = parseInt(e.target.value, 10);
                let cart = getCart();
                
                const itemInCart = cart.find(item => item.id == itemId);
                if (itemInCart) {
                    if (newQty > 0) {
                        itemInCart.qty = newQty;
                    } else {
                        // Si la cantidad es 0 o menos, eliminamos el item
                        cart = cart.filter(item => item.id != itemId);
                    }
                }
                saveCart(cart);
                renderItems();
            });
        });
    }

    // Evento para el botón "Vaciar Bolsa"
    vaciarBolsaBtn.addEventListener('click', () => {
        // se pide confirmacion
        if (confirm('¿Estás seguro de que quieres vaciar tu bolsa?')) {
            saveCart([]); 
            renderItems();
        }
    });

    // Escuchar cambios en el almacenamiento local para actualizar la vista en otras pestañas
    window.addEventListener('storage', () => {
        renderItems();
        updateCartCount();
    });

    // inicialización
    renderItems();
});