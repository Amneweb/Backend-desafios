const objeto = {};
for (let i = 1; i <= 10000; i++) {
  let numero = Math.floor(Math.random() * 20 + 1);
  console.log(numero);
  objeto[numero] = objeto[numero] ? objeto[numero] + 1 : 1;
}
console.log(objeto);
