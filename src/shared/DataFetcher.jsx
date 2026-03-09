import React, { useState } from "react";

/**
 * DataFetcher - Demonstrates Render Prop Pattern
 * Separates data loading logic from rendering logic
 * Allows flexible rendering of loading/error/success states
 */
function DataFetcher({ render, data, isLoading, error }) {
  return render({ data, isLoading, error });
}

/**
 * Example usage of RenderProp pattern:
 * const Example = () => (
 *   <DataFetcher
 *     data={products}
 *     isLoading={loading}
 *     error={error}
 *     render={({ data, isLoading, error }) => (
 *       <>
 *         {isLoading && <p>Loading...</p>}
 *         {error && <p>Error: {error}</p>}
 *         {data && <ProductList products={data} />}
 *       </>
 *     )}
 *   />
 * );
 */

export default DataFetcher;
