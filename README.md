# 📤 Advanced File Uploader

A modern, full-stack file uploading application built with **React** frontend and **FastAPI** backend, featuring secure AWS S3 integration, real-time validation, and comprehensive metadata tracking.

![File Uploader](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)

## ✨ Features

### 🔒 **Security & Validation**
- File type validation (images, documents, archives, videos, audio)
- File size limits (configurable, default: 5MB)
- Secure environment variable management
- CORS protection
- AWS S3 secure storage

### 📊 **Metadata & Logging**
- Real-time upload progress tracking
- Comprehensive file metadata collection
- Server-side logging with detailed information
- Upload timestamp and unique file identification

### 🎨 **Modern UI/UX**
- Beautiful gradient design with responsive layout
- Drag-and-drop file selection interface
- Real-time validation feedback
- Upload progress indicators
- Detailed upload results display

### ⚡ **Performance**
- Asynchronous file processing
- Efficient memory usage with BytesIO
- Optimized for large file uploads
- Fast AWS S3 integration

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI library
- **Axios** - HTTP client for API requests
- **CSS3** - Advanced styling with gradients and animations
- **Responsive Design** - Mobile-first approach

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.13+** - Latest Python features
- **Boto3** - AWS SDK for S3 integration
- **Python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server

### Cloud & Storage
- **AWS S3** - Secure file storage
- **Environment Variables** - Secure configuration management

## 📋 Supported File Types

| Category | Extensions |
|----------|------------|
| **Images** | JPG, JPEG, PNG, GIF, BMP, WebP |
| **Documents** | PDF, DOC, DOCX, TXT, RTF |
| **Archives** | ZIP, RAR, 7Z, TAR, GZ |
| **Videos** | MP4, AVI, MOV, WMV, FLV, WebM |
| **Audio** | MP3, WAV, FLAC, AAC, OGG |

## 🚀 Quick Start

### Prerequisites
- **Python 3.13+**
- **Node.js 16+**
- **AWS Account** with S3 access
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Task1
```

### 2. Backend Setup (FastAPI)
```bash
cd server

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

#### Configure Environment Variables
Edit `server/.env` with your AWS credentials:
```env
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-south-1
BUCKET_NAME=your-s3-bucket-name
```

#### Start the Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup (React)
```bash
cd client

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
Task1/
├── README.md
├── .gitignore
├── client/                    # React Frontend
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   └── src/
│       ├── App.js            # Main application component
│       ├── App.css           # Global styles
│       ├── FileUpload.js     # File upload component
│       ├── FileUpload.css    # Component-specific styles
│       └── ...
└── server/                   # FastAPI Backend
    ├── main.py              # Main application file
    ├── requirements.txt     # Python dependencies
    ├── .env.example        # Environment template
    └── .env                # Your configuration (not in git)
```

## 🔧 Configuration

### File Upload Limits
Modify in `server/main.py`:
```python
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB in bytes
```

### Allowed File Types
Add/remove file types in `server/main.py`:
```python
ALLOWED_FILE_TYPES = {
    'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
    # Add more categories...
}
```

### CORS Configuration
Update allowed origins in `server/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    # ...
)
```

## 📡 API Endpoints

### POST `/upload`
Upload a file to AWS S3 with validation and metadata tracking.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field

**Response:**
```json
{
  "url": "https://bucket-name.s3.amazonaws.com/unique-filename.ext",
  "metadata": {
    "original_filename": "document.pdf",
    "file_size": 1048576,
    "file_size_mb": 1.0,
    "content_type": "application/pdf",
    "category": "document",
    "upload_time": "2024-01-15T10:30:00.123456",
    "unique_filename": "uuid.pdf"
  }
}
```

**Error Responses:**
- `400`: Invalid file type or size limit exceeded
- `500`: Server error or AWS configuration issue

## 🔒 Security Features

### Environment Variables
- AWS credentials stored securely in `.env`
- Environment template provided (`.env.example`)
- `.gitignore` prevents credential exposure

### File Validation
- Server-side file type validation
- File size limit enforcement
- Content-type verification

### AWS S3 Security
- Unique filename generation (UUID)
- Metadata storage for audit trails
- Configurable bucket permissions

## 📊 Logging & Monitoring

The application provides comprehensive logging:

```python
# Example log entry
INFO: File upload - Original: document.pdf, 
      Size: 1048576 bytes (1.00MB), 
      Type: application/pdf, 
      Category: document, 
      Unique name: 123e4567-e89b-12d3-a456-426614174000.pdf, 
      Upload time: 2024-01-15T10:30:00.123456
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CORS Errors
```bash
# Ensure FastAPI server is running on port 8000
# Check CORS configuration in main.py
```

#### 2. AWS Credentials
```bash
# Verify .env file exists and contains valid AWS credentials
# Check AWS IAM permissions for S3 access
```

#### 3. File Upload Fails
```bash
# Check file size (must be < 5MB by default)
# Verify file type is in allowed list
# Ensure S3 bucket exists and is accessible
```

#### 4. Module Import Errors
```bash
# Install missing dependencies
pip install -r requirements.txt

# For frontend
npm install
```

## 🚀 Deployment

### Backend Deployment (AWS/Heroku/DigitalOcean)
1. Set environment variables in your hosting platform
2. Install dependencies: `pip install -r requirements.txt`
3. Run: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: http://localhost:8000/docs
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 👨‍💻 Author

**Deekshith RP**
- GitHub: [@deekshithrp](https://github.com/deekshithrp)
- Email: your-email@example.com

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ and ☕
