import React, { useState, useRef } from 'react';

export default function VideoConverter() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultSize, setResultSize] = useState(null);
  const [quality, setQuality] = useState(2500000);
  const [isDragging, setIsDragging] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
      setResultUrl(null);
      setProgress(0);
    }
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const convertToWebm = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    await new Promise((resolve) => {
      video.onloadedmetadata = () => resolve();
    });

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioSource, audioDestination;
    
    try {
      audioSource = audioContext.createMediaElementSource(video);
      audioDestination = audioContext.createMediaStreamDestination();
      audioSource.connect(audioDestination);
      audioSource.connect(audioContext.destination);
      
      const audioTrack = audioDestination.stream.getAudioTracks()[0];
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
    } catch (e) {
      console.warn('Аудиодорожка отсутствует или не доступна', e);
    }

    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: Number(quality)
    };

    const recorder = new MediaRecorder(
      stream, 
      MediaRecorder.isTypeSupported(options.mimeType) ? options : { mimeType: 'video/webm' }
    );

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultSize((blob.size / (1024 * 1024)).toFixed(2));
      setIsProcessing(false);
      setProgress(100);
      URL.revokeObjectURL(videoUrl);
    };

    recorder.start();
    await video.play();

    const drawFrame = () => {
      if (video.paused || video.ended) {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const currentProgress = Math.min(
        Math.round((video.currentTime / video.duration) * 100),
        99
      );
      setProgress(currentProgress);
      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  };

  const formatSize = (bytes) => (bytes / (1024 * 1024)).toFixed(2);
  const originalSizeMb = file ? formatSize(file.size) : 0;
  const savedPercent = resultSize ? Math.round((1 - resultSize / originalSizeMb) * 100) : 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎬 Video Converter & Compressor</h2>

      {/* Dropzone */}
      <div 
        style={{
          ...styles.dropzone,
          borderColor: isDragging ? '#6366f1' : '#374151',
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(31, 41, 55, 0.5)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="video/*" 
          onChange={handleFileChange}
          disabled={isProcessing}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
        <p style={{ margin: 0, fontSize: '14px', color: '#e5e7eb' }}>
          {file ? file.name : 'Перетащите видео сюда или кликните для выбора'}
        </p>
        {file && (
          <span style={styles.fileSizeBadge}>
            Размер: {originalSizeMb} MB
          </span>
        )}
      </div>

      {file && (
        <div style={styles.settingsGroup}>
          <label style={styles.label}>Качество / Битрейт:</label>
          <select 
            value={quality} 
            onChange={(e) => setQuality(e.target.value)}
            disabled={isProcessing}
            style={styles.select}
          >
            <option value="1000000">⚡ Низкое (Макс. сжатие ~1 Mbps)</option>
            <option value="2500000">⚖️ Среднее (Оптимально ~2.5 Mbps)</option>
            <option value="5000000">💎 Высокое (~5 Mbps)</option>
          </select>
        </div>
      )}

      {/* Progress Bar */}
      {isProcessing && (
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
          <span style={styles.progressText}>{progress}%</span>
        </div>
      )}

      {file && (
        <button 
          onClick={convertToWebm} 
          disabled={isProcessing}
          style={{
            ...styles.button,
            opacity: isProcessing ? 0.6 : 1,
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? 'Конвертация в процессе...' : 'Сконвертировать в WebM'}
        </button>
      )}

      {/* Result Section */}
      {resultUrl && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <span style={{ fontWeight: 600 }}>Результат:</span>
            <span style={styles.badge}>
              {resultSize} MB {savedPercent > 0 && `( -${savedPercent}% )`}
            </span>
          </div>

          <video 
            ref={videoRef} 
            src={resultUrl} 
            controls 
            style={styles.videoPreview} 
          />

          <a 
            href={resultUrl} 
            download={`converted_${Date.now()}.webm`}
            style={styles.downloadBtn}
          >
            💾 Скачать WebM
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    color: '#f3f4f6',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '500px',
    margin: '0 auto'
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    textAlign: 'center',
    background: 'linear-gradient(90deg, #818cf8, #c084fc)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  dropzone: {
    border: '2px dashed #374151',
    borderRadius: '12px',
    padding: '24px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '16px'
  },
  fileSizeBadge: {
    display: 'inline-block',
    marginTop: '8px',
    fontSize: '12px',
    padding: '2px 8px',
    backgroundColor: '#374151',
    borderRadius: '12px',
    color: '#9ca3af'
  },
  settingsGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#9ca3af',
    marginBottom: '6px'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    backgroundColor: '#1f2937',
    color: '#f3f4f6',
    border: '1px solid #374151',
    outline: 'none',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'transform 0.1s ease'
  },
  progressContainer: {
    position: 'relative',
    height: '20px',
    backgroundColor: '#1f2937',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '16px',
    border: '1px solid #374151'
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
    transition: 'width 0.2s ease'
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff'
  },
  resultCard: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: '12px',
    border: '1px solid #374151'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '14px'
  },
  badge: {
    backgroundColor: '#059669',
    color: '#ecfdf5',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  videoPreview: {
    width: '100%',
    maxHeight: '220px',
    borderRadius: '8px',
    backgroundColor: '#000',
    marginBottom: '12px'
  },
  downloadBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px'
  }
};