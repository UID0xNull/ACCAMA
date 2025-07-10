export default function Footer() {
  return (
    <footer className="p-8 text-center bg-gray-100">
      <div className="flex flex-col items-center space-y-2">
        <a href="https://www.instagram.com/accama.club/" className="flex items-center space-x-2">
          <span className="text-2xl font-light">ACCAMA</span>
          <img src="/assets/instagram.svg" alt="Instagram" width="40" />
        </a>
        <p>Buenos Aires, Argentina</p>
        <p>Todos los derechos reservados © 2025 ACCAMA</p>
      </div>
    </footer>
  );
}