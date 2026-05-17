import React, { useState } from 'react';

export default function ColorWizard() {
  const [hex, setHex] = useState('#4a90e2');

  // Хелпер: HEX в RGB
  const hexToRgb = (hexStr) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hexStr.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Хелпер: RGB в HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Хелпер: Расчет относительной яркости для контраста (WCAG)
  const getLuminance = (r, g, b) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : { h: 0, s: 0, l: 0 };

  // Считаем контрастность с белым и черным текстом
  const colorLum = rgb ? getLuminance(rgb.r, rgb.g, rgb.b) : 0;
  const whiteLum = 1;
  const blackLum = 0;
  
  const contrastWithWhite = rgb ? (whiteLum + 0.05) / (colorLum + 0.05) : 0;
  const contrastWithBlack = rgb ? (colorLum + 0.05) / (blackLum + 0.05) : 0;
  
  // Переворачиваем формулу, если значение меньше 1
  const finalContrastWhite = contrastWithWhite < 1 ? { ratio: 1 / contrastWithWhite, score: 'FAIL' } : { ratio: contrastWithWhite, score: contrastWithWhite >= 4.5 ? 'AAA' : contrastWithWhite >= 3 ? 'AA' : 'FAIL' };
  const finalContrastBlack = contrastWithBlack < 1 ? { ratio: 1 / contrastWithBlack, score: 'FAIL' } : { ratio: contrastWithBlack, score: contrastWithBlack >= 4.5 ? 'AAA' : contrastWithBlack >= 3 ? 'AA' : 'FAIL' };

  // Генерация оттенков (Светлее / Темнее)
  const generateShades = () => {
    if (!rgb) return [];
    return [-30, -20, -10, 0, 10, 20, 30].map((offset) => {
      let newL = hsl.l + offset;
      if (newL > 100) newL = 100;
      if (newL < 0) newL = 0;
      return `hsl(${hsl.h}, ${hsl.s}%, ${newL}%)`;
    });
  };

  const shades = generateShades();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔮 Color Wizard</h2>
      
      <div style={styles.inputRow}>
        <input 
          type="color" 
          value={hex} 
          onChange={(e) => setHex(e.target.value)} 
          style={styles.colorPicker}
        />
        <input 
          type="text" 
          value={hex} 
          onChange={(e) => setHex(e.target.value)} 
          placeholder="#000000"
          style={styles.input}
        />
      </div>

      {rgb && (
        <div style={styles.formatsGrid}>
          <div style={styles.formatCard} onClick={() => copyToClipboard(hex)}>
            <span style={styles.formatLabel}>HEX</span>
            <span style={styles.formatValue}>{hex.toUpperCase()} 📋</span>
          </div>
          <div style={styles.formatCard} onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
            <span style={styles.formatLabel}>RGB</span>
            <span style={styles.formatValue}>{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} 📋</span>
          </div>
          <div style={styles.formatCard} onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}>
            <span style={styles.formatLabel}>HSL</span>
            <span style={styles.formatValue}>{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} 📋</span>
          </div>
        </div>
      )}

      {/* Палитра оттенков */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Live Palette (Hover / Active states)</h4>
        <div style={styles.palette}>
          {shades.map((shade, idx) => (
            <div 
              key={idx} 
              style={{ ...styles.colorBlock, backgroundColor: shade }} 
              onClick={() => copyToClipboard(shade)}
              title={`Copy ${shade}`}
            >
              <span style={styles.colorBlockLabel}>{idx === 3 ? 'Base' : `${(idx - 3) * 10}%`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Проверка контраста */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>WCAG Contrast Checker</h4>
        <div style={styles.contrastRow}>
          <div style={{ ...styles.contrastBox, backgroundColor: hex, color: '#fff' }}>
            <span>White Text</span>
            <strong>{finalContrastWhite.ratio.toFixed(1)}:1</strong>
            <span style={styles.badge(finalContrastWhite.score)}>{finalContrastWhite.score}</span>
          </div>
          <div style={{ ...styles.contrastBox, backgroundColor: hex, color: '#000' }}>
            <span>Black Text</span>
            <strong>{finalContrastBlack.ratio.toFixed(1)}:1</strong>
            <span style={styles.badge(finalContrastBlack.score)}>{finalContrastBlack.score}</span>
          </div>
        </div>
      </div>
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
    color: 'rgba(0,0,0,0.8)',
  },
  inputRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  colorPicker: {
    border: 'none',
    width: '45px',
    height: '45px',
    borderRadius: '8px',
    cursor: 'pointer',
    background: 'none',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(0,0,0,0.5)',
    borderRadius: '8px',
    color: '#222',
    padding: '10px 14px',
    fontSize: '16px',
    width: '120px',
    outline: 'none',
  },
  formatsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
    marginBottom: '25px',
  },
  formatCard: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  formatLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 'bold',
  },
  formatValue: {
    fontSize: '13px',
    color: '#fff',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  section: {
    marginBottom: '25px',
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
  },
  palette: {
    display: 'flex',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '45px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  colorBlock: {
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s',
  },
  colorBlockLabel: {
    fontSize: '10px',
    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
    color: '#fff',
  },
  contrastRow: {
    display: 'flex',
    gap: '15px',
  },
  contrastBox: {
    flex: 1,
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    fontWeight: '500',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  badge: (score) => ({
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: score === 'FAIL' ? '#ff3b30' : '#34c759',
    color: '#fff',
    fontWeight: 'bold',
    marginTop: '5px',
  }),
};