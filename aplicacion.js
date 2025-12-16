import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

    //Airtable configuracion

    const airtableToken = AIRTABLE_TOKEN;
    const baseID = BASE_ID;
    const tableName = TABLE_NAME;
    const airtableUrl = `https://api.airtable.com/v0/${baseID}/${tableName}`;

    // ========================================
    // FUNCIONES PARA LA BOLSA PARA PANTALLA PRINCIPAL Y DE PRODUCTO (index.html) Y PRODUCTO (producto.html)
    // ========================================
    
    // Recupera la bolsa de compras desde localStorage. Obtiene el valor almacenado en 'cart' y lo parsea como JSON. y try/catch por si el JSON esta mal formado para siempre devolver un array valido.
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    // Guarda la bolsa de compras en localStorage. Convierte el array 'cart' a una cadena JSON y lo almacena en 'cart'. Luego llama a renderCartCount para actualizar el contador del carrito.
    function saveCart(cart) { // Guarda el carrito en localStorage y actualiza el contador del carrito. En CRUD esta funcion es C de Create y U de Update
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartCount();
    }

    // Agrega un producto a la bolsa de compras. Busca el producto por su ID en la lista de productos (array anterior). Si ya existe en la bolsa, incrementa su cantidad, si no, se hace push de uno nuevo y lo agrega con cantidad 1.
    function addToCart(productId) {
        const producto = products.find(p => p.id === Number(productId));
        if (!producto) return;
        const cart = getCart();
        const existing = cart.find(i => i.id === producto.id); // buscar por id
        if (existing) {
            existing.qty += 1; // lo agrega si no existe
        } else {
            cart.push({ id: producto.id, name: producto.name, price: producto.price, image: producto.image, qty: 1 }); // agregar nuevo producto con cantidad 1 si "existing" no lo encuentra
        }
        saveCart(cart); //
    }

    // Calcula la cantidad total de items en la bolsa de compras sumando las cantidades de cada item para mostrar el numero en el badge del carrito
    function getCartTotalQuantity() {
        return getCart().reduce((acc, it) => acc + (it.qty || 0), 0);
    }

    // Actualiza el contador del carrito en la interfaz. Busca el elemento con id 'cart-count' y actualiza su texto y visibilidad según la cantidad total de items en la bolsa.
    function renderCartCount() {
        const cartCountBadge = document.getElementById('cart-count');  // obtener el elemento del contador del carrito
        if (!cartCountBadge) return;
        const total = getCartTotalQuantity(); // obtiene la cantidad total de items en el carrito
        cartCountBadge.innerText = total > 0 ? total : ''; // si es mayor a 0 muestra el numero en el badge del carrito, sino vacio
        cartCountBadge.style.display = total > 0 ? 'inline-block' : 'none'; // si es mayor muestra el estilo inline-block, sino nada
    }

    // por si hay cambios en el carrito desde otra pestaña
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') renderCartCount();
        if (e.key === 'favorites') updateFavoriteButtons();
    });

    // ========================================
    // FUNCIONES PARA GESTIONAR FAVORITOS
    // ========================================

    // Recupera los favoritos desde localStorage. Obtiene el valor almacenado en 'favorites' y lo parsea como JSON. y try/catch por si el JSON esta mal formado para siempre devolver un array valido.
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
    function addToFavorites(product) {
        const favorites = getFavorites();
        const itemKey = product.recordId || String(product.id);
        const isFavorited = favorites.some(fav => 
            (fav.recordId && fav.recordId === itemKey) || (String(fav.id) === itemKey) // verifica si ya esta en favoritos
        );

        // utiliza el if para ver si ya está en favoritos, lo elimina; si no, lo agrega. 
        if (isFavorited) {
            // Eliminar de favoritos si se encuentra seleccionado como favorito y se vuelve a clickear
            const filtered = favorites.filter(fav => {
                const favKey = fav.recordId || String(fav.id);
                return favKey !== itemKey;
            });
            saveFavorites(filtered);
        } else {
            // Si no, lo agrega a favoritos. El push realiza un nuevo favorito con los datos del producto
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
        // Actualiza los botones de favoritos en la interfaz
        updateFavoriteButtons();
    }

    // funcion para verificar si un producto está en favoritos
    function isFavorited(product) {
        const favorites = getFavorites();
        const itemKey = product.recordId || String(product.id);
        return favorites.some(fav => 
            (fav.recordId && fav.recordId === itemKey) || (String(fav.id) === itemKey) // verifica si ya esta en favoritos mediante id
        );
    }

    // actualiza el estado de los botones de favoritos en la interfaz. Recorre todos los botones de favoritos y actualiza su apariencia según si el producto está en favoritos o no
    function updateFavoriteButtons() {
        document.querySelectorAll('.product-favorite-btn').forEach(btn => {
            const productId = btn.dataset.productId;
            const stored = JSON.parse(localStorage.getItem('productsAirtable') || '[]');
            const product = stored.find(p => p.recordId === productId); // buscar producto en productsAirtable por recordId
            if (product && isFavorited(product)) {
                btn.classList.add('is-favorited');
                btn.innerHTML = '<span class="material-symbols-outlined" style="color:#FEFEFF;">favorite</span>'; //estilo de relleno de favorito
            } else {
                btn.classList.remove('is-favorited');
                btn.innerHTML = '<span class="material-symbols-outlined">favorite</span>'; //estilo de no relleno de favorito
            }
        });
    }

    // ========================================
    // AIRTABLE y RENDERIZADO DE PRODUCTOS
    // ========================================

    document.addEventListener('DOMContentLoaded', () => {
        const productContainer = document.querySelector('.product-section');
        if (!productContainer) console.warn('No existe .product-section en el DOM');

        // Variables para filtrado y búsqueda
        let listProducts = []; // se llenará un array con productos de Airtable
        const currentFilters = { text: '', category: '', brands: [] };

        // Setup buscador
        const inputSearch = document.getElementById('input-search-products');
        if (inputSearch) {
            inputSearch.addEventListener('keyup', (event) => {
                currentFilters.text = event.target.value.toLowerCase();
                renderProducts(filterProducts());
            });
        }

        // función para filtrar productos según filtros actuales, esto lo utiliza el buscador y los filtros de categoría
        function filterProducts() {
            const filteredByCategoryAndText = listProducts.filter(product =>
                product.name.toLowerCase().includes(currentFilters.text) &&
                (currentFilters.category === '' || product.category.toLowerCase() === currentFilters.category)
            );

            if (currentFilters.brands.length === 0) {
                return filteredByCategoryAndText;
            }

            const finalList = filteredByCategoryAndText.filter(product => { // lista final filtrada por marcas
                const productBrand = (product.brand || '').trim().toLowerCase(); // limpia los espacios y pasa a minusculas
                return currentFilters.brands.includes(productBrand); // verifica si la marca del producto está en las marcas seleccionadas
            });
            return finalList;
        }

        // setup filtros de categoria barra superior (hombre, mujer, unisex, marcas)
        const categoryFilters = document.querySelectorAll('#perfumes-mujer, #perfumes-hombre, #unisex, #marcas');
        const perfumesMujerBtn = document.getElementById('perfumes-mujer');
        const perfumesHombreBtn = document.getElementById('perfumes-hombre');
        const unisexBtn = document.getElementById('unisex');
        if (categoryFilters) {
            perfumesMujerBtn && perfumesMujerBtn.addEventListener('click', () => {
                currentFilters.category = 'mujer';
                renderProducts(filterProducts());
            });
            perfumesHombreBtn && perfumesHombreBtn.addEventListener('click', () => {
                currentFilters.category = 'hombre';
                renderProducts(filterProducts());
            });
            unisexBtn && unisexBtn.addEventListener('click', () => {
                currentFilters.category = 'unisex';
                renderProducts(filterProducts());
            });
        }


        //*********** setup filtros de categoria menu de filtros izquierdo (marcas)************//
        const brandFilters = document.querySelectorAll('.filtro-marca input[name="marca"]'); // selecciona todas las marcas de la categoria .filtro-marca

        function marcaCheckbox() {      // función para manejar el cambio en los checkboxes de marca
            const selectedBrands = Array.from(brandFilters) // array para guardar las marcas seleccionadas en checkboxes
                .filter(checkbox => checkbox.checked) // filtra solo las marcas que están seleccionadas en checkbox
                .map(checkbox => checkbox.value.toLowerCase()); // mapea los valores de las marcas seleccionadas a minúsculas
            currentFilters.brands = selectedBrands; // actualiza los filtros actuales con las marcas seleccionadas
            renderProducts(filterProducts()); //trae los productos filtrados y los renderiza
        }

        if (brandFilters.length > 0) {  // verifica que haya checkboxes de marca
            brandFilters.forEach(checkbox => { // agrega un event listener a cada checkbox de marca
                checkbox.addEventListener('change', marcaCheckbox); // llama a marcaCheckbox cuando cambia el estado del checkbox
            });
        } else {
            console.warn('No se encontraron productos para el filtro seleccionado. Por favor, intente con otro.'); // advertencia si no hay checkboxes de marca
        }





        // Catalogo de productos desde mi api de Airtable mediante fetch
        // el async lo que hace es avisar que la función es asíncrona y que va a haber esperas dentro de la función
        async function getProductsFromAirtable() { // realiza una función asíncrona para obtener los productos desde Airtable
            try {
                const response = await fetch(airtableUrl, {     // await para esperar la respuesta de fetch antes de continuar
                    headers: {
                        'Authorization': `Bearer ${airtableToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                // manejo de errores de fetch para la llamada a Airtable
                if (!response.ok) {
                    const text = await response.text(); // obtener el texto de la respuesta para más detalles del error
                    console.error('Airtable responded with', response.status, text);
                    productContainer && (productContainer.innerHTML = '<p>Error cargando productos. Por favor intente de nuevo mas tarde</p>'); // muestra mensaje de error en la página. Si falla, salta al catch
                    return;
                }

                const data = await response.json();  // si la respuesta desde airtable es ok, parsea el JSON de la respuesta para que javaScript lo pueda interpretar

                if (!data.records) { //si no hay records en la respuesta de airtable, muestra mensaje de error
                    console.error('Respuesta de Airtable sin records', data); // muestra en consola que no hay records
                    productContainer && (productContainer.innerHTML = '<p>No hay productos disponibles para mostrar.</p>'); // muestra mensaje en la página
                    return;
                }

                // Mapeo de los productos desde Airtable al formato deseado
                const mappedProducts = data.records.map((item, idx) => { // recorre cada producto de airtable y lo mapea a un objeto producto con los campos necesarios
                    const f = item.fields || {}; // accede a los campos del producto desde airtable
                    // extraer url si el campo es un attachment
                    let image = ''; // inicia una variable vacía para las imagenes de los productos
                    const imgField = f.Img || f.Image || f.Images || f.img; // intenta obtener el campo de imagen desde varios nombres posibles
                    if (Array.isArray(imgField) && imgField.length > 0) image = imgField[0].url || imgField[0].thumbnails?.large?.url || '';  // si es un array que contiene attachments, obtiene la url del primero
                    else if (typeof imgField === 'string') image = imgField; // si es una cadena, la usa directamente como url


                    //Mapeo de campos de Airtable a objeto producto de la aplicación
                    return {
                        recordId: item.id, // id de Airtable
                        name: f.Name || f.Title || 'Sin nombre',
                        price: f.Price || f.Precio || f.price || 0,
                        image: image,
                        category: f.Category || f.Genero || '',
                        brand: f.Brand || f.Marca || f.brand || '',
                        description: f.Description || f.Descripción || f.description || ''
                    };
                });

                // Guardar en la variable listProducts los productos mapeados para que el buscador funcione
                listProducts = mappedProducts;

                // Guardar en localStorage para que producto.html lo lea
                try // usa try/catch por si hay error al guardar en localStorage
                { 
                    localStorage.setItem('productsAirtable', JSON.stringify(mappedProducts)); // guardar productos de Airtable en localStorage mediante un jSON.stringify
                } catch (e) { // si hay error, lo muestra en consola
                    console.warn('No se pudo guardar productos del API de Airtable. Por favor, intente de nuevo mas tarde.', e); // muestra advertencia en consola
                }

                // render inicial (o filtrado si hay texto en el buscador)
                renderProducts(filterProducts()); // llama a la funcion para renderizar productos filtrados

                // actualizar los botones de favoritos para mostrar cuáles están marcados
                updateFavoriteButtons();
                }
            catch (error) { // captura cualquier error en la llamada a fetch o en el procesamiento de datos por si no funciona la llamada a Airtable
            console.error('Ocurrió un error al obtener los productos desde Airtable', error);
            productContainer && (productContainer.innerHTML = '<p>Error cargando productos. Intente de nuevo más tarde.</p>');
            }
        }


        // función para renderizar productos en el contenedor para mostrar en la página principal
        function renderProducts(lista) {
            if (!productContainer) return;
            productContainer.innerHTML = '';
            lista.forEach(prod => { // recorre cada producto filtrado
                const div = document.createElement('div');
                div.className = 'product-item';
                const isFav = isFavorited(prod);
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
                        <button type="button" class="product-favorite-btn" data-product-id="${prod.recordId}" title="Agregar a favoritos">
                            <span class="material-symbols-outlined" style="color:${isFav ? 'red' : 'inherit'};">${isFav ? 'favorite' : 'favorite'}</span>
                        </button>
                        <button type="button" class="product-cart-btn" data-id="${prod.recordId}">Añadir a la bolsa</button>
                    </div>`; // crea el HTML del producto con botones de favorito y añadir al carrito
                productContainer.appendChild(div);
            });

            // Esto hace que los botones de favorito funcionen correctamente cuando se renderizan los productos y añade listeners a cada botón
            productContainer.querySelectorAll('.product-favorite-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault(); // Previene el comportamiento por defecto del botón
                    e.stopPropagation(); // Evita que el evento se propague al contenedor padre
                    const recId = e.currentTarget.dataset.productId; // obtiene el recordId del dataset del botón
                    // buscar producto en productsAirtable por recordId y añadir o eliminar de favoritos
                    const stored = JSON.parse(localStorage.getItem('productsAirtable') || '[]');
                    const product = stored.find(item => item.recordId === recId);
                    if (product) addToFavorites(product);
                });

            });

            // Esto hace que los botones de "Añadir a la bolsa" funcionen correctamente cuando se renderizan los productos y añade listeners a cada botón
            productContainer.querySelectorAll('.product-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const recId = e.currentTarget.dataset.id;
                    // buscar producto en productsAirtable por recordId y añadir al carrito
                    const stored = JSON.parse(localStorage.getItem('productsAirtable') || '[]');
                    const p = stored.find(item => item.recordId === recId);
                    if (!p) return alert('Producto no encontrado en localStorage'); // por si no encuentra el producto en localStorage
                    // usar addToCart por recordId: añadimos con recordId para identificar
                    const cart = getCart();
                    const existing = cart.find(i => i.recordId === p.recordId);
                    if (existing) existing.qty = (existing.qty || 0) + 1; // si ya está en el carrito, incrementa la cantidad
                    else cart.push({ recordId: p.recordId, name: p.name, price: p.price, image: p.image, qty: 1 });
                    saveCart(cart);

                    // Cambia el texto del botón a "¡Añadido!" para confirmar al usuario que se agregó al carrito
                    const btnBack = e.currentTarget;
                    const originalText = btnBack.textContent;
                    btnBack.textContent = '¡Añadido!';
                    btnBack.disabled = true;
                    // Después de 1.5 segundos, vuelve a cambiar el texto del botón a su estado original
                    setTimeout(() => {
                        btnBack.textContent = originalText;
                        btnBack.disabled = false;
                    }, 1500);
                });
            });
        }

        // llamada inicial para obtener productos desde Airtable
        getProductsFromAirtable();
    });



    // se deja comentario para tener track del avance realizado y tener certeza de la evolucion que se tuvo 23/11/2025
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