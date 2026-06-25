import React, { useState } from 'react';

export default function FluidTypographyCalculator() {
  // Исходные дефолтные значения (как в твоем ТЗ)
  const [minFontSize, setMinFontSize] = useState(22);
  const [maxFontSize, setMaxFontSize] = useState(48);
  const [minWidth, setMinWidth] = useState(400);
  const [maxWidth, setMaxWidth] = useState(1200);
  const [copied, setCopied] = useState(false);

  // Функция расчета строки clamp()
  const generateClamp = () => {
    const minFont = parseFloat(minFontSize);
    const maxFont = parseFloat(maxFontSize);
    const minW = parseFloat(minWidth);
    const maxW = parseFloat(maxWidth);

    if (!minFont || !maxFont || !minW || !maxW || minW === maxW) {
      return 'clamp(..., ..., ...)';
    }

    // Расчет наклона (slope) и пересечения (y-intercept)
    const slope = (maxFont - minFont) / (maxW - minW);
    const yIntersection = minFont - slope * minW;

    // Переводим в rem (базовый шрифт 16px) и vw
    const slopeVw = (slope * 100).toFixed(2);
    const interceptRem = (yIntersection / 16).toFixed(2);

    return `clamp(${minFont}px, ${interceptRem}rem + ${slopeVw}vw, ${maxFont}px)`;
  };

  const clampResult = generateClamp();

  const handleCopy = () => {
    navigator.clipboard.writeText(clampResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Сброс статуса через 2 сек
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Fluid Typography Calculator</h3>
      
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Min Font Size (px)</label>
          <input 
            type="number" 
            value={minFontSize} 
            onChange={(e) => setMinFontSize(e.target.value)} 
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Max Font Size (px)</label>
          <input 
            type="number" 
            value={maxFontSize} 
            onChange={(e) => setMaxFontSize(e.target.value)} 
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Min Screen Width (px)</label>
          <input 
            type="number" 
            value={minWidth} 
            onChange={(e) => setMinWidth(e.target.value)} 
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Max Screen Width (px)</label>
          <input 
            type="number" 
            value={maxWidth} 
            onChange={(e) => setMaxWidth(e.target.value)} 
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.outputContainer}>
        <code style={styles.code}>{clampResult}</code>
        <button onClick={handleCopy} style={styles.button}>
          {copied ? '✓ Скопировано' : 'Копировать'}
        </button>
      </div>
    </div>
  );
}

// Простые стили для интеграции в расширение (можно заменить на Tailwind/CSS Modules)
const styles = {
  container: {
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    color: '#cdd6f4',
    fontFamily: 'sans-serif',
    maxWidth: '100%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#333333'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '12px',
    color: '#333333'
  },
  input: {
    padding: '8px',
    background: '#313244',
    border: '1px solid #45475a',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none'
  },
  outputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'between',
    background: '#11111b',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #45475a',
    gap: '10px'
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#a6e3a1',
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflowX: 'auto'
  },
  button: {
    padding: '8px 12px',
    background: '#89b4fa',
    border: 'none',
    borderRadius: '6px',
    color: '#11111b',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s',
    ':hover': {
      background: '#b4befe'
    }
  }
};