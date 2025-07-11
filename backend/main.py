from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from utils.summarizer import generate_structured_notes, generate_quiz_from_transcript
from utils.transcriber import fetch_youtube_transcript
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
import traceback
import uuid

app = FastAPI()

# Allow all origins (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoURL(BaseModel):
    url: str

@app.post("/generate-summary/")
async def generate_summary(data: VideoURL):
    try:
        video_id = str(uuid.uuid4())
        transcript = fetch_youtube_transcript(data.url)
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

@app.post("/cleanup/{video_id}")
def cleanup_after_view(video_id: str):
    return {"message": "Cleanup skipped (no video stored)"}
