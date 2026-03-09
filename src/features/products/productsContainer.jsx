import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ProductList from "./ProductList";
import ProductEditForm from "./ProductEditForm";
import CategorizedProductList from "./CategorizedProductList";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import FilterDropdown from "./FilterDropdown";
import Pagination from "./Pagination";
import LoadingSkeleton from "../../shared/LoadingSkeleton";
import Modal from "../../shared/Modal";
import Button from "../../shared/Button";
import { sortProducts } from "../../utils/productUtils";
import {
  fetchProducts,
  setSearch,
  setSortType,
  setCurrentPage,
  setItemsPerPage,
  selectProducts,
  selectFilteredProducts,
  selectPagination,
  selectPaginatedProducts
} from '../../store/productsSlice';
import styles from "./ProductsContainer.module.css";

/**
 * ProductsContainer - Redux Toolkit state management with 3+ components
 * Features:
 * - Redux state lifted across ProductList, CategorizedList, EditForm, and Modal
 * - Complex nested state management for edited products
 * - Multi-condition rendering for different view modes
 * - Imperative control of Modal and Form via refs
 */
export default function ProductsContainer() {
  const dispatch = useDispatch();

  // ===== REDUX STATE =====
  const products = useSelector(selectProducts);
  const filtered = useSelector(selectFilteredProducts);
  const { currentPage, itemsPerPage, totalPages, startIndex, endIndex } = useSelector(selectPagination);
  const paginatedProducts = useSelector(selectPaginatedProducts);
  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);

  // ===== LOCAL STATE (for UI concerns) =====
  const [viewMode, setViewMode] = useState("paginated"); // paginated, categorized

  // ===== MODAL & FORM STATE =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const modalRef = useRef(null);
  const formRef = useRef(null);

  // ===== NOTIFICATION STATE =====
  const [notification, setNotification] = useState(null);

  // Fetch initial products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ===== EVENT HANDLERS =====
  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    dispatch(setItemsPerPage(newItemsPerPage));
  };

  const handleSearch = (searchTerm) => {
    dispatch(setSearch(searchTerm));
  };

  const handleSort = (sortType) => {
    dispatch(setSortType(sortType));
  };

  // Handle product edit - opens modal
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsAddMode(false);
    setIsModalOpen(true);
    // Focus after modal renders
    setTimeout(() => {
      formRef.current?.focusTitle();
    }, 100);
  };

  // Handle add product - opens modal
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsAddMode(true);
    setIsModalOpen(true);
    // Focus after modal renders
    setTimeout(() => {
      formRef.current?.focusTitle();
    }, 100);
  };

  // Handle delete product
  const handleDeleteProduct = (id) => {
    // Note: In a real app, this would dispatch a delete action
    // For now, we'll show a notification that this feature needs backend integration
    setNotification({
      type: "info",
      message: "Delete functionality requires backend integration",
    });

    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form submission - updates or creates products immutably
  const handleFormSubmit = (formData) => {
    if (isAddMode) {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        title: formData.basicInfo.title,
        description: formData.basicInfo.description,
        price: formData.basicInfo.price,
        category: formData.basicInfo.category,
        image: formData.basicInfo.image,
        rating: formData.basicInfo.rating,
        specs: formData.specs,
      };

      // Note: In a real app, this would dispatch an addProduct action
      // For now, we'll show a notification
      setNotification({
        type: "info",
        message: `Add product functionality requires backend integration`,
      });

      // Show notification
      setNotification({
        type: "success",
        message: `Product "${newProduct.title}" would be added (demo)!`,
      });
    } else {
      // Edit existing product
      if (!selectedProduct) return;

      // Note: In a real app, this would dispatch an updateProduct action
      // For now, we'll show a notification
      setNotification({
        type: "success",
        message: `Product "${formData.basicInfo.title}" would be updated (demo)!`,
      });
    }

    // Close modal and reset form
    closeModal();

    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    formRef.current?.reset();
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "paginated" ? "categorized" : "paginated"));
  };

  return (
    <div className={styles.container}>
      {/* Notification */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
        </div>
      )}

      {/* Toolbar - Redux state controls multiple child components */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <SearchBar onSearch={handleSearch} />
          <FilterDropdown products={products} onFilter={() => {}} />
          <SortDropdown onSort={handleSort} />
        </div>
        <div className={styles.toolbarRight}>
          <Button onClick={handleAddProduct}>✚ Add Product</Button>
          <Button onClick={toggleViewMode}>
            {viewMode === "paginated" ? "📂 Categories" : "📋 List"}
          </Button>
        </div>
      </div>

      {/* Multi-condition rendering: Loading state */}
      {isLoading && <LoadingSkeleton count={itemsPerPage} />}

      {/* Multi-condition rendering: Error state */}
      {error && !isLoading && (
        <div className={styles.errorState}>
          <p>❌ Error: {error}</p>
          <p>Please try refreshing the page.</p>
        </div>
      )}

      {/* Multi-condition rendering: Success state */}
      {!isLoading && !error && (
        <>
          {/* Paginated view */}
          {viewMode === "paginated" && (
            <>
              <ProductList
                products={paginatedProducts}
                startIndex={0}
                endIndex={paginatedProducts.length}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}

          {/* Categorized view - multi-dimensional rendering */}
          {viewMode === "categorized" && (
            <CategorizedProductList
              products={filtered}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </>
      )}

      {/* Modal with Portal - imperative control via ref */}
      <Modal
        ref={modalRef}
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          isAddMode
            ? "✚ Add New Product"
            : selectedProduct
            ? `Edit: ${selectedProduct.title}`
            : "Edit Product"
        }
        size="large"
      >
        <ProductEditForm
          ref={formRef}
          initialProduct={selectedProduct}
          isAddMode={isAddMode}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
}
