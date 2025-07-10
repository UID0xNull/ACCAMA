export default function Actividades() {
  return (
    <section id="actividades" className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Nuestras Actividades</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="activity-card p-4 border rounded">
          <img src="/img/charla.jpg" alt="Talleres Educativos" className="mb-2" />
          <h3 className="font-semibold">Talleres Educativos</h3>
          <p>Organizamos eventos periódicos que reúnen a la comunidad.</p>
        </div>
        <div className="activity-card p-4 border rounded">
          <img src="/img/FEM_3797.jpg" alt="Dispensario" className="mb-2" />
          <h3 className="font-semibold">Próximamente Dispensario</h3>
          <p>Servicio de dispensa adaptado a las necesidades de los pacientes.</p>
        </div>
        <div className="activity-card p-4 border rounded">
          <img src="/img/FEM_3952.jpg" alt="Asesoramiento" className="mb-2" />
          <h3 className="font-semibold">Asesoramiento personalizado</h3>
          <p>Ofrecemos asesoramiento especializado en cultivo.</p>
        </div>
      </div>
    </section>
  );
}