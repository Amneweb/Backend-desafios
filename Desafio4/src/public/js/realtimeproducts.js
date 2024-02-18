const socket = io();

const productos = document.querySelector("#productos");
productos.innerHTML = "Hola estoy en div productos";

socket.on("infoProductos", (data) => {
  console.log("info productos", data);
  let lista = "";
  data.forEach((producto) => {
    lista += `${producto.title} - ${producto.price}<br/>`;
  });
  productos.innerHTML = lista;
});
