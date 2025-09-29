# 📤 Advanced File Uploader

A modern, full-stack file uploading application built with **React** frontend and **FastAPI** backend, featuring secure AWS S3 integration, real-time validation, and comprehensive metadata tracking.

🌐 **Live Demo**: [https://simplefileuploader.vercel.app](https://simplefileuploader.vercel.app)

![File Uploader](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688)

## 🛠️ Tech Stack
- **Frontend**: React 18+, Axios, CSS3
- **Backend**: FastAPI, Python 3.13+, Boto3
- **Storage**: AWS S3
- **Deployment**: Vercel (Frontend), Uvicorn (Backend)

## 📋 Supported File Types
- **Images**: JPG, JPEG, PNG, GIF, BMP, WebP
- **Documents**: PDF, DOC, DOCX, TXT, RTF  
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Videos**: MP4, AVI, MOV, WMV, FLV, WebM
- **Audio**: MP3, WAV, FLAC, AAC, OGG

## 🚀 Setup & Run

### Prerequisites
- Python 3.13+
- Node.js 16+
- AWS Account with S3 access

### 1. Clone Repository
```bash
git clone [<repository-url>](https://github.com/rpdeeksh/simplefileuploader.git)
cd Task1
```

### 2. Backend Setup
```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Configure AWS credentials in .env
cp .env.example .env
# Edit .env with your AWS S3 credentials

# Run server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup  
```bash
cd client
npm install

# Configure API URL in .env
cp .env.example .env  
# Edit .env with your backend URL

# Run frontend
npm start
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Docs**: http://localhost:8000/docs

## 🔧 Environment Configuration

### Server (.env)
```env
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=ap-south-1
BUCKET_NAME=your-s3-bucket-name
```

### Client (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:8000
# For production: https://your-api-domain.com
```

## 👨‍💻 Author

**Deekshith RP**
- GitHub: [[@rpdeeksh](https://github.com/rpdeeksh)]

---

⭐ **Star this repository if you found it helpful!**
