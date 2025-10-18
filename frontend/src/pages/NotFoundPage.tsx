import { Link } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

export default function NotFoundPage() {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search and redirect
    console.log('Search from 404');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-primary-500">404</div>
          <h1 className="text-2xl font-bold text-foreground">
            Página no encontrada
          </h1>
          <p className="text-secondary-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Search Card */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-left">
              <h2 className="font-semibold mb-2">¿Buscando algo específico?</h2>
              <p className="text-sm text-secondary-600">
                Prueba buscar el producto que necesitas
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                type="text"
                placeholder="Buscar productos..."
                className="w-full"
              />
              <Button type="submit" className="w-full">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full">
              <HomeIcon className="h-5 w-5 mr-2" />
              Ir al Inicio
            </Button>
          </Link>

          <div className="text-sm text-secondary-600">
            ¿Necesitas ayuda?{' '}
            <a href="#" className="text-primary-500 hover:underline">
              Contacta con soporte
            </a>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="pt-8 border-t">
          <h3 className="font-semibold mb-4">Categorías populares</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Libros', 'Tecnología', 'Ropa', 'Otros'].map((category) => (
              <Link
                key={category}
                to={`/?category=${category.toLowerCase()}`}
                className="p-3 rounded-lg border hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}