import React, { useState, useRef } from 'react';

export default function DocConverter() {
  const [file, setFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError('');

    if (!selected) {
      setFile(null);
      return;
    }

    const validExtensions = ['.docx'];
    const ext = selected.name
      .slice(selected.name.lastIndexOf('.'))
      .toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError('Поддерживается только формат .docx (Word 2007+). Старый .doc сохраните как .docx в Word.');
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleConvert = async () => {
    if (!file) return;

    setIsConverting(true);
    setError('');

    try {
      // Динамически подгружаем mammoth для чтения docx
      const mammoth = await import('mammoth');
      // jsPDF для генерации PDF
      const { jsPDF } = await import('jspdf');

      // 1. Читаем docx и получаем HTML
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // 2. Парсим HTML во временный DOM
      const container = document.createElement('div');
      container.innerHTML = html;

      // 3. Создаём PDF
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      let cursorY = margin;

      // Проходим по блокам (параграфы, заголовки, списки)
      const blocks = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');

      blocks.forEach((el) => {
        const tag = el.tagName.toLowerCase();
        let fontSize = 12;
        let fontStyle = 'normal';

        if (/^h[1-6]$/.test(tag)) {
          const level = parseInt(tag[1], 10);
          fontSize = Math.max(24 - (level - 1) * 3, 12);
          fontStyle = 'bold';
        }

        doc.setFont('helvetica', fontStyle);
        doc.setFontSize(fontSize);

        const text = el.textContent.trim();
        if (!text) return;

        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 1.4;

        lines.forEach((line) => {
          if (cursorY + lineHeight > pageHeight - margin) {
            doc.addPage();
            cursorY = margin;
          }
          doc.text(line, margin, cursorY);
          cursorY += lineHeight;
        });

        cursorY += 6; // отступ между блоками
      });

      // 4. Скачиваем
      const pdfName = file.name.replace(/\.(docx?|DOCX?)$/, '') + '.pdf';
      doc.save(pdfName);
    } catch (err) {
      console.error(err);
      setError('Ошибка конвертации: ' + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="doc-converter">
      <h3>📄 DOC → PDF Converter</h3>

      <div className="doc-converter__dropzone">
        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          id="doc-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="doc-input" className="doc-converter__label">
          {file ? `📎 ${file.name}` : 'Выберите .doc или .docx файл'}
        </label>
      </div>

      {error && <p className="doc-converter__error">{error}</p>}

      <div className="doc-converter__actions">
        <button
          onClick={handleConvert}
          disabled={!file || isConverting}
          className="tool-card"
        >
          {isConverting ? '⏳ Конвертация...' : '🚀 Конвертировать в PDF'}
        </button>

        {file && (
          <button onClick={handleReset} className="tool-card">
            ✖ Сбросить
          </button>
        )}
      </div>

      <p className="doc-converter__hint">
        Поддерживается формат <b>.docx</b> (современный Word). Старый <b>.doc</b>{' '}
        может не конвертироваться корректно.
      </p>
    </div>
  );
}