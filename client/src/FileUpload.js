import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [error, setError] = useState("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'doc', 'docx', 'txt', 'rtf', 'zip', 'rar', '7z', 'tar', 'gz', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mp3', 'wav', 'flac', 'aac', 'ogg'];
  
  // API Base URL from environment variables
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");
    setUrl("");
    setFileMetadata(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Client-side validation
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!ALLOWED_TYPES.includes(fileExtension)) {
      setError(`File type not allowed. Supported types: ${ALLOWED_TYPES.join(', ')}`);
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024*1024)}MB`);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    
    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      setUrl(res.data.url);
      setFileMetadata(res.data.metadata);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileCategory = (filename) => {
    if (!filename) return 'unknown';
    const ext = filename.split('.').pop().toLowerCase();
    
    const categories = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
      document: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
      archive: ['zip', 'rar', '7z', 'tar', 'gz'],
      video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
      audio: ['mp3', 'wav', 'flac', 'aac', 'ogg']
    };
    
    for (const [category, extensions] of Object.entries(categories)) {
      if (extensions.includes(ext)) return category;
    }
    return 'unknown';
  };

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <div className="file-input-wrapper">
          <input 
            type="file" 
            onChange={handleFileChange}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            <span className="upload-icon">📁</span>
            {file ? file.name : 'Choose a file...'}
          </label>
        </div>

        {file && (
          <div className="file-info">
            <div className="file-details">
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
              <p><strong>Type:</strong> {file.type || 'Unknown'}</p>
              <p><strong>Category:</strong> {getFileCategory(file.name)}</p>
            </div>
          </div>
        )}

        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className={`upload-button ${uploading ? 'uploading' : ''}`}
        >
          {uploading ? `Uploading... ${uploadProgress}%` : 'Upload File'}
        </button>

        {uploading && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {url && fileMetadata && (
          <div className="success-section">
            <div className="success-message">
              <span className="success-icon">✅</span>
              File uploaded successfully!
            </div>
            
            <div className="file-metadata">
              <h3>Upload Details:</h3>
              <div className="metadata-grid">
                <div><strong>Original Name:</strong> {fileMetadata.original_filename}</div>
                <div><strong>File Size:</strong> {fileMetadata.file_size_mb} MB</div>
                <div><strong>Content Type:</strong> {fileMetadata.content_type}</div>
                <div><strong>Category:</strong> {fileMetadata.category}</div>
                <div><strong>Upload Time:</strong> {new Date(fileMetadata.upload_time).toLocaleString()}</div>
                <div><strong>Unique ID:</strong> {fileMetadata.unique_filename}</div>
              </div>
            </div>

            <div className="file-link">
              <p><strong>File URL:</strong></p>
              <a href={url} target="_blank" rel="noreferrer" className="download-link">
                {url}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="upload-guidelines">
        <h3>Upload Guidelines:</h3>
        <ul>
          <li>Maximum file size: 10MB</li>
          <li>Supported formats:</li>
          <ul>
            <li><strong>Images:</strong> JPG, PNG, GIF, BMP, WebP</li>
            <li><strong>Documents:</strong> PDF, DOC, DOCX, TXT, RTF</li>
            <li><strong>Archives:</strong> ZIP, RAR, 7Z, TAR, GZ</li>
            <li><strong>Videos:</strong> MP4, AVI, MOV, WMV, FLV, WebM</li>
            <li><strong>Audio:</strong> MP3, WAV, FLAC, AAC, OGG</li>
          </ul>
        </ul>
      </div>
    </div>
  );
}

export default FileUpload;
