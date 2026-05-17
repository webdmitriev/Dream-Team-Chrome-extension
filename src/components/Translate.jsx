import React, { useState, useEffect } from 'react';

export default function Translate() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isEnToRu, setIsEnToRu] = useState(true); // true = EN->RU, false = RU->EN
  const [isLoading, setIsLoading] = useState(false);

  // Функция запроса к бесплатному API Google Translate
  const handleTranslate = async (sourceText, enToRu) => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    const sourceLang = enToRu ? 'en' : 'ru';
    const targetLang = enToRu ? 'ru' : 'en';

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;

      const response = await fetch(url);
      const data = await response.json();

      // Собираем перевод из хитрой структуры массивов Google
      const result = data[0].map(item => item[0]).join('');
      setTranslatedText(result);
    } catch (error) {
      console.error('Ошибка перевода:', error);
      setTranslatedText('Ошибка перевода...');
    } finally {
      setIsLoading(false);
    }
  };

  // Дебаунс: перевод сработает через 500мс после того, как пользователь закончил ввод
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTranslate(text, isEnToRu);
    }, 500);

    return () => clearTimeout(timer);
  }, [text, isEnToRu]);

  // Смена направления перевода
  const handleSwap = () => {
    setIsEnToRu(!isEnToRu);
    setText(translatedText);
    setTranslatedText(text);
  };

  return (
    <div className="translator-card" style={styles.card}>
      <div className="translator-header" style={styles.header}>
        <span style={styles.langLabel}>{isEnToRu ? '🇬🇧 EN' : '🇷🇺 RU'}</span>
        <button onClick={handleSwap} style={styles.swapBtn} type="button">⇄</button>
        <span style={styles.langLabel}>{isEnToRu ? '🇷🇺 RU' : '🇬🇧 EN'}</span>
      </div>

      <div style={styles.body}>
        <textarea
          style={styles.textarea}
          placeholder={isEnToRu ? "Type english text..." : "Введите русский текст..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
        />

        <div style={styles.outputContainer}>
          {isLoading ? (
            <div style={styles.loader}>Translating...</div>
          ) : (
            <div style={text ? styles.outputText : styles.placeholderText}>
              {translatedText || (isEnToRu ? "Перевод появится здесь" : "Translation will appear here")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Стили, адаптированные под темную тему расширения
const styles = {
  card: {
    width: '100%',
    marginBottom: '10px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '5px',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  langLabel: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  swapBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textarea: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    padding: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  },
  outputContainer: {
    width: '100%',
    minHeight: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'flex-start',
  },
  outputText: {
    color: '#222', // Приятный зеленый цвет для результата перевода
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    width: '100%'
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  loader: {
    color: '#fff', // Оранжевый цвет для лоадера
    fontSize: '13px',
    fontStyle: 'italic'
  }
};