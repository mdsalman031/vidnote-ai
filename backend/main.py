# main.py

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, HttpUrl
from utils.summarizer import (
    generate_structured_notes,
    generate_quiz_from_transcript,
    generate_flashcards_from_transcript,
    answer_question_about_transcript, 
)
from utils.transcriber import transcribe_audio
from utils.video_downloader import download_video
from utils.frame_extractor import extract_key_frames
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import traceback
import uuid
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoURL(BaseModel):
    url: HttpUrl

app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

@app.post("/generate-summary/")
async def generate_summary(data: VideoURL):
    try:
        video_id = str(uuid.uuid4())
        transcript = transcribe_audio(str(data.url))
        if not transcript:
            raise Exception("Transcript could not be generated")

        notes_html = generate_structured_notes(transcript)

        return {
            "message": "Structured notes generated",
            "notes": notes_html,
            "video_id": video_id
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-quiz/")
async def generate_quiz(data: VideoURL):
    try:
        transcript = transcribe_audio(str(data.url))
        if not transcript:
            raise Exception("Transcript is empty")

        summary_html = generate_structured_notes(transcript)
        summary_text = BeautifulSoup(summary_html, "html.parser").get_text(separator=" ")
        questions = generate_quiz_from_transcript(summary_text)

        return {"questions": questions}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/key-frames/")
async def key_frame_generation(data: VideoURL):
    try:
        video_path = download_video(str(data.url))
        key_frame_paths = extract_key_frames(video_path)
        frame_urls = [f"/{path}" for path in key_frame_paths]
        return {"message": "Key frames generated successfully", "frames": frame_urls}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Key frame generation failed: {str(e)}")

@app.post("/cleanup/{video_id}")
def cleanup_all_downloads(video_id: str):
    downloads_dir = Path("downloads")
    try:
        if downloads_dir.exists() and downloads_dir.is_dir():
            for file in downloads_dir.iterdir():
                if file.is_file():
                    file.unlink()
                elif file.is_dir():
                    shutil.rmtree(file)
            return {"message": "All files in 'downloads/' deleted successfully"}
        else:
            return {"message": "'downloads/' folder does not exist"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@app.post("/generate-flashcards/")
async def flashcards_endpoint(request: Request):
    try:
        data = await request.json()
        url = data.get("youtube_url")
        if not url:
            raise HTTPException(status_code=400, detail="youtube_url is required")

        transcript = transcribe_audio(url)
        if not transcript:
            raise HTTPException(status_code=500, detail="Transcript could not be extracted")

        flashcards = generate_flashcards_from_transcript(transcript)
        return {"flashcards": flashcards}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Flashcard generation failed: {str(e)}")

# ✅ Chatbot Endpoint
@app.post("/ask-question/")
async def chatbot_handler(request: Request):
    try:
        data = await request.json()
        question = data.get("question")
        url = data.get("youtube_url")

        if not question or not url:
            raise HTTPException(status_code=400, detail="Missing question or youtube_url")

        transcript = transcribe_audio(url)
        if not transcript:
            raise HTTPException(status_code=500, detail="Transcript could not be extracted")

        response = answer_question_about_transcript(transcript, question)
        return {"answer": response}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Chatbot failed: {str(e)}")
