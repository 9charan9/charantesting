import React from "react";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange 
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button
          className="pagination-btn prev-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Previous page"
        >
          ← Prev
        </button>

        <div className="page-numbers">
          {currentPage > 1 && pages[0] > 1 && (
            <>
              <button 
                className="pagination-btn page-btn"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {pages[0] > 2 && <span className="pagination-dots">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              className={`pagination-btn page-btn ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="pagination-dots">...</span>
              )}
              <button 
                className="pagination-btn page-btn"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn next-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          Next →
        </button>
      </div>

      <div className="pagination-info">
        <div className="items-per-page">
          <label htmlFor="items-select">Items per page:</label>
          <select 
            id="items-select"
            value={itemsPerPage} 
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
}
