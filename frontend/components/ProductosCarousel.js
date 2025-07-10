import { useState } from 'react';

const productos = [
  {
    imagen: '/img/D_NQ_NP_2X_778641-MLA79208699873_092024-F.png',
    titulo: 'Quantum Farmer J280 Evo Mint'
  },
  {
    imagen: '/img/proxy.png',
    titulo: 'Puffco Proxy'
  },
  {
    imagen: '/img/onyx_0003_Peak-Onyx-3Quarters-Left.webp',
    titulo: 'Puffco Peak'
  },
  {
    imagen: '/img/D_NQ_NP_2X_930944-MLA70242909253_062023-F.webp',
    titulo: 'Prensa Extracción Rosin'
  },
  {
    imagen: '/img/gotas sublinguales.png',
    titulo: 'Aceite CBD 5%'
  }
];

export default function ProductosCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % productos.length);
  const prev = () => setIndex((index - 1 + productos.length) % productos.length);

  const producto = productos[index];

  return (
    <section id="productos" className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Productos</h2>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prev} className="p-2 border">&#10094;</button>
        <div className="product-card p-4 border rounded w-60">
          <div className="product-image mb-2">
            <img src={producto.imagen} alt={producto.titulo} className="mx-auto" />
          </div>
          <h3 className="font-semibold text-sm">{producto.titulo}</h3>
          <div className="consultar-btn mt-2 border rounded">
            <a href="https://wa.me/+5491126717729">Consultar</a>
          </div>
        </div>
        <button onClick={next} className="p-2 border">&#10095;</button>
      </div>
    </section>
  );
}