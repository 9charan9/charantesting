/**
 * Scroll lock utility
 * Prevents body scroll when modal is open
 */

let scrollLockCount = 0;

export function lockScroll() {
  if (scrollLockCount === 0) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
  }
  scrollLockCount++;
}

export function unlockScroll() {
  scrollLockCount--;
  if (scrollLockCount === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

function getScrollbarWidth() {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);
  
  const inner = document.createElement('div');
  outer.appendChild(inner);
  
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  
  return scrollbarWidth;
}
