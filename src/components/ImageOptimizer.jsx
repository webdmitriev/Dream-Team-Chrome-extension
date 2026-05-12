import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';

const ImageOptimizer = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const compressSingleImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
      // Удаляем лишние метаданные PNG для максимального сжатия
      alwaysKeepIdatChunks: false 
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return {
        id: Math.random().toString(36).substr(2, 9),
        blob: compressedFile, // Сохраняем blob для архивации
        name: compressedFile.name,
        size: (compressedFile.size / 1024).toFixed(2) + ' KB',
        oldSize: (file.size / 1024).toFixed(2) + ' KB',
        url: URL.createObjectURL(compressedFile),
        originalName: file.name
      };
    } catch (error) {
      console.error(`Ошибка при сжатии ${file.name}:`, error);
      return null;
    }
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });

    const compressedResults = [];
    for (let i = 0; i < files.length; i++) {
      const result = await compressSingleImage(files[i]);
      if (result) compressedResults.push(result);
      setProgress(prev => ({ ...prev, current: i + 1 }));
    }

    setResults(prev => [...prev, ...compressedResults]);
    setIsProcessing(false);
  };

  // Функция для скачивания всех файлов одним архивом
  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    
    results.forEach((res) => {
      // Добавляем каждый файл в корень архива
      zip.file(`opt_${res.originalName}`, res.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(content);
    
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = `optimized_images_${new Date().getTime()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="optimizer-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Optimize Images</h3>
      
      <div style={dropZoneStyle}>
        <input 
          type="file" 
          multiple 
          accept="image/jpeg, image/png" 
          onChange={handleUpload} 
          disabled={isProcessing}
          id="fileInput"
          style={{ display: 'none' }}
        />
        <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block' }}>
          {isProcessing 
            ? `⏳ Compressing: ${progress.current} / ${progress.total}` 
            : "(JPG, PNG)"}
        </label>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <button onClick={downloadAllAsZip} style={zipButtonStyle}>
              📦 Download all as ZIP archive
            </button>
            <button onClick={() => setResults([])} style={clearButtonStyle}>
              🗑️ Clear all
            </button>
          </div>

          <div style={tableContainerStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
                  <th style={thStyle}>File</th>
                  <th style={thStyle}>Result</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res) => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={tdStyle}>{res.name}</td>
                    <td style={tdStyle}>
                      <small style={{ display: 'block', width: '100%', color: '#999' }}>{res.oldSize}</small>
                      <strong>{res.size}</strong>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <a href={res.url} download={`opt_${res.originalName}`} style={downloadLinkStyle}>
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Стили
const dropZoneStyle = {
  border: '2px dashed #4A90E2',
  borderRadius: '12px',
  padding: '30px',
  textAlign: 'center',
  background: '#F5F9FF',
  color: '#4A90E2',
  fontWeight: 'bold'
};

const zipButtonStyle = {
  background: '#4CAF50',
  color: 'white',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const clearButtonStyle = {
  background: '#transparent',
  color: '#FF5252',
  border: '1px solid #FF5252',
  padding: '10px 18px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const tableContainerStyle = {
  maxHeight: '380px',
  overflowY: 'auto',
  border: '1px solid #eee',
  borderRadius: '8px'
};

const thStyle = { padding: '12px', fontSize: '14px', color: '#666' };
const tdStyle = { minWidth: '130px', padding: '12px', fontSize: '14px' };
const downloadLinkStyle = { color: '#4A90E2', textDecoration: 'none', fontWeight: 'bold' };

export default ImageOptimizer;