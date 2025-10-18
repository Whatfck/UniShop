import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

import { useProductsStore, type Product } from '../stores/products';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, toggleFavorite } = useProductsStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const product = products.find(p => p.id === parseInt(id || '0'));

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-secondary-600">El producto que buscas no existe.</p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
  };

  const handleContact = () => {
    // TODO: Open WhatsApp with seller
    const message = `Hola! Me interesa tu producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-secondary-600 hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Volver a resultados
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {isLoading ? (
              <Skeleton className="aspect-square w-full rounded-lg" />
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary-100">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-secondary-300'
                  }`}
                >
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full space-y-2" />
              </>
            ) : (
              <>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-secondary-600">{product.category}</p>
                </div>

                <div className="text-4xl font-bold text-primary-600">
                  ${product.price}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-secondary-600">
                    <span className="font-medium">{product.condition}</span>
                    <span className="mx-2">•</span>
                    <span>{product.location}</span>
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className="p-3 rounded-full hover:bg-secondary-100 transition-colors"
                  >
                    {product.isFavorite ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-secondary-600" />
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Descripción</h2>
                  <p className="text-secondary-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {product.seller.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.seller.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-secondary-600">
                          <span>⭐ {product.seller.rating}</span>
                          <span>•</span>
                          <span>{product.seller.totalSales} ventas</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleContact}
                      className="w-full"
                      size="lg"
                    >
                      📱 Contactar por WhatsApp
                    </Button>
                  </CardContent>
                </Card>

                <div className="text-sm text-secondary-500">
                  Publicado el {new Date(product.postedDate).toLocaleDateString('es-ES')}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}