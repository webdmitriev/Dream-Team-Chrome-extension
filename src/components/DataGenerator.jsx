import React, { useState } from 'react';

export default function DataGenerator() {
  const [dataType, setDataType] = useState('lorem'); // lorem, users, text
  const [count, setCount] = useState(3);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  // Списки для генерации фейковых юзеров
  const firstNames = ['Дмитрий', 'Александр', 'Елена', 'Ольга', 'Алексей', 'Ирина', 'Артем', 'Наталья'];
  const lastNames = ['Иванов', 'Петров', 'Смирнова', 'Кузнецов', 'Попова', 'Васильев', 'Соколов', 'Новикова'];
  const domains = ['gmail.com', 'yandex.ru', 'mail.ru', 'outlook.com'];
  const positions = ['Frontend Developer', 'UI/UX Designer', 'Project Manager', 'DevOps Engineer', 'QA Specialist'];

  const loremParagraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    "Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat. Praesent id massa ac neque elementum vehicula. In id erat non orci commodo lobortis."
  ];

  const generateData = () => {
    let generated = '';

    if (dataType === 'lorem') {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(loremParagraphs[i % loremParagraphs.length]);
      }
      generated = paragraphs.join('\n\n');
    } 
    
    else if (dataType === 'users') {
      const users = [];
      for (let i = 0; i < count; i++) {
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const pos = positions[Math.floor(Math.random() * positions.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const id = Math.floor(1000 + Math.random() * 9000);
        
        users.push({
          id,
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}${id}@${domain}`,
          role: pos,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`
        });
      }
      generated = JSON.stringify(users, null, 2);
    } 
    
    else if (dataType === 'text') {
      const words = ["интерфейс", "компонент", "разработка", "скрипт", "адаптив", "стили", "функция", "массив", "объект", "валидация", "запрос", "сервер"];
      let lines = [];
      for (let i = 0; i < count; i++) {
        let line = [];
        const wordCount = 3 + Math.floor(Math.random() * 5);
        for (let j = 0; j < wordCount; j++) {
          line.push(words[Math.floor(Math.random() * words.length)]);
        }
        lines.push(line.join(' '));
      }
      generated = lines.join('\n');
    }

    setResult(generated);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎲 Dummy Data Generator</h2>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Что генерируем:</label>
          <select 
            value={dataType} 
            onChange={(e) => setDataType(e.target.value)} 
            style={styles.select}
          >
            <option value="lorem">Lorem Ipsum (Абзацы)</option>
            <option value="users">Массив Users (JSON)</option>
            <option value="text">Короткие строки (Для меню/заголовков)</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Количество:</label>
          <input 
            type="number" 
            min="1" 
            max="20" 
            value={count} 
            onChange={(e) => setCount(parseInt(e.target.value) || 1)} 
            style={styles.input}
          />
        </div>
      </div>

      <button onClick={generateData} style={styles.generateBtn} type="button">
        Сгенерировать данные
      </button>

      {result && (
        <div style={styles.resultBlock}>
          <div style={styles.resultHeader}>
            <span style={styles.resultTitle}>Сгенерировано:</span>
            <button onClick={copyToClipboard} style={styles.copyBtn} type="button">
              {copied ? '✅ Скопировано!' : '📋 Копировать'}
            </button>
          </div>
          <textarea
            style={styles.textarea}
            value={result}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    color: '#222',
    fontFamily: 'sans-serif',
    padding: '10px 5px',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '20px',
  },
  row: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  label: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  select: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: '8px',
    color: '#222',
    padding: '10px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: '8px',
    color: '#222',
    padding: '10px',
    fontSize: '14px',
    outline: 'none',
    width: '70px',
  },
  generateBtn: {
    background: '#007aff',
    border: 'none',
    color: '#222',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    width: '100%',
    marginBottom: '15px',
  },
  resultBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: '13px',
    color: 'rgba(0, 0, 0, 0.5)',
  },
  copyBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#222',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  textarea: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    color: '#000',
    padding: '12px',
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  }
};