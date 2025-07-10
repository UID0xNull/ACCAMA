import Hero from '../components/Hero';
import SobreNosotros from '../components/SobreNosotros';
import Actividades from '../components/Actividades';
import ProductosCarousel from '../components/ProductosCarousel';
import ProximoEvento from '../components/ProximoEvento';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <SobreNosotros />
      <Actividades />
      <ProductosCarousel />
      <ProximoEvento />
      <Contacto />
      <Footer />
    </>
  );
}