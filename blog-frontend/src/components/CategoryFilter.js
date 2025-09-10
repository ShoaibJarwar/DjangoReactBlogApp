import React from "react";

const CategoryFilterComponent = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor="categoryFilter" className="form-label fw-bold">
        Filter by Categories
      </label>
      <select
        id="categoryFilter"
        className="form-select shadow-sm"
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}{" "}
            {cat.post_count
              .toString()
              .split("")
              .map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d])
              .join("")}
          </option>
        ))}
      </select>
    </div>
  );
};
const CategoryFilter = React.memo(CategoryFilterComponent);
export default CategoryFilter;