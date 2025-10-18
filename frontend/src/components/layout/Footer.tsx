export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="font-bold text-xl">Unishop</span>
            </div>
            <p className="text-sm text-secondary-600">
              La plataforma universitaria para comprar y vender productos entre estudiantes.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Cómo Vender
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Consejos de Seguridad
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Centro de Ayuda
                </a>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Libros
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Tecnología
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Ropa
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Otros
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Soporte
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Reportar Problema
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-600 hover:text-primary-500 transition-colors">
                  Términos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-secondary-600">
          <p>&copy; 2024 Unishop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}