document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {id: 1, name: "Jean Paul Gaultier Le Beau Le Parfum 125ml", price: 177600, image: "https://http2.mlstatic.com/D_NQ_NP_2X_790143-MLA70673937702_072023-F.webp", brand: "Jean Paul Gaultier", description: "Descubre la nueva intensidad masculina de Jean Paul Gaultier, Le Beau Le Parfum. Una fragancia que te sumerge en un jardín de tentación y seducción. Con notas de madera de sándalo y haba tonka, combinadas con la sensualidad del ámbar gris, este Eau de Parfum Intense es la esencia del hombre irresistible."},
        {id: 2, name: "One Million Elixir 100ml", price: 176400, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/4/142880-a-one-million-elixir-parfum-intense-200ml.jpg", brand: "Paco Rabanne", description: "One Million Elixir, más rico e intenso que nunca. Una mezcla de rosa de Damasco, osmanto y haba tonka silvestre que crea una composición magistral e inolvidable."},
        {id: 3, name: "Versace Dylan Blue Pour Homme 100ml", price: 196000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/r/v/rv139283.jpg", brand: "Versace", description: "Una fragancia fougère, amaderada y aromática. Altamente distintiva con un aroma de bergamota, pomelo y hojas de higuera. Una expresión de fuerza y carisma."},
        {id: 4, name: "Stronger With You Intensely For Him EDP 100ml", price: 289000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/2/125747-a-stronger-with-you-intensely-for-him-edp-100ml.jpg", brand: "Emporio Armani", description: "Un perfume oriental amaderado con un toque de fougère que cuenta una historia de amor intenso. Notas de pimienta rosa, vainilla y un acorde de ámbar amaderado."},
        {id: 5, name: "Club de Nuit Intense Man EDT 105ml", price: 109000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/5/155114-a-club-de-nuit-intense-men-edt-105ml.jpg", brand: "Armaf", description: "Una provocativa fragancia masculina amaderada y especiada. Se abre con notas frescas de limón, manzana y grosella negra que conducen a un corazón opulento de rosa y jazmín."},
        {id: 6, name: "Dior Sauvage Elixir 100ml", price: 482000, image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/4/147916-a-sauvage-elixir-100ml.jpg", brand: "Dior", description: "Un licor extraordinariamente concentrado, con un corazón de especias, una esencia de lavanda a medida y una mezcla de maderas licorosas que forman la firma de su estela potente y cautivadora."},
        {id: 7, name: "Lattafa Asad Bourbon 100ml", price: 78000, image: "https://perfumeschile.cl/cdn/shop/files/Lattafa-Asad-Bourbon-EDP-100ML-Hombre.png?v=1738956960&width=1500", brand: "Lattafa", description: "Una fragancia que evoca la calidez y la riqueza del bourbon, con notas especiadas y amaderadas. Perfecta para el hombre que busca un aroma único y memorable."},
        {id: 8, name: "Versace The Dreamer 100ml", price: 72000, image: "https://www.infoparfum.ro/wp-content/uploads/2016/08/versace-the-dreamer-e1472019454983.jpg", brand: "Versace", description: "Una fragancia atemporal y romántica. Notas de enebro, estragón y artemisia abren paso a un corazón de ámbar, lirio y flor de lino, sobre una base de flor de tabaco."},
        {id: 9, name: "Lattafa Khamrah Qahwa 100ml", price: 65000, image: "https://perfume-malaysia.com/wp-content/uploads/2024/08/khamrah-qahwa.jpg", brand: "Lattafa", description: "Una versión intensa y adictiva con un toque de café arábigo. Combina la calidez del Khamrah original con la energía del cardamomo y el praliné, creando una estela gourmand inolvidable."}
    ];

    // Lógica del Carrito pero para el boton añadir a la bolsa dentro de la pagina producto
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

    function renderCartCount() {
        const cartCountBadge = document.getElementById('cart-count');
        if (!cartCountBadge) return;
        const total = getCartTotalQuantity();
        cartCountBadge.innerText = total > 0 ? total : '';
        cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none';
    }

    // Lógica de la Página del Producto

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);
    const airtableId = urlParams.get('airtableId');

    // Si viene airtableId buscamos en localStorage productsAirtable (guardados por aplicacion.js)
    let product = null;
    let productFromAirtable = false;
    if (airtableId) {
        try {
            const stored = JSON.parse(localStorage.getItem('productsAirtable') || '[]');
            product = stored.find(p => p.recordId === airtableId) || null;
            if (product) productFromAirtable = true;
        } catch (e) {
            console.warn('No se pudo leer productsAirtable desde localStorage', e);
        }
    }

    if (!product && !isNaN(productId)) {
        product = products.find(p => p.id === productId) || null;
    }

    if (product) {
        document.title = `${product.name} - La Esencia`;

        const productImage = document.querySelector('.producto-imagen img');
        const productName = document.querySelector('.producto-nombre');
        const productBrand = document.querySelector('.producto-marca');
        const productPrice = document.querySelector('.producto-precio');
        const productInstallments = document.querySelector('.producto-cuotas');
        const productDescription = document.querySelector('.producto-descripcion p');
        const addButton = document.querySelector('.boton-anadir');

        productImage.src = product.image || '';
        productImage.alt = product.name || '';
        productName.textContent = product.name || '';
        productBrand.textContent = product.brand || product.category || '';
        productPrice.textContent = `$${(product.price || 0).toLocaleString('es-AR')}`;
        productInstallments.textContent = `6 cuotas sin interés de $${((product.price || 0) / 6).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        productDescription.textContent = product.description || '';

        // funcionalidad del botón añadir a la bolsa
        if (addButton) {
            addButton.addEventListener('click', () => {
                // Si el producto vino desde Airtable, añadimos usando recordId al carrito
                if (productFromAirtable && product.recordId) {
                    const cart = getCart();
                    const existing = cart.find(i => i.recordId === product.recordId);
                    if (existing) existing.qty = (existing.qty || 0) + 1;
                    else cart.push({ recordId: product.recordId, name: product.name, price: product.price, image: product.image, qty: 1 });
                    saveCart(cart);
                } else {
                    addToCart(product.id);
                }
                // cambia a añadido cuando agregás el producto
                const originalText = addButton.textContent;
                addButton.textContent = '¡Añadido!';
                addButton.disabled = true;
                setTimeout(() => {
                    addButton.textContent = originalText;
                    addButton.disabled = false;
                }, 1500);
            });
        }

    } else {
        const productContainer = document.querySelector('.producto-main');
        productContainer.innerHTML = '<h1>Producto no encontrado</h1><p>El producto que buscas no existe o fue removido. <a href="index.html">Volver a la página principal</a>.</p>';
    }

    // inicio
    renderCartCount();
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            renderCartCount();
        }
    });
});
