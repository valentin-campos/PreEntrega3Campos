
//
class Producto {
    constructor(id, nombre, precio, categoria, imagen){
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
    }
}

class BaseDeDatos {
    constructor(){
        // ARRAY para el catalogo de producto
        this.productos =[];
        // Empezar a cargar productos
        this.agregarRegistro(1, "Oppenheimer", 800, "Pelicula", "oppenheimer.webp")
        this.agregarRegistro(2, "Batman", 800, "Pelicula", "batman.webp")
        this.agregarRegistro(3, "La momia ", 800, "Pelicula", "laMomia.webp")
        this.agregarRegistro(4, "Star Wars", 800, "Pelicula", "starwars.webp")
        this.agregarRegistro(5, "The Office", 500, "Serie", "theOffice.webp")
        this.agregarRegistro(6, "Peaky Blinders", 500, "Serie", "peakyBlinders.webp")
        
    }


    // Metodo que crea el objeto producto y lo almacena en el catalogo (array)
    agregarRegistro(id, nombre, precio, categoria, imagen){
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }

    // Nos devuelve el catalogo de productos
    traerRegistros() {
        return this.productos;
    }
    
    // Nos devuelve un producto segun el Id
    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id); 
    }
    
    // Nos devuelve un array con todas las coincidencia que encuentre  segun la busqueda
    //toLowerCase() hace la palabra en minuscula 
    registrosPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    }  
}


class Carrito {
    constructor() {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        //
        this.carrito = carritoStorage ||  [];
        this.total = 0; // Suma total de los precios a pagar
        this.cantidadProductos = 0; // Cantidad de productos en el carrito 
        this.listar();
    }

    // 
    estaEnCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
    }

    // Agregar al carrito
    agregar(producto) {
        const productoEnCarrito = this.estaEnCarrito(producto);

        if (!productoEnCarrito) {
            this.carrito.push({ ...producto, cantidad: 1});
        } else {
            productoEnCarrito.cantidad++;
        }
        // Actualizo el storage
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        // 
        this.listar();
    }

    // Quitar del carrito
    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        // Actualizo el storage
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        //
        this.listar();
    }    

    // Renderiza todos los productos en el HTML
    listar() {
        // Reiniciamos variables
        this.total = 0
        this.cantidadProductos = 0;
        divCarrito.innerHTML = "";

        for (const producto of this.carrito) {
            divCarrito.innerHTML += `
            <div class="productoCarrito">
                <h2>${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
            </div>
            `;
            // Actualizamos los totales
            this.total += producto.precio * producto.cantidad;
            this.cantidadProductos += producto.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");

        for (const boton of botonesQuitar) {
            boton.addEventListener("click", (event) => {
                event.preventDefault();
                const idProducto = Number(boton.dataset.id);
                this.quitar(idProducto);
            });
        }

        spanCantidadProductos.innerText = this.cantidadProductos;
        spanTotalCarrito.innerText = this.total;
    }
}

//
const bd = new BaseDeDatos();

// Elementos
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const inputBuscar = document.querySelector("#inputBuscar");

// Instaciamos la clase carrito
const carrito = new Carrito();


//
cargarProductos(bd.traerRegistros());


function cargarProductos(productos) {
    // Vaciaños el div
    divProductos.innerHTML = ""
    //
    for (const producto of productos) {
        divProductos.innerHTML += `
            <div class="producto">
                <h2 class="nombre">${producto.nombre}</h2>
                <p class="precio">$${producto.precio}</p>
                <div class"imagen">
                    <img src="img/${producto.imagen}" />
                </div>
                <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
            </div>
        `
    }

    // Lista dinamica con todos los botones que tenga el catalogo
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            //Guardo el dataset ID
            const idProducto = Number(boton.dataset.id);
            // Uso
            const producto = bd.registroPorId(idProducto);
            //
            carrito.agregar(producto);
        })
    }
}

// Buscador

inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra);
    cargarProductos(productos);
});
