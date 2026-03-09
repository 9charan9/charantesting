import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filteredItems: [],
    search: '',
    sortType: '',
    currentPage: 1,
    itemsPerPage: 6,
    isLoading: false,
    error: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setSortType: (state, action) => {
      state.sortType = action.payload;
      state.currentPage = 1; // Reset to first page when sorting
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearch, setSortType, setCurrentPage, setItemsPerPage, clearError } = productsSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectFilteredProducts = (state) => {
  const { items, search, sortType } = state.products;
  let filtered = items;

  // Filter by search
  if (search) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sort
  if (sortType) {
    filtered = [...filtered].sort((a, b) => {
      if (sortType === 'price') return a.price - b.price;
      if (sortType === 'name') return a.title.localeCompare(b.title);
      return 0;
    });
  }

  return filtered;
};
export const selectPagination = (state) => {
  const { currentPage, itemsPerPage } = state.products;
  const filteredItems = selectFilteredProducts(state);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    totalItems: filteredItems.length,
  };
};
export const selectPaginatedProducts = (state) => {
  const filteredItems = selectFilteredProducts(state);
  const { startIndex, endIndex } = selectPagination(state);
  return filteredItems.slice(startIndex, endIndex);
};

export default productsSlice.reducer;