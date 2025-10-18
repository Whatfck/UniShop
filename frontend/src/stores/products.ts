import { create } from 'zustand';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller: {
    id: string;
    name: string;
    rating: number;
    totalSales: number;
  };
  isFavorite: boolean;
  location: string;
  postedDate: string;
  views: number;
  favorites: number;
}

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  selectedCategory: string;
  selectedCondition: string;
  selectedDate: string;
  isLoading: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedCondition: (condition: string) => void;
  setSelectedDate: (date: string) => void;
  toggleFavorite: (productId: number) => void;
  filterProducts: () => void;
  setLoading: (loading: boolean) => void;

  // API-like functions (mock for now)
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: 'Todas',
  selectedCondition: 'Todas',
  selectedDate: 'Todas',
  isLoading: false,

  setProducts: (products) => set({ products, filteredProducts: products }),

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterProducts();
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().filterProducts();
  },

  setSelectedCondition: (condition) => {
    set({ selectedCondition: condition });
    get().filterProducts();
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().filterProducts();
  },

  toggleFavorite: (productId) => {
    const { products, filteredProducts } = get();
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    );
    const updatedFiltered = filteredProducts.map(product =>
      product.id === productId
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    );
    set({ products: updatedProducts, filteredProducts: updatedFiltered });
  },

  filterProducts: () => {
    const { products, searchQuery, selectedCategory, selectedCondition, selectedDate } = get();

    let filtered = [...products];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by condition
    if (selectedCondition !== 'Todas') {
      filtered = filtered.filter(product => product.condition === selectedCondition);
    }

    // Filter by date (simplified)
    if (selectedDate !== 'Todas') {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedDate) {
        case 'Hoy':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'Esta semana':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'Este mes':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(product =>
        new Date(product.postedDate) >= filterDate
      );
    }

    set({ filteredProducts: filtered });
  },

  setLoading: (isLoading) => set({ isLoading }),

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/products');

      // Mock data
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Calculadora Científica Casio FX-991ES Plus',
          description: 'Calculadora científica avanzada con funciones de ingeniería. Incluye manual de usuario. Excelente estado, batería nueva.',
          price: 150,
          category: 'Tecnología',
          condition: 'Usado - Excelente',
          images: ['https://via.placeholder.com/300x200'],
          seller: {
            id: '1',
            name: 'María González',
            rating: 4.8,
            totalSales: 23,
          },
          isFavorite: false,
          location: 'Campus Central',
          postedDate: '2024-01-15',
          views: 45,
          favorites: 8,
        },
        {
          id: 2,
          name: 'Libro de Matemáticas Discretas',
          description: 'Libro en perfectas condiciones, sin subrayados. Incluye ejercicios resueltos.',
          price: 80,
          category: 'Libros',
          condition: 'Usado - Bueno',
          images: ['https://via.placeholder.com/300x200'],
          seller: {
            id: '2',
            name: 'Carlos Rodríguez',
            rating: 4.6,
            totalSales: 15,
          },
          isFavorite: true,
          location: 'Facultad de Ingeniería',
          postedDate: '2024-01-12',
          views: 32,
          favorites: 5,
        },
        {
          id: 3,
          name: 'Audífonos Sony WH-1000XM4',
          description: 'Audífonos inalámbricos con cancelación de ruido. Como nuevos, incluyen estuche original.',
          price: 200,
          category: 'Tecnología',
          condition: 'Nuevo',
          images: ['https://via.placeholder.com/300x200'],
          seller: {
            id: '3',
            name: 'Ana López',
            rating: 4.9,
            totalSales: 8,
          },
          isFavorite: false,
          location: 'Biblioteca Central',
          postedDate: '2024-01-10',
          views: 67,
          favorites: 12,
        },
      ];

      set({ products: mockProducts, filteredProducts: mockProducts });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      // const response = await api.get(`/products/search?q=${query}`);

      // For now, just filter existing products
      get().setSearchQuery(query);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));