import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// API functions
const fetchProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchProductById = async (id) => {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

// Query Keys
export const queryKeys = {
  products: ['products'],
  product: (id) => ['products', id],
};

// Custom hooks for products
export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    ...options,
  });
};

export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
};

// Mutation hooks with optimistic updates
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { ...newProduct, id: Date.now() };
    },
    onMutate: async (newProduct) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products);

      // Optimistically update cache
      queryClient.setQueryData(queryKeys.products, (old) => [
        ...(old || []),
        { ...newProduct, id: Date.now(), isOptimistic: true }
      ]);

      // Return context with snapshot
      return { previousProducts };
    },
    onError: (err, newProduct, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products, context.previousProducts);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...updates };
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products });
      await queryClient.cancelQueries({ queryKey: queryKeys.product(id) });

      // Snapshot previous values
      const previousProducts = queryClient.getQueryData(queryKeys.products);
      const previousProduct = queryClient.getQueryData(queryKeys.product(id));

      // Optimistically update products list
      queryClient.setQueryData(queryKeys.products, (old) =>
        old?.map(product =>
          product.id === id ? { ...product, ...updates, isOptimistic: true } : product
        )
      );

      // Optimistically update individual product
      queryClient.setQueryData(queryKeys.product(id), (old) =>
        old ? { ...old, ...updates, isOptimistic: true } : old
      );

      return { previousProducts, previousProduct };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products, context.previousProducts);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(queryKeys.product(variables.id), context.previousProduct);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(variables.id) });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products);

      // Optimistically remove from cache
      queryClient.setQueryData(queryKeys.products, (old) =>
        old?.filter(product => product.id !== id)
      );

      // Remove individual product cache
      queryClient.removeQueries({ queryKey: queryKeys.product(id) });

      return { previousProducts };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products, context.previousProducts);
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
  });
};