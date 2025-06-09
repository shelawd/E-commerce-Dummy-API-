import { useEffect, useState } from "react";

function Categories({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold text-gray-700">
        Select Category:
      </label>
      <select
        onChange={(e) => onCategorySelect(e.target.value)}
        className="w-full max-w-xs p-2 border border-gray-300 rounded"
      >
        <option value="all">All</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Categories;
