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

    function mostrarProductos(listaDeProductos) {
        productContainer.innerHTML = '';

        listaDeProductos.forEach(producto => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("product-item");

            productoDiv.innerHTML = `
                <a href="./producto.html">
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
    }

    mostrarProductos(products);
    
    const botones = document.querySelectorAll('.product-actions button');
    botones.forEach(boton => {
        boton.addEventListener('click', (evento) => {
            evento.preventDefault();
            evento.stopPropagation(); // evita que el click burbujee al <a>
            const productoName = evento.target.parentElement.parentElement.querySelector('.product-text p').innerText;
            alert(`Añadiste ${productoName} a la bolsa.`);
        });
    });
});
// ...existing code...