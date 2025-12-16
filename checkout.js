document.addEventListener('DOMContentLoaded', () => {
    
    // VERIFICACIÓN DE SEGURIDAD
    // Si no hay carrito o está vacío, volver al inicio
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Tu bolsa está vacía. Redirigiendo al inicio...');
        window.location.href = 'index.html';
        return;
    }

    // AUTOCOMPLETADO DE USUARIO
    // Si el usuario ya inició sesión, rellenamos sus datos básicos
    const loggedUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (loggedUser) {
        // Asumiendo que guardaste 'name' y 'email' en el objeto user
        document.getElementById('nombre').value = loggedUser.name || '';
        document.getElementById('email').value = loggedUser.email || '';
        // Si tuvieras más datos guardados (como apellido), los pondrías aquí
    }

    // RENDERIZAR RESUMEN (Read de LocalStorage)
    const itemsContainer = document.getElementById('checkout-items-list');
    const totalElement = document.getElementById('checkout-total');
    let total = 0;

    cart.forEach(item => {
        // Calcular subtotal por item
        const itemTotal = item.price * (item.qty || 1);
        total += itemTotal;

        // Crear HTML del item (versión resumida)
        const div = document.createElement('div');
        div.classList.add('summary-item');
        div.innerHTML = `
            <span class="summary-item-name">${item.qty}x ${item.name}</span>
            <span class="summary-item-price">$${itemTotal.toLocaleString('es-AR')}</span>
        `;
        itemsContainer.appendChild(div);
    });

    // Mostrar Total
    totalElement.textContent = `$${total.toLocaleString('es-AR')}`;

    // MANEJO DEL FORMULARIO
    const form = document.getElementById('form-checkout');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        
        // Simulamos carga
        const btn = document.querySelector('.btn-pagar');
        const originalText = btn.textContent;
        btn.textContent = 'Procesando pago...';
        btn.disabled = true;

        setTimeout(() => {
            // PROCESO DE ÉXITO
            
            // Crear Objeto de la Orden 
            const newOrder = {
                orderId: Date.now(), // ID falso basado en timestamp
                customer: {
                    email: document.getElementById('email').value,
                    dni: document.getElementById('dni').value
                },
                items: cart,
                total: total,
                date: new Date().toISOString()
            };

            console.log("Orden Creada:", newOrder);

            // Limpiar Carrito
            localStorage.removeItem('cart');
            
            // Feedback al usuario
            alert(`¡Gracias por tu compra ${document.getElementById('nombre').value}! \nTu pedido #${newOrder.orderId} ha sido confirmado.`);
            
            // Redirección
            window.location.href = 'index.html';
            
        }, 2000); // Esperamos 2 segundos para simular red
    });

    // FORMATO DE TARJETA DE CRÉDITO
    const cardInput = document.getElementById('numero-tarjeta');
    cardInput.addEventListener('input', (e) => {
        // Agrega espacios cada 4 números visualmente
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = value.match(/.{1,4}/g);
        if (formatted) {
            e.target.value = formatted.join(' ');
        }
    });
});