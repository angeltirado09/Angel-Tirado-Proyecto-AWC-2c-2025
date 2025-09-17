<!-- aun no se usa -->

const products = [
    {
        name: "Jean Paul Gaultier Le Beau Le Parfum 125ml",
        description: "Cada adicción tiene su secreto. La de este eau de parfum intenso amaderado de ámbar se cosecha en el Jardín de Gaultier. Y conjuga con audacia la poderosa virilidad de la madera de sándalo y del haba tonka, la sensualidad del ámbar gris y la frescura del jengibre y la piña.",
        image: "https://http2.mlstatic.com/D_NQ_NP_2X_790143-MLA70673937702_072023-F.webp",
        price: 177600 // Quita el signo $, solo debe ser número
    },
    {
        name: "Versace Dylan Blue Pour Homme EDT 100ML",
        description: "El Versace Dylan Blue Pour Homme EDT 100ML es una fragancia intensa y cautivadora que combina notas frescas y amaderadas. Su aroma es perfecto para el hombre moderno que busca dejar una impresión duradera.",
        image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/1/1/117212-b-dylan-blue-pour-homme-edt_1_1.jpg",
        price: 196000
    },
    {
        name: "Davidoff Cool Water 125ml",
        description: "Davidoff Cool Water es una fragancia fresca y acuática que evoca la sensación de libertad y aventura. Con notas de menta, lavanda y sándalo, es perfecta para el hombre moderno que busca un aroma distintivo.",
        image: "https://d3cdlnm7te7ky2.cloudfront.net/media/catalog/product/cache/1f1b8d9a1b49678555bea203c2f52e39/r/v/rv15099-b_1.jpg",
        price: 96000
    }
]; //array de objetos

const grid = document.querySelector('.productos'); //grid de productos

function createProductCard(product) {
    const card = document.createElement('article');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.style.width = "300px";
    img.style.height = "auto";
    img.style.objectFit = "contain";
    // Esto mantiene la proporción y evita distorsión de las imagenes de los productos

    const title = document.createElement('h3');
    title.textContent = product.name;

    const description = document.createElement('p');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;

    const button = document.createElement('button');
    button.textContent = 'Comprar';

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(price);
    card.appendChild(button);

    return card;
} //funcion que crea la tarjeta del producto

products.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card);
}); //for each que recorre la variable products y crea una tarjeta por cada producto

const cotizacion = document.querySelector('.cotizacion'); // Selecciona la sección de cotización

// Crea la tabla de cotización y la agrega al DOM
function crearTablaCotizacion() {
    if (!cotizacion) return;
    const table = document.createElement('table');
    table.innerHTML = `
        <caption>¡Aceptamos pagos en divisas! esta es la cotización:</caption>
        <tr>
            <th>Divisa</th>
            <th>Precio</th>
        </tr>
        <tr>
            <td>Dólar</td>
            <td>$0</td>
        </tr>
        <tr>
            <td>Euro</td>
            <td>$0</td>
        </tr>
        <tr>
            <td>Real</td>
            <td>$0</td>
        </tr>
    `;
    cotizacion.appendChild(table);
}

// Ejemplo: actualizar los valores de la tabla de cotización
function actualizarCotizacion(nuevosValores) {
    // nuevosValores es un objeto: { Dólar: 1200, Euro: 1300, Real: 183 }
    const filas = cotizacion.querySelectorAll('tr');
    filas.forEach(fila => {
        const celdaDivisa = fila.children[0];
        const celdaPrecio = fila.children[1];
        if (celdaDivisa && celdaPrecio && nuevosValores[celdaDivisa.textContent]) {
            celdaPrecio.textContent = `$${nuevosValores[celdaDivisa.textContent]}`;
        }
    });
}

// Obtener cotizaciones reales usando una API pública alternativa
async function fetchCotizaciones() {
    try {
        // Usamos una API alternativa gratuita y pública
        const response = await fetch('https://open.er-api.com/v6/latest/ARS');
        const data = await response.json();
        // Verificamos que la respuesta sea exitosa
        if (data.result === "success") {
            // Calculamos cuántos ARS es 1 unidad de cada moneda extranjera
            const cotizaciones = {
                Dólar: (1 / data.rates.USD).toFixed(2),
                Euro: (1 / data.rates.EUR).toFixed(2),
                Real: (1 / data.rates.BRL).toFixed(2)
            };
            actualizarCotizacion(cotizaciones);
        } else {
            console.error('Error en la respuesta de la API:', data);
        }
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
    }
}

// Llama a la función crearTablaCotizacion para crear la tabla antes de actualizar los valores
crearTablaCotizacion();
// Llama a la función fetchCotizaciones si existe .cotizacion
if (cotizacion) {
    fetchCotizaciones();
}