from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import boto3
from botocore.exceptions import NoCredentialsError
import uuid
import os
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File upload constraints
MAX_FILE_SIZE = 5 * 1024 * 1024  # 10MB in bytes
ALLOWED_FILE_TYPES = {
    'image': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
    'document': ['pdf', 'doc', 'docx', 'txt', 'rtf'],
    'archive': ['zip', 'rar', '7z', 'tar', 'gz'],
    'video': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
    'audio': ['mp3', 'wav', 'flac', 'aac', 'ogg']
}

# AWS credentials loaded from .env file
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
BUCKET_NAME = os.getenv("BUCKET_NAME")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

def get_file_category(file_extension: str) -> str:
    """Determine file category based on extension"""
    file_extension = file_extension.lower()
    for category, extensions in ALLOWED_FILE_TYPES.items():
        if file_extension in extensions:
            return category
    return 'unknown'

def is_file_type_allowed(filename: str) -> bool:
    """Check if file type is allowed"""
    if not filename or '.' not in filename:
        return False
    
    file_extension = filename.split('.')[-1].lower()
    for extensions in ALLOWED_FILE_TYPES.values():
        if file_extension in extensions:
            return True
    return False

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not is_file_type_allowed(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Supported types: {', '.join([ext for exts in ALLOWED_FILE_TYPES.values() for ext in exts])}"
            )
        
        # Read file content to check size
        file_content = await file.read()
        file_size = len(file_content)
        
        # Validate file size
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Generate unique file name
        file_extension = file.filename.split(".")[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Get file metadata
        file_category = get_file_category(file_extension)
        upload_time = datetime.now().isoformat()
        
        # Log file upload metadata
        logger.info(f"File upload - Original: {file.filename}, "
                   f"Size: {file_size} bytes ({file_size/(1024*1024):.2f}MB), "
                   f"Type: {file.content_type}, "
                   f"Category: {file_category}, "
                   f"Unique name: {unique_filename}, "
                   f"Upload time: {upload_time}")
        
        # Reset file pointer to beginning for S3 upload
        from io import BytesIO
        file_obj = BytesIO(file_content)
        
        # Upload to S3
        s3.upload_fileobj(
            file_obj,
            BUCKET_NAME,
            unique_filename,
            ExtraArgs={
                "Metadata": {
                    "original_filename": file.filename,
                    "file_size": str(file_size),
                    "content_type": file.content_type or "application/octet-stream",
                    "category": file_category,
                    "upload_time": upload_time
                }
            }
        )

        file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{unique_filename}"
        
        return {
            "url": file_url,
            "metadata": {
                "original_filename": file.filename,
                "file_size": file_size,
                "file_size_mb": round(file_size / (1024*1024), 2),
                "content_type": file.content_type,
                "category": file_category,
                "upload_time": upload_time,
                "unique_filename": unique_filename
            }
        }

    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="AWS credentials not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
