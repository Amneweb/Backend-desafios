//generé este array para agregar varios productos al mismo tiempo
data = [
  {
    titulo: "Remera térmica infantil",
    precio: 12000,
    codigo: "WsT017",
    stock: 10,
    descripcion:
      "Remera fabricada en tela bamboo, ideal como primera piel para usarse debajo del neoprene",
    diapositiva: "/imagenes/thumbnails/WsT017.jpg",
  },
  {
    titulo: "Calza térmica infantil",
    precio: 12600,
    codigo: "WsT018",
    stock: 5,
    descripcion:
      "Calza larga fabricada en tela bamboo, ideal como primera piel para usarse debajo del neoprene",
    diapositiva: "/imagenes/thumbnails/WsT018.jpg",
  },
  {
    titulo: "Chaqueta náutica respirable Thermoskin",
    precio: 96000,
    codigo: "Ws4019",
    stock: 11,
    descripcion:
      "Chaqueta fabricada en tela impermeable y respirable, con puños y cintura de neoprene",
    diapositiva: "/imagenes/thumbnails/Ws4019.jpg",
  },
  {
    titulo: "Remera térmica infantil",
    precio: 12000,
    codigo: "WsT017",
    stock: 10,
    descripcion:
      "Remera fabricada en tela bamboo, ideal como primera piel para usarse debajo del neoprene",
    diapositiva: "/imagenes/thumbnails/WsT017.jpg",
  },
  {
    titulo: "Anteojos polarizados ringless",
    precio: 54000,
    codigo: "UND1054",
    stock: 3,
    descripcion: "Anteojos con marco superior, lentes polarizados y espejados.",
    diapositiva: "/imagenes/thumbnails/UND1054.jpg",
  },
  {
    titulo: "Anteojos protección UV marco cuadrado, espejados",
    codigo: "UND1050",
    stock: 2,
    descripcion: "Anteojos con marco cuadrado, casi planos, sin curvatura.",
    diapositiva: "/imagenes/thumbnails/UND1050.jpg",
  },
];
// creamos una clase para los productos
class Producto {
  constructor(title, price, code, stock, description, thumb) {
    this.title = title;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.description = description;
    this.thumb = thumb;
  }
}

class ProductManager {
  #productos;
  #productosRutaDirectorio;
  #productosRutaArchivo;
  #fs;

  constructor() {
    this.#productos = [];
    this.#productosRutaDirectorio = "archivos";
    this.#productosRutaArchivo =
      this.#productosRutaDirectorio + "/productos.json";
    this.#fs = require("fs");
  }
  /* Método Crear directorio y verificar existencia de archivo
   *
   *
   */
  createDir = async () => {
    console.log("==En función createDir===\n\n");

    try {
      await this.#fs.promises.mkdir(this.#productosRutaDirectorio, {
        recursive: true,
      });
      if (!this.#fs.existsSync(this.#productosRutaArchivo)) {
        console.log("el archivo no existe => se crea vacío");
        await this.#fs.promises.writeFile(this.#productosRutaArchivo, "[]");
      }
    } catch (error) {
      console.log("error creando directorio y archivo", error);
      throw ("error creando directorio y archivo", error);
    } finally {
      console.log("==termina funcion de crear archivo==\n\n");
    }
  };

  /* Método Add Products: agrega productos al archivo
   *
   *
   */
  addProduct = async (title, price, code, stock, description, thumb) => {
    console.log("=== Empieza la función AddProduct===\n\n");
    //verifico si tiene todos los datos. Si no los tiene interrumpe el proceso
    if (!title || !price || !code || !stock || !description || !thumb) {
      return console.log(
        `Al producto con nombre ${title} le faltan uno o más datos y no será agregado \n`
      );
    }
    //creo el producto nuevo con la clase Producto
    let productoNuevo = new Producto(
      title,
      price,
      code,
      stock,
      description,
      thumb
    );
    console.log("Se creará un producto nuevo: ", productoNuevo, "\n\n");
    try {
      await this.getProducts();

      if (
        this.#productos.find(
          (cadaproducto) => cadaproducto.code === productoNuevo.code
        )
      ) {
        return console.log(
          `El producto con código ${productoNuevo.code} ya está en el archivo y no será agregado\n`
        );
      } else {
        let maxID = 0;
        //busco el máximo id para generar un ID nuevo (la opción con length deja de funcionar cuando borro productos porque (length + 1) pasa a ser menor que el máximo id que se había generado antes de borrar los productos)
        if (this.#productos.length > 0) {
          const arrayDeID = this.#productos.map((producto) => producto.id);
          maxID =
            arrayDeID.length > 1
              ? arrayDeID.reduce((a, b) => Math.max(a, b))
              : arrayDeID[0];
        }
        this.#productos.push({
          ...productoNuevo,
          id: maxID + 1,
        });

        console.log("Lista actualizada de productos: ");
        console.log(this.#productos);

        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        console.log(
          `El producto con código ${productoNuevo.code} fue agregado con éxito\n\n`
        );
      }
    } catch (error) {
      console.error(
        `Error creando el producto nuevo: ${JSON.stringify(
          productoNuevo
        )}, detalle del error: ${error}`
      );
      throw Error(
        `Error creando producto nuevo: ${JSON.stringify(
          productoNuevo
        )}, detalle del error: ${error}`
      );
    } finally {
      console.log("===Finaliza función add products===\n\n");
    }
  };
  /* Método getProducts: Leer archivo y obtener productos
   *
   *
   */
  getProducts = async () => {
    try {
      console.log("===Empieza funcion getProducts===\n\n");
      await this.createDir();
      let productosLeidos = await this.#fs.promises.readFile(
        this.#productosRutaArchivo,
        "utf-8"
      );
      this.#productos = JSON.parse(productosLeidos);

      console.log("productos Leidos y parseados: ", this.#productos);
      return this.#productos;
    } catch (error) {
      console.error(
        `Dentro de getProducts: Error leyendo los productos, detalle del error: ${error}`
      );
      throw Error(
        `Dentro de getProducts: Error leyendo los productos, detalle del error: ${error}`
      );
    }
  };
  /* Método getProductByID: Leer archivo y ver si existe producto con determinado id
   *
   *
   */
  getProductByID = async (id) => {
    try {
      await this.getProducts();

      const productoEncontrado = this.#productos.find(
        (cadaproducto) => cadaproducto.id === id
      );
      productoEncontrado
        ? console.log(
            "El producto encontrado con id: ",
            id,
            " es el siguiente: ",
            productoEncontrado
          )
        : console.log("No se encontró el producto con el id ", id);

      return productoEncontrado;
    } catch (error) {
      console.error(
        `Error leyendo los productos en get product by id, detalle del error: ${error}`
      );
      throw Error(
        `Error leyendo los productos en get product by id, detalle del error: ${error}`
      );
    } finally {
      console.log("===Fin get product by id===\n\n");
    }
  };

  /* Método deleteProductByID: Borrar producto con un id determinado
   *
   *
   */
  deleteProductByID = async (id) => {
    try {
      console.log("===Empieza función delete===\n\n");
      const productoAborrar = await this.getProductByID(id);
      if (productoAborrar) {
        this.#productos.splice(this.#productos.indexOf(productoAborrar), 1);
        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        console.log(`El producto con id ${id} fue borrado con éxito\n\n`);
        console.log(
          "el nuevo archivo de productos es el siguiente: ",
          this.#productos
        );
      } else {
        console.log("no existe el id indicado");
      }
    } catch (error) {
      console.log(
        `error al tratar de borrar el producto, detalle del error: ${error}`
      );
    } finally {
      console.log("===Fin de la función para borrar===");
    }
  };

  /* Método updateProductByID: Modificar producto con un id determinado
   *
   *
   */
  updateProductByID = async (id, propiedad, nuevoValor) => {
    try {
      console.log("===Empieza función update===\n\n");
      const productoAmodificar = await this.getProductByID(id);
      console.log("Producto a modificar ", productoAmodificar);
      if (productoAmodificar) {
        const indice = this.#productos.indexOf(productoAmodificar);
        this.#productos[indice][propiedad] = nuevoValor;
        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        console.log(`El producto con id ${id} fue modificado con éxito\n\n`);
        console.log(
          "el nuevo archivo de productos es el siguiente: ",
          this.#productos
        );
      } else {
        console.log("no existe el id indicado");
      }
    } catch (error) {
      console.log(
        `error al tratar de modificar el producto, detalle del error: ${error}`
      );
    } finally {
      console.log("===Fin de la función para modificar===");
    }
  };
}

let productManager = new ProductManager();
console.log(productManager);

let manejoDeProductos = async () => {
  //agrego un solo producto
  try {
    await productManager.addProduct(
      "Chaleco Salvavidas Zhik",
      120000,
      "PFD20",
      30,
      "Chaleco con espuma de celda cerrada",
      "imagenes/thumbnails/PFD20.jpg"
    );

    let productos = await productManager.getProducts();
    console.log(
      `Productos encontrados en Product Manager: ${productos.length}`
    );
    console.log(productos);
    //agrego muchos productos juntos
    console.log("===Agrego productos desde el array de datos: data ===\n\n");

    for (const producto of data) {
      await productManager.addProduct(...Object.values(producto));
    }
    console.log("===Termino de agregar productos desde array===\n\n");
    //busqueda por ID
    console.log("===Busco productos por id===\n\n");
    const id1 = 4;
    const id2 = "amneris";
    await productManager.getProductByID(id1); //existe
    await productManager.getProductByID(id2); //no existe
    //borrado de productos
    console.log("===Borrando producto por id===\n\n");
    await productManager.deleteProductByID(2);
    //modificación de productos
    console.log("===Modificando producto por id===\n\n");
    await productManager.updateProductByID(3, "stock", 30);
  } catch (error) {
    console.log("error al correr el programa");
  }
};
manejoDeProductos();
