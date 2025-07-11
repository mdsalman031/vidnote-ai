import os
import re
import json
import requests
from typing import List
from dotenv import load_dotenv
import bleach
from bs4 import BeautifulSoup
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")

TOGETHER_API_URL = "https://api.together.ai/v1/chat/completions"
TOGETHER_MODEL = "mistralai/Mistral-7B-Instruct-v0.1"

VALID_MODELS = [
    "mistralai/Mistral-7B-Instruct-v0.1",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "meta-llama/Llama-2-7B-Chat-hf",
]

assert TOGETHER_MODEL in VALID_MODELS, "Model not valid or not available serverless"

HEADERS = {
    "Authorization": f"Bearer {TOGETHER_API_KEY}",
    "Content-Type": "application/json"
}

ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u']

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def summarize_with_together(prompt: str) -> str:
    payload = {
        "model": TOGETHER_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that summarizes transcripts into structured notes."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5,
        "top_p": 0.9,
        "max_tokens": 2048
    }

    try:
        response = requests.post(TOGETHER_API_URL, headers=HEADERS, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Together API error: {str(e)}")

def extract_body_content(html: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')
    body = soup.body
    return str(body) if body else html

def sanitize_html(html_content: str) -> str:
    cleaned = bleach.clean(html_content, tags=ALLOWED_TAGS)
    cleaned = bleach.clean(cleaned, tags=ALLOWED_TAGS, attributes={}, strip=True)
    return cleaned

def generate_structured_notes(transcript: str) -> str:
    cleaned = clean_text(transcript)
    if not cleaned or len(cleaned.split()) < 20:
        return "<p><strong>Transcript too short to generate detailed notes.</strong></p>"

    try:
        prompt = (
            "Convert the following transcript into **well-structured, detailed notes** in HTML format. "
            "Use <h2> for section headings, <p> for paragraphs, and <ul><li> for short lists.\n\n"
            + cleaned
        )
        summary = summarize_with_together(prompt)
        html_body = extract_body_content(summary)
        return sanitize_html(html_body)
    except Exception as e:
        print(f"[ERROR] Together summarization failed: {e}")
        return "<p><strong>Structured notes could not be generated.</strong></p>"

def fetch_youtube_transcript(video_url: str) -> str:
    video_id = video_url.split("v=")[-1].split("&")[0]
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        return " ".join([entry['text'] for entry in transcript])
    except Exception as e:
        print(f"[ERROR] Transcript fetch failed: {e}")
        return ""

def generate_quiz_from_transcript(transcript: str) -> List[dict]:
    cleaned = clean_text(transcript)
    if not cleaned or len(cleaned.split()) < 20:
        return []

    quiz_prompt = (
        "From the following video transcript, generate a quiz with 5 to 10 multiple choice questions. "
        "Each question should include:\n"
        "- A clear question\n"
        "- 4 answer options labeled A, B, C, D\n"
        "- One correct answer\n"
        "- Return the output as a valid JSON array with each object having 'question', 'options', and 'answer' fields\n\n"
        f"Transcript:\n{cleaned}"
    )

    try:
        response = summarize_with_together(quiz_prompt)
        questions = json.loads(response)
        return questions
    except Exception as e:
        print(f"[ERROR] Quiz generation failed: {e}")
        return []
