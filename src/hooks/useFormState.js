import { useState, useCallback } from 'react';

/**
 * Advanced form state management hook
 * Handles complex nested state, array operations, and controlled inputs
 */
export function useFormState(initialValues) {
  const [formState, setFormState] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Handle single field changes (two-way binding)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Handle nested object updates immutably
  const setNestedValue = useCallback((path, value) => {
    setFormState((prev) => {
      const keys = path.split('.');
      const newState = { ...prev };
      let current = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newState;
    });
  }, []);

  // Array operations: add item to array
  const addArrayItem = useCallback((arrayName, newItem) => {
    setFormState((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem],
    }));
  }, []);

  // Array operations: update item in array
  const updateArrayItem = useCallback((arrayName, index, updatedItem) => {
    setFormState((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], ...updatedItem };
      return {
        ...prev,
        [arrayName]: newArray,
      };
    });
  }, []);

  // Array operations: remove item from array
  const removeArrayItem = useCallback((arrayName, index) => {
    setFormState((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  }, []);

  // Track touched fields
  const markTouched = useCallback((fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  // Set validation errors
  const setFieldError = useCallback((fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  // Reset form to initial state
  const reset = useCallback(() => {
    setFormState(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  // Reset specific fields
  const resetField = useCallback((fieldName) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: initialValues[fieldName],
    }));
    setTouched((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
    setErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  }, [initialValues]);

  return {
    values: formState,
    touched,
    errors,
    handleChange,
    setNestedValue,
    addArrayItem,
    updateArrayItem,
    removeArrayItem,
    markTouched,
    setFieldError,
    reset,
    resetField,
    setValue: (name, value) => setFormState((prev) => ({ ...prev, [name]: value })),
  };
}
