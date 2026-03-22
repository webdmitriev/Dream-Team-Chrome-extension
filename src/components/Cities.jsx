import { useEffect, useState } from "react";

const cities = [
  { name: "Москва", timezone: "Europe/Moscow", flag: "🇷🇺" },
  { name: "Красноярск", timezone: "Asia/Krasnoyarsk", flag: "🇷🇺" },
  { name: "Филиппины", timezone: "Asia/Manila", flag: "🇵🇭" }
];

export default function Cities() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="cities df-fs-st w-100p">
      {cities.map((city) => (
        <div key={city.name} className="somewhere-date df-ce-fs w-100p">
          <div>{city.flag} {city.name}</div>
          <div className="somewhere-date__time">
            {now.toLocaleTimeString("ru-RU", {
              timeZone: city.timezone,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false
            })}
          </div>
        </div>
      ))}
    </div>
  );
}