import { useState, useEffect } from 'react';

// 1. Рабочие сайты
const workSites = [
  { site: "Красноярск", front: "https://sibdentalclinic.ru/", back: "https://sibdentalclinic.ru/wp-admin/" },
  { site: "Ростов-На-Дону", front: "https://rostov-dental.ru/", back: "https://rostov-dental.ru/wp-admin/" },
  { site: "Пермь", front: "https://rodontadent.ru/", back: "https://rodontadent.ru/wp-admin/" },
  { site: "Омск", front: "https://ulybkasibiri.ru/", back: "https://ulybkasibiri.ru/wp-admin/" },
  { site: "Самара", front: "https://klinikapovolzhye.ru/", back: "https://klinikapovolzhye.ru/wp-admin/" },
  { site: "Кемерово", front: "https://kemerovodental.ru/", back: "https://kemerovodental.ru/wp-admin/" },
  { site: "Краснодар", front: "https://komandamechty-krasnodar.ru/", back: "https://komandamechty-krasnodar.ru/wp-admin/" },
  { site: "Улан-Удэ", front: "https://komandamechty-ulan-ude.ru/", back: "https://komandamechty-ulan-ude.ru/wp-admin/" },
  { site: "Волгоград", front: "https://komandamechty-volgograd.ru/", back: "https://komandamechty-volgograd.ru/wp-admin/" },
  { site: "Иркутск", front: "https://komandamechty-irkutsk.ru/", back: "https://komandamechty-irkutsk.ru/wp-admin/" },
  { site: "Томск", front: "https://komandamechty-tomsk.ru/", back: "https://komandamechty-tomsk.ru/wp-admin/" },
  { site: "Саратов", front: "https://komandamechty-saratov.ru/", back: "https://komandamechty-saratov.ru/wp-admin/" },
  { site: "Тольятти", front: "https://komandamechty-togliatti.ru/", back: "https://komandamechty-togliatti.ru/wp-admin/" },
  { site: "Нижний Новгород", front: "https://alldent32.ru/", back: "https://alldent32.ru/wp-admin/" },
  { site: "Санкт-Петербург", front: "https://worlddentspb.ru/", back: "https://worlddentspb.ru/wp-admin/" },
  { site: "Новокузнецк", front: "https://novokuznetskdental.ru/", back: "https://novokuznetskdental.ru/wp-admin/" },
  { site: "Новосибирск", front: "https://easystomdental.ru/", back: "https://easystomdental.ru/wp-admin/" },
  { site: "Калининград", front: "https://kaliningrad-dental.ru/", back: "https://kaliningrad-dental.ru/wp-admin/" },
  { site: "Барнаул", front: "https://stomatologiachehova.ru/", back: "https://stomatologiachehova.ru/wp-admin/" },
  { site: "Чебоксары", front: "https://komandamechty-cheboksary.ru/", back: "https://komandamechty-cheboksary.ru/wp-admin/" },
  { site: "Kazakhstan", front: "https://dreamteammed.kz/", back: "https://dreamteammed.kz/wp-admin/" },
];

// 2. Личные / Домашние сайты (добавляй сюда свои проекты)
const personalSites = [
  { site: "Сочи", front: "https://dreamclean-sochi.ru/", back: "https://dreamclean-sochi.ru/wp-admin/" },
  { site: "Сочи (Адлер)", front: "https://dreamclean-sochi.ru/adler/", back: "https://dreamclean-sochi.ru/adler/wp-admin/" },
  // { site: "Мой Блог", front: "https://myblog.ru/", back: "https://myblog.ru/wp-admin/" },
];

export default function Sites() {
  const [activeTab, setActiveTab] = useState('work'); // 'work' | 'personal'
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  // Объединенный список для фоновой проверки
  const allSites = [...workSites, ...personalSites];

  const checkWordPressApi = async (baseUrl) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    try {
      const apiUrl = `${baseUrl.replace(/\/$/, '')}/wp-json/`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data?.namespaces);
      }
      
      if ([403, 429, 503].includes(response.status)) {
        return true;
      }

      return false;
    } catch (error) {
      clearTimeout(timeoutId);

      try {
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 5000);

        await fetch(baseUrl, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          signal: fallbackController.signal
        });

        clearTimeout(fallbackTimeout);
        return true; 
      } catch (fallbackError) {
        console.log(`[Site Down] ${baseUrl}:`, fallbackError.message);
        return false;
      }
    }
  };

  const checkAllSites = async () => {
    setLoading(true);

    // Проверяем ВСЕ сайты из обеих категорий одновременно
    const promises = allSites.map(async (site) => {
      const isAlive = await checkWordPressApi(site.front);
      return { url: site.front, status: isAlive };
    });

    const resultsArray = await Promise.all(promises);

    const results = {};
    resultsArray.forEach(({ url, status }) => {
      results[url] = status;
    });

    setStatuses(results);
    setLoading(false);
  };

  useEffect(() => {
    checkAllSites();

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
        title={isActive ? "WordPress & DB — OK" : "Ошибка сервера / БД / Недоступен"}
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

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .sites-tab-btn {
        background: transparent;
        border: none;
        outline: none;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: #888;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      .sites-tab-btn.active {
        color: #2196f3;
        border-bottom-color: #2196f3;
      }
      .sites-tabs-header {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        border-bottom: 1px solid #eee;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Выбираем текущий массив для отображения
  const currentSites = activeTab === 'work' ? workSites : personalSites;

  return (
    <div className="sites-container w-100p">
      {/* Шапка табов */}
      <div className="sites-tabs-header">
        <button
          className={`sites-tab-btn ${activeTab === 'work' ? 'active' : ''}`}
          onClick={() => setActiveTab('work')}
        >
          Рабочие сайты ({workSites.length})
        </button>
        <button
          className={`sites-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Личные сайты ({personalSites.length})
        </button>
      </div>

      {/* Список активной вкладки */}
      <div className="sites df-fs-st w-100p">
        {currentSites.map((site, index) => (
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
    </div>
  );
}