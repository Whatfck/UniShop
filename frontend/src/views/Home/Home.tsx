import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Footer } from '../../components/layout';
import { HeroSection } from '../../components/features/home';
import { FilterPanel } from '../../components/features/search';
import { ProductGrid } from '../../components/features/product';
import { useTheme } from '../../hooks';
import type { Product, ProductFilters } from '../../types';

import { mockProducts } from '../../data/mockProducts';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (query: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const filtered = mockProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteToggle = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, isFavorited: !product.isFavorited }
        : product
    ));
  };

  const handleContact = (product: Product) => {
    console.log('Contact seller:', product.seller);
    // Open WhatsApp or contact modal
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      {/* Hero Section */}
      <HeroSection />

      <main className="max-w-full mx-auto py-8" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel */}
          <aside className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1 order-1 lg:order-2">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onProductClick={handleProductClick}
              onFavoriteToggle={handleFavoriteToggle}
              onContact={handleContact}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;