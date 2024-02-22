function formatear(amount) {
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
  return formateado;
}

const socket = io();
const productos = document.querySelector("#productos");
const dibujarProductos = (data) => {
  let inner = "";
  inner += `<ul class="principal"><li><ul class="interna encabezado"><li>ID</li><li>Nombre</li><li>Precio</li><li>Descripción</li><li>Código</li><li>Status</li><li>Stock</li></ul></li>`;

  data.forEach((producto) => {
    inner += `<ul class="interna">`;
    inner += `<li>${producto.id}</li>`;
    inner += `<li>${producto.title}</li>`;
    inner += `<li>${formatear(producto.price)}</li>`;
    inner += `<li>${producto.description}</li>`;
    inner += `<li>${producto.code}</li>`;
    inner += `<li>${producto.status}</li>`;
    inner += `<li>${producto.stock}</li>`;
    inner += `</ul>`;
  });
  inner += `</ul>`;

  productos.innerHTML = inner;
};
socket.on("infoProductos", (data) => {
  console.log("info productos provenientes del servidor", data);

  dibujarProductos(data);
  socket.emit;
});
const formulario = document.querySelector("#agregar");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(formulario);
  const nuevoProducto = Object.fromEntries([...formData]);
  console.log("nuevo producto ", nuevoProducto);

  socket.emit("nuevoProducto", nuevoProducto);

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
