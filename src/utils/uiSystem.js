/**
 * Reusable UI System - Dynamic Class Composition
 * Demonstrates how to compose dynamic classes for flexible component styling
 */

/**
 * Class composition utility - combines multiple class names conditionally
 */
export function clsx(...classes) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Dynamic button class helper
 * @param {object} options - Configuration for button styling
 * @param {string} options.variant - 'primary' | 'secondary' | 'danger'
 * @param {string} options.size - 'sm' | 'md' | 'lg'
 * @param {boolean} options.disabled - Whether button is disabled
 * @param {boolean} options.loading - Whether button is loading
 * @returns {string} Combined class names
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
} = {}) {
  const baseClass = 'button';
  const variantClass = `button--${variant}`;
  const sizeClass = `button--${size}`;
  const disabledClass = disabled ? 'button--disabled' : '';
  const loadingClass = loading ? 'button--loading' : '';

  return clsx(baseClass, variantClass, sizeClass, disabledClass, loadingClass);
}

/**
 * Dynamic input class helper
 * @param {object} options - Configuration for input styling
 * @param {boolean} options.error - Whether input has error
 * @param {boolean} options.touched - Whether input has been touched
 * @param {boolean} options.focus - Whether input is focused
 * @returns {string} Combined class names
 */
export function inputClasses({
  error = false,
  touched = false,
  focus = false,
} = {}) {
  const baseClass = 'input';
  const errorClass = error ? 'input--error' : '';
  const touchedClass = touched ? 'input--touched' : '';
  const focusClass = focus ? 'input--focus' : '';

  return clsx(baseClass, errorClass, touchedClass, focusClass);
}

/**
 * Dynamic container class helper for responsive layouts
 * @param {object} options - Configuration for container
 * @param {boolean} options.isLoading - Loading state
 * @param {boolean} options.isEmpty - Empty state
 * @param {boolean} options.isError - Error state
 * @returns {string} Combined class names
 */
export function containerClasses({
  isLoading = false,
  isEmpty = false,
  isError = false,
} = {}) {
  const baseClass = 'container';
  const loadingClass = isLoading ? 'container--loading' : '';
  const emptyClass = isEmpty ? 'container--empty' : '';
  const errorClass = isError ? 'container--error' : '';

  return clsx(baseClass, loadingClass, emptyClass, errorClass);
}
