import React, { useState } from 'react';

export default function JsFilters() {
  const [activeSnippet, setActiveSnippet] = useState('unique');
  const [copied, setCopied] = useState(false);

  // База наших сниппетов и паттернов
  const snippets = {
    unique: {
      title: 'Удаление дубликатов',
      desc: 'Очищает массив от повторяющихся примитивных значений (строк или чисел) с помощью Set.',
      code: `const data = [1, 2, 2, 3, 4, 4, 5];\n\nconst unique = data.filter((item, index, array) => {\n  return array.indexOf(item) === index;\n});\n\n// Современный быстрый аналог без filter:\n// const unique = [...new Set(data)];`,
      result: '[1, 2, 3, 4, 5]'
    },
    falsy: {
      title: 'Очистка от "мусора" (Falsy)',
      desc: 'Удаляет из массива все ложные значения: null, undefined, false, 0, "" (пустые строки).',
      code: `const data = ['React', '', null, 'WordPress', undefined, 'JS', false];\n\nconst clean = data.filter(Boolean);\n\n// Или развернуто:\n// const clean = data.filter(item => !!item);`,
      result: '["React", "WordPress", "JS"]'
    },
    searchObj: {
      title: 'Поиск по объектам (Поиск по сайту)',
      desc: 'Фильтрует массив объектов по совпадению подстроки в определенном поле (без учета регистра).',
      code: `const posts = [\n  { id: 1, title: 'Изучаем React' },\n  { id: 2, title: 'Кастомные блоки WordPress' },\n  { id: 3, title: 'Основы JavaScript' }\n];\n\nconst query = 'word';\n\nconst searchResult = posts.filter(post => {\n  return post.title.toLowerCase().includes(query.toLowerCase());\n});`,
      result: '[\n  { "id": 2, "title": "Кастомные блоки WordPress" }\n]'
    },
    removeById: {
      title: 'Удаление элемента (Для стейта React)',
      desc: 'Классический паттерн для удаления объекта из массива по его ID (например, при клике на корзину).',
      code: `const items = [\n  { id: 10, name: 'Книга' },\n  { id: 20, name: 'Ручка' },\n  { id: 30, name: 'Блокнот' }\n];\n\nconst idToRemove = 20;\n\n// Оставляем всё, кроме элемента с этим id\nconst filteredItems = items.filter(item => item.id !== idToRemove);`,
      result: '[\n  { "id": 10, "name": "Книга" },\n  { "id": 30, "name": "Блокнот" }\n]'
    },
    byRange: {
      title: 'Фильтр по диапазону (Цены / Даты)',
      desc: 'Выбирает элементы, которые подходят под диапазон условий "от и до".',
      code: `const products = [\n  { name: 'Чехол', price: 500 },\n  { name: 'Зарядка', price: 1500 },\n  { name: 'Наушники', price: 4500 }\n];\n\nconst min = 1000;\nconst max = 3000;\n\nconst inRange = products.filter(p => p.price >= min && p.price <= max);`,
      result: '[\n  { "name": "Зарядка", "price": 1500 }\n]'
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🦊 JS Array Filter Wizard</h2>
      <p style={styles.description}>Готовые, оптимизированные паттерны фильтрации массивов для ваших проектов.</p>

      <div style={styles.layout}>
        {/* Меню выбора сниппета */}
        <div style={styles.sidebar}>
          {Object.keys(snippets).map((key) => (
            <button
              key={key}
              onClick={() => setActiveSnippet(key)}
              style={{
                ...styles.menuBtn,
                ...(activeSnippet === key ? styles.activeMenuBtn : {})
              }}
              type="button"
            >
              {snippets[key].title}
            </button>
          ))}
        </div>

        {/* Контентная часть */}
        <div style={styles.content}>
          <div style={styles.descBox}>
            <p style={styles.descText}>{snippets[activeSnippet].desc}</p>
          </div>

          <div style={styles.codeSection}>
            <div style={styles.codeHeader}>
              <span style={styles.sectionLabel}>JavaScript Code:</span>
              <button 
                onClick={() => copyToClipboard(snippets[activeSnippet].code)} 
                style={styles.copyBtn}
                type="button"
              >
                {copied ? '✅ Скопировано!' : '📋 Копировать код'}
              </button>
            </div>
            <pre style={styles.pre} onClick={() => copyToClipboard(snippets[activeSnippet].code)}>
              <code>{snippets[activeSnippet].code}</code>
            </pre>
          </div>

          <div style={styles.resultSection}>
            <span style={styles.sectionLabel}>Результат выполнения (Output):</span>
            <pre style={styles.resultPre}>
              <code>{snippets[activeSnippet].result}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    color: '#222',
    fontFamily: 'sans-serif',
    padding: '10px 5px',
    maxWidth: '650px',
  },
  title: {
    marginTop: 0,
    marginBottom: '5px',
    fontSize: '20px',
  },
  description: {
    fontSize: '13px',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: '20px',
  },
  layout: {
    display: 'flex',
    gap: '20px',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '200px',
    flexShrink: 0,
  },
  menuBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    color: 'rgba(0, 0, 0, 0.7)',
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  activeMenuBtn: {
    backgroundColor: '#007aff',
    color: '#222',
    borderColor: '#007aff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: 0, // фикс сжатия pre
  },
  descBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderLeft: '3px solid #007aff',
    padding: '10px 12px',
    borderRadius: '0 6px 6px 0',
  },
  descText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: '1.4',
    color: 'rgba(0,0,0,0.8)',
  },
  codeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: '11px',
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  copyBtn: {
    background: 'none',
    border: 'none',
    color: '#007aff',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '2px 6px',
  },
  pre: {
    margin: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '12px',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflowX: 'auto',
    cursor: 'pointer',
    lineHeight: '1.5',
  },
  resultSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  resultPre: {
    margin: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflowX: 'auto',
  }
};