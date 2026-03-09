import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { useFormState } from '../../hooks/useFormState';
import styles from './ProductEditForm.module.css';

/**
 * Advanced Product Editor Form - handles both Add and Edit
 * Features:
 * - Fully controlled inputs with two-way binding
 * - Dynamic fields (add/remove)
 * - Nested object state (product details)
 * - Array operations (specs)
 * - useRef for focus management
 * - useImperativeHandle for parent control
 * - Conditional disabling
 * - Dynamic class assignment based on state
 */
const ProductEditForm = forwardRef(
  ({ initialProduct, onSubmit, isAddMode = false }, ref) => {
    const formRefs = {
      title: useRef(null),
      price: useRef(null),
      form: useRef(null),
    };

    const defaultValues = {
      basicInfo: {
        title: '',
        description: '',
        price: '',
        category: 'electronics',
        image: '',
        rating: { rate: 0, count: 0 },
      },
      specs: [],
    };

    const initialValues = initialProduct
      ? {
          basicInfo: {
            title: initialProduct?.title || '',
            description: initialProduct?.description || '',
            price: initialProduct?.price || '',
            category: initialProduct?.category || 'electronics',
            image: initialProduct?.image || '',
            rating: initialProduct?.rating || { rate: 0, count: 0 },
          },
          specs: initialProduct?.specs || [],
        }
      : defaultValues;

    const form = useFormState(initialValues);

    // Expose imperative methods to parent
    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          form.reset();
        },
        focusTitle: () => {
          formRefs.title.current?.focus();
        },
        focusPrice: () => {
          formRefs.price.current?.focus();
        },
        submit: () => {
          handleSubmit(new Event('submit'));
        },
        getValues: () => form.values,
      }),
      [form]
    );

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();

      // Validation
      const newErrors = {};
      if (!form.values.basicInfo.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!form.values.basicInfo.price || form.values.basicInfo.price <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }
      if (!form.values.basicInfo.category.trim()) {
        newErrors.category = 'Category is required';
      }

      if (Object.keys(newErrors).length > 0) {
        Object.entries(newErrors).forEach(([field, error]) => {
          form.setFieldError(field, error);
        });
        return;
      }

      onSubmit?.(form.values);
      if (isAddMode) {
        form.reset();
        formRefs.title.current?.focus();
      }
    };

    // Add new spec field
    const handleAddSpec = () => {
      form.addArrayItem('specs', { key: '', value: '' });
    };

    // Remove spec field
    const handleRemoveSpec = (index) => {
      form.removeArrayItem('specs', index);
    };

    // Update spec field
    const handleSpecChange = (index, field, value) => {
      form.updateArrayItem('specs', index, { [field]: value });
    };

    // Dynamic class for conditional styling
    const getTitleInputClass = () => {
      let className = styles.input;
      if (form.errors.title) className += ` ${styles.error}`;
      if (form.touched.title) className += ` ${styles.touched}`;
      return className;
    };

    const getPriceInputClass = () => {
      let className = styles.input;
      if (form.errors.price) className += ` ${styles.error}`;
      if (form.touched.price) className += ` ${styles.touched}`;
      return className;
    };

    const isSubmitDisabled = () => {
      // Conditional disable logic
      return (
        !form.values.basicInfo.title.trim() ||
        !form.values.basicInfo.price ||
        form.values.basicInfo.price <= 0
      );
    };

    return (
      <form ref={formRefs.form} onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information Section */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Product Information</legend>

          {/* Title Input */}
          <div className={styles.fieldGroup}>
            <label htmlFor="title" className={styles.label}>
              Product Title *
            </label>
            <input
              ref={formRefs.title}
              id="title"
              name="title"
              type="text"
              className={getTitleInputClass()}
              value={form.values.basicInfo.title}
              onChange={(e) => {
                form.setNestedValue('basicInfo.title', e.target.value);
              }}
              onBlur={() => form.markTouched('title')}
              placeholder="Enter product title"
            />
            {form.errors.title && form.touched.title && (
              <span className={styles.errorMessage}>{form.errors.title}</span>
            )}
          </div>

          {/* Description Input */}
          <div className={styles.fieldGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={form.values.basicInfo.description}
              onChange={(e) => {
                form.setNestedValue('basicInfo.description', e.target.value);
              }}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {/* Price Input */}
          <div className={styles.fieldGroup}>
            <label htmlFor="price" className={styles.label}>
              Price (USD) *
            </label>
            <input
              ref={formRefs.price}
              id="price"
              name="price"
              type="number"
              step="0.01"
              className={getPriceInputClass()}
              value={form.values.basicInfo.price}
              onChange={(e) => {
                form.setNestedValue('basicInfo.price', parseFloat(e.target.value));
              }}
              onBlur={() => form.markTouched('price')}
              placeholder="0.00"
            />
            {form.errors.price && form.touched.price && (
              <span className={styles.errorMessage}>{form.errors.price}</span>
            )}
          </div>

          {/* Category Input */}
          <div className={styles.fieldGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <select
              id="category"
              className={styles.input}
              value={form.values.basicInfo.category}
              onChange={(e) => {
                form.setNestedValue('basicInfo.category', e.target.value);
              }}
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
              <option value="toys">Toys</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Image URL Input */}
          <div className={styles.fieldGroup}>
            <label htmlFor="image" className={styles.label}>
              Image URL
            </label>
            <input
              id="image"
              type="url"
              className={styles.input}
              value={form.values.basicInfo.image}
              onChange={(e) => {
                form.setNestedValue('basicInfo.image', e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Rating Fields */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label htmlFor="rate" className={styles.label}>
                Rating
              </label>
              <input
                id="rate"
                type="number"
                min="0"
                max="5"
                step="0.1"
                className={styles.input}
                value={form.values.basicInfo.rating.rate}
                onChange={(e) => {
                  form.setNestedValue('basicInfo.rating.rate', parseFloat(e.target.value));
                }}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="count" className={styles.label}>
                Review Count
              </label>
              <input
                id="count"
                type="number"
                min="0"
                className={styles.input}
                value={form.values.basicInfo.rating.count}
                onChange={(e) => {
                  form.setNestedValue('basicInfo.rating.count', parseInt(e.target.value));
                }}
              />
            </div>
          </div>
        </fieldset>

        {/* Dynamic Specifications Section */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            Specifications ({form.values.specs.length})
          </legend>

          <div className={styles.specsList}>
            {form.values.specs.map((spec, index) => (
              <div key={index} className={styles.specItem}>
                <input
                  type="text"
                  className={styles.input}
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  placeholder="Spec name (e.g., Color)"
                />
                <input
                  type="text"
                  className={styles.input}
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Spec value (e.g., Red)"
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveSpec(index)}
                  title="Remove spec"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.addButton}
            onClick={handleAddSpec}
          >
            + Add Specification
          </button>
        </fieldset>

        {/* Form Actions */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.submitButton} ${
              isSubmitDisabled() ? styles.disabled : ''
            }`}
            disabled={isSubmitDisabled()}
          >
            {isAddMode ? '✚ Add Product' : '💾 Save Product'}
          </button>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => form.reset()}
          >
            Reset
          </button>
        </div>
      </form>
    );
  }
);

ProductEditForm.displayName = 'ProductEditForm';

export default ProductEditForm;
