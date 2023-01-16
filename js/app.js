//variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProductos = document.querySelector('#lista-productos');
let articulosCarrito =[];

//eventlisteners
cargarEventListeners();
function cargarEventListeners(){
    //Agregar un producto al carrito
    listaProductos.addEventListener('click', agregarProducto);
    //Elimina productos del carrito
    carrito.addEventListener('click',eliminarProducto);
    //Mostrar productos de local Storage
    document.addEventListener('DOMContentLoaded',()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })
    //Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click',()=>{
        articulosCarrito = [];//reset al arreglo
        limpiarHTML();// se elimina todo el HTML
    })

}

//funciones
function agregarProducto(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const productoSeleccionado = e.target.parentElement.parentElement; //accediendo a los elementos
        leerDatosProducto(productoSeleccionado);
    }
}

function eliminarProducto(e){
    console.log(e.target.classList);
    if(e.target.classList.contains('borrar-producto')){
        const productoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(producto =>producto.id !==productoId);
        carritoHTML(); //Iteramos sobre el carrito
    }
}
//Extraer informacion del producto
function leerDatosProducto(producto){
    //console.log(producto)

    //objeto para extraer las propiedades del producto
    const infoProducto ={
        imagen: producto.querySelector('img').src,
        titulo: producto.querySelector('h4').textContent,
        precio: producto.querySelector('.precio span').textContent,
        id: producto.querySelector('a').getAttribute('data-id'),
        cantidad:1
    }

    // Revisar si ya existe el elemento en el carrito
    const existe = articulosCarrito.some(producto=> producto.id === infoProducto.id );
    if (existe){
        //Actualizamos solo cantidad
        const productos = articulosCarrito.map (producto=>{
            if(producto.id === infoProducto.id){
                producto.cantidad++;
                return producto; //retorna el objeto actualizado
            }else{
                return producto;//retorna los objetos que no son duplicados
            }
        });
        articulosCarrito=[...productos]
    }else{
        //Agregar los elementos al carrito
        articulosCarrito = [...articulosCarrito, infoProducto];
    }


    
    console.log(articulosCarrito);
    carritoHTML();
}

//Productos para mostrar en el carrito de compras
function carritoHTML(){
    //limpiar el HTML
    limpiarHTML();

    articulosCarrito.forEach( producto =>{
        const {imagen, titulo, precio, cantidad, id} =producto;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src = "${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-producto" data-id="${id}"> X </a>
            </td>
        `;
        //Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    //Agregar al storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));
}

//Elimina los cursos del tbody para que no se encimen otros productos
function limpiarHTML(){
    
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}