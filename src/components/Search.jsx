import { useState } from "react";

import google from "../assets/img/icon-google.svg";
import yandex from "../assets/img/icon-yandex.svg";

export default function Search() {
  const [query, setQuery] = useState("");

  const searchGoogle = () => {
    if (!query.trim()) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const searchYandex = () => {
    if (!query.trim()) return;
    window.location.href = `https://yandex.ru/search/?text=${encodeURIComponent(query)}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchYandex(); // или searchYandex(), выбери какой по умолчанию
    }
  };

  return (
    <div className="search df-ce-st w-100p">
      <div className="search-container__data df-ce-st w-100p">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Поиск..."
        />
        <div className="search-buttons df-fs-st">
          <button onClick={searchGoogle} className="df-ce-ce"><img src={google} alt="Google" /></button>
          <button onClick={searchYandex} className="df-ce-ce"><img src={yandex} alt="Yandex" /></button>
        </div>
      </div>
    </div>
  );
}