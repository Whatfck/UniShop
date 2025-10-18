import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  HeartIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../stores/auth';

// Mock data - TODO: Replace with API calls
const mockUserStats = {
  totalProducts: 5,
  activeProducts: 4,
  soldProducts: 1,
  totalEarnings: 150,
  favoritesCount: 12,
  viewsThisMonth: 245,
};

const mockUserProducts = [
  {
    id: 1,
    name: 'Calculadora Científica Casio',
    price: 150,
    status: 'ACTIVE',
    views: 45,
    favorites: 8,
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Libro de Matemáticas',
    price: 80,
    status: 'SOLD',
    views: 32,
    favorites: 5,
    createdAt: '2024-01-10',
  },
];

const mockSoldProducts = [
  {
    id: 2,
    name: 'Libro de Matemáticas',
    price: 80,
    buyer: 'María González',
    soldDate: '2024-01-20',
  },
];

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'products' | 'sold' | 'favorites'>('products');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mi Panel</h1>
            <p className="text-secondary-600 mt-1">
              Bienvenido de vuelta, {user?.name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/sell">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Vender Producto
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Productos Activos</p>
                  <p className="text-2xl font-bold">{mockUserStats.activeProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Ganado</p>
                  <p className="text-2xl font-bold">${mockUserStats.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HeartIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Favoritos</p>
                  <p className="text-2xl font-bold">{mockUserStats.favoritesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Vistas este mes</p>
                  <p className="text-2xl font-bold">{mockUserStats.viewsThisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'products', label: 'Mis Productos', count: mockUserStats.totalProducts },
                { id: 'sold', label: 'Productos Vendidos', count: mockUserStats.soldProducts },
                { id: 'favorites', label: 'Mis Favoritos', count: mockUserStats.favoritesCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Mis Productos</h2>
              <Link to="/sell">
                <Button size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {mockUserProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-secondary-600">${product.price}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-secondary-500">
                          <span>👁️ {product.views} vistas</span>
                          <span>❤️ {product.favorites} favoritos</span>
                          <span>📅 {new Date(product.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'ACTIVE' ? 'Activo' : 'Vendido'}
                        </span>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sold' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Productos Vendidos</h2>

            <div className="grid gap-4">
              {mockSoldProducts.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-secondary-600">Comprador: {product.buyer}</p>
                          <p className="text-sm text-secondary-500">
                            Vendido el {new Date(product.soldDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">${product.price}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Mis Favoritos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODO: Implement favorites grid similar to HomePage */}
              <Card>
                <CardContent className="p-4 text-center text-secondary-500">
                  <HeartIcon className="h-12 w-12 mx-auto mb-2 text-secondary-300" />
                  <p>No tienes productos favoritos aún</p>
                  <Link to="/" className="text-primary-600 hover:underline text-sm">
                    Explorar productos
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}