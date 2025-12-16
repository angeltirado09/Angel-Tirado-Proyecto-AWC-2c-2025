document.addEventListener("DOMContentLoaded", () => {
    // ========================================
    // SELECCIONAR CLASES DE BOLSA.HTML
    // ========================================
    // se buscan los elementos HTML donde mostraremos el carrito y el resumen de precios
    const itemsListContainer = document.querySelector(".bolsa-items-list");
    const subtotalElem = document.getElementById("resumen-subtotal");
    const totalElem = document.getElementById("resumen-total");
    const vaciarBolsaBtn = document.querySelector(".btn-vaciar-bolsa");
    const cartCountBadge = document.getElementById('cart-count');

    // ========================================
    // FUNCIONES PARA GESTIONAR LA BOLSA DE COMPRAS 
    // ========================================
    // Estas funciones se encargan de guardar y recuperar el carrito desde localStorage

    // Recupera la bolsa de compras desde localStorage. Obtiene el valor almacenado en 'cart' y lo parsea como JSON. y try/catch por si el JSON esta mal formado para siempre devolver un array valido.
    // En CRUD esta funcion es R de Read
    function getCart() {
        // Obtiene el carrito del localStorage y lo convierte en un array
        try {
            //utilizamos try catch por si el JSON esta mal formado
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return []; // si hay error al parsear, devuelve un array vacio
        }
    }

    // Guarda la bolsa de compras en localStorage. Convierte el array 'cart' a una cadena JSON y lo almacena en 'cart'. Luego llama a renderCartCount para actualizar el contador del carrito.
    function saveCart(cart) {
        // Guarda el carrito en localStorage y 
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('storage'));
        // notifica si hubo un cambio en el carrito
    }

    // ========================================
    // FUNCIONES DE FORMATO Y RENDERIZADO
    // ========================================
    // Estas funciones muestran los items del carrito en la página y calculan precios

    function formatPrice(price) {
        // Convierte un número a formato de moneda argentina (con $ y separadores de miles)
        return `$${price.toLocaleString('es-AR')}`;
    }

    

    function renderItems() {
        // Obtiene los items del carrito y los dibuja en la página como filas con imagen, cantidad, precio, etc
        const cart = getCart();
        itemsListContainer.innerHTML = ''; 

        // Si no hay items en la bolsa se muestra un mensaje de que está vacía
        if (cart.length === 0) {
            itemsListContainer.innerHTML = '<p class="bolsa-vacia-msg">Tu bolsa de compras está vacía.</p>';
            updateSummary(); // actualiza el resumen de precios con la funcion correspondiente
            updateCartCount(); // actualiza el contador del carrito con la funcion correspondiente
            return;
        }

        // Dibujamos cada item del carrito como una fila
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('bolsa-item');
            // se usa el id o recordId segun corresponda del item desde el airtable para poder agregarlo a la bolsa
            const itemKey = (item.id !== undefined && item.id !== null) ? String(item.id) : String(item.recordId || '');
            itemDiv.dataset.id = itemKey;

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

        // Configuramos los listeners para cada item (eliminar, cambiar cantidad)
        addEventListenersToItems();
        updateSummary();
        updateCartCount();
    }

    function updateSummary() {
        // Calcula el subtotal sumando (precio * cantidad) de todos los items
        const cart = getCart();
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0); // suma precio * cantidad de cada item para el calculo
        subtotalElem.textContent = formatPrice(subtotal);
        totalElem.textContent = formatPrice(subtotal);
    }

    function updateCartCount() {
        // Actualiza el badge en el header que muestra cuántos items hay en el carrito
        const cart = getCart();
        const total = cart.reduce((acc, it) => acc + (it.qty || 0), 0); // suma las cantidades de todos los items
        // muestra el total en el badge (el iconito del contador de la bolsa en el header), si es 0 no muestra nada
        if (cartCountBadge) { 
            cartCountBadge.innerText = total > 0 ? total : '';
            cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none';
        }
    }


    // ========================================
    // MANEJO DE EVENTOS PARA ITEMS DE LA BOLSA
    // ========================================
    // Aquí se configura la lógica para eliminar items, cambiar cantidad, y vaciar el carrito

    // Configura los eventos para los botones y campos de cantidad de cada item en la bolsa
    function addEventListenersToItems() {
        // Evento para eliminar un item del carrito
        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', (e) => {
                // Obtenemos el ID del item a eliminar
                const itemId = e.target.closest('.bolsa-item').dataset.id; // se usa el id segun corresponda del item desde el airtable para poder eliminarlo de la bolsa. El closest busca el elemento padre con la clase 'bolsa-item'
                let cart = getCart();
                // Filtramos el carrito para sacar el item eliminado
                cart = cart.filter(item => {
                    const key = (item.id !== undefined && item.id !== null) ? String(item.id) : String(item.recordId || '');
                    return key !== itemId;
                }); // si el id del item no es igual al id del item a eliminar, lo mantenemos en el carrito
                saveCart(cart);
                renderItems();
            });
        });

        // Evento para cambiar la cantidad de un item
        document.querySelectorAll('.item-cantidad-input').forEach(input => {
            input.addEventListener('change', (e) => {
                // Obtenemos el ID del item y la nueva cantidad
                const itemId = e.target.closest('.bolsa-item').dataset.id;
                const newQty = parseInt(e.target.value, 10);
                let cart = getCart();

                // Buscamos el item en el carrito
                const itemInCart = cart.find(item => {
                    const key = (item.id !== undefined && item.id !== null) ? String(item.id) : String(item.recordId || '');
                    return key === itemId;
                });
                
                if (itemInCart) {
                    if (newQty > 0) {
                        // Actualizamos la cantidad
                        itemInCart.qty = newQty;
                    } else {
                        // Si la cantidad es 0 o menos, eliminamos el item
                        cart = cart.filter(item => {
                            const key = (item.id !== undefined && item.id !== null) ? String(item.id) : String(item.recordId || '');
                            return key !== itemId;
                        });
                    }
                }
                saveCart(cart);
                renderItems();
            });
        });
    }

    // ========================================
    // EVENTO PARA VACIAR LA BOLSA
    // ========================================
    // Cuando el usuario hace clic en "Vaciar Bolsa", pedimos confirmación y limpiamos todo

    vaciarBolsaBtn.addEventListener('click', () => { // En CRUD esta funcion es D de Delete
        // se pide confirmacion
        if (confirm('¿Estás seguro de que quieres vaciar tu bolsa?')) {
            saveCart([]); 
            renderItems();
        }
    });

    // ========================================
    // SINCRONIZACIÓN ENTRE PESTAÑAS
    // ========================================
    // Si se cambia la bolsa en otra pestaña, esto actualiza la vista actual

    window.addEventListener('storage', () => {
        renderItems();
        updateCartCount();
    });

    // ========================================
    // INICIALIZACIÓN
    // ========================================
    // Mostramos el carrito cuando la página carga

    renderItems();
});
