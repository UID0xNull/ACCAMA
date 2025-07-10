import { useState, useEffect } from 'react';

export default function Hero() {
    const [navActive, setNavActive] = useState(false);

  useEffect(() => {
    const numParticles = 24;
    const hero = document.querySelector('.mainhero');
    if (!hero) return;

    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none'
    });
    hero.appendChild(container);

    function createParticle() {
      const particle = document.createElement('img');
      particle.src = '/assets/cannabis-leaf-svgrepo-com.svg';
      Object.assign(particle.style, {
        position: 'absolute',
        width: '30px',
        height: '30px',
        opacity: Math.random() * 0.8 + 0.2,
        transform: `rotate(${Math.random() * 360}deg)`
      });

      const heroRect = hero.getBoundingClientRect();
      const startX = Math.random() * heroRect.width;
      const startY = Math.random() * heroRect.height;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;

      container.appendChild(particle);
      animateParticle(particle);
    }

    function animateParticle(particle) {
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      function move() {
        let x = parseFloat(particle.style.left);
        let y = parseFloat(particle.style.top);
        x += speedX;
        y += speedY;
        if (x < 0) x = hero.clientWidth;
        if (x > hero.clientWidth) x = 0;
        if (y < 0) y = hero.clientHeight;
        if (y > hero.clientHeight) y = 0;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        requestAnimationFrame(move);
      }
      move();
    }

    for (let i = 0; i < numParticles; i++) createParticle();

    return () => {
      container.remove();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const logoContainer = document.getElementById('h1');
      const logoImg = document.getElementById('logoimg');
      if (!logoContainer || !logoImg) return;
      if (window.scrollY > 30 && window.scrollY < 1600) {
        logoContainer.classList.add('scrolled');
        logoImg.classList.add('des');
        logoContainer.classList.remove('appear');
      } else {
        logoContainer.classList.remove('scrolled');
        logoImg.classList.remove('des');
        logoContainer.classList.add('appear');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
<div className="hero relative">
      <header className="flex items-center justify-between p-4">
        <div className="logo flex items-center" >
          <div className="accama" id="accama" style={{display: 'flex'}}>
            <h1 id="h1" className="phoneh1">ACCAMA</h1>
            <img id="logoimg" src="/assets/logo.png" alt="logo" width="20%" />
          </div>
          <img
            src="/assets/menu-alt-2-svgrepo-com.svg"
            className="menu-toggle md:hidden ml-2"
            width="30"
            onClick={() => setNavActive(!navActive)}
          />
        </div>
        <nav className={`${navActive ? 'block' : 'hidden'} md:flex space-x-4`}>
          <a href="#sobreus">Sobre nosotros</a>
          <a href="#actividades">Actividades</a>
          <a href="#productos">Productos</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a
          href="https://app.tikzet.com/events/quinta-cannabica-db16"
          className="a2 hidden md:block"
        >
          ¡Conseguí tus entradas!
        </a>
      </header>
      <div className="mainhero relative py-20 text-center">
        <div className="centro relative z-10">
          <img src="/assets/caduceo.svg" alt="caduceo" className="mx-auto" />
          <h2 className="text-4xl font-bold">ACCAMA</h2>
          <p>Asociación y Club Cannábico de Malvinas Argentinas</p>
          <p className="mt-4 text-lg">Más información</p>
          <div className="arrowdiv mt-2">
            <a href="#sobreus">
              <img src="/assets/down-arrow2-svgrepo-com.svg" width="30" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}