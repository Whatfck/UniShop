import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { useProductsStore } from '../stores/products';

const categories = ['Todas', 'Libros', 'Tecnología', 'Ropa', 'Otros'];
const conditions = ['Todas', 'Nuevo', 'Usado'];
const dates = ['Todas', 'Hoy', 'Esta semana', 'Este mes'];

export default function HomePage() {
  const {
    filteredProducts,
    searchQuery,
    selectedCategory,
    selectedCondition,
    selectedDate,
    isLoading,
    setSearchQuery,
    setSelectedCategory,
    setSelectedCondition,
    setSelectedDate,
    toggleFavorite,
    fetchProducts,
  } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the store
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Search Bar */}
      <div className="md:hidden p-4 border-b">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="icon">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-secondary-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <h3 className="font-semibold mb-3">Condición</h3>
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => setSelectedCondition(condition)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCondition === condition
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-secondary-100'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <h3 className="font-semibold mb-3">Fecha de Publicación</h3>
              <div className="space-y-2">
                {dates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedDate === date
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-secondary-100'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                // Skeleton Loading
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <Skeleton className="h-6 w-16" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="overflow-hidden card-hover group cursor-pointer">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-secondary-600 mb-2">
                          {product.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary-600">
                            ${product.price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(product.id);
                            }}
                            className="p-2 rounded-full hover:bg-secondary-100 transition-colors"
                          >
                            {product.isFavorite ? (
                              <HeartSolidIcon className="h-5 w-5 text-red-500" />
                            ) : (
                              <HeartIcon className="h-5 w-5 text-secondary-600" />
                            )}
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}