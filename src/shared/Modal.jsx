import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { lockScroll, unlockScroll } from '../utils/scrollLock';
import styles from './Modal.module.css';

/**
 * Modal component with Portal implementation
 * Features:
 * - forwardRef for parent control
 * - useImperativeHandle for imperative methods
 * - Click outside to close
 * - ESC key to close
 * - Scroll lock
 */
const Modal = forwardRef(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      showCloseButton = true,
      size = 'medium',
    },
    ref
  ) => {
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    // Imperative methods for parent control
    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          if (modalRef.current) {
            modalRef.current.style.display = 'flex';
            lockScroll();
          }
        },
        close: () => {
          if (modalRef.current) {
            modalRef.current.style.display = 'none';
            unlockScroll();
          }
        },
        focus: () => {
          contentRef.current?.focus();
        },
      }),
      []
    );

    // Handle ESC key press
    useEffect(() => {
      if (!isOpen) return;

      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose?.();
        }
      };

      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Handle click outside to close
    const handleBackdropClick = useCallback(
      (e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      },
      [onClose]
    );

    // Lock/unlock scroll
    useEffect(() => {
      if (isOpen) {
        lockScroll();
        return () => unlockScroll();
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        ref={modalRef}
      >
        <div
          className={`${styles.modal} ${styles[size]}`}
          ref={contentRef}
          tabIndex={-1}
        >
          {/* Modal Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showCloseButton && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>

          {/* Modal Content */}
          <div className={styles.content}>{children}</div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
