import React from 'react';
import img1 from '../assets/contenido/FEM_3941.jpg';
import img2 from '../assets/contenido/photo_2025-02-12_08-13-37.jpg';

export default function SobreNosotros() {
  return (
    <section id="sobreus">
      <span className="linea"></span>
      <h2 className="section-title">Acerca de Nosotros</h2>
      <div className="sobreusdiv">
        <div className="about-card">
          <div className="about-image">
            <img src={img1} alt="Sobre ACCAMA" />
          </div>
          <div className="about-content">
            <h3>Nuestra Misión</h3>
            <p>
              Trabajamos para promover el acceso seguro y de calidad al cannabis terapéutico, y la educación sobre el cannabis en Malvinas Argentinas, fomentando la inclusión, asegurando una trazabilidad y el enfoque en nuestros pacientes como pilares fundamentales.
            </p>
          </div>
        </div>
        <div className="about-card">
          <div className="about-content">
            <h3>Nuestros Valores</h3>
            <p>
              Integrar el desarrollo de un modelo productivo autosustentable que integre a la comunidad, fomente la investigación y la educación.
            </p>
          </div>
          <div className="about-image">
            <img src={img2} alt="Valores ACCAMA" />
          </div>
        </div>
      </div>
    </section>
  );
}