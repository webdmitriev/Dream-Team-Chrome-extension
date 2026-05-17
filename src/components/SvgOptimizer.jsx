import React, { useState } from 'react';

export default function SvgOptimizer() {
  const [rawSvg, setRawSvg] = useState('');
  const [cleanSvg, setCleanSvg] = useState('');
  const [isCurrentColor, setIsCurrentColor] = useState(true);
  const [copied, setCopied] = useState(false);

  const optimizeSvg = (input) => {
    if (!input.trim()) {
      setCleanSvg('');
      return;
    }

    let optimized = input;

    // 1. Удаляем XML-декларации, doctype и комментарии
    optimized = optimized.replace(/<\?xml.*\?>/gi, '');
    optimized = optimized.replace(/<!DOCTYPE.*?>/gi, '');
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');

    // 2. Удаляем мусорные атрибуты Figma, Sketch и Inkscape
    optimized = optimized.replace(/\s(x|y|id|version="[^"]*"|xmlns="[^"]*"|xml:space="[^"]*")/gi, ' ');
    optimized = optimized.replace(/\s(enable-background="[^"]*"|sketch:[^=]+="[^"]*")/gi, ' ');
    
    // ВАЖНО: оставляем xmlns только в корневом теге <svg>, если его там нет
    if (!optimized.includes('xmlns="')) {
      optimized = optimized.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // 3. Заменяем жесткие цвета на currentColor (чтобы управлять цветом через CSS)
    if (isCurrentColor) {
      // Заменяем fill="..." и stroke="..." если они не "none"
      optimized = optimized.replace(/fill="(?!none)[^"]+"/gi, 'fill="currentColor"');
      optimized = optimized.replace(/stroke="(?!none)[^"]+"/gi, 'stroke="currentColor"');
    }

    // 4. Чистим лишние пробелы и переносы строк
    optimized = optimized.replace(/\s{2,}/g, ' ');
    optimized = optimized.trim();

    setCleanSvg(optimized);
  };

  const handleProcess = () => {
    optimizeSvg(rawSvg);
  };

  const copyToClipboard = () => {
    if (!cleanSvg) return;
    navigator.clipboard.writeText(cleanSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>⚡ SVG Optimizer & Sanitizer</h2>
      
      <textarea
        style={styles.textarea}
        placeholder="Вставьте сырой код <svg> из Figma или файла..."
        value={rawSvg}
        onChange={(e) => setRawSvg(e.target.value)}
        rows={6}
      />

      <div style={styles.optionsRow}>
        <button onClick={handleProcess} style={styles.processBtn} type="button">
          Очистить SVG
        </button>
      </div>

      {cleanSvg && (
        <div style={styles.resultContainer}>
          <div style={styles.resultHeader}>
            <span style={styles.resultTitle}>Результат:</span>
            <button onClick={copyToClipboard} style={styles.copyBtn} type="button">
              {copied ? '✅ Скопировано!' : '📋 Копировать код'}
            </button>
          </div>
          
          <textarea
            style={{ ...styles.textarea, ...styles.output }}
            value={cleanSvg}
            readOnly
            rows={4}
          />

          <div style={styles.previewSection}>
            <span style={styles.resultTitle}>Превью (в цвете темы):</span>
            <div 
              style={styles.previewBox} 
              dangerouslySetInnerHTML={{ __html: cleanSvg }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    color: '#fff',
    fontFamily: 'sans-serif',
    padding: '10px 5px',
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '20px',
    color: '#222',
  },
  textarea: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    padding: '12px',
    fontSize: '13px',
    fontFamily: 'monospace',
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: '15px 0',
  },
  processBtn: {
    background: '#34c759',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  resultContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  copyBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#222',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  output: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
    color: '#aaa',
  },
  previewSection: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  previewBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    color: '#fff', // Задаем иконке тестовый оранжевый цвет через CSS родителя
    maxHeight: '100px',
    overflow: 'hidden',
  }
};