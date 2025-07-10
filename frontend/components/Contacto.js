import { useState } from 'react';

export default function Contacto() {
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/procesar-formulario.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setMensaje(data.message);
      if (data.success) e.target.reset();
      setTimeout(() => setMensaje(null), 5000);
    } catch (err) {
      setMensaje('Ocurrió un error al enviar el formulario.');
    }
  };

  return (
    <section id="contacto" className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Contacto</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" name="nombre" placeholder="Nombre completo" required className="border p-2 w-full" />
        <input type="tel" name="telefono" placeholder="Número de teléfono" required className="border p-2 w-full" />
        <input type="email" name="email" placeholder="Correo electrónico" required className="border p-2 w-full" />
        <input type="text" name="consulta" placeholder="Escribe tu consulta" required className="border p-2 w-full" />
        <select name="reprocann" required className="border p-2 w-full">
          <option value="" disabled>¿Tenés Reprocann?</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
        <button type="submit" className="border p-2">Enviar</button>
      </form>
      {mensaje && <div className="mt-2">{mensaje}</div>}
    </section>
  );
}