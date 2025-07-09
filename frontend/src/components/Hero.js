import React from 'react';
import logo from '../assets/logo.png';
import menu from '../assets/menu-alt-2-svgrepo-com.svg';
import caduceo from '../assets/caduceo.svg';
import arrow from '../assets/down-arrow2-svgrepo-com.svg';

export default function Hero() {
  return (
    <div className="hero">
      <header>
        <div className="logo">
          <div className="accama" style={{ display: 'flex' }}>
            <h1 className="phoneh1" id="h1">ACCAMA</h1>
            <img src={logo} alt="logo" id="logoimg" width="20%" />
          </div>
          <img src={menu} className="menud" width="10%" style={{ display: 'none' }} alt="menu" />
        </div>
        <nav style={{ paddingRight: '25px' }}>
          <a href="#sobreus">Sobre nosotros</a>
          <a href="#">Objetivos</a>
          <a href="#">Actividades</a>
          <a href="#">Contacto</a>
        </nav>
        <a href="https://app.tikzet.com/events/quinta-cannabica-db16" className="a2">¡Conseguí tus entradas!</a>
      </header>
      <div className="mainhero">
        <div className="centro">
          <img src={caduceo} alt="" />
          <h2>ACCAMA</h2>
          <p>Asociación y Club Cannábico de Malvinas Argentinas</p>
          <br />
          <p style={{ fontSize: '1.5rem' }}>Más información</p>
          <div className="arrowdiv">
            <a href="#sobreus"><img src={arrow} width="30vh" alt="arrow" /></a>
          </div>
        </div>
      </div>
    </div>
  );
}