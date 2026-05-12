import { useState, useEffect } from 'react';

const sites = [
  { site: "Красноярск", front: "https://sibdentalclinic.ru/", back: "https://sibdentalclinic.ru/wp-admin/" },
  { site: "Ростов-На-Дону", front: "https://rostov-dental.ru/", back: "https://rostov-dental.ru/wp-admin/" },
  { site: "Пермь", front: "https://rodontadent.ru/", back: "https://rodontadent.ru/wp-admin/" },
  { site: "Омск", front: "https://ulybkasibiri.ru/", back: "https://ulybkasibiri.ru/wp-admin/" },
  { site: "Самара", front: "https://klinikapovolzhye.ru/", back: "https://klinikapovolzhye.ru/wp-admin/" },
  { site: "Кемерово", front: "https://kemerovodental.ru/", back: "https://kemerovodental.ru/wp-admin/" },
  { site: "Краснодар", front: "https://komandamechty-krasnodar.ru/", back: "https://komandamechty-krasnodar.ru/wp-admin/" },
  { site: "Улан-Удэ", front: "https://komandamechty-ulan-ude.ru/", back: "https://komandamechty-ulan-ude.ru/wp-admin/" },
  { site: "Волгоград", front: "https://komandamechty-volgograd.ru/", back: "https://komandamechty-volgograd.ru/wp-admin/" },
  { site: "Тольятти", front: "https://komandamechty-togliatti.ru/", back: "https://komandamechty-togliatti.ru/wp-admin/" },
  { site: "Нижний Новгород", front: "https://alldent32.ru/", back: "https://alldent32.ru/wp-admin/" },
  { site: "Новокузнецк", front: "https://novokuznetskdental.ru/", back: "https://novokuznetskdental.ru/wp-admin/" },
  { site: "Новосибирск", front: "https://easystomdental.ru/", back: "https://easystomdental.ru/wp-admin/" },
  { site: "Санкт-Петербург", front: "https://worlddentspb.ru/", back: "https://worlddentspb.ru/wp-admin/" },
  { site: "Калининград", front: "https://kaliningrad-dental.ru/", back: "https://kaliningrad-dental.ru/wp-admin/" },
  { site: "Барнаул", front: "https://stomatologiachehova.ru/", back: "https://stomatologiachehova.ru/wp-admin/" },
];

export default function Sites() {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const checkSiteStatus = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-cache',
        mode: 'no-cors',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      return true;
    } catch (error) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-cache',
          mode: 'no-cors',
        });
        return true;
      } catch (secondError) {
        console.log(`${url} недоступен`);
        return false;
      }
    }
  };

  const checkAllSites = async () => {
    setLoading(true);
    const results = {};

    const promises = sites.flatMap(site => [
      checkSiteStatus(site.front).then(status => ({ url: site.front, status })),
    ]);

    const allResults = await Promise.all(promises);

    allResults.forEach(({ url, status }) => {
      results[url] = status;
    });

    setStatuses(results);
    setLoading(false);
  };

  useEffect(() => {
    checkAllSites();

    // Обновляем статусы каждые 60 секунд
    const interval = setInterval(checkAllSites, 60000);

    return () => clearInterval(interval);
  }, []);

  const StatusIndicator = ({ isActive, isLoading }) => {
    if (isLoading) {
      return (
        <span style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          border: '2px solid #ff9800',
          borderTop: '2px solid transparent',
          animation: 'spin 1s linear infinite',
        }} />
      );
    }

    return (
      <span
        style={{
          display: 'inline-block',
          width: '24px',
          height: '10px',
          borderRadius: '10px',
          backgroundColor: isActive ? '#4caf50' : '#f44336',
          transition: 'all 0.3s ease',
        }}
      />
    );
  };

  // Добавляем анимацию спиннера в ваш CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="sites df-fs-st w-100p">
      {sites.map((site, index) => (
        <div key={index} className="sites-item df-ce-fs w-100p">
          <div className="site-name">{site.site}</div>
          <a href={site.front} target="_blank" rel="noopener noreferrer" className="site-front">Front</a>
          <a href={site.back} target="_blank" rel="noopener noreferrer" className="site-back">Admin</a>
          <StatusIndicator
            isActive={statuses[site.front]}
            isLoading={loading && statuses[site.front] === undefined}
          />
        </div>
      ))}
    </div>
  );
}