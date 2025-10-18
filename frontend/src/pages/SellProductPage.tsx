import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../stores/auth';

const sellProductSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'El nombre es demasiado largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000, 'La descripción es demasiado larga'),
  price: z.number().min(0.01, 'El precio debe ser mayor a 0').max(999999, 'Precio demasiado alto'),
  category: z.string().min(1, 'Debes seleccionar una categoría'),
  condition: z.enum(['NUEVO', 'USADO_EXCELENTE', 'USADO_BUENO', 'USADO_ACEPTABLE']),
});

type SellProductForm = z.infer<typeof sellProductSchema>;

const categories = [
  'Libros',
  'Tecnología',
  'Ropa',
  'Hogar',
  'Deportes',
  'Vehículos',
  'Música',
  'Arte',
  'Otros',
];

const conditions = [
  { value: 'NUEVO', label: 'Nuevo' },
  { value: 'USADO_EXCELENTE', label: 'Usado - Excelente' },
  { value: 'USADO_BUENO', label: 'Usado - Bueno' },
  { value: 'USADO_ACEPTABLE', label: 'Usado - Aceptable' },
];

export default function SellProductPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<SellProductForm>({
    resolver: zodResolver(sellProductSchema),
    defaultValues: {
      condition: 'USADO_BUENO',
    },
  });

  const watchedPrice = watch('price');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      setError('root', { message: 'Máximo 5 imágenes permitidas' });
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data: SellProductForm) => {
    if (images.length === 0) {
      setError('root', { message: 'Debes subir al menos una imagen' });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Publishing product:', { ...data, images });

      // Mock successful publication
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError('root', { message: 'Error al publicar el producto. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Vender Producto</h1>
            <p className="text-secondary-600 mt-2">
              Completa los detalles de tu producto para publicarlo en Unishop
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Images Section */}
            <Card>
              <CardHeader>
                <CardTitle>Fotos del Producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Producto ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="aspect-square border-2 border-dashed border-secondary-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                      <PhotoIcon className="h-8 w-8 text-secondary-400 mb-2" />
                      <span className="text-sm text-secondary-600">Añadir foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <p className="text-sm text-secondary-600">
                  {images.length}/5 fotos • Formatos: JPG, PNG • Máx. 5MB cada una
                </p>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">
                    Nombre del producto *
                  </label>
                  <Input
                    id="name"
                    placeholder="Ej: iPhone 12 Pro Max 256GB"
                    {...register('name')}
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="label">
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe detalladamente tu producto, incluye características, estado, etc."
                    {...register('description')}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="label">
                      Precio (COP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">$</span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`pl-8 ${errors.price ? 'input-error' : ''}`}
                        {...register('price', { valueAsNumber: true })}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                    {watchedPrice && (
                      <p className="mt-1 text-sm text-secondary-600">
                        ≈ ${Math.round(watchedPrice * 0.00023)} USD
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="label">
                      Categoría *
                    </label>
                    <select
                      id="category"
                      {...register('category')}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                        errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">
                    Estado del producto *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {conditions.map((condition) => (
                      <label key={condition.value} className="flex items-center">
                        <input
                          type="radio"
                          value={condition.value}
                          {...register('condition')}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm">{condition.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {errors.root && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Publicando...' : 'Publicar Producto'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}