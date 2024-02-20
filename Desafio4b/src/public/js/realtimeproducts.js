function formatear(amount) {
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
  return formateado;
}

const socket = io();
const productos = document.querySelector("#productos");
document.querySelector("lista.principal") &&
  document.querySelector("lista.principal").remove();
const dibujarProductos = (data) => {
  const nuevoFragmento = new DocumentFragment();
  const lista = document.createElement("ul");
  lista.classList.add("principal");
  lista.innerHTML = `<li><ul class="interna encabezado"><li>ID</li><li>Nombre</li><li>Precio</li><li>Descripción</li><li>Código</li><li>Status</li><li>Stock</li></ul></li>`;

  data.forEach((producto) => {
    const listaInterna = document.createElement("li");
    let porProducto = "";
    porProducto += `<ul class="interna">`;
    porProducto += `<li>${producto.id}</li>`;
    porProducto += `<li>${producto.title}</li>`;
    porProducto += `<li>${formatear(producto.price)}</li>`;
    porProducto += `<li>${producto.description}</li>`;
    porProducto += `<li>${producto.code}</li>`;
    porProducto += `<li>${producto.status}</li>`;
    porProducto += `<li>${producto.stock}</li>`;
    porProducto += `</ul>`;
    listaInterna.innerHTML = porProducto;
    lista.append(listaInterna);
  });
  nuevoFragmento.append(lista);
  productos.append(nuevoFragmento);
};
socket.on("infoProductos", (data) => {
  console.log("info productos provenientes del servidor", data);
  productos.innerHTML = "";
  dibujarProductos(data);
});
const formulario = document.querySelector("#agregar");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formulario);
  const nuevoProducto = Object.fromEntries([...formData]);
  console.log("nuevo producto ", nuevoProducto);

  socket.emit("nuevoProducto", nuevoProducto);
  productos.innerHTML = "";
  document
    .querySelectorAll("input:not([type='submit'])")
    .forEach((cadaInput) => (cadaInput.value = ""));
  const mostrarError = document.querySelector("#errorAgregar");
  mostrarError.innerText = "";
  socket.on("errorAgregar", (data) => {
    if (data) {
      console.log("error en cliente ", data);
      mostrarError.innerText = data;
    }
  });
});

const borrador = document.querySelector("#borrar");
borrador.addEventListener("submit", (e) => {
  e.preventDefault();

  const IDaborrar = borrador.IDproducto.value;
  console.log("a borrar ", IDaborrar);

  socket.emit("aBorrar", IDaborrar);
  const mostrarError = document.querySelector("#errorBorrar");
  mostrarError.innerText = "";
  socket.on("errormsj", (data) => {
    if (data) {
      mostrarError.innerText = data;
    }
  });
});

const modificador = document.querySelector("#modificar");
modificador.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(modificador);
  const datosModificables = Object.fromEntries([...formData]);
  const IDamodificar = datosModificables.IDproductoModificar;
  console.log("id", IDamodificar);
  const propiedad = datosModificables.propiedad;
  console.log("propiedad", propiedad);
  const valor = datosModificables.nuevoValor;
  console.log("valor ", valor);

  socket.emit("aModificar", { IDamodificar, propiedad, valor });
  const mostrarError = document.querySelector("#errorModificar");
  mostrarError.innerText = "";
  socket.on("errorModificar", (data) => {
    if (data) {
      mostrarError.innerText = data;
    }
  });
});
