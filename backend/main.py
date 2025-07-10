from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from utils.transcriber import fetch_youtube_transcript
from utils.video_downloader import download_video
from utils.frame_extractor import extract_key_frames
from utils.summarizer import (
    generate_structured_notes,
    generate_quiz_from_transcript,
    queue_frame_extraction
)
import os
import uuid
import traceback
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vidnote-ai.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static download directory for frames
downloads_path = os.path.join(os.path.dirname(__file__), "downloads")
os.makedirs(downloads_path, exist_ok=True)
app.mount("/downloads", StaticFiles(directory=downloads_path), name="downloads")


class VideoRequest(BaseModel):
    url: str


@app.post("/generate-summary/")
def generate_summary(data: VideoRequest, background_tasks: BackgroundTasks):
    try:
        video_id = str(uuid.uuid4())

        # 1. Download video
        video_path = download_video(data.url)

        # 2. Get transcript
        transcript = fetch_youtube_transcript(data.url)
        if not transcript:
            raise Exception("Transcript fetch failed or is empty")

        # 3. Generate structured notes
        detailed_notes = generate_structured_notes(transcript)

        # 4. Extract key frames in background
        background_tasks.add_task(queue_frame_extraction, video_path, video_id)

        return {
            "message": "Structured notes generated",
            "notes": detailed_notes,
            "video_id": video_id
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-frames/{video_id}")
def get_extracted_frames(video_id: str):
    try:
        files = sorted(os.listdir(downloads_path))
        frames = [f"/downloads/{f}" for f in files if f.startswith(video_id) and f.endswith(".jpg")]
        return {"frames": frames}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-quiz/")
def generate_quiz(data: VideoRequest):
    try:
        transcript = fetch_youtube_transcript(data.url)
        if not transcript:
            raise Exception("Transcript is empty")

        summary_html = generate_structured_notes(transcript)
        summary_text = BeautifulSoup(summary_html, "html.parser").get_text(separator=" ")

        questions = generate_quiz_from_transcript(summary_text)
        return {"questions": questions}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Internal Cleanup utility
def cleanup_files(video_path: str, video_id: str):
    try:
        if os.path.exists(video_path):
            os.remove(video_path)

        for file in os.listdir(downloads_path):
            if file.startswith(video_id) and file.endswith(".jpg"):
                os.remove(os.path.join(downloads_path, file))

        print(f"[CLEANUP] Deleted video and frames for video_id: {video_id}")
    except Exception as e:
        print(f"[CLEANUP ERROR] {e}")


# ✅ Manual cleanup endpoint (frontend should call this after rendering)
@app.post("/cleanup/{video_id}")
def cleanup_after_view(video_id: str):
    try:
        video_path = os.path.join(os.path.dirname(__file__), f"{video_id}.mp4")

        if os.path.exists(video_path):
            os.remove(video_path)

        for file in os.listdir(downloads_path):
            if file.startswith(video_id) and file.endswith(".jpg"):
                os.remove(os.path.join(downloads_path, file))

        print(f"[CLEANUP] Manually triggered cleanup for video_id: {video_id}")
        return {"message": "Cleanup completed"}

    except Exception as e:
        print(f"[CLEANUP ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))
