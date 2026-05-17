import React, { useState } from 'react';

export default function ShadowWizard() {
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(8);
  const [shadowBlur, setShadowBlur] = useState(24);
  const [shadowSpread, setShadowSpread] = useState(-4);
  const [shadowOpacity, setShadowOpacity] = useState(0.15);
  const [copied, setCopied] = useState(false);

  // Генерируем цвет тени с учетом прозрачности
  const shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
  const shadowCode = `box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shadowCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Shadow Wizard</h2>
      <p style={styles.description}>Настройте идеальную тень для карточек, модалок или кнопок интерфейса.</p>

      <div style={styles.layout}>
        {/* Блок ползунков (Контроллеры) */}
        <div style={styles.controls}>
          <div style={styles.controlRow}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Смещение X (По горизонтали):</span>
              <span style={styles.value}>{shadowX}px</span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={shadowX} 
              onChange={(e) => setShadowX(Number(e.target.value))} 
              style={styles.range}
            />
          </div>

          <div style={styles.controlRow}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Смещение Y (По вертикали):</span>
              <span style={styles.value}>{shadowY}px</span>
            </div>
            <input 
              type="range" 
              min="-50" 
              max="50" 
              value={shadowY} 
              onChange={(e) => setShadowY(Number(e.target.value))} 
              style={styles.range}
            />
          </div>

          <div style={styles.controlRow}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Размытие (Blur):</span>
              <span style={styles.value}>{shadowBlur}px</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={shadowBlur} 
              onChange={(e) => setShadowBlur(Number(e.target.value))} 
              style={styles.range}
            />
          </div>

          <div style={styles.controlRow}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Растяжение (Spread):</span>
              <span style={styles.value}>{shadowSpread}px</span>
            </div>
            <input 
              type="range" 
              min="-30" 
              max="30" 
              value={shadowSpread} 
              onChange={(e) => setShadowSpread(Number(e.target.value))} 
              style={styles.range}
            />
          </div>

          <div style={styles.controlRow}>
            <div style={styles.labelRow}>
              <span style={styles.label}>Прозрачность (Opacity):</span>
              <span style={styles.value}>{Math.round(shadowOpacity * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={shadowOpacity} 
              onChange={(e) => setShadowOpacity(Number(e.target.value))} 
              style={styles.range}
            />
          </div>
        </div>

        {/* Блок «Живого» превью */}
        <div style={styles.previewArea}>
          <div style={{
            ...styles.previewBox,
            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColor}`
          }}>
            Preview
          </div>
        </div>
      </div>

      {/* Вывод готового CSS-кода */}
      <div style={styles.resultBlock}>
        <div style={styles.resultHeader}>
          <span style={styles.label}>Кликните по коду для копирования:</span>
          <button onClick={copyToClipboard} style={styles.copyBtn} type="button">
            {copied ? '✅ Скопировано!' : '📋 Копировать'}
          </button>
        </div>
        <code style={styles.codeBlock} onClick={copyToClipboard}>
          {shadowCode}
        </code>
      </div>
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
    marginBottom: '5px',
    fontSize: '20px',
  },
  description: {
    fontSize: '13px',
    color: 'rgba(0,0,0,0.5)',
    marginBottom: '20px',
    lineHeight: '1.4',
  },
  layout: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    marginBottom: '25px',
  },
  controls: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  controlRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  label: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  value: {
    color: '#007aff',
    fontWeight: '600',
  },
  range: {
    width: '100%',
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  previewArea: {
    width: '160px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBox: {
    width: '110px',
    height: '110px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    color: '#1c1c1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'box-shadow 0.1s ease',
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
  copyBtn: {
    background: 'rgba(0, 0, 0, 0.08)',
    border: 'none',
    color: '#222',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  codeBlock: {
    display: 'block',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  }
};