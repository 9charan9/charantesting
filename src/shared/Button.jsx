export default function Button({ children, className, ...props }) {
  const baseStyles = {
    padding: '8px 16px',
    margin: '5px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#5568d3';
    e.target.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = '#667eea';
    e.target.style.transform = 'translateY(0)';
  };

  return (
    <button
      style={baseStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}
