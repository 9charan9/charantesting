export default function SortDropdown({ onSort }) {
  return (
    <select onChange={(e) => onSort(e.target.value)}>
      <option value="">Sort</option>
      <option value="price">Price</option>
      <option value="name">Name</option>
    </select>
  );
}
