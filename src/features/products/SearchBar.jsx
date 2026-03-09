export default function SearchBar({ onSearch }) {
  return (
    <input
      placeholder="Search products..."
      onChange={(e) => onSearch(e.target.value)}
      style={{ padding: 8, marginRight: 10 }}
    />
  );
}
