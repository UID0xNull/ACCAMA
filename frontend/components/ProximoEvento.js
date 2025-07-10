import { useEffect, useState } from 'react';

export default function ProximoEvento() {
  const [timeLeft, setTimeLeft] = useState({days: '00', hours: '00', minutes: '00', seconds: '00'});

  useEffect(() => {
    const target = new Date('2025-06-08T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({days: '00', hours: '00', minutes: '00', seconds: '00'});
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="proximo-evento" className="p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Próximo Evento</h2>
      <div className="event-card mx-auto max-w-md p-4 border rounded">
        <img src="/img/photo_2025-02-12_08-13-38.jpg" alt="Próximo Evento" className="mb-4" />
        <h3 className="font-semibold">Próximo evento ACCAMA</h3>
        <p className="event-date">8 de Junio de 2025</p>
        <div className="flex justify-between my-4">
          <div>
            <span>{timeLeft.days}</span>
            <div className="text-xs">Días</div>
          </div>
          <div>
            <span>{timeLeft.hours}</span>
            <div className="text-xs">Horas</div>
          </div>
          <div>
            <span>{timeLeft.minutes}</span>
            <div className="text-xs">Minutos</div>
          </div>
          <div>
            <span>{timeLeft.seconds}</span>
            <div className="text-xs">Segundos</div>
          </div>
        </div>
        <div>
          <a href="https://app.tikzet.com/events/quinta-cannabica-db16" className="consultar-btn border rounded p-2 inline-block">¡Reserva tu Entrada Ahora!</a>
        </div>
      </div>
    </section>
  );
}