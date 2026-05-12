import React, { useState } from 'react';

// Выносим твою логику (я немного упростил для краткости, используй свой полный список сокращений)
const capitalizeAfterDotSimple = (text) => {
  if (!text || typeof text !== 'string') return text;
  const exceptions = ['т.е', 'т.к', 'т.д', 'т.п', 'см.', 'г.', 'ул.', 'д.', 'в.', 'вв.'];
  const exceptionPattern = new RegExp(`\\b(${exceptions.join('|')})\\.\\s`, 'gi');
  const markers = [];
  let tempText = text.replace(exceptionPattern, (match) => {
    const marker = `__ABBR_${markers.length}__`;
    markers.push({ marker, original: match });
    return marker;
  });
  tempText = tempText.replace(/(?<=\.\s+)([а-яё])/g, (match) => match.toUpperCase());
  tempText = tempText.replace(/^([а-яё])/, (match) => match.toUpperCase());
  markers.forEach(({ marker, original }) => {
    tempText = tempText.replace(marker, original);
  });
  return tempText;
};

const typographText = (text) => {
  if (!text || typeof text !== 'string') return text;
  let result = text.replace(/\u00A0/g, ' '); // Сбрасываем старые неразрывные
  result = result.replace(/(\s)-(\s)/g, '$1—$2'); // Тире
  result = result.replace(/(\d)\s*-\s*(\d)/g, '$1–$2'); // Короткое тире

  // Неразрывные пробелы после коротких слов
  const shortWords = ['в', 'и', 'к', 'с', 'у', 'о', 'а', 'я', 'он', 'но', 'за', 'из', 'от', 'до', 'по', 'не', 'на', 'без'];
  shortWords.forEach(word => {
    const regex = new RegExp(`(^|\\s)${word}(\\s)`, 'gi');
    result = result.replace(regex, `$1${word}\u00A0`);
  });

  // Пробел перед единицами измерения
  result = result.replace(/(\d+)\s*(руб|р|кг|г|см|м|км|ч|мин|сек)/gi, '$1\u00A0$2');
  
  result = capitalizeAfterDotSimple(result);
  return result;
};

const Typograf = () => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');

  const handleTypograph = () => {
    if (!text) return;
    const processed = typographText(text);
    setText(processed);
    
    // Копируем в буфер обмена сразу
    navigator.clipboard.writeText(processed).then(() => {
      setStatus('Готово! Текст в буфере');
      setTimeout(() => setStatus(''), 2000);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Типограф (No-break space)</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Вставьте ваш текст здесь..."
        style={textareaStyle}
      />
      
      <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button onClick={handleTypograph} style={buttonStyle}>
          Оттипографить и скопировать
        </button>
        {status && <span style={{ color: '#4CAF50', fontSize: '14px' }}>{status}</span>}
      </div>
      
      <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
        * Исправит тире, добавит &nbsp; после предлогов и сделает заглавные после точек.
      </p>
    </div>
  );
};

// Стили
const textareaStyle = {
  width: '100%',
  height: '150px',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontFamily: 'inherit',
  fontSize: '14px',
  resize: 'vertical'
};

const buttonStyle = {
  background: '#4A90E2',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Typograf;