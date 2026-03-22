import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  const search = () => {
    if (!query.trim()) return;

    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="search-container">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск в Google..."
      />
      <button onClick={search}>🔍</button>
    </div>
  );
}